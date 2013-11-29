'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('FriendsCtrl', function ($scope, Token, Request) {

    $scope.friends = [];

    /**
     * init
     */
    $scope.init = function() {
        Token.request({
                action: 'ls',
                resource: 'friends',
                receiver: Token.agent().email,
                fields: ['name', '_id', 'email', 'hisPermissions', 'myPermissions'],
          }).
        then(function(friends) {
            console.log('friends');
            console.log(friends);
            $scope.friends = friends;
          }).
        catch(function(err) {
            console.log('err');
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
                receiver: Token.agent().email,
                friend: friend,
                permission: permission,
          }).
        then(function() {
          }).
        catch(function(err) {
            console.log(err);
          });
      };

    /**
     * Send a friend request
     *
     * @param string
     * @param string
     */
    $scope.friend = function(friendEmail, gebo) {
        console.log('friendEmail');
        console.log(friendEmail);
        console.log('gebo');
        console.log(gebo);

        Token.send({ 
                performative: 'request',
                action: 'friend',
                sender: Token.agent().email,
                receiver: friendEmail,
                gebo: gebo,
          }).
        then(function() {
          }).
        catch(function(err) {
            console.log(err);
          });
      };
  });
