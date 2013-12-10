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

        FriendsCtrl = $controller('FriendsCtrl', {
                $scope: scope,
                Token: token,
                Request: request,
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

        // Get a list of friends
        $httpBackend.whenPOST(GEBO_ADDRESS + '/perform', {
                receiver: token.agent().email,
                action: 'ls',
                content: {
                    resource: 'friends',
                    fields: ['name', '_id', 'email', 'hisPermissions', 'myPermissions'],
                },
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
            $httpBackend.expectPOST(GEBO_ADDRESS + '/perform', {
                    receiver: token.agent().email,
                    action: 'ls',
                    content: {
                        resource: 'friends',
                        fields: ['name', '_id', 'email', 'hisPermissions', 'myPermissions'],
                    },
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

    /**
     * grantAccess
     */
    describe('grantAccess', function() {

        beforeEach(function() {
            $httpBackend.whenPOST(GEBO_ADDRESS + '/perform', {
                    receiver: token.agent().email,
                    action: 'grantAccess',
                    content: {
                        friend: 'john@painter.com',
                        permission: {
                                email: 'some@app.com',
                                read: true,
                                write: true,
                                execute: false,
                            },
                    },
                    access_token: ACCESS_TOKEN,
                }).respond();
        });

        it('should attempt to perform the grantAccess action on the gebo', function() {

            $httpBackend.expectPOST(GEBO_ADDRESS + '/perform', {
                    receiver: token.agent().email,
                    action: 'grantAccess',
                    content: {
                        friend: 'john@painter.com',
                        permission: {
                                email: 'some@app.com',
                                read: true,
                                write: true,
                                execute: false,
                            },
                    },
                    access_token: ACCESS_TOKEN,
                });

            scope.grantAccess('john@painter.com', {
                    email: 'some@app.com',
                    read: true,
                    write: true,
                    execute: false});

            $httpBackend.flush();
        });
    });

    /**
     * friend
     */
    describe('friend', function() {

        it('should send a friend request to the gebo specified', function() {
            $httpBackend.expectPOST(GEBO_ADDRESS + '/perform', {
                    receiver: token.agent().email,
                    action: 'certificate',
                    content: {
                            agent: 'john@painter.com', 
                        },
                    access_token: ACCESS_TOKEN,
                }).respond('some certificate');

            $httpBackend.expectPOST(GEBO_ADDRESS + '/send', {
                    sender: 'dan@example.com',
                    receiver: 'john@painter.com',
                    performative: 'request',
                    action: 'friend',
                    gebo: 'https://foreigngebo.com',
                    content: {
                        name: token.agent().name,
                        email: token.agent().email,
                        gebo: GEBO_ADDRESS,
                        certificate: 'some certificate',
                    },
                    access_token: ACCESS_TOKEN,
                }).respond();

            scope.sender = 'dan@example.com';
            scope.receiver = 'john@painter.com'; 
            scope.action = 'friend';
            scope.gebo = 'https://foreigngebo.com';
            scope.friend();

            $httpBackend.flush();
        });
    });
});
