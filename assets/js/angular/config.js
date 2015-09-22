(function () {
  'use strict';

  angular.module('mainModule')
  .config(['$httpProvider', 'RestangularProvider', '$locationProvider',
    function ($httpProvider, RestangularProvider, $locationProvider) {
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
      RestangularProvider.setRequestSuffix('/');
      $locationProvider.html5Mode(true);
    }]);
})();