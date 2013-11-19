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
               fields: ['created', 'action', '_id', 'type', 'data', 'creditor', 'debtor', 'fulfilled'],
               access_token: ACCESS_TOKEN,
           }).respond([
                   { 
                        _id: '1',
                        action: 'friend', 
                        type: 'request',
                        message: {
                            newFriend: {
                                    name: 'Dan',
                                    email: 'dan@email.com',
                                    uri: 'https://somegebo.com',
                                    hisCertificate: 'some certificate',
                            },
                        }
                   }]);


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
     * init
     */
    describe('init', function() {
        it('should load a list of social commitments', function() {
            expect(scope.socialCommitments.length).toBe(0);
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'ls',
                    resource: 'socialcommitments',
                    recipient: token.agent.email,
                    fields: ['created', 'action', '_id', 'type', 'data', 'creditor', 'debtor', 'fulfilled'],
                    access_token: ACCESS_TOKEN });

            scope.init();
            $httpBackend.flush();

            expect(scope.socialCommitments.length).toBe(1);
            expect(scope.socialCommitments[0]._id).toBe('1');
            expect(scope.socialCommitments[0].action).toBe('friend');
            expect(scope.socialCommitments[0].type).toBe('request');
            expect(scope.socialCommitments[0].message.newFriend.name).toBe('Dan');
            expect(scope.socialCommitments[0].message.newFriend.email).toBe('dan@email.com');
            expect(scope.socialCommitments[0].message.newFriend.uri).toBe('https://somegebo.com');
            expect(scope.socialCommitments[0].message.newFriend.hisCertificate).toBe('some certificate');
        });
    });


});
