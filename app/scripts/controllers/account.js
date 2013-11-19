'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('AccountCtrl', function ($scope, Token) {

    $scope.friends = [];

    $scope.agent = Token.data();

    /**
     * init
     */
    $scope.init = function() {
        console.log('AccountCtrl init');
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
