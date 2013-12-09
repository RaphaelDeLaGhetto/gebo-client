'use strict';

angular.module('geboRegistrantHaiApp', ['ngRoute', 'gebo-client-token', 'ui.bootstrap', 'gebo-client-performatives'])
  .config(function ($routeProvider, $httpProvider) {

    // Enable CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.
      when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).
      when('/token', {
        templateUrl: 'views/token.html',
        controller: 'MainCtrl'
      }).
      when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      }).
      when('/friends', {
        templateUrl: 'views/friends.html',
        controller: 'FriendsCtrl'
      }).
      when('/log', {
        templateUrl: 'views/log.html',
        controller: 'LogCtrl'
      }).
      when('/conversations', {
        templateUrl: 'views/conversations.html',
        controller: 'ConversationsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  });
