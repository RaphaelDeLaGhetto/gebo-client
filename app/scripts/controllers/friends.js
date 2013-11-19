'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('FriendsCtrl', function ($scope, Token) {

    $scope.friends = [];

    /**
     * init
     */
    $scope.init = function() {
        Token.request({
                action: 'ls',
                resource: 'friends',
                recipient: Token.agent().email,
                fields: ['name', '_id', 'email', 'hisPermissions', 'myPermissions'],
          }).
        then(function(friends) {
            $scope.friends = friends;
          }).
        catch(function(err) {
          }); 
      };
  });
