'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('FriendsCtrl', function ($scope, Token, Request) {

    $scope.friends = [];

    // Friending variables
    $scope.sender = Token.agent().email;
    $scope.receiver = null;
    $scope.action = null;
    $scope.gebo = null;

    /**
     * init
     */
    $scope.init = function() {
        Token.perform({
                receiver: Token.agent().email,
                action: 'ls',
                content: {
                    resource: 'friends',
                    fields: ['name', '_id', 'email', 'hisPermissions', 'myPermissions'],
                }
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
        Token.perform({
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
     */
    $scope.friend = function() {

        var message = {
                receiver: Token.agent().email,
                action: 'certificate',
                content: {
                    agent: $scope.receiver,
                },
            };

        Token.perform(message).
            then(function(certificate) {
                var content = {
                        name: Token.agent().name,
                        email: Token.agent().email,
                        gebo: Token.getEndpoints().gebo,
                        certificate: certificate,
                    };

                var message = Request.make($scope.sender, $scope.receiver, $scope.action, $scope.gebo, content);
                Token.send(message).
                    then(function() {
                      }).
                    catch(function(err) {
                        console.log(err);
                      });
              }).
            catch(function(err) {
                console.log(err);
              });
      };
  });
