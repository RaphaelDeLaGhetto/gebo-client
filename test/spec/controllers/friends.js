'use strict';

describe('Controller: FriendsCtrl', function () {

    /**
     * Constants
     */
    var GEBO_ADDRESS = 'https://somegebo.com',
        REDIRECT_URI = 'https://myhost.com',
        ACCESS_TOKEN = '1234';


    // load the controller's module
    beforeEach(module('geboRegistrantHaiApp'));

    var FriendsCtrl,
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

        FriendsCtrl = $controller('FriendsCtrl', {
                $scope: scope,
                Token: token
              });
   
       /**
        * $httpBackend
        */

       // Get a list of friends
       $httpBackend.whenPOST(GEBO_ADDRESS + '/request', {
               action: 'ls',
               resource: 'friends',
               recipient: token.agent.email,
               fields: ['name', '_id', 'email', 'hisPermissions', 'myPermissions'],
               access_token: ACCESS_TOKEN,
           }).respond([{ name: 'Dan', _id: '1', email: 'dan@email.com'},
                       { name:'Yanfen', _id: '2', email: 'yanfen@email.com' }]);


    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should do something', function () {
        expect(!!FriendsCtrl).toBe(true);
        expect(!!token).toBe(true);
    });

    /**
     * init
     */
    describe('init', function() {

        it('should load a list of friends', function() {
            expect(scope.friends.length).toBe(0);
            $httpBackend.expectPOST(GEBO_ADDRESS + '/request', {
                    action: 'ls',
                    resource: 'friends',
                    recipient: token.agent.email,
                    fields: ['name', '_id', 'email', 'hisPermissions', 'myPermissions'],
                    access_token: ACCESS_TOKEN });

            scope.init();
            $httpBackend.flush();

            expect(scope.friends.length).toBe(2);
            expect(scope.friends[0]._id).toBe('1');
            expect(scope.friends[0].name).toBe('Dan');
            expect(scope.friends[0].email).toBe('dan@email.com');
            expect(scope.friends[1]._id).toBe('2');
            expect(scope.friends[1].name).toBe('Yanfen');
            expect(scope.friends[1].email).toBe('yanfen@email.com');
        });
    });
});
