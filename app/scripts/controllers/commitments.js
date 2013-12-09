'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('LogCtrl', function ($scope, Token) {

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
        Token.perform({
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

  });
