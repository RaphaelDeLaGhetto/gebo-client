'use strict';

describe('Controller: AccountCtrl', function () {

    /**
     * Constants
     */
    var GEBO_ADDRESS = 'https://somegebo.com',
        REDIRECT_URI = 'https://myhost.com',
        ACCESS_TOKEN = '1234';

    // load the controller's module
    beforeEach(module('geboRegistrantHaiApp'));
    
    var AccountCtrl,
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

       
        // Get controller
        AccountCtrl = $controller('AccountCtrl', {
                $scope: scope,
                Token: token,
              });

        /**
         * $httpBackend
         */

        // Get a list of friends
        $httpBackend.whenPOST(GEBO_ADDRESS + '/request', {
                action: 'ls',
                resource: 'friends',
                recipient: scope.agent.email,
                fields: ['name', '_id', 'email'],
                access_token: ACCESS_TOKEN,
            }).respond([{ name: 'Dan', _id: '1', email: 'dan@email.com'},
                        { name:'Yanfen', _id: '2', email: 'yanfen@email.com' }]);

        /**
         * Spies
         */
        spyOn(token, 'data').andCallFake(function() {
            return {
                _id: '3',
                name: 'John',
                email: 'john@painter.com',
                admin: false,
            };

        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should do something', function () {
        expect(!!AccountCtrl).toBe(true);
        expect(!!token).toBe(true);
    });

    /**
     * onload
     */
    describe('onload', function() {

        beforeEach(inject(function($controller) {
            var ctrl = $controller('AccountCtrl', {
                    $scope: scope,
                    Token: token
            });
        }));

        it('should set the agent data', function() {
            expect(token.data).toHaveBeenCalled();
            expect(scope.agent._id).toBe('3');
            expect(scope.agent.name).toBe('John');
            expect(scope.agent.email).toBe('john@painter.com');
            expect(scope.agent.admin).toBe(false);
        });
    });

    /**
     * init
     */
    describe('init', function() {

//        beforeEach(function() {
//        });

        it('should load a list of friends', function() {
            expect(scope.friends.length).toBe(0);
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'ls',
                    resource: 'friends',
                    recipient: scope.agent.email,
                    fields: ['name', '_id', 'email'],
                    access_token: ACCESS_TOKEN });

            scope.init();
            $httpBackend.flush();

            expect(scope.friends.length).toBe(2);
            expect(scope.friends[0].name).toBe('Dan');
            expect(scope.friends[0].email).toBe('dan@email.com');
            expect(scope.friends[1].name).toBe('Yanfen');
            expect(scope.friends[1].email).toBe('yanfen@email.com');
        });

        it('should load a list of social commitments', function() {

        });
    });
});
