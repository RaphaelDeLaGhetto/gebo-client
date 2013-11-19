'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('AccountCtrl', function ($scope, Token) {

    $scope.friends = [];

    /**
     * init
     */
    $scope.init = function() {
        Token.request({
                action: 'ls',
                resource: 'friends',
                fields: ['name', '_id', 'email'],
          }).
        then(function(friends) {
            $scope.friends = friends;
          }).
        catch(function(err) {
          }); 
      };
  });
