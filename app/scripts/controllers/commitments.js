'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('CommitmentsCtrl', function ($scope, Token) {

    $scope.socialCommitments = [];

    $scope.performatives = ['request', 'propose', 'inform']

    /**
     * init
     */
    $scope.init = function() {
        Token.request({
                action: 'ls',
                resource: 'socialcommitments',
                recipient: Token.agent().email,
                fields: ['created', 'action', '_id', 'type', 'data', 'creditor', 'debtor', 'fulfilled'],
          }).
        then(function(socialCommitments) {
            $scope.socialCommitments = socialCommitments.reverse();
          }).
        catch(function(err) {
            console.log(err);
          }); 
      };


  });
