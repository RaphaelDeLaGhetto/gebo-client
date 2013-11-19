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
        scope;
    
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        token = $injector.get('Token');

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
         * Spies
         */
        spyOn(token, 'agent').andCallFake(function() {
            return {
                _id: '3',
                name: 'John',
                email: 'john@painter.com',
                admin: false,
            };

        });
    }));

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
            expect(token.agent).toHaveBeenCalled();
            expect(scope.agent._id).toBe('3');
            expect(scope.agent.name).toBe('John');
            expect(scope.agent.email).toBe('john@painter.com');
            expect(scope.agent.admin).toBe(false);
        });
    });

});
