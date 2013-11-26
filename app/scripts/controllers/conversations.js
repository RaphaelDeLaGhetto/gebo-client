'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('ConversationsCtrl', function ($scope, Token) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.conversations = [];

    /**
     * Paging stuff
     */
    $scope.limit = 10;
    $scope.page = 1;
    $scope.totalItems = 2000; // This is a temporary measure
    var _skip = $scope.limit * ($scope.page - 1);
    $scope.terminated = null;


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
                resource: 'conversations',
                receiver: Token.agent().email,
                fields: ['created', 'type', 'role', '_id', 'conversationId', 'socialCommitments'],
//                criteria: { fulfilled: $scope.fulfilled },
                options: { skip: _skip, limit: $scope.limit, sort: '-created' },
          }).
        then(function(conversations) {
            $scope.conversations = conversations;
          }).
        catch(function(err) {
            console.log(err);
          });
      };



  });
