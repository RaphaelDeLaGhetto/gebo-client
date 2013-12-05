'use strict';

describe('Controller: CommitmentsCtrl', function () {

    /**
     * Constants
     */
    var GEBO_ADDRESS = 'https://somegebo.com',
        REDIRECT_URI = 'https://myhost.com',
        ACCESS_TOKEN = '1234';

    // load the controller's module
    beforeEach(module('geboRegistrantHaiApp'));

    var CommitmentsCtrl,
        token,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        token = $injector.get('Token');
        $httpBackend = $injector.get('$httpBackend');

        /**
         * Token
         */

        // Set up token
        token.setEndpoints({
                clientId: 'gebo-registrant-hai@capitolhill.ca',
                clientName: 'gebo-registrant-hai',
                localStorageName: 'gebo-registrant-hai-token',
                gebo: GEBO_ADDRESS,
                redirect: REDIRECT_URI,
              });
        token.set(ACCESS_TOKEN);

        CommitmentsCtrl = $controller('CommitmentsCtrl', {
                $scope: scope,
                Token: token
              });
   
       /**
        * $httpBackend
        */

       // Get a list of social commitments
       $httpBackend.whenPOST(GEBO_ADDRESS + '/request', {
               action: 'ls',
               resource: 'socialcommitments',
               recipient: token.agent.email,
               fields: ['created', 'action', '_id', 'performative', 'message', 'creditor', 'debtor', 'fulfilled'],
//               criteria: { fulfilled: null },
               options: { skip: 0, limit: scope.limit, sort: '-created' },
               access_token: ACCESS_TOKEN,
           }).respond([
                   { 
                        _id: '1',
                        action: 'friend', 
                        performative: 'request',
                        message: {
                            newFriend: {
                                    name: 'Dan',
                                    email: 'dan@email.com',
                                    uri: 'https://somegebo.com',
                                    hisCertificate: 'some certificate',
                            },
                        }
                   }]);

        // When the page is loaded, the $watch:page event gets fired
        $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                action: 'ls',
                resource: 'socialcommitments',
                recipient: token.agent.email,
                fields: ['created', 'action', '_id', 'performative', 'message', 'creditor', 'debtor', 'fulfilled'],
//                criteria: { fulfilled: null },
                options: { skip: 0, limit: scope.limit, sort: '-created' },
                access_token: ACCESS_TOKEN });
        $httpBackend.flush();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should do something', function () {
        expect(!!CommitmentsCtrl).toBe(true);
        expect(!!token).toBe(true);
    });

    /**
     * ls
     */
    describe('ls', function() {

        it('should request the appropriate range of social commitments', function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'ls',
                    resource: 'socialcommitments',
                    recipient: token.agent.email,
                    fields: ['created', 'action', '_id', 'performative', 'message', 'creditor', 'debtor', 'fulfilled'],
//                    criteria: { fulfilled: null },
                    options: { skip: 0, limit: scope.limit, sort: '-created' },
                    access_token: ACCESS_TOKEN });

            scope.socialCommitments = [];
            expect(scope.socialCommitments.length).toBe(0);
            scope.ls();
            $httpBackend.flush();

            expect(scope.socialCommitments.length).toBe(1);
            expect(scope.socialCommitments[0]._id).toBe('1');
            expect(scope.socialCommitments[0].action).toBe('friend');
            expect(scope.socialCommitments[0].performative).toBe('request');
            expect(scope.socialCommitments[0].message.newFriend.name).toBe('Dan');
            expect(scope.socialCommitments[0].message.newFriend.email).toBe('dan@email.com');
            expect(scope.socialCommitments[0].message.newFriend.uri).toBe('https://somegebo.com');
            expect(scope.socialCommitments[0].message.newFriend.hisCertificate).toBe('some certificate');
         });
    });

    /**
     * changePage
     */
    describe('$watch: page', function() {

        it('should load new social commitments when it changes', function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'ls',
                    resource: 'socialcommitments',
                    recipient: token.agent.email,
                    fields: ['created', 'action', '_id', 'performative', 'message', 'creditor', 'debtor', 'fulfilled'],
//                    criteria: { fulfilled: null },
                    options: { skip: 10, limit: scope.limit, sort: '-created' },
                    access_token: ACCESS_TOKEN }).
                respond([{ 
                        _id: '11',
                        action: 'friend', 
                        performative: 'request',
                        message: {
                            newFriend: {
                                    name: 'John',
                                    email: 'john@epainter.com',
                                    uri: 'https://somegebo.com',
                                    hisCertificate: 'some other certificate',
                            },
                        }
                   }]);

            scope.socialCommitments = [];
            expect(scope.socialCommitments.length).toBe(0);
 
            scope.page = 2;
            scope.$apply();
            $httpBackend.flush();
            expect(scope.socialCommitments.length).toBe(1);
        });
    });

    /**
     * agree
     */
    describe('agree', function() {

        beforeEach(function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'agree',
                    recipient: token.agent.email,
                    socialCommitmentId: '123',
                    access_token: ACCESS_TOKEN }).
                respond({ 
                        _id: '1',
                        name: 'John', 
                        email: 'john@painter.com',
                        performative: 'request',
                        hisCertificate: 'some other certificate',
                        uri: 'https://somegebo.com',
                   });
        });

        it('should post an agree request to the gebo', function() {
            scope.agree('123');
            $httpBackend.flush();
        });

        it('should post an request to the gebo once agreed', function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'ls',
                    resource: 'socialcommitments',
                    recipient: token.agent.email,
                    fields: ['created', 'action', '_id', 'performative', 'message', 'creditor', 'debtor', 'fulfilled'],
//                    criteria: { fulfilled: null },
                    options: { skip: scope.limit * (scope.page - 1), limit: scope.limit, sort: '-created' },
                    access_token: ACCESS_TOKEN }).
                respond([{ 
                        _id: '11',
                        action: 'friend', 
                        performative: 'request',
                        message: {
                            newFriend: {
                                    name: 'John',
                                    email: 'john@epainter.com',
                                    uri: 'https://somegebo.com',
                                    hisCertificate: 'some other certificate',
                            },
                        }
                   }]);

            scope.agree('123');
            $httpBackend.flush();
        });
    });

    /**
     * refuse
     */
    describe('refuse', function() {
        beforeEach(function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'refuse',
                    recipient: token.agent.email,
                    socialCommitmentId: '123',
                    access_token: ACCESS_TOKEN }).
                respond({ 
                        _id: '11',
                        action: 'friend', 
                        performative: 'request',
                        message: {
                            newFriend: {
                                    name: 'John',
                                    email: 'john@epainter.com',
                                    uri: 'https://somegebo.com',
                                    hisCertificate: 'some other certificate',
                            },
                        },
                        fulfilled: Date.now(),
                   });
        });

        it('should post a refuse request to the gebo', function() {
            scope.refuse('123');
            $httpBackend.flush();
        });

        it('should post an request to the gebo once refused', function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'ls',
                    resource: 'socialcommitments',
                    recipient: token.agent.email,
                    fields: ['created', 'action', '_id', 'performative', 'message', 'creditor', 'debtor', 'fulfilled'],
//                    criteria: { fulfilled: null },
                    options: { skip: scope.limit * (scope.page - 1), limit: scope.limit, sort: '-created' },
                    access_token: ACCESS_TOKEN }).
                respond([{ 
                        _id: '11',
                        action: 'friend', 
                        performative: 'request',
                        message: {
                            newFriend: {
                                    name: 'John',
                                    email: 'john@epainter.com',
                                    uri: 'https://somegebo.com',
                                    hisCertificate: 'some other certificate',
                            },
                        }
                   }]);

            scope.refuse('123');
            $httpBackend.flush();
        });
    });
});
