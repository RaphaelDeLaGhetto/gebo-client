'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('AccountCtrl', function ($scope, Token) {

    $scope.friends = [];

    $scope.agent = Token.agent();

    /**
     * init
     */
    $scope.init = function() {
        Token.request({
                action: 'ls',
                resource: 'friends',
                recipient: $scope.agent.email,
                fields: ['name', '_id', 'email'],
          }).
        then(function(friends) {
            $scope.friends = friends;
          }).
        catch(function(err) {
          }); 
      };
  });
