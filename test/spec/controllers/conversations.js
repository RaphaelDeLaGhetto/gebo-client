'use strict';

describe('Controller: ConversationsCtrl', function () {

    /**
     * Constants
     */
    var GEBO_ADDRESS = 'https://somegebo.com',
        REDIRECT_URI = 'https://myhost.com',
        ACCESS_TOKEN = '1234';

    // load the controller's module
    beforeEach(module('geboRegistrantHaiApp'));

    var ConversationsCtrl,
        token,
        request,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        token = $injector.get('Token');
        request = $injector.get('Request');
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

        ConversationsCtrl = $controller('ConversationsCtrl', {
                $scope: scope,
                Token: token,
                Request: request
              });

        /**
         * Spies
         */
        spyOn(token, 'agent').andCallFake(function() {
                return {
                        name: 'Dan',
                        email: 'dan@example.com',    
                    };
              });  

       /**
        * $httpBackend
        */

       // Get a list of conversations
       $httpBackend.whenPOST(GEBO_ADDRESS + '/perform', {
               receiver: token.agent().email,
               action: 'ls',
               content: {
                   resource: 'conversations',
                   fields: ['created', 'type', 'role', '_id', 'conversationId', 'socialCommitments'],
    //               criteria: { terminated: false },
                   options: { skip: 0, limit: scope.limit, sort: [['created', 'descending']] },
               },
               access_token: ACCESS_TOKEN,
           }).respond([
                   { 
                        _id: '1',
                        role: 'client',
                        type: 'request',
                        conversationId: 'Some conversation ID',
                        created: Date.now(), 
                        socialCommitments: [
                            {
                                performative: 'reply request',
                                action: 'friend',
                                message: {},
                                creditor: 'client@email.com',
                                debtor: 'server@email.com',
                                created: Date.now(),
                                fulfilled: null,
                            },
                        ]
                   }]);

        // When the page is loaded, the $watch:page event gets fired
        $httpBackend.expectPOST(GEBO_ADDRESS + '/perform', {
                receiver: token.agent().email,
                action: 'ls',
                content: {
                    resource: 'conversations',
                    fields: ['created', 'type', 'role', '_id', 'conversationId', 'socialCommitments'],
    //               criteria: { terminated: false },
                    options: { skip: 0, limit: scope.limit, sort: [['created', 'descending']] },
                },
                access_token: ACCESS_TOKEN });
        $httpBackend.flush();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should do something', function () {
        expect(!!ConversationsCtrl).toBe(true);
        expect(!!token).toBe(true);
    });

    /**
     * ls
     */
    describe('ls', function() {

        it('should ask for the appropriate range of conversations', function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/perform', {
                receiver: token.agent().email,
                action: 'ls',
                content: {
                    resource: 'conversations',
                    fields: ['created', 'type', 'role', '_id', 'conversationId', 'socialCommitments'],
    //               criteria: { terminated: false },
                    options: { skip: 0, limit: scope.limit, sort: [['created', 'descending']] },
                },
                access_token: ACCESS_TOKEN });
        
            scope.conversations = [];
            expect(scope.conversations.length).toBe(0);
            scope.ls();
            $httpBackend.flush();

            expect(scope.conversations.length).toBe(1);
            expect(scope.conversations[0]._id).toBe('1');
            expect(scope.conversations[0].type).toBe('request');
            expect(scope.conversations[0].role).toBe('client');
            expect(scope.conversations[0].conversationId).toBe('Some conversation ID');
            expect(!!scope.conversations[0].created).toBe(true);
            expect(scope.conversations[0].socialCommitments.length).toBe(1);
            expect(scope.conversations[0].socialCommitments[0].performative).toBe('reply request');
            expect(scope.conversations[0].socialCommitments[0].action).toBe('friend');
            expect(!!scope.conversations[0].socialCommitments[0].message).toBe(true);
            expect(scope.conversations[0].socialCommitments[0].creditor).toBe('client@email.com');
            expect(scope.conversations[0].socialCommitments[0].debtor).toBe('server@email.com');
            expect(!!scope.conversations[0].socialCommitments[0].created).toBe(true);
            expect(scope.conversations[0].socialCommitments[0].fulfilled).toBe(null);
         });
    });

    /**
     * changePage
     */
    describe('$watch: page', function() {

        it('should load new conversations when it changes', function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/perform', {
                    receiver: token.agent().email,
                    action: 'ls',
                    content: {
                        resource: 'conversations',
                        fields: ['created', 'type', 'role', '_id', 'conversationId', 'socialCommitments'],
    //                    criteria: { terminated: false },
                        options: { skip: 10, limit: scope.limit, sort: [['created', 'descending']] },
                    },
                    access_token: ACCESS_TOKEN }).
                respond([
                   { 
                        _id: '11',
                        role: 'client',
                        type: 'request',
                        conversationId: 'Some conversation ID',
                        created: Date.now(), 
                        socialCommitments: [
                            {
                                performative: 'reply request',
                                action: 'friend',
                                message: {},
                                creditor: 'client@email.com',
                                debtor: 'server@email.com',
                                created: Date.now(),
                                fulfilled: null,
                            },
                        ]
                   }]);

            scope.conversations = [];
            expect(scope.conversations.length).toBe(0);
 
            scope.page = 2;
            scope.$apply();
            $httpBackend.flush();
            expect(scope.conversations.length).toBe(1);
        });
    });

});

