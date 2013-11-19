'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('CommitmentsCtrl', function ($scope, Token) {

    $scope.socialCommitments = [];

    /**
     * init
     */
    $scope.init = function() {
        Token.request({
                action: 'ls',
                resource: 'socialcommitments',
                recipient: Token.agent().email,
                fields: ['action', '_id', 'type', 'data', 'creditor', 'debtor', 'created', 'fulfilled'],
          }).
        then(function(socialCommitments) {
            $scope.socialCommitments = socialCommitments;
          }).
        catch(function(err) {
            console.log(err);
          }); 
      };


  });
