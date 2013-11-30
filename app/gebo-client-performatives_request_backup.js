angular.module("gebo-client-performatives", ["gebo-client-performatives.conversationControl","gebo-client-performatives.request"]);
;(function() {
'use strict';                  

angular.module('gebo-client-performatives.conversationControl',
        ['gebo-client-performatives.request',
         'templates/server-reply-request.html',
         'templates/client-reply-request.html',
         'templates/server-propose-discharge-perform.html',
         'templates/client-propose-discharge-perform.html',
         'templates/server-reply-propose-discharge-perform.html',
         'templates/client-reply-propose-discharge-perform.html',
         'templates/server-perform.html']).
    directive('conversationControl', function ($templateCache, Request, $compile) {

    function _link(scope, element, attributes) {
        console.log('_controller');
        attributes.$observe('sc', function(newValue) {
            scope.sc = newValue;
          });

        attributes.$observe('email', function(newValue) {
            scope.email = newValue;
          });

        scope.agree = function(id, evt) {
            if (evt) {
              evt.preventDefault();
              evt.stopPropagation();
            }
            console.log(Request.agree(scope.sc, scope.email));
        };

        if (scope.sc && scope.email) {
            var directive = Request.getDirectiveName(scope.sc, scope.email);
            element.html($templateCache.get('templates/' + directive + '.html'));
            $compile(element.contents())(scope);
        }

      };

    return {
            restrict: 'E',
            scope: true,
            link: _link,
         };
      });
  }());


angular.module("templates/client-propose-discharge-perform.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/client-propose-discharge-perform.html",
    "");
}]);

angular.module("templates/client-reply-propose-discharge-perform.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/client-reply-propose-discharge-perform.html",
    "");
}]);

angular.module("templates/client-reply-request.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/client-reply-request.html",
    "");
}]);

angular.module("templates/server-perform.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/server-perform.html",
    "");
}]);

angular.module("templates/server-propose-discharge-perform.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/server-propose-discharge-perform.html",
    "");
}]);

angular.module("templates/server-reply-propose-discharge-perform.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/server-reply-propose-discharge-perform.html",
    "");
}]);

angular.module("templates/server-reply-request.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/server-reply-request.html",
    "<button class=\"btn btn-small\" ng-click=\"agree(sc._id, $event)\">\n" +
    "    <span class=\"glyphicon glyphicon-question-sign\"></span></button>\n" +
    "<button class=\"btn btn-small\" ng-click=\"refuse(sc._id, $event)\">\n" +
    "    <span class=\"glyphicon glyphicon-thumbs-down\"></span></button>\n" +
    "<button class=\"btn btn-small\" ng-click=\"agree(sc._id, $event)\">\n" +
    "    <span class=\"glyphicon glyphicon-thumbs-up\"></span></button>'\n" +
    "");
}]);

;(function() {
'use strict';                  

angular.module('gebo-client-performatives.request', ['ngRoute', 'ngResource']).
    factory('Request', function () {

        /**
         * Initiate a request
         *
         * @param string
         * @param string
         * @param string
         * @param string
         *
         * @return Object
         */
        function _request(sender, receiver, action, gebo) {
            return {
                    sender: sender,
                    receiver: receiver,
                    performative: 'request',
                    action: action,
                    gebo: gebo,
                };
          };

        /**
         * Cancel a request
         *
         * @param Object - social commitment
         * @param string - email of sender
         *
         * @return Object
         */
        function _cancel(sc, email) {
            return {
                    sender: email,
                    receiver: sc.debtor === email? sc.creditor: sc.debtor,
                    performative: 'cancel request',
                    action: sc.action,
                };
          };

        /**
         * Communicate misunderstanding
         *
         * @param Object - social commitment
         * @param string - email of sender
         *
         * @return Object
         */
        function _notUnderstood(sc, email) {
            return {
                    sender: email,
                    receiver: sc.debtor === email? sc.creditor: sc.debtor,
                    performative: 'not-understood ' + sc.performative.split(' ').pop(),
                    action: sc.action,
                };
          };

        /**
         * Refuse an agent's assertion
         *
         * @param Object - social commitment
         * @param string - email of sender
         *
         * @return Object
         */
        function _refuse(sc, email) {
            return {
                    sender: email,
                    receiver: sc.debtor === email? sc.creditor: sc.debtor,
                    performative: 'refuse ' + sc.performative.split(' ').pop(),
                    action: sc.action,
                };
          };

        /**
         * Refuse an agent's assertion
         *
         * @param Object - social commitment
         * @param string - email of sender
         *
         * @return Object
         */
        function _timeout(sc, email) {
            return {
                    sender: email,
                    receiver: sc.debtor === email? sc.creditor: sc.debtor,
                    performative: 'timeout ' + sc.performative.split(' ').pop(),
                    action: sc.action,
                };
          };

        /**
         * Agree to an agent's assertion
         *
         * @param Object - social commitment
         * @param string - email of sender
         *
         * @return Object
         */
        function _agree(sc, email) {
            console.log('_agree');
            sc = JSON.parse(sc);
            console.log(sc);
            console.log(sc.performative);
            console.log(email);
            return {
                    sender: email,
                    receiver: sc.debtor === email? sc.creditor: sc.debtor,
                    performative: 'agree ' + sc.performative.split(' ').pop(),
                    action: sc.action,
                };
          };

        /**
         * Signal failure to perform action
         *
         * @param Object - social commitment
         * @param string - email of sender
         *
         * @return Object
         */
        function _failure(sc, email) {
            return {
                    sender: email,
                    receiver: sc.debtor === email? sc.creditor: sc.debtor,
                    performative: 'failure ' + sc.performative.split(' ').pop(),
                    action: sc.action,
                };
          };

        /**
         * Signal that the request action has been performed 
         *
         * @param Object - social commitment
         * @param string - email of sender
         *
         * @return Object
         */
        function _proposeDischarge(sc, email) {
            return {
                    sender: email,
                    receiver: sc.debtor === email? sc.creditor: sc.debtor,
                    performative: 'propose ' + sc.performative.split(' ').pop(),
                    action: sc.action,
                };
          };

        /**
         * Get the name of the appropriate directive
         *
         * (This will likely be moved in reorganization)
         *
         * @param Object - social commitment
         * @param string - email of would-be sender
         *
         * @return string
         */
        function _getDirectiveName(sc, email) {

            // Determine the agent's role
            var role = 'server';
            switch(sc.performative) {
                case 'reply request':
                    role = sc.debtor === email? 'server': 'client';
                    break;
                case 'propose discharge|perform':
                    role = sc.debtor === email? 'server': 'client';
                    break;
                case 'reply propose|discharge|perform':
                    role = sc.debtor === email? 'client': 'server';
                    break;
             }

            // Remove spaces and pipes
            return role + '-' + sc.performative.replace(' ', '-').replace(/\|/g, '-');
          };

        return {
            agree: _agree,
            cancel: _cancel,
            failure: _failure,
            getDirectiveName: _getDirectiveName,
            notUnderstood: _notUnderstood,
            proposeDischarge: _proposeDischarge,
            refuse: _refuse,
            request: _request,
            timeout: _timeout,
        };
      });
  }());
