'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('CommitmentsCtrl', function ($scope, Token) {

    $scope.socialCommitments = [];

    /**
     * Paging stuff
     */
    $scope.limit = 10;
    $scope.page = 1;
    $scope.totalItems = 2000; // This is a temporary measure
    var _skip = $scope.limit * ($scope.page - 1);
    $scope.fulfilled = null;

    /**
     * $watch
     */
    $scope.$watch('page', function(newPage) {
        $scope.page = newPage;
        _skip = $scope.limit * ($scope.page - 1);
        $scope.ls();
      });

    /**
     * ls
     */
    $scope.ls = function() {
        Token.request({
                action: 'ls',
                resource: 'socialcommitments',
                receiver: Token.agent().email,
                fields: ['created', 'action', '_id', 'performative', 'message', 'creditor', 'debtor', 'fulfilled'],
//                criteria: { fulfilled: $scope.fulfilled },
                options: { skip: _skip, limit: $scope.limit, sort: '-created' },
          }).
        then(function(socialCommitments) {
            $scope.socialCommitments = socialCommitments;
          }).
        catch(function(err) {
            console.log(err);
          });
      };

    /**
     * agree
     *
     * @param string
     * @param event
     */
    $scope.agree = function(id, e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        Token.request({
                action: 'agree',
                receiver: Token.agent().email,
                socialCommitmentId: id,
          }).
        then(function(relevantData) {
            $scope.ls();
          }).
        catch(function(err) {
            console.log(err);
          });

      };

    /**
     * refuse
     *
     * @param string
     * @param event
     */
    $scope.refuse = function(id, e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        Token.request({
                action: 'refuse',
                receiver: Token.agent().email,
                socialCommitmentId: id,
          }).
        then(function(refusedCommitment) {
            $scope.ls();
          }).
        catch(function(err) {
            console.log(err);
          });

      };
  });
