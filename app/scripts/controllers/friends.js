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
            console.log(err);
          }); 
      };

    /**
     * Give the agent specified the given permission 
     *
     * @param string
     * @param Object
     */
    $scope.grantAccess = function(friend, permission) {
        Token.request({
                action: 'grantAccess',
                recipient: Token.agent().email,
                friend: friend,
                permission: permission,
          }).
        then(function() {
          }).
        catch(function(err) {
            console.log(err);
          });
      };
  });
