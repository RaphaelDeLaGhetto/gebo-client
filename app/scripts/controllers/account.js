'use strict';

angular.module('geboRegistrantHaiApp')
  .controller('AccountCtrl', function ($scope, Token) {

    $scope.agent = Token.agent();
  });
