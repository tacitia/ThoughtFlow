/**
* LoginController
* @namespace authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('authentication.controllers')
    .controller('LoginController', ['$location', '$scope', 'Authentication',
      function LoginController($location, $scope, Authentication) {

        $scope.login = login;

        activate();

        /**
        * @name activate
        * @desc Actions to be performed when this controller is instantiated
        * @memberOf thinkster.authentication.controllers.LoginController
        */
        function activate() {
          // If the user is authenticated, they should not be here.
          if (Authentication.isAuthenticated()) {
            $location.url('/');
          }
        }

        /**
        * @name login
        * @desc Log the user in
        * @memberOf thinkster.authentication.controllers.LoginController
        */
        function login() {
          Authentication.login($scope.email, $scope.password);
        }
      }]);
})();