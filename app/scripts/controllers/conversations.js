'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('ConversationsCtrl', function ($scope, Token, Request) {

    $scope.conversations = [];

    $scope.request = Request;

    $scope.email = Token.agent().email;

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
     * Set Request message callback
     *
     * This function is called every time a
     * new message is created.
     */
    Request.setCallback(function(message) {
        Token.send(message).
            then(function(data) {
                console.log('message sent');
                console.log(data); 
              }).
            catch(function(err) {
                console.log('err');
                console.log(err);
              });
      });

    /**
     * Set Request perform callback
     *
     * This function is called every time a
     * server agent wishes to perform a
     * gebo-defined action
     */
    Request.setPerformCallback(function(message) {
        console.log('message');
        console.log(message);
        Token.request(message).
            then(function(response) {
                console.log('response');
                console.log(response);
              }).
            catch(function(err) {
                console.log(err);
              });
      });

    /**
     * ls
     */
    $scope.ls = function() {
        Token.request({
                action: 'ls',
                resource: 'conversations',
                receiver: $scope.email,
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
