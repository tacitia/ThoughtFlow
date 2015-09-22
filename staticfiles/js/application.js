var myAwesomeJSVariable = "I'm so awesome!!";

angular.module('mainModule', [
  'restangular', 
  'ui.router', 
  'ui.bootstrap', 
  'ngPageHeadMeta',
  'authentication',
  'exploreModule',
  'coreModule',
  'angularModalService',
//  'd3'
]);
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
(function () {
  'use strict';

  angular
    .module('authentication', [
      'authentication.controllers',
      'authentication.services'
    ]);

  angular
    .module('authentication.controllers', []);

  angular
    .module('authentication.services', ['ngCookies']);
})();
/*
angular.module('mainModule')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
//        $urlRouterProvider.otherwise("/404.html");
        $stateProvider
            .state('404', {
                url: "/404.html",
                views: {
                    "FullContentView": {
                        templateUrl: 'errors/404.html'
                    }
                }
            })
    }]);
    */
angular
  .module('coreModule', [
    'core.services'
  ]);

angular
  .module('core.services', []);
angular.module('mainModule')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: "/",
                views: {
                    "FullContentView": {
                        templateUrl: 'core/landing.html'
                    }
                }
            })
            .state('index.explore', {
                url: "explore/",
                views: {
                    "MainView@index": {
                        templateUrl: 'core/partials/explore.html',
                        controller: 'ExploreController'
                    }
                }
            })
            .state('index.investigate', {
                url: "investigate/",
                views: {
                    "MainView@index": {
                        templateUrl: 'core/partials/investigate.html'
                    }
                }
            });
        
        $stateProvider
            .state('register', {
                url: "/register",
                views: {
                    "FullContentView": {
                        templateUrl: 'authentication/register.html',
                        controller: 'RegisterController'
                    }
                }
            });

        $stateProvider
            .state('login', {
                url: "/login",
                views: {
                    "FullContentView": {
                        templateUrl: 'authentication/login.html',
                        controller: 'LoginController'
                    }
                }
            });
    }]);
angular
  .module('exploreModule', [
    'explore.controllers',
  ]);

angular
  .module('explore.controllers', []);
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
/**
* Register controller
* @namespace authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('authentication.controllers')
    .controller('RegisterController', ['$http', '$location', '$scope', 'Authentication', 
      function RegisterController($http, $location, $scope, Authentication) {
        $scope.register = register;

        $scope.email = "hua_guo@brown.edu";
        $scope.password = "1234";
        $scope.username = "hua";

        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf thinkster.authentication.controllers.RegisterController
         */
        function activate() {
          // If the user is authenticated, they should not be here.
          if (Authentication.isAuthenticated()) {
            $location.url('/');
          }
        }

        /**
        * @name register
        * @desc Try to register a new user
        * @param {string} email The email entered by the user
        * @param {string} password The password entered by the user
        * @param {string} username The username entered by the user
        * @returns {Promise}
        * @memberOf thinkster.authentication.services.Authentication
        */
        function register(email, password, username) {
          console.log(email)
          console.log($scope.email)
          return $http.post('/api/v1/accounts/', {
            username: $scope.username,
            password: $scope.password,
            email: $scope.email
          }).then(registerSuccessFn, registerErrorFn);

          /**
          * @name registerSuccessFn
          * @desc Log the new user in
          */
          function registerSuccessFn(data, status, headers, config) {
            Authentication.login(email, password);
          }

          /**
          * @name registerErrorFn
          * @desc Log "Epic failure!" to the console
          */
          function registerErrorFn(data, status, headers, config) {
            console.error('Epic failure!');
          }
        }
    }]); 
})();
/**
* Authentication
* @namespace authentication.services
*/
(function () {
  'use strict';

  angular
    .module('authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $http) {
    /**
    * @name Authentication
    * @desc The Factory to be returned
    */
    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate
    };

    return Authentication;

    ////////////////////

    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @param {string} email The email entered by the user
    * @returns {Promise}
    * @memberOf thinkster.authentication.services.Authentication
    */
    function register(email, password, username) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        password: password,
        email: email
      });
    }

    /**
     * @name login
     * @desc Try to log in with email `email` and password `password`
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function login(email, password) {
      return $http.post('/api/v1/auth/login/', {
        email: email, password: password
      }).then(loginSuccessFn, loginErrorFn);

      /**
       * @name loginSuccessFn
       * @desc Set the authenticated account and redirect to index
       */
      function loginSuccessFn(data, status, headers, config) {
        Authentication.setAuthenticatedAccount(data.data);

        window.location = '/';
      }

      /**
       * @name loginErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function loginErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
    }

    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function logout() {
      return $http.post('/api/v1/auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '/';
      }

      /**
       * @name logoutErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function logoutErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
    }

    /**
     * @name getAuthenticatedAccount
     * @desc Return the currently authenticated account
     * @returns {object|undefined} Account if authenticated, else `undefined`
     * @memberOf thinkster.authentication.services.Authentication
     */
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }

      return JSON.parse($cookies.authenticatedAccount);
    }

    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf thinkster.authentication.services.Authentication
     */
    function isAuthenticated() {
      return !!$cookies.authenticatedAccount;
    }

    /**
     * @name setAuthenticatedAccount
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} user The account object to be stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
    }

    /**
     * @name unauthenticate
     * @desc Delete the cookie where the user object is stored
     * @returns {undefined}
     * @memberOf thinkster.authentication.services.Authentication
     */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
    }

  }
})();
angular.module('mainModule')
    .controller('CoreCtrl', ['CoreFactory', function (CoreFactory) {
        
    }]);
angular.module('mainModule')
    .factory('CoreFactory', ['Restangular', function (Restangular) {
        return {

        }
    }]);
  angular
    .module('core.services')
    .factory('Core', Core);

  Core.$inject = ['$cookies', '$http'];

  function Core($cookies, $http) {
    var Core = {
      postTextByUserId: postTextByUserId,
      deleteEntry: deleteEntry,
      postConceptByUserId: postConceptByUserId,
      getAllDataForUser: getAllDataForUser
    };

    return Core;

    ////////////////////

    function getAllDataForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-data/' + userId + '/')
      .then(successFn, errorFn);
    }

    function postTextByUserId(userId, title, content) {
      return $http.post('/api/v1/data/texts/', {
        created_by: userId,
        title: title,
        content: content
      }).then(function(response) {
        return response.data[0];
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
      });
    }

    function postConceptByUserId(userId, term) {
      return $http.post('/api/v1/data/concepts/', {
        created_by: userId,
        term: term
      }).then(function(response) {
        return response.data[0];
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
      });
    }

    function deleteEntry(id, type, successFn, errorFn) {
      return $http.post('/api/v1/data/' + type + '/delete/', {
        // switch to using the id of the currently active user
        user_id: 1,
        id: id
      }).then(successFn, errorFn);
    }

  }
angular.module('explore.controllers')
  .controller('ExploreController', ['$scope', '$modal', 'Core',
    function($scope, $modal, Core) {


    var data = Core.getAllDataForUser(1, function(response) {
      $scope.texts = response.data.texts;
      $scope.concepts = response.data.concepts;
    }, function(response) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(response);
    });

    $scope.selectedEntry = {};
    $scope.selectedEntry['text'] = null;
    $scope.selectedEntry['concept'] = null;
    $scope.selectedEntry['evidence'] = null;

    $scope.hasUnsavedChanges = false;
    $scope.associationSource = '';

    $scope.filterSwitches = {};
    $scope.filterSwitches['text'] = false;
    $scope.filterSwitches['concept'] = false;
    $scope.filterSwitches['evidence'] = false;

    $scope.associatedIds = {};
    $scope.associatedIds['text'] = [];
    $scope.associatedIds['concept'] = [];
    $scope.associatedIds['evidence'] = [];

    $scope.texts = data.texts;
    $scope.concepts = data.concepts;
    $scope.evidence = data.evidence;

    $scope.associationMap = [
      {
        source: 1,
        sourceType: 'text',
        target: 1,
        targetType: 'concept'
      },
      {
        source: 1,
        sourceType: 'text',
        target: 1,
        targetType: 'evidence'
      },
      {
        source: 1,
        sourceType: 'concept',
        target: 1,
        targetType: 'text'
      },
      {
        source: 1,
        sourceType: 'concept',
        target: 1,
        targetType: 'evidence'
      }      

    ];

    $scope.selectEntry = function(elem, type) {
      if (elem === $scope.selectedEntry[type]) {
        $scope.selectedEntry[type] = null;
        if (type === 'text') $scope.activeText = '';
      }
      else {
        $scope.selectedEntry[type] = elem;
        if (type === 'text') $scope.activeText = $scope.selectedEntry['text'].content;
      }
    } 

    $scope.addTextEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/textsModal.html',
        controller: 'TextsModalController',
      });

      modalInstance.result.then(function (newEntry) {
        $scope.texts.push(newEntry);  
      });
    }

    $scope.addConceptEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/conceptsModal.html',
        controller: 'ConceptsModalController',
      });

      modalInstance.result.then(function (newEntry) {
        $scope.concepts.push(newEntry);    
      });      
    }

    $scope.addEvidenceEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/evidenceModal.html',
        controller: 'EvidenceModalController',
      });

      modalInstance.result.then(function (newEntry) {
        $scope.concepts.push(newEntry);    
      });      
    }

    $scope.saveTextEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/saveModal.html',
        controller: 'SaveModalController',
        resolve: {
          textEntry: function() {
            return $scope.selectedEntry['text'];
          }
        }
      });

      modalInstance.result.then(function (newEntry) {
        $scope.selectedEntry['text'].content = $scope.activeText;
        $scope.hasUnsavedChanges = false;
      });      
    }

    $scope.deleteEntry = function(type) {
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            switch (type) {
              case 'text': return $scope.selectedEntry[type].title;
              case 'concept': return $scope.selectedEntry[type].term;
              case 'evidence': return $scope.selectedEntry[type].title;
            }
          },
          id: function() {
            return $scope.selectedEntry[type].id;
          },
          type: function() {
            return type;
          }
        }
      });      

      var target = (type === 'text') 
        ? $scope.texts 
        : (type === 'concept' ? $scope.concepts : $scope.evidence)
      modalInstance.result.then(function (deletedEntryId) {
        _.remove(target, function(elem) {
          return elem.id === deletedEntryId;
        })
      });
    }

    $scope.startMakingChanges = function() {
      $scope.hasUnsavedChanges = true;
    }

    $scope.showAssociation = function(type) {
      if ($scope.associationSource === type) {
        updateAssociationSource('');
      }
      else {
        updateAssociationSource(type);
        switch (type) {
          case 'text': {
            $scope.associatedIds['concept'] = getAssociatedIds('text', 'concept', $scope.selectedEntry['text'].id);
            $scope.associatedIds['evidence'] = getAssociatedIds('text', 'evidence', $scope.selectedEntry['text'].id);
            break;
          }
          case 'concept': {
            $scope.associatedIds['text'] = getAssociatedIds('concept', 'text', $scope.selectedEntry['concept'].id);
            $scope.associatedIds['evidence'] = getAssociatedIds('concept', 'evidence', $scope.selectedEntry['concept'].id);
            break;
          }
          case 'evidence': {
            $scope.associatedIds['text'] = getAssociatedIds('evidence', 'text', $scope.selectedEntry['evidence'].id);
            $scope.associatedIds['concept'] = getAssociatedIds('evidence', 'concept', $scope.selectedEntry['evidence'].id);
            break;
          }
        }
      }
    }

    function updateAssociationSource(source) {
      _.forOwn($scope.filterSwitches, function(value, key) {
        $scope.filterSwitches[key] = source !== '' && source !== key; 
      });
      $scope.associationSource = source;
    }

    function getAssociatedIds(sourceType, targetType, source) {
      return _.filter($scope.associationMap, function(entry) {
        return entry.sourceType === sourceType && entry.targetType === targetType && entry.source === source;
      })
      .map(function(entry) {
        return entry.target;
      });      
    }

    $scope.associationInactive = function(source) {
      return $scope.selectedEntry[source]===null || ($scope.associationSource !== '' && $scope.associationSource !== source)
    }

    $scope.filterColumn = function(source) {
      if ($scope.filterSwitches[source]) {
        return function(entry) {
          return $scope.associatedIds[source].indexOf(entry.id) > -1;
        }
      }
      else {
        return function() {
          return true;
        }
      }
    }

  }]);

angular.module('explore.controllers')
  .controller('ConceptsModalController', ['$scope', '$modalInstance', '$modal', 'Core', 
    function($scope, $modalInstance, $modal, Core) {

    $scope.term = ""; 

    $scope.ok = function () {
      var newConcept = Core.postConceptByUserId(1, $scope.term);
      if (newConcept) {
        $modalInstance.close(newConcept);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
angular.module('explore.controllers')
  .controller('DeleteModalController', ['$scope', '$modalInstance', 'Core', 'id', 'content', 'type',
    function($scope, $modalInstance, Core, id, content, type) {

    $scope.id = id;
    $scope.content = content;
    $scope.type = type;

    $scope.delete = function () {
      Core.deleteEntry($scope.id, $scope.type, function() {
        $modalInstance.close($scope.id);
      }, function(response) {
        console.log('server error when deleting ' + $scope.type)
        console.log(response)
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
angular.module('explore.controllers')
  .controller('SaveModalController', function($scope, $modalInstance, textEntry) {

    $scope.textEntry = textEntry;

    $scope.save = function () {
      $modalInstance.close($scope.textEntry);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
angular.module('explore.controllers')
  .controller('TextsModalController', ['$scope', '$modalInstance', '$modal', 'Core', 
    function($scope, $modalInstance, $modal, Core) {

    $scope.title = "";
    $scope.content = ""; 

    $scope.ok = function () {
      var newText = Core.postTextByUserId(1, $scope.title, $scope.content);
      console.log(newText);
      if (newText) {
        $modalInstance.close(newText);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('authentication/login.html',
        "<div class=\"row\">\n  <div class=\"col-md-4 col-md-offset-4\">\n    <h1>Login</h1>\n\n    <div class=\"well\">\n      <form role=\"form\" ng-submit=\"login()\">\n        <div class=\"alert alert-danger\" ng-show=\"error\" ng-bind=\"error\"></div>\n\n        <div class=\"form-group\">\n          <label for=\"login__email\">Email</label>\n          <input type=\"text\" class=\"form-control\" id=\"login__email\" ng-model=\"email\" placeholder=\"ex. john@example.com\" />\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"login__password\">Password</label>\n          <input type=\"password\" class=\"form-control\" id=\"login__password\" ng-model=\"password\" placeholder=\"ex. thisisnotgoogleplus\" />\n        </div>\n\n        <div class=\"form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('authentication/register copy.html',
        "<div class=\"row\">\n  <div class=\"col-md-4 col-md-offset-4\">\n    <h1>Register</h1>\n\n    <div class=\"well\">\n      <form role=\"form\" ng-submit=\"register()\">\n        <div class=\"form-group\">\n          <label for=\"register__email\">Email</label>\n          <input type=\"email\" class=\"form-control\" id=\"register__email\" ng-model=\"email\" placeholder=\"ex. jane@notgoogle.com\" />\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"register__username\">Username</label>\n          <input type=\"text\" class=\"form-control\" id=\"register__username\" ng-model=\"username\" placeholder=\"ex. jane\" />\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"register__password\">Password</label>\n          <input type=\"password\" class=\"form-control\" id=\"register__password\" ng-model=\"password\" placeholder=\"ex. thisisnotgoogleplus\" />\n        </div>\n\n        <div class=\"form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('authentication/register.html',
        "<div class=\"row\">\n  <div class=\"col-md-4 col-md-offset-4\">\n    <h1>Register</h1>\n\n    <div class=\"well\">\n      <form role=\"form\" ng-submit=\"register()\">\n        <div class=\"form-group\">\n          <label for=\"register__email\">Email</label>\n          <input type=\"email\" class=\"form-control\" id=\"register__email\" ng-model=\"email\" placeholder=\"ex. jane@notgoogle.com\" />\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"register__username\">Username</label>\n          <input type=\"text\" class=\"form-control\" id=\"register__username\" ng-model=\"username\" placeholder=\"ex. jane\" />\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"register__password\">Password</label>\n          <input type=\"password\" class=\"form-control\" id=\"register__password\" ng-model=\"password\" placeholder=\"ex. thisisnotgoogleplus\" />\n        </div>\n\n        <div class=\"form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/landing.html',
        "<page-meta-data status-code=\"200\">\n\t<title>{{ 'meta_title_core' }}</title>\n\t<meta name=\"description\" content=\"{{ 'meta_description_core'}}\"/>\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_core' }}\"/>\n</page-meta-data>\n\n<div data-ng-controller=\"CoreCtrl\">\n    <ng-include src=\"'core/partials/language-picker.html'\"></ng-include>\n    <div ui-view=\"MainView\"></div>\n</div>\n");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('errors/404.html',
        "<page-meta-data status-code=\"404\">\n\t<title>{{ 'meta_title_404' | translate }}</title>\n\t<meta name=\"description\" content=\"{{ meta_description_404 }}\">\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_404' | translate }}\">\n</page-meta-data>\n\n<div>\n    <h1>Page was not found.</h1>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/conceptsModal.html',
        "<div class=\"modal-header\">\n    <h3>Add new concept</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"term\">Term</label>\n  <input type=\"text\" class=\"form-control\" id=\"term\" ng-model=\"term\"/>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/confirmModal.html',
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"content\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"delete()\">Delete</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/deleteModal copy.html',
        "<div class=\"modal-header\">\n    <h3>Are you sure you want to delete this?</h3>\n</div>\n<div class=\"modal-body\">\n  <p>{{textEntry.title}}</p>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-danger\" ng-click=\"delete()\">Delete</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/deleteModal.html',
        "<div class=\"modal-header\">\n    <h3>Are you sure you want to delete this?</h3>\n</div>\n<div class=\"modal-body\">\n  <p>{{content}}</p>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-danger\" ng-click=\"delete()\">Delete</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/modal.html',
        "<div ng-controller=\"ModalManagerCtrl\">\n    <script type=\"text/ng-template\" id=\"myModalContent.html\">\n        <div class=\"modal-header\">\n            <h3 class=\"modal-title\">I'm a modal!</h3>\n        </div>\n        <div class=\"modal-body\">\n            <ul>\n                <li ng-repeat=\"item in items\">\n                    <a href=\"#\" ng-click=\"$event.preventDefault(); selected.item = item\">{{ item }}</a>\n                </li>\n            </ul>\n            Selected: <b>{{ selected.item }}</b>\n        </div>\n        <div class=\"modal-footer\">\n            <button class=\"btn btn-primary\" type=\"button\" ng-click=\"ok()\">OK</button>\n            <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n        </div>\n    </script>\n\n    <button type=\"button\" class=\"btn btn-default\" ng-click=\"open()\">Open me!</button>\n    <div ng-show=\"selected\">Selection from a modal: {{ selected }}</div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/modalContent copy.html',
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"content\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/modalContent.html',
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"content\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/saveModal.html',
        "<div class=\"modal-header\">\n    <h3>Save the changes?</h3>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/textsModal copy.html',
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"content\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/textsModal.html',
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"content\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/english.html',
        "<p class=\"padding-lg\">\n    <em>\"In the end, it's not going to matter how many breaths you took, but how many moments took your breath away.\"</em>\n</p>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/explore.html',
        "  <div class=\"column\" id=\"texts-col\">\n    <div class=\"header\">\n      <span>Texts</span>\n    </div>\n    <div class=\"body row\">\n      <div class=\"index col-md-4\">\n        <table class=\"table\">\n          <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n            <td ng-click=\"selectEntry(t, 'text')\">{{t.title}}</td>\n          </tr>\n        </table>\n      </div>\n      <div class=\"content col-md-8\">\n        <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n        </textarea>\n      </div>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addTextEntry()\">Add</button>\n        <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='text'}\" ng-disabled=\"associationInactive('text')\" ng-click=\"showAssociation('text')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"concepts-col\">\n    <div class=\"header\">\n      <span>Concepts</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"c in concepts | filter:filterColumn('concept')\" ng-class=\"{active: hover || c.id == selectedEntry['concept'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n          <td ng-click=\"selectEntry(c, 'concept')\">{{c.term}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addConceptEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-class='{\"btn-success\": associationSource===\"concept\"}' ng-disabled=\"associationInactive('concept')\" ng-click=\"showAssociation('concept')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['concept']===null\" ng-click=\"deleteEntry('concept')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"evidence-col\">\n    <div class=\"header\">\n      <span>Evidence</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"e in evidence | filter:filterColumn('evidence')\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n           <td ng-click=\"selectEntry(e, 'evidence')\">{{e.title}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n        <button class=\"btn btn-default\">Edit</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='evidence'}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"showAssociation('evidence')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n      </div>\n    </div>\n  </div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/investigate.html',
        "<p class=\"padding-lg\">\n</p>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/language-picker.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.investigate\">Investigate</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/swedish.html',
        "<p class=\"padding-lg\">\n    <em>\"Det är egentligen bara dåliga böcker som äro i behov av förord.\"</em>\n</p>");
}]);