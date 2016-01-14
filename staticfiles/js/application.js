angular.module('mainModule', [
  'restangular', 
  'ui.router', 
  'ui.bootstrap', 
  'ngPageHeadMeta',
  'authentication',
  'logger',
  'coreModule',
  'v1Module',
  'v2Module',
  'modalModule',
  'utilityModule',
  'angularModalService',
  'angularFileUpload',
  'ngAnimate'
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
var myAwesomeJSVariable = "I'm so awesome!!";

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
    'core.services',
    'pubmed.services',
    'associationMap.services',
    'argument.services'
  ]);

angular
  .module('core.services', []);

angular
  .module('pubmed.services', []);  

angular
  .module('associationMap.services', ['core.services']);

angular
  .module('argument.services', ['core.services']);
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

        $stateProvider
            .state('v1', {
                url: "/v1",
                views: {
                    "FullContentView": {
                        templateUrl: 'core/v1/landing.v1.html',
                        controller: 'BaselineController'
                    }
                }
            })

        $stateProvider
            .state('v2', {
                url: "/v2",
                views: {
                    "FullContentView": {
                        templateUrl: 'core/v2/landing.v2.html',
                        controller: 'LandingController'
                    }
                }
            })       
            .state('v2.explore', {
                url: "/explore/:userId?collectionId",
                views: {
                    'MainView@v2': {
                        templateUrl: 'core/v2/explore.v2.html',
                        controller: 'ExploreController'
                    }
                }
            })
            .state('v2.focus', {
                url: "/focus/:userId?collectionId",
                views: {
                    "MainView@v2": {
                        templateUrl: 'core/v2/focus.v2.html',
                        controller: 'FocusController'
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
(function () {
  'use strict';

  angular
    .module('logger', [
      'logger.services'
    ]);

  angular
    .module('logger.services', []);
})();
angular
  .module('modalModule', [
    'modal.controllers',
  ]);

angular
  .module('modal.controllers', []);
angular
  .module('utilityModule', [
    'bibtex.services'
  ]);

angular
  .module('bibtex.services', []);
angular
  .module('v1Module', [
    'v1.controllers',
  ]);

angular
  .module('v1.controllers', ['modalModule']);
angular
  .module('v2Module', [
    'v2.controllers',
    'landing.v2.controllers',
    'explore.v2.controllers',
    'focus.v2.controllers',
    'termTopic.services',
    'ngAnimate', 
    'ui.bootstrap'
  ]);

angular
  .module('v2.controllers', ['modalModule']);

angular
  .module('landing.v2.controllers', []);

angular
  .module('explore.v2.controllers', ['angularFileUpload', 'ui.select', 'ngSanitize']);

angular
  .module('focus.v2.controllers', ['angularFileUpload']);

angular
  .module('termTopic.services', []);
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
  .module('argument.services')
  .factory('Argument', Argument);

Argument.$inject = ['$cookies', '$http'];

function Argument($cookies, $http) {

  var Argument = {
    getArgument: getArgument,
    getAssociatedEvidence: getAssociatedEvidence,
    getEvidenceRecommendation: getEvidenceRecommendation,
    getRelatedArguments: getRelatedArguments
  };

  return Argument;

  ////////////////////

  function getArgument() {

  }

  // Get evidence that are marked as associated by the user
  function getAssociatedEvidence(textId, paragraphIndex) {
  }

  // Get evidence that are judged as most relevant to the piece of argument
  function getEvidenceRecommendation(text, collectionId, successFn, errorFn) {
      $http.post('/api/v1/service/getEvidenceRecommendation/', {
        text: text,
        collectionId: collectionId
      }).then(successFn, errorFn);
      return;
  }

  function getRelatedArguments() {

  }

}
angular
  .module('associationMap.services')
  .factory('AssociationMap', AssociationMap);

AssociationMap.$inject = ['Core'];

function AssociationMap(Core) {
  var associationMap = null;

  var AssociationMap = {
    initialize: initialize,
    getAssociatedIdsBySource: getAssociatedIdsBySource,
    getAssociatedIdsByTarget: getAssociatedIdsByTarget,
    getAssociationsOfType: getAssociationsOfType,
    addAssociation: addAssociation,
    removeAssociation: removeAssociation,
    hasAssociation: hasAssociation
  };

  return AssociationMap;

  ////////////////////

  function initialize(userId, successFn) {
    Core.getAssociationMap(userId, function(response) {
      associationMap = response.data;
      console.log('>> User association map retrieved...');
      successFn();
    }, function(response) {
      console.log('server error when retrieving association map');
      console.log(response);
    });
  }

  function getAssociatedIdsBySource(sourceType, targetType, sourceId) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType && entry.sourceId === sourceId;
    })
    .map(function(entry) {
      return entry.targetId;
    });      
  }

  function getAssociatedIdsByTarget(sourceType, targetType, targetId) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType && entry.targetId === targetId;
    })
    .map(function(entry) {
      return entry.sourceId;
    });      
  }


  function getAssociationsOfType(sourceType, targetType) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType;
    })
  }

  function addAssociation(userId, sourceType, targetType, source, target, successFn) {
    Core.postAssociationByUserId(userId, sourceType, targetType, source, target, 
      function(response) {
        console.log(response.data[0])
        associationMap.push(response.data[0]);
        successFn(response.data[0]);
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);
      })
  }

  function removeAssociation(userId, sourceType, targetType, source, target, successFn) {
    Core.deleteAssociationByUserId(userId, sourceType, targetType, source, target, 
      function(response) {
        _.pull(associationMap, _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: source, targetId: target}));
        console.log('association map after deleting ' + source + ' ' + target);
        console.log(associationMap);
        successFn();
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);        
      })
  }

  function hasAssociation(sourceType, targetType, sourceId, targetId) {
    return _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: sourceId, targetId: targetId}) != undefined;
  }
}
  angular
    .module('core.services')
    .factory('Core', Core);

  Core.$inject = ['$cookies', '$http'];

  function Core($cookies, $http) {
    var csrf_token = '{% csrf_token %}';
    var Core = {
      addBookmark: addBookmark,
      deleteEntry: deleteEntry,
      postTextByUserId: postTextByUserId,
      postConceptByUserId: postConceptByUserId,
      postEvidenceByUserId: postEvidenceByUserId,
      postAssociationByUserId: postAssociationByUserId,
      deleteAssociationByUserId: deleteAssociationByUserId,
      deleteBookmark: deleteBookmark,
      getAllTextsForUser: getAllTextsForUser,
      getAllEvidenceForUser: getAllEvidenceForUser,
      getAllDataForUser: getAllDataForUser,
      getAssociationMap: getAssociationMap,
      getEvidenceByTopic: getEvidenceByTopic,
      getEvidenceByTitle: getEvidenceByTitle,
      getEvidenceCollection: getEvidenceCollection,
      getEvidenceTextTopicsForUser: getEvidenceTextTopicsForUser
    };

    return Core;

    ////////////////////

    function getAllTextsForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/texts/' + userId + '/')
       .then(successFn, errorFn);
    } 

    function getAllEvidenceForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/evidence/' + userId + '/')
       .then(successFn, errorFn);
    }       

    function getAllDataForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-data/' + userId + '/')
       .then(successFn, errorFn);
    }

    function getAssociationMap(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-associations/' + userId + '/')
        .then(successFn, errorFn);
    }


    function postTextByUserId(userId, title, content, isNew, textId, successFn, errorFn) {
      return $http.post('/api/v1/data/texts/' + userId + '/', {
        created_by: userId,
        title: title,
        content: content,
        is_new: isNew,
        text_id: textId
      }).then(successFn, errorFn);
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

    function getEvidenceCollection(collectionId, successFn, errorFn) {
      console.log('>> Retrieving evidence collection...');
      $http.get('/api/v1/data/collection/' + collectionId + '/')
        .then(successFn, errorFn);
    }

    function postEvidenceByUserId(userId, title, abstract, metadata, successFn, errorFn) {
      return $http.post('/api/v1/data/evidence/', {
        created_by: userId,
        title: title,
        abstract: abstract,
        metadata: metadata
      }).then(successFn, errorFn);
    }

    function getEvidenceByTopic(collectionId, topicId, userId, successFn, errorFn) {
      $http.post('/api/v1/service/getEvidenceByTopic/', {
        collection_id: collectionId,
        topic_id: topicId,
        user_id: userId
      }).then(successFn, errorFn);
    }

    function getEvidenceByTitle(collectionId, title, successFn, errorFn) {
      $http.post('/api/v1/service/searchEvidenceByTitle/', {
        collection_id: collectionId,
        title: title
      }).then(successFn, errorFn);
    }

    function postAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn)      
    }

    function addBookmark(userId, evidenceId, successFn, errorFn) {
      console.log('add bookmark called');
      return $http.post('/api/v1/data/bookmark/', {
        // switch to using the id of the currently active user
        user_id: userId,
        evidence_id: evidenceId
      }).then(successFn, errorFn);      
    }

    function deleteAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/delete/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn)      
    }

    function deleteEntry(id, type, userId, successFn, errorFn) {
      return $http.post('/api/v1/data/' + type + '/delete/', {
        // switch to using the id of the currently active user
        user_id: userId,
        id: id
      }).then(successFn, errorFn);
    }

    function deleteBookmark(userId, evidenceId, successFn, errorFn) {
      return $http.post('/api/v1/data/bookmark/delete/', {
        // switch to using the id of the currently active user
        user_id: userId,
        evidence_id: evidenceId
      }).then(successFn, errorFn);      
    }
 
    function getEvidenceTextTopicsForUser(userId, successFn, errorFn) {
      return $http.post('/api/v1/service/retrieveEvidenceTextTopics/', {
        user_id: userId
      }).then(successFn, errorFn);
    }

  }
  angular
    .module('pubmed.services')
    .factory('Pubmed', Pubmed);

  Pubmed.$inject = ['$cookies', '$http'];

  function Pubmed($cookies, $http) {
    var Pubmed = {
      findNeighborConcepts: findNeighborConcepts,
      searchEvidenceForTerms: searchEvidenceForTerms,
      extractTerms: extractTerms
    };

    return Pubmed;

    ////////////////////

    function findNeighborConcepts(concepts, userId, successFn, errorFn) {
      var plainConcepts = concepts.map(function(d) {
        return d.term;
      });
      return $http.post('api/v1/service/growConcept/', {
        concepts: plainConcepts,
        requested_by: 1
      }).then(successFn, errorFn);
    }

    function searchEvidenceForTerms(terms, userId, successFn, errorFn) {
      $http.post('api/v1/service/searchEvidenceForTerms/', {
        terms: terms,
        user_id: userId
      }).then(successFn, errorFn)
    }

    function extractTerms(text, userId, successFn, errorFn) {
      $http.post('api/v1/service/extractTerms/', {
        text: text
      }).then(successFn, errorFn);
    }

  }
(function () {
  'use strict';

  angular
    .module('logger.services')
    .factory('Logger', Logger);

  Logger.$inject = ['$http'];

  function Logger($http) {
    var csrf_token = '{% csrf_token %}';
    /**
    * @name Logger
    * @desc The Factory to be returned
    */
    var Logger = {
      logAction: logAction
    };

    var lastActionName = null;

    return Logger;

    ////////////////////

    function logAction(userId, actionName, majorVersion, minorVersion, view, parameters, successFn, errorFn, forbidRepeat) {
      if (forbidRepeat && actionName === lastActionName) return;
      lastActionName = actionName;
      return $http.post('/api/v1/action/add/', {
        userId: userId,
        name: actionName,
        majorVersion: majorVersion,
        minorVersion, minorVersion,
        view: view,
        parameters: parameters,
        csrf_token: csrf_token
      }).then(successFn, errorFn);
    }


    function postTextByUserId(userId, title, content, isNew, textId, successFn, errorFn) {
      return $http.post('/api/v1/data/texts/' + userId + '/', {
        created_by: userId,
        title: title,
        content: content,
        is_new: isNew,
        text_id: textId
      }).then(successFn, errorFn);
    }    

  }
})();
angular.module('modal.controllers')
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
angular.module('modal.controllers')
  .controller('DeleteModalController', ['$scope', '$modalInstance', 'Core', 'ids', 'content', 'type', 'userId',
    function($scope, $modalInstance, Core, ids, content, type, userId) {

    $scope.content = content;
    $scope.type = type;

    $scope.delete = function () {
      var counter = 0;
      for (var i = 0; i < ids.length; ++i) {
        var currentId = ids[i];
        Core.deleteEntry(currentId, $scope.type, userId, function() {
          Core.deleteBookmark(userId, currentId, function() {
            counter += 1;
            if (counter === ids.length) $modalInstance.close(ids);
          }, function(response) {
            console.log('server error when deleting evidence bookmark')
            console.log(response)
          });
        }, function(response) {
          console.log('server error when deleting ' + $scope.type)
          console.log(response)
        });
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
angular.module('modal.controllers')
  .controller('EvidenceModalController', ['$scope', '$modalInstance', '$modal', 'userId', 'Core', 'Bibtex',
    function($scope, $modalInstance, $modal, userId, Core, Bibtex) {

    $scope.title = "";
    $scope.abstract = "";

    $scope.ok = function () {
      var newEvidence = Core.postEvidenceByUserId(userId, $scope.title, $scope.abstract, {},
        function(response) {
          $modalInstance.close(response.data);
        }, function(response) {
          console.log('server error when saving new evidence');
          console.log(response);
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
angular.module('modal.controllers')
  .controller('SaveModalController', function($scope, $modalInstance, textEntry, userId, Core) {

    $scope.textEntry = textEntry;

    $scope.save = function () {
      Core.postTextByUserId(userId, $scope.textEntry.title, $scope.textEntry.content, false, $scope.textEntry.id, 
        function(response) {
          $modalInstance.close(response.data[0]);
        }, function(response) {
          console.log('server error when saving new concept');
          console.log(response);
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
angular.module('modal.controllers')
  .controller('TextsModalController', ['$scope', '$modalInstance', 'textsInfo', 'concepts', 'evidence', 'userId', 'Core', 'AssociationMap',
    function($scope, $modalInstance, textsInfo, concepts, evidence, userId, Core, AssociationMap) {

    $scope.textsInfo = textsInfo;
    $scope.concepts = concepts !== null ? concepts : [];
    $scope.evidence = evidence;
    var associatedConceptIds = AssociationMap.getAssociatedIdsBySource('text', 'concept', textsInfo.id);
    var associatedEvidenceIds = AssociationMap.getAssociatedIdsByTarget('evidence', 'text', textsInfo.id);
    var tempAssociatedConceptIds = [];
    var tempAssociatedEvidenceIds = [];

    $scope.ok = function () {
      var newText = Core.postTextByUserId(userId, $scope.textsInfo.title, $scope.textsInfo.content, true, null,
        function(response) {
          tempAssociatedConceptIds.forEach(function(id) {
            AssociationMap.addAssociation('text', 'concept', response.data[0].id, id);
          });
          $modalInstance.close(response.data[0]);
        }, function(response) {
          console.log('server error when saving new concept');
          console.log(response);
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    // Temporarily storing associations locally before the creation of the text entry on the server
    $scope.addAssociatedConceptLocally = function() {
      if (tempAssociatedConceptIds.indexOf($scope.selectedConcept.id) < 0) {
        tempAssociatedConceptIds.push($scope.selectedConcept.id)
      }
    }

    $scope.isAssociated = function(type, id) {
      if (type === 'concept') {
        return function(entry) {
          return associatedConceptIds.indexOf(entry.id) > -1 || tempAssociatedConceptIds.indexOf(entry.id) > -1;
        };
      }
      else if (type === 'evidence') {
        return function(entry) {
          return associatedEvidenceIds.indexOf(entry.id) > -1 || tempAssociatedEvidenceIds.indexOf(entry.id) > -1;
        };
      }
    }

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
        "<page-meta-data status-code=\"200\">\n\t<title>{{ 'meta_title_core' }}</title>\n\t<meta name=\"description\" content=\"{{ 'meta_description_core'}}\"/>\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_core' }}\"/>\n</page-meta-data>\n\n<div data-ng-controller=\"CoreCtrl\">\n    <ng-include src=\"'core/partials/version-picker.html'\"></ng-include>\n</div>\n");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('errors/404.html',
        "<page-meta-data status-code=\"404\">\n\t<title>{{ 'meta_title_404' | translate }}</title>\n\t<meta name=\"description\" content=\"{{ meta_description_404 }}\">\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_404' | translate }}\">\n</page-meta-data>\n\n<div>\n    <h1>Page was not found.</h1>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/conceptsModal copy.html',
        "<div class=\"modal-header\">\n    <h3>Add new concept</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"term\">Term</label>\n  <input type=\"text\" class=\"form-control\" id=\"term\" ng-model=\"term\"/>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
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
    $templateCache.put('modal/evidenceModal.html',
        "<div class=\"modal-header\">\n    <h3>Add new evidence</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"abstract\">Abstract</label>  \n  <textarea class=\"form-control\" id=\"abstract\" ng-model=\"abstract\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
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
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"textsInfo.title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"textsInfo.content\"></textarea>\n  <table class=\"table\">\n    <tr ng-repeat=\"c in concepts | filter:isAssociated('concept')\">\n      <td>{{c.term}}</td>\n    </tr>\n  </table>\n<!--  <select ng-model=\"selectedConcept\" ng-options=\"c.term for c in concepts\">\n    <option value=\"\">-- choose concept --</option>\n  </select>\n  <button class=\"btn btn-xs\" ng-click=\"addAssociatedConceptLocally()\">Add</button> -->\n<!--  <select class=\"form-control\" ng-model=\"selectedEvidence\" ng-options=\"e.title for e in evidence\">\n    <option value=\"\">-- choose evidence --</option>\n  </select> \n  <button class=\"btn btn-xs\">Add</button> -->\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);
angular
  .module('bibtex.services')
  .factory('Bibtex', Bibtex);

  function Bibtex($http, $q) {
    var Bibtex = {
      parseBibtexFile
    };

    return Bibtex;

    ////////////////////

    function parseBibtexFile(fileContent) {
      var evidenceList = [];
      var lines = fileContent.split('\n');

      lines.reduce(function(prev, curr, index, array) {
        var cleanLine = curr.trim(); // Wish this is really clean
        var initial = cleanLine.charAt(0);
        if (initial === '@') {
          var newEvidence = [cleanLine];
          prev.push(newEvidence);
        }
        else if (initial.length > 0 && initial !== '%') {
          var numOfEvidence = prev.length;
          prev[numOfEvidence-1].push(cleanLine);
        }
        return prev;
      }, evidenceList)

      var results = [];

      evidenceList.forEach(function(evidenceArray) {
        var evidenceString = evidenceArray.join('\n');
        var parsedEvidence = parseBibtex(evidenceString);
        for (var key in parsedEvidence) { // There should be only one key. Any better way to read that only key?
          var metadata = parsedEvidence[key];
          if (metadata.TITLE !== undefined) {
            results.push({
              title: metadata.TITLE,
              abstract: metadata.ABSTRACT !== undefined ? metadata.ABSTRACT : '',
              metadata: _.omit(_.omit(metadata, 'TITLE'), 'ABSTRACT')
            });
          }
        }
      });      

      return results;
    }
  }
angular.module('v1.controllers')
  .controller('BaselineController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Argument', 'Pubmed', 'Bibtex',
    function($scope, $modal, Core, AssociationMap, Argument, Pubmed, Bibtex) {

    var userId = 105;
    var topicColors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]

    Core.getAllDataForUser(userId, function(response) {
      console.log(response.data)
      $scope.texts = response.data.texts;
      $scope.concepts = response.data.concepts;
    }, function(response) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(response);
    });

    $scope.loadingEvidence = true;
    $scope.loadingStatement = 'Generating topic models over bookmarked evidence...';
    Core.getEvidenceTextTopicsForUser(userId, function(response) {
      processEvidenceTextTopics(response, 's');
      $scope.evidenceSourceMap = _.object(_.map($scope.evidence, function(e) {
        return [e.id, 1];
      }));
      visualizeTextTopicDistribution();
    });

    AssociationMap.initialize(userId);

    // terms extracted from the selected text
    $scope.terms = [];
    $scope.topics = null;
    $scope.evidenceSourceMap = {};

    $scope.selectedEntry = {};
    $scope.selectedEntry['text'] = null;
    $scope.selectedEntry['evidence'] = null;
    $scope.selectedWords = [];
    $scope.selectedTerms = [];
    $scope.selectedTopic = -1;
    $scope.evidenceSelectionMap = {};

    $scope.hasUnsavedChanges = false;
    $scope.associationSource = '';
    $scope.evidenceTextAssociated = false;

    $scope.filterSwitches = {};
    $scope.filterSwitches['text'] = false;
    $scope.filterSwitches['evidence'] = false;

    $scope.associatedIds = {};
    $scope.associatedIds['text'] = [];
    $scope.associatedIds['evidence'] = [];

    $scope.topics = [];
    $scope.evidence = [];
    $scope.evidenceTopicMap = {};
    $scope.textTopicMap = {};

    $scope.showCitingTexts = false;

    /* ========== Selector functions Begin ========== */

    $scope.selectEntry = function(elem, type) {
      if (elem === $scope.selectedEntry[type]) {
        $scope.selectedEntry[type] = null;
        if (type === 'text') $scope.activeText = '';
      }
      else {
        $scope.selectedEntry[type] = elem;
        if (type === 'text') $scope.activeText = $scope.selectedEntry['text'].content;
      }
      if ($scope.selectedEntry['evidence'] != null && $scope.selectedEntry['text'] != null) {
        $scope.evidenceTextAssociated = AssociationMap.hasAssociation('evidence', 'text',
          $scope.selectedEntry['evidence'].id,
          $scope.selectedEntry['text'].id
        );
      }
      if ($scope.selectedEntry['evidence'] != null) {
        $scope.selectedWords = $scope.selectedEntry['evidence'].abstract.split(' ');
      }
    } 

    $scope.selectTerm = function(term) {
      if ($scope.selectedTerms.indexOf(term) >= 0) {
        $scope.selectedTerms = _.without($scope.selectedTerms, term);
      }
      else {
        $scope.selectedTerms.push(term);
      }
    }

    $scope.selectTopic = function(topicIndex) {
      $scope.selectedTopic = ($scope.selectedTopic === topicIndex) ? -1 : topicIndex;
    }

    /* ========== Selector functions End ========== */

    /* ========== Input handling functions Begin ========== */

    $scope.addTerm = function() {
      var textComponent = document.getElementById('textContent');
      var selectedText;
      console.log(textComponent.selectionStart)
      // IE version
      if (document.selection != undefined)
      {
        textComponent.focus();
        var sel = document.selection.createRange();
        selectedText = sel.text;
      }
      // Mozilla version
      else if (textComponent.selectionStart != undefined)
      {
        var startPos = textComponent.selectionStart;
        var endPos = textComponent.selectionEnd;
        selectedText = textComponent.value.substring(startPos, endPos)
      }
      $scope.terms.push({
        frequency: -1,
        length: selectedText.split(' ').length,
        term:selectedText
      });
      console.log($scope.terms);
    };

    $scope.addTextEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/textsModal.html',
        controller: 'TextsModalController',
        resolve: {
          textsInfo: function() {
            return {
              id: -1,
              title: "",
              content: ""
            }
          },
          concepts: function() {
            return $scope.concepts;
          },
          evidence: function() {
            return $scope.evidence;
          },
          userId: function() {
            return userId;
          }
        }
      });

      modalInstance.result.then(function (newEntry) {
        $scope.texts.push(newEntry);  
      });
    }

    $scope.addEvidenceEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/evidenceModal.html',
        controller: 'EvidenceModalController',
        resolve: {
          userId: function() {
            return userId;
          }
        }
      });

      modalInstance.result.then(function (newEntries) {
        console.log(newEntries);
        $scope.evidence = $scope.evidence.concat(newEntries); 
        extendEvidenceMap(newEntries, 1);
      });      
    }


    // TODO: fill in
    $scope.updateEvidenceEntry = function() {
    }

    $scope.saveTextEntry = function() {
      var newText = $scope.selectedEntry['text'];
      newText.content = $scope.activeText;
      var modalInstance = $modal.open({
        templateUrl: 'modal/saveModal.html',
        controller: 'SaveModalController',
        resolve: {
          textEntry: function() {
            return $scope.selectedEntry['text'];
          },
          userId: function() {
            return userId;
          }
        }
      });

      modalInstance.result.then(function (newEntry) {
        $scope.selectedEntry['text'].content = $scope.activeText;
        $scope.hasUnsavedChanges = false;
      });      
    }

    $scope.deleteEntry = function(type) {
      var selectedEvidence = _.keys(_.pick($scope.evidenceSelectionMap, function(value, key) {
        return value;
      }));
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            if (selectedEvidence.length > 0) {
              return selectedEvidence.length + ' publications';
            }
            else {
              switch (type) {
                case 'text': return $scope.selectedEntry[type].title;
                case 'evidence': return $scope.selectedEntry[type].title;
              }
            }
          },
          id: function() {
            if (selectedEvidence.length > 0) {
              return selectedEvidence;
            }
            else {
              return [$scope.selectedEntry[type].id];
            }
          },
          type: function() {
            return type;
          },
          userId: function() {
            return userId;
          }
        }
      });      

      var target = (type === 'text') 
        ? $scope.texts : $scope.evidence;

      modalInstance.result.then(function (deletedEntryId) {
        for (var i = 0; i < deletedEntryId.length; ++i) {
          var entryId = deletedEntryId[i];
          _.remove(target, function(elem) {
            return elem.id == entryId;
          })
          if (type === 'evidence') {
            $scope.evidenceSelectionMap[entryId] = false;
          }
        };
      });
    }

    /* ========== Input handling functions End ========== */

    /* ========== Boolean functions Begin ========== */

    $scope.isSearchTerm = function(w) {
      if (w === 'of') {
        return false;
      }
      for (var i = 0; i < $scope.selectedTerms.length; ++i) {
        var term = $scope.selectedTerms[i].term;
        var term_parts = term.split(' ');
        var word_parts = w.split('-');
        if (term_parts.indexOf(w) > -1) {
          return true;
        }
        for (var j = 0; j < word_parts.length; ++j) {
          var wp = word_parts[j];
          if (term_parts.indexOf(wp) > -1) {
            return true;
          }
        }
      }
      return false;
    };

    $scope.isTopicTerm = function(w) {
      if (w === 'of') {
        return false;
      }
      if ($scope.selectedTopic === -1) return false;
      var topicTerms = $scope.topics[$scope.selectedTopic];
      for (var i = 0; i < topicTerms.length; ++i) {
        var term = topicTerms[i];
        var term_parts = term.split(' ');
        var word_parts = w.split('-');
        if (term_parts.indexOf(w) > -1) {
          return true;
        }
        for (var j = 0; j < word_parts.length; ++j) {
          var wp = word_parts[j];
          if (term_parts.indexOf(wp) > -1) {
            return true;
          }
        }
      }
      return false;
    }

    $scope.termSelected = function(term) {
      return $scope.selectedTerms.indexOf(term) >= 0;
    };

    $scope.evidenceTextAssociated = function() {
      if ($scope.selectedEntry['evidence']===null || $scope.selectedEntry['text']===null) {
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', 
        $scope.selectedEntry['evidence'].id, 
        $scope.selectedEntry['text'].id
      );
    };

    $scope.isAssociated = function(e, t) {
      if (e ===null || t === null) {
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', e.id, t.id);
    };
    $scope.cites = function(t, e) {
      if (e ===null || t === null) {
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', e.id, t.id);
    };
    $scope.toggleShowCitingTexts = function() {
        $scope.showCitingTexts = !$scope.showCitingTexts;
      console.log('show citing texts');
      console.log($scope.showCitingTexts);
    };


    /* ========== Boolean functions En ========== */

    /* ========== Event handling functions Begin ========== */

    $scope.startMakingChanges = function() {
      $scope.hasUnsavedChanges = true;
    }

    function updateAssociationSource(source) {
      _.forOwn($scope.filterSwitches, function(value, key) {
        $scope.filterSwitches[key] = source !== '' && source !== key; 
      });
      $scope.associationSource = source;
    };

    $scope.associationInactive = function(source) {
      return $scope.selectedEntry[source]===null || ($scope.associationSource !== '' && $scope.associationSource !== source)
    };

    // Add an association between the selected evidence and the active text
    $scope.updateEvidenceAssociation = function() {
      console.log('updare evidence association');
      var eid = $scope.selectedEntry['evidence'].id;
      var tid = $scope.selectedEntry['text'].id;
      console.log('association map shows having association? ' + AssociationMap.hasAssociation('evidence', 'text', eid, tid));
      if ($scope.evidenceTextAssociated) {
        AssociationMap.removeAssociation(userId, 'evidence', 'text', eid, tid, function() {
          $scope.evidenceTextAssociated = false;          
        });   
      }
      else {
        AssociationMap.addAssociation(userId, 'evidence', 'text', 
          eid, tid, function() {
            $scope.evidenceSourceMap[eid] = 1;
            $scope.evidenceTextAssociated = true;
          });        
      }
    };

    /* ========== Event handling functions End ========== */

    /* ========== Filter functions Begin ========== */
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
    };

    $scope.filterTerms = function() {
      return function(term) {
        return true;
//        return term.frequency > 1 || term.length > 1;
      };
    };

    $scope.filterEvidence = function() {
      return function(evidence) {
        return $scope.selectedTopic === -1 || $scope.evidenceTopicMap[evidence.id] == $scope.selectedTopic;
      }
    };

    $scope.evidenceOrder = function(e) {
      // 1000 and 500 are random...
      var order = 1000 - $scope.countTextsReferencingEvidence(e);
      if ($scope.isAssociated(e, $scope.selectedEntry['text'])) {
        order -= 1000;
      }
      if ($scope.evidenceSourceMap[e.id] === 0) {
        order = 1000;
      }

      return order;
    };


    /* ========== Filter functions End ========== */

    /* ========== Service requests functions Begin ========== */

    $scope.extractTerms = function() {
      var text = $scope.activeText;
      Pubmed.extractTerms(text, userId, function(response) {
        $scope.selectedTerms = [];
        $scope.terms = response.data;
      }, function(errorResponse) {
        console.log('error occurred while extracting terms');
        console.log(errorResponse)
      })
    }

    $scope.searchEvidenceForTerms = function() {
      var terms = $scope.selectedTerms.map(function(d) {
        return d.term;
      })

      $scope.loadingEvidence = true;
      $scope.loadingStatement = 'Searching PubMed for related publications...';
      // This function is called when the user wants to search the PubMed repo; 
      // There should be another function to handle search within personal reference
      Pubmed.searchEvidenceForTerms(terms, userId, function(response) {
        // After receiving the response, update the evidence list
        processEvidenceTextTopics(response, 's');
        extendEvidenceMap(response.data.evidence, 0);
        visualizeTextTopicDistribution();
      }, function(errorResponse) {
        console.log('error occurred while searching for evidence');
        console.log(errorResponse)        
      });
      setTimeout(function(){ 
        $scope.$apply(function(){
          $scope.loadingStatement = 'Generating topic models over retrieved evidence...';
        });
      }, 5000);
    };

    $scope.recommendCitations = function() {
      Argument.getEvidenceRecommendation($scope.activeText, function(response) {
        processEvidenceTextTopics(response, 'r');
        extendEvidenceMap(response.data.evidence, 0);
        visualizeTextTopicDistribution();
      }, function(errorResponse) {
        console.log('error occurred while recommending citations');
        console.log(errorResponse);
      });
    };

    function extendEvidenceMap(evidence, source) {
        var newEvidenceMap = _.object(_.map(_.filter(evidence, function(e) {
          return $scope.evidenceSourceMap[e.id] === undefined;
        }), function(e) {
          return [e.id, source];
        }));
        _.extend($scope.evidenceSourceMap, newEvidenceMap); 
    }

    /* ========== Service requests functions End ========== */    

    $scope.processBibtexFile = function() {
      var selectedFile = document.getElementById('bibtex-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        var evidenceList = Bibtex.parseBibtexFile(fileContent);      
        var storedEvidence = [];        
        
        evidenceList.forEach(function(evidence) {
          Core.postEvidenceByUserId(userId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), 
            function(response) {
              storedEvidence.push(response.data[0]);
              if (storedEvidence.length === evidenceList.length) {
                $scope.evidence = $scope.evidence.concat(storedEvidence); 
                extendEvidenceMap(storedEvidence, 1);
              }
            }, function(response) {
              console.log('server error when saving new evidence');
              console.log(response);
            });
        });

      };
      reader.readAsText(selectedFile);
    };

    $scope.countTextsReferencingEvidence = function(e) {
      return AssociationMap.getAssociatedIdsBySource('evidence', 'text', e.id).length;
    };

    $scope.countEvidenceWithTopic = function(topicIndex) {
      var result = 0;
      for (var key in $scope.evidenceTopicMap) {
        if ($scope.evidenceTopicMap[key] === topicIndex) {
          result += 1;
        }
      }
      return result;
    };

    $scope.countSearchTermOccurrence = function(term, abstract) {
      var result = 0;
      var abstractWords = abstract.split(' ');
      for (var i = 0; i < abstractWords.length; ++i) {
        var word = abstractWords[i];
        if (word === 'of') {
          continue
        }
        var term_parts = term.split(' ');
        if (term_parts.indexOf(word) > -1) result += 1;
        if (word.split('-').length>1) {
          for (var j = 0; j < term_parts.length; ++j) {
            if (word.split('-').indexOf(term_parts[j]) > -1) {
              result += 1;
            }
          }
        }
      }
      return result;
    };

    function processEvidenceTextTopics(response, mode) {
      if (mode === 's') {
        $scope.topics = response.data.topics;
        $scope.evidence = _.uniq(response.data.evidence, function(n) {
          return n.id;
        }).map(function(e) {
          e.metadata = JSON.parse(e.metadata);
          return e;
        });
        $scope.evidenceSelectionMap = _.object(_.map($scope.evidence, function(e) {
          return [e.id, false];
        }));
        $scope.evidenceTopicMap = _.object(_.map(_.omit(response.data.evidenceTextTopicMap, function(value, key) {
          return !key.startsWith('e');
        }), function(value, key) {
          return [key.split('-')[1], value.max]
        }));
        $scope.textTopicMap = _.object(_.map(_.omit(response.data.evidenceTextTopicMap, function(value, key) {
          return !key.startsWith('t');
        }), function(value, key) {
          return [key.split('-')[1], value.dist]
        }));
        $scope.loadingEvidence = false;
      }
      else if (mode === 'r') {
        var data = response.data;
        console.log(data);
        $scope.topics = _.map(data.topics, function(d) {
          return d.terms.map(function(t) {
            return t[0];
          });
        });
        $scope.evidence = data.evidence.map(function(e) {
          e.metadata = JSON.parse(e.metadata);
          return e;
        });
        $scope.evidenceSelectionMap = _.object(_.map($scope.evidence, function(e) {
          return [e.id, false];
        }));
        $scope.evidenceTopicMap = _.object(_.map($scope.evidence, function(e) {
          return [e.id, 0];
        }));
        // TODO: update $scope.textTopicMap
        $scope.loadingEvidence = false;           
      }
    };

    function visualizeTextTopicDistribution() {
      d3.selectAll('.topic-info').selectAll('g').remove();
      if ($scope.topics.length === 0) {
        return;
      }
      d3.selectAll('.topic-info')
        .data($scope.texts)
        .append('g')        
        .selectAll('rect')
        .data(function(t) {
          var distribution = $scope.textTopicMap[t.id];
          var accumulation = distribution.reduce(function(prev, curr, index) {
            if (index === 0) {
              return prev.concat([curr]);
            }
            else {
              return prev.concat([curr + prev[prev.length-1]])
            }
          }, [0]);
          return distribution.map(function(d, i) {
            return {
              'dist': d,
              'acc': accumulation[i]
            };
          });
        })
        .enter()
        .append('rect')
        .attr('fill', function(d, i) {
          return topicColors[i];
        })
        .attr('width', function(d) {
          return d.dist * 150;
        })
        .attr('height', 20)
        .attr('transform', function(d, i) {
          var left = d.acc * 150;
          return 'translate(' + left + ',0)';
        });      
    }

  }]);

angular.module('v1.controllers')
  .controller('TermVisController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed',
    function($scope, $modal, Core, AssociationMap, Pubmed) {

    

  }]);

angular.module('explore.v2.controllers')
  .controller('ExploreController', ['$scope', '$stateParams', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic', 'Logger',
    function($scope, $stateParams, $modal, Core, AssociationMap, Pubmed, TermTopic, Logger) {

    console.log($stateParams)

    var topTermContainer = null;
    var topTopicContainer = null;
    var termTopicConnectionContainer = null;
    var topicNeighborContainer = null;
    var termColorMap = d3.scale.category10();

    var defaultFill = '#ccc';

    $scope.collections = [
      { id: 10, name: 'visualization'},
      { id: 11, name: 'pfc and executive functions'},
      { id: 12, name: 'virtual reality'},
      { id: 13, name: 'TVCG'},
    ];

    var userId = parseInt($stateParams.userId);
    var collectionId = parseInt($stateParams.collectionId);

    $scope.userId = userId;
    $scope.collectionId = collectionId;
    $scope.collectionName = _.find($scope.collections, function(c) {
      return c.id === collectionId;
    }).name;

    var termBatchSize = 30;
    var topicBatchSize = 30;

    $scope.selectedEvidence = null;
    $scope.selectedTerms = [];
    $scope.selectedWords = [];
    $scope.selectedTopic = null;

    $scope.candidateEvidence = [];
    $scope.searchTitle = '';

    $scope.selected = {};

    $scope.loadingEvidence = true;
    $scope.loadingTopicEvidence = false;
    $scope.loadingStatement = 'Retrieving evidence collection and topics...';

    $scope.termStartIndex = 0;

    Logger.logAction(userId, 'load explore view', 'v2','1', 'explore', {
      collectionId: collectionId
    }, function(response) {
      console.log('action logged: load explore view');
    });

    Core.getEvidenceCollection(collectionId, function(response) {
      $scope.loadingEvidence = false;
      $scope.topics = response.data.map(function(topic) {
        return {
          id: topic.index,
          terms: JSON.parse(topic.terms).map(function(termTuple) {
            return {
              term: termTuple[0],
              prob: termTuple[1]
            }
          }),
          evidenceCount: topic.document_count
        }
      });
      console.log($scope.topics)
      TermTopic.initialize($scope.topics);
      $scope.terms = TermTopic.getAllTerms();
      $scope.selected.searchTerm = $scope.terms[0];
      visualizeTopicTermDistribution();
//      visualizeTopicTermGraph();
//      visualizeTopicTermMatrix($scope.topics);
    }, function(errorResponse) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(errorResponse);
    });

    function updateTerms() {
      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex, $scope.selectedTerms);
      var topicAndConnections = TermTopic.getTopTopics(terms, topicBatchSize, $scope.selectedTerms);
      var topics = topicAndConnections.topics;
      var termTopicConnections = topicAndConnections.termTopicConnections;
      visualizeTopTerms(topTermContainer, 300, 600, terms);
      visualizeTermTopicConnections(termTopicConnectionContainer, 100, 600, terms, topics, termTopicConnections);
      visualizeTopTopics(topTopicContainer, 650, 600, topics);
      updateTermTopicFills();
      updateConnectionStrokes();
    }

    $scope.searchEvidenceByTitle = function() {
        Logger.logAction(userId, 'search evidence by title', 'v2','1', 'explore', {
          query: $scope.searchTitle
        }, function(response) {
          console.log('action logged: search evidence by title');
        });

      Core.getEvidenceByTitle(collectionId, $scope.searchTitle, function(response) {
        $scope.candidateEvidence = response.data;
        $scope.selected.searchTitle = $scope.candidateEvidence[0];
        $scope.selectSearchTitle($scope.selected.searchTitle);
      });
    };

    $scope.selectSearchTitle = function(title) {

        Logger.logAction(userId, 'select title by search', 'v2','1', 'explore', {
          evidence: title.id
        }, function(response) {
          console.log('action logged: select title by search');
        });

      if (title.topic !== -1) {
        $scope.selectedTopic = _.find($scope.topics, function(t) {
          return t.id === title.topic;
        });
        console.log($scope.selectedTopic)
        for (var i = 0; i < 5; ++i) {
          $scope.selectedTerms.push($scope.selectedTopic.terms[i].term);
        }
        $scope.updateTermTopicOrdering();
      }
    }

    $scope.selectSearchTerm = function(term) {
      $scope.selectedTerms.push(term.term);
      $scope.termStartIndex = 0;
      updateTerms();
//      updateTerms(newTerms, topics, termTopicConnections);
    };

    $scope.showNextTerms = function() {
      if (TermTopic.numOfTerms() > $scope.termStartIndex + termBatchSize) {

        Logger.logAction(userId, 'scroll terms', 'v2','1', 'explore', {
          direction: 'forward'
        }, function(response) {
          console.log('action logged: scroll terms');
        });

        $scope.termStartIndex += termBatchSize;
        updateTerms();
      }
    };

    $scope.showPrevTerms = function() {
      if ($scope.termStartIndex - termBatchSize >= 0) {

        Logger.logAction(userId, 'scroll terms', 'v2','1', 'explore', {
          direction: 'backward'
        }, function(response) {
          console.log('action logged: scroll terms');
        });

        $scope.termStartIndex -= termBatchSize;
        updateTerms();
      }
    };

    $scope.isTopicTerm = function(w) {
      if (w === 'of') {
        return false;
      }
      if ($scope.selectedTopic === null) return false;
      var topicTerms = _.take($scope.selectedTopic.terms, 10);
      for (var i = 0; i < topicTerms.length; ++i) {
        var term = topicTerms[i].term;
        if (matchesTerm(w, term)) {
          return true;
        }
      }
      return false;
    };

    function matchesTerm(word, term) {
        var term_parts = term.split(' ');
        var word_parts = word.split('-');
        if (term_parts.indexOf(word) > -1) {
          return true;
        }
        for (var j = 0; j < word_parts.length; ++j) {
          var wp = word_parts[j];
          if (term_parts.indexOf(wp) > -1) {
            return true;
          }
        } 
        return false;    
    }

    $scope.selectEvidence = function(evidence) {
      Logger.logAction(userId, 'select evidence', 'v2', '1', 'explore', {
        evidence: evidence.id,
      }, function(response) {
        console.log('action logged: select evidence');
      });

      $scope.selectedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');
    }

    // Get co-occurred terms and publications with those labels
    $scope.getNeighborConcepts = function() {

      Pubmed.findNeighborConcepts($scope.selectedConcepts, 1, function(response) {
        console.log(response);
      }, function(errorRespone) {

      });
    };

    $scope.updateTermTopicOrdering = function() {

      // TODO: check whether invoked through UI or programatically
      Logger.logAction(userId, 'reorder term and topics given selected terms', 'v2','1', 'explore', {
        numSelectedTerms: $scope.selectedTerms.length
      }, function(response) {
        console.log('action logged: reorder term and topics given selected terms');
      });

      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex, $scope.selectedTerms);
      var topicsAndConnections = TermTopic.getTopTopics(terms, topicBatchSize, $scope.selectedTerms);
      var topics = topicsAndConnections.topics;
      var connections = topicsAndConnections.termTopicConnections;      
      visualizeTopTerms(topTermContainer, 300, 600, terms);
      visualizeTopTopics(topTopicContainer, 650, 600, topics);
      visualizeTermTopicConnections(termTopicConnectionContainer, 100, 600, terms, topics, connections);
      updateTermTopicFills();
      updateConnectionStrokes();
    };

    $scope.bookmarkEvidence = function(e) {
      Logger.logAction(userId, 'bookmark evidence', 'v2', '1', 'explore', {
        evidence: e.id,
        topic: $scope.selectedTopic.id,
        numDocuments: $scope.evidence.length
      }, function(response) {
        console.log('action logged: bookmark evidence');
      });

      Core.addBookmark(userId, e.id, function(response) {
        console.log('bookmark evidence success');
        e.bookmarked = true;
      }, function(errorResponse) {
        console.log(errorResponse);
      });
    };

    function visualizeTopicTermDistribution(topics) {
      var params = {
        width: 1800,
        height: 600,
        margin: { 
          left: 50,
          top: 80,
          bottom: 20,
          right: 0
        },
        termNum: 50
      };

      var canvas = d3.select('#topic-term-dist')
        .attr('width', params.width + params.margin.left + params.margin.right)
        .attr('height', params.height + params.margin.top + params.margin.bottom);

      canvas.append('text')
        .text('Terms (' + TermTopic.numOfTerms() + ' total)')
        .attr('font-size', 18)
        .attr('transform', 'translate(170, 20)');

      canvas.append('text')
        .text('Topics (' + TermTopic.numOfTopics() + ' total)')
        .attr('font-size', 18)
        .attr('transform', 'translate(500, 20)');

      canvas.append('text')
        .text('Similar topics')
        .attr('font-size', 18)
        .attr('transform', 'translate(1150, 20)');

      canvas.append('text')
        .text('# of docs')
        .attr('font-size', 14)
        .attr('transform', 'translate(450, 60)');

      canvas.append('text')
        .text('term distribution')
        .attr('font-size', 14)
        .attr('transform', 'translate(725, 60)');

      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex);
      var topicAndConnections = TermTopic.getTopTopics(terms, topicBatchSize);
      var topics = topicAndConnections.topics;
      var termTopicConnections = topicAndConnections.termTopicConnections;

      topTermContainer = configSvgContainer(canvas.append('svg'), 300, params.height, params.margin.left, params.margin.top);
      termTopicConnectionContainer = configSvgContainer(canvas.append('svg'), 100, params.height, params.margin.left + 300, params.margin.top);
      topTopicContainer = configSvgContainer(canvas.append('svg'), 650, params.height, params.margin.left + 400, params.margin.top);
      topicNeighborContainer = configSvgContainer(canvas.append('svg'), 600, params.height + 30, params.margin.left + 1050, params.margin.top - 30);

      visualizeTopTerms(topTermContainer, 300, 600, terms);
      visualizeTermTopicConnections(termTopicConnectionContainer, 100, 600, terms, topics, termTopicConnections);
      visualizeTopTopics(topTopicContainer, 650, 600, topics);
    }

    function configSvgContainer(container, width, height, x, y) {
      container
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y);

      return container;
    }

    function visualizeTopTerms(container, width, height, topTerms) {

      var x = d3.scale.linear()
        .domain([0, TermTopic.getTermPropertyMax('weight')])
        .range([0, width-140]); // 100 pixels are allocated to the texts

      var y = d3.scale.ordinal()
        .domain(d3.range(termBatchSize))
        .rangeBands([0, height], 0.05);

      var term = container.selectAll('.term')
        .data(topTerms, function(d) {
          return d.term;
        });

      term.exit().remove();
      var newTerms = term.enter()
        .append('g')
        .attr('class', 'term');
      term.transition()
        .attr('transform', function(d, i) {
          return 'translate(100, ' + y(i) + ')'; // Each group is moved right by 100, to leave 100 pixels for the texts
        });

      newTerms.append('text')
        .text(function(term) {
          return term.term;
        })
        .attr('text-anchor', 'end')
        .attr('dy', 13);

      newTerms.append('rect')
        .attr('width', function(d) {
          return x(d.properties.weight);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .attr('transform', 'translate(20, 0)') // Space between rectangles and texts
        .on('click', function(d) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            Logger.logAction(userId, 'deselect term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              topicCount: d.properties.topicCount,
              target: 'term index'
            }, function(response) {
              console.log('action logged: deselect term');
            });
            $scope.selectedTerms = _.without($scope.selectedTerms, d.term);
          }
          else {
            Logger.logAction(userId, 'select term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              topicCount: d.properties.topicCount,
              target: 'term index'
            }, function(response) {
              console.log('action logged: select term');
            });
            $scope.selectedTerms.push(d.term);
          }
          updateTermTopicFills();
          updateConnectionStrokes();
        });
    }

    function updateTermTopicFills() {
      termColorMap.domain($scope.selectedTerms);
      topTermContainer.selectAll('rect')
        .attr('fill', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            return termColorMap(d.term);
          }
          else {
            return '#ccc';
          }
        });
      topTopicContainer.selectAll('rect')
        .attr('fill', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            return termColorMap(d.term);
          }
          else {
            return '#ccc';
          }
        });
    }

    function updateConnectionStrokes() {
      termTopicConnectionContainer.selectAll('path')
        .attr('stroke', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term.term) >= 0) {
            return termColorMap(d.term.term);
          }
          else {
            return '#ccc';
          }          
        })
        .attr('opacity', function(d, i) {
          return ($scope.selectedTerms.length === 0 || $scope.selectedTerms.indexOf(d.term.term) >= 0) ? 1 : 0;
        });
    }

    function visualizeTopTopics(container, width, height, topTopics) {

      var y = d3.scale.ordinal()
        .domain(d3.range(topicBatchSize))
        .rangeBands([0, height], 0.05);

      var topic = container.selectAll('.topic')
        .data(topTopics, function(d, i) {
          return d.id;
        });

      topic.exit().remove();

      var newTopics = topic
        .enter()
        .append('g')
        .attr('class', 'topic')

      topic.transition()
        .attr('transform', function(d, i) {
          return 'translate(50, ' + y(i) + ')'; // 50 is allocated to topic ids
        });

      visualizeIndividualTopic(newTopics, width-50, y);
    }

    function visualizeIndividualTopic(topic, width, y) {

      var termWidth = width - 10;

      topic.append('rect')
        .attr('class', 'topic-background')
        .attr('id', function(d) {
          return 'topic-bg-' + d.id;
        })
        .attr('width', 60)
        .attr('height', 20)
        .attr('transform', 'translate(-50, 0)')
        .attr('rx', 5)
        .attr('fill', 'steelblue')
        .attr('opacity', 0);

      topic.append('text')
        .text(function(topic) {
          return topic.evidenceCount;
        })
        .attr('text-anchor', 'end')
        .attr('dy', 13)
        .attr('dx', -20)
        .on('mouseover', function(d) {
          d3.selectAll('.topic-background').attr('opacity', 0);
          d3.select('#topic-bg-' + d.id).attr('opacity', 0.5); 
          if ($scope.selectedTopic !== null) {
            d3.select('#topic-bg-' + $scope.selectedTopic.id).attr('opacity', 0.5); 
          }
        })
        .on('mouseout', function() {
          d3.selectAll('.topic-background').attr('opacity', function(d) {
            return ($scope.selectedTopic !== null && d.id === $scope.selectedTopic.id) ? 0.5 : 0;
          });          
        })
        .on('click', function(d) {
          Logger.logAction(userId, 'select topic', 'v2','1', 'explore', {
            topic: d.id,
            target: 'individual topic'
          }, function(response) {
            console.log('action logged: select topic');
          });

          d3.selectAll('.topic-background').attr('opacity', 0);
          d3.select('#topic-bg-' + d.id).attr('opacity', 0.5);        
          setSelectedTopic(d);
        });      

      var probSum = 1;
      // Hack alert!!!
      if (collectionId === 12) probSum = 0.2;
      if (collectionId === 13) probSum = 0.5;

      var term = topic.selectAll('g')
        .data(function(d, i) {
          var acc = 0;
          var terms = d.terms;
          for (var j = 0; j < terms.length; ++j) {
            var term = terms[j];
            term.prevProb = acc;
            acc += term.prob;
          }
          terms.push({
            prevProb: acc,
            prob: probSum - acc,
            term: 'other terms'
          });
          return terms;
        })
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
          return 'translate(' + (d.prevProb * termWidth * (1 / probSum)) + ', 0)';
        });

      term.append('rect') 
        .attr('width', function(d) {
          return Math.max(d.prob * termWidth * (1 / probSum) - 1, 1);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .on('click', function(d) {
          // TODO: cannot easily count topic count here, will add if necessary
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            Logger.logAction(userId, 'deselect term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              prob: d.prob,
              topic: topic.id,
              target: 'individual topic'
            }, function(response) {
              console.log('action logged: deselect term');
            });
            $scope.selectedTerms = _.without($scope.selectedTerms, d.term);
          }
          else {
            Logger.logAction(userId, 'select term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              prob: d.prob,
              topic: topic.id,
              target: 'individual topic'
            }, function(response) {
              console.log('action logged: select term');
            });
            $scope.selectedTerms.push(d.term);
          }
          updateTermTopicFills();
        });        

      term.append('text')
        .attr('x', function(d) {
          return d.prob * termWidth * (1 / probSum) / 2;
        })
        .attr('dy', 13)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text(function(d, i) {
          return i < 2 ? d.term : '';
        });      
    }

    function setSelectedTopic(d) {
      $scope.selectedTopic = d;
      visualizeTopicNeighborMatrix(topicNeighborContainer, 600, 600, d);
      $scope.selectedDocumentTerms = _.object(_.range(10).map(function(num) {
        return [num, false];
      }));
      $scope.loadingTopicEvidence = true;
      Core.getEvidenceByTopic(collectionId, d.id, userId, function(response) {
        $scope.evidence = response.data.evidence;
        var bookmarkedEvidence = response.data.evidenceBookmarks.map(function(b) {
          return b.evidence;
        });
        $scope.evidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
          e.bookmarked = bookmarkedEvidence.indexOf(e.id) >= 0;
        })
        $scope.loadingTopicEvidence = false;
      }, function(errorResponse) {
        console.log(errorResponse);
      })      
    } 

    function visualizeTermTopicConnections(container, width, height, terms, topics, connections) {

      var termIndexMap = getItemIndexMap(terms, 'origIndex');
      var topicIndexMap = getItemIndexMap(topics, 'id');

      var termY = d3.scale.ordinal()
        .domain(d3.range(termBatchSize))
        .rangeBands([0, height], 0.05);
      var topicY = d3.scale.ordinal()
        .domain(d3.range(topicBatchSize))
        .rangeBands([0, height], 0.05);

      var line = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate('basis');

      var curve = container.selectAll('.connection')
        .data(connections, function(d, i) {
          return d.term.origIndex + '-' + d.topic.id;
        });

      curve.exit().remove();

      curve.enter()
        .append('path')
        .attr('class', 'connection')
        .attr('fill', 'none')
        .attr('stroke', '#ccc');

      curve
        .attr('d', function(d) {
          var termPos = 5 + termY(termIndexMap[d.term.origIndex]);
          var topicPos = 5 + topicY(topicIndexMap[d.topic.id]);
          var points = [
            {x: 0, y: termPos},
            {x: 50, y: termPos},
            {x: 50, y: topicPos},
            {x: 100, y: topicPos}
          ]; 
          return line(points);
        });
    }

    function getItemIndexMap(itemArray, idProperty) {
      return _.object(itemArray.map(function(item, i) {
        return [item[idProperty], i];
      }));
    }

    // Deprecated - replaced by visualizeTopicNeighborMatrix
    function visualizeTopicTermMatrix(topics) {
      var params = {
        width: 1000,
        height: 1000,
        margin: {
          left: 100,
          top: 50
        },
        termNum: 50
      };

      var canvas = d3.select('#topic-term-matrix')
        .style('width', params.width)
        .style('height', params.height);

      var x = d3.scale.ordinal()
        .domain(topTopics.map(function(topic) {
          return topic.id;
        }))
        .rangeBands([0, params.width - params.margin.left]);
      var y = d3.scale.ordinal()
        .domain(_.take(termOrders.weight, params.termNum))
        .rangeBands([0, params.height - params.margin.top]);

      var row = canvas.selectAll('.term-row')
        .data(topTerms)
        .enter()
        .append('g')
        .attr('class', 'term-row')
        .attr('transform', function(d) {
          return 'translate(' + params.margin.left + ', ' + (params.margin.top+y(d.origIndex)) + ')';
        });

      row.append('line')
        .attr('x2', params.width)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      row.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'end')
        .text(function(d, i) {
          return d.term;
        });

      var column = canvas.selectAll('.topic-col')
        .data(topTopics)
        .enter()
        .append('g')
        .attr('class', 'topic-col')
        .attr('transform', function(d) {
          return 'translate(' + (params.margin.left+x(d.id)) + ', ' + params.margin.top + ')';
        });

      column.append('line')
        .attr('y2', params.height)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      column.append('text')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(-45)')
        .text(function(d, i) {
          return d.id;
        });

      column.selectAll('circle')
        .data(function(d) {
          return _.filter(d.terms, function(term) {
            return topTerms.map(function(t) {
                return t.term;
              })
              .indexOf(term.term) > -1;
          });
        })
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', '#ccc')
        .attr('transform', function(d) {
          return 'translate(0, ' + y(termIndexMap[d.term]) + ')'
        });
    }

    function visualizeTopicNeighborMatrix(container, assignedWidth, assignedHeight, topic) {
      var topTerms = _.take(topic.terms, 10);
      var neighborTopics = TermTopic.getNeighborTopics(topic, 2);

      var width = Math.min(assignedWidth, topTerms.length * 30);
      var height = Math.min(assignedHeight, neighborTopics.length * 20);

      var margin = {
        top: 80,
        left: 20
      }

      var x = d3.scale.ordinal()
        .domain(topTerms.map(function(term) {
          return term.term;
        }))
        .rangeBands([0, width]);
      var y = d3.scale.ordinal()
        .domain(_.sortBy(neighborTopics, function(topic) {
          return topic.numSharedTerms;
        }).map(function(topic) {
          return topic.id;
        }))
        .rangeBands([0, height]);

      container.selectAll('.topic-row').remove();
      container.selectAll('.term-col').remove();

      var row = container.selectAll('.topic-row')
        .data(neighborTopics)
        .enter()
        .append('g')
        .attr('class', 'topic-row')
        .attr('transform', function(d) {
          return 'translate(' + margin.left + ', ' + (margin.top+y(d.id)) + ')';
        });

      row.append('line')
        .attr('x2', width)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      row.append('rect')
        .attr('class', 'topic-rect')
        .attr('height', 20)
        .attr('width', width)
        .attr('stroke', 'white')
        .attr('fill', '#ccc')
        .on('mouseover', function(d, i) {
          d3.select(this)
            .attr('fill', 'steelblue');
        })
        .on('mouseout', function(d, i) {
          d3.select(this)
            .attr('fill', '#ccc');          
        })
        .on('click', function(d, i) {
          Logger.logAction(userId, 'select topic', 'v2','1', 'explore', {
            topic: d.id,
            target: 'neighbor topic matrix'
          }, function(response) {
            console.log('action logged: select topic');
          });
          setSelectedTopic(d);
        });      

      var column = container.selectAll('.term-col')
        .data(topTerms)
        .enter()
        .append('g')
        .attr('class', 'term-col')
        .attr('transform', function(d) {
          return 'translate(' + (margin.left + x(d.term)) + ', ' + margin.top + ')';
        });

/*
      column.append('line')
        .attr('y2', height)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1); */

      column.append('text')
        .attr('text-anchor', 'start')
        .attr('dx', 10)
        .attr('transform', 'rotate(-45)')
        .text(function(d, i) {
          return d.term;
        });

      column.selectAll('circle')
        .data(function(term) {
          return _.filter(neighborTopics, function(topic) {
            return topic.terms.map(function(t) {
              return t.term;
            }).indexOf(term.term) > -1;
          });
        })
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', 'white')
        .attr('transform', function(d) {
          return 'translate(15, ' + (10+y(d.id)) + ')'
        });
    }

    // Deprecated; replaced by visualizeTopicNeighborMatrix
    function visualizeTopicCentricGraph(container, topic) {

      container.selectAll('.node').remove();
      container.selectAll('.link').remove();
      container.selectAll('text').remove();

      var results = TermTopic.getNeighborTopics(topic, 2);
      results.topics.forEach(function(topic) {
        topic.isFixed = false;
      })
      topic.isFixed = true;
      topic.x = 200;
      topic.y = 200;
      var nodes = results.terms.concat(results.topics);

      var links = _.filter(results.connections.map(function(connection) {
        return {
          source: connection.term,
          target: connection.topic
        }
      }), function(link) {
        return nodes.indexOf(link.source) >= 0 && nodes.indexOf(link.target) >= 0;
      });

      // To get the same graph layout every time the page is loaded
      Math.seedrandom('Chronos');

      var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([600, 600])
        .linkStrength(0.1)
        .friction(0.9)
        .linkDistance(300)
        .charge(-60)
        .gravity(0.1)
        .theta(0.8)
        .alpha(0.1);

      force.start();
      for (var i = 5000; i > 0; --i) {
        force.tick();
      }
      force.stop();

      var linkGroup = container.selectAll('line')
        .data(force.links())
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr('class', 'link')
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      var termGroup = container.selectAll('rect')
        .data(results.terms)
        .enter()
        .append('rect')
        .attr('class', 'node term')
        .attr('width', function(d) {
          return d.term.length * 10;
        })
        .attr('height', 25)
        .attr('fill', '#1f77b4')
        .attr('opacity', '0.25')
        .attr('ry', 5)
        .attr("x", function(d) { return d.x - d.term.length * 5; })
          .attr("y", function(d) { return d.y - 18; });

      var topicGroup = container.selectAll('circle')
        .data(results.topics)
        .enter()
        .append('circle')
        .attr('class', 'node topic')
        .attr('fill', '#ff7f0e')
        .attr('stroke', function(d) {
          return d.isFixed ? 'steelblue' : 'none';
        })
        .attr('r', function(d, i) {
          return d.isFixed ? 20 : 10;
        })
        .attr('cx', function(d, i) {
          return d.x;
        })
        .attr('cy', function(d, i) {
          return d.y;
        })
        .attr('opacity', 0.5)
        .on('mouseover', function(topic, i) {
          var ownTerms = _.filter(links, function(l) {
            return l.target === topic;
          })
          .map(function(l) {
            return l.source;
          });
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', function(term, i) {
              return ownTerms.indexOf(term) < 0 ? 0.25 : 0.75;
            });
        })
        .on('mouseout', function(d, i) {
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', 0.25);
        });

      var termTextGroup = container.selectAll('text')
        .data(results.terms)
        .enter()
        .append('text')
        .text(function(d) {
          return d.term;
        })
        .attr('text-anchor', 'middle')
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .on('mouseover', function(term) {
          var ownTopics = _.filter(links, function(l) {
            return l.source === term;
          })
          .map(function(l) {
            return l.target;
          });
          d3.select('#graph')
            .selectAll('.topic')
            .attr('opacity', function(topic, i) {
              return ownTopics.indexOf(topic) < 0 ? 0.5 : 1;
            });

        })
        .on('mouseout', function(d, i) {
          d3.select('#graph')
            .selectAll('.topic')
            .attr('opacity', 0.5);
        });

    }

    function visualizeTopicTermGraph() {
      var terms = TermTopic.getTopTerms('weight', 500, 0);
      var topicAndConnections = TermTopic.getTopTopics(terms, 100);
      var topics = topicAndConnections.topics;
      var links = topicAndConnections.termTopicConnections.map(function(connection) {
        return {
          source: connection.term,
          target: connection.topic
        }
      });
      var nodes = terms.concat(topics);

      var canvas = d3.select('#graph')
        .style('width', 1200)
        .style('height', 1200);

      // To get the same graph layout every time the page is loaded
      Math.seedrandom('Chronos');

      var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([1200, 1200])
        .linkStrength(0.1)
        .friction(0.9)
        .linkDistance(300)
        .charge(-60)
        .gravity(0.1)
        .theta(0.8)
        .alpha(0.1);

      force.start();
      for (var i = 5000; i > 0; --i) {
        force.tick();
      }
      force.stop();

      var linkGroup = canvas.selectAll('line')
        .data(force.links())
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      var termGroup = canvas.selectAll('rect')
        .data(terms)
        .enter()
        .append('rect')
        .attr('class', 'node term')
        .attr('width', function(d) {
          return d.term.length * 10;
        })
        .attr('height', 25)
        .attr('fill', '#1f77b4')
        .attr('opacity', '0.25')
        .attr('ry', 5)
        .attr("x", function(d) { return d.x - d.term.length * 5; })
          .attr("y", function(d) { return d.y - 18; });

      var topicGroup = canvas.selectAll('circle')
        .data(topics)
        .enter()
        .append('circle')
        .attr('class', 'node topic')
        .attr('fill', '#ff7f0e')
        .attr('r', 10)
        .attr('cx', function(d, i) {
          return d.x;
        })
        .attr('cy', function(d, i) {
          return d.y;
        })
        .on('mouseover', function(topic, i) {
          var ownTerms = _.filter(links, function(l) {
            return l.target === topic;
          })
          .map(function(l) {
            return l.source;
          });
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', function(term, i) {
              return ownTerms.indexOf(term) < 0 ? 0.25 : 0.75;
            });
        })
        .on('mouseout', function(d, i) {
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', '0.25');
        });

      var termTextGroup = canvas.selectAll('text')
        .data(terms)
        .enter()
        .append('text')
        .text(function(d) {
          return d.term;
        })
        .attr('text-anchor', 'middle')
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    }

    $scope.selectTermToFilterDocuments = function(term, index) {
      var numSelectedDocTerms = 0;
      for (var i = 0; i < 10; ++i) {
        if ($scope.selectedDocumentTerms[i]) {
          numSelectedDocTerms += 1;
        }
      }
      Logger.logAction(userId, 'select term to filter documents', 'v2','1', 'explore', {
        topic: $scope.selectedTopic.id,
        numSelectedTerms: numSelectedDocTerms,
        numDocuments: $scope.evidence.length
      }, function(response) {
        console.log('action logged: select term to filter documents');
      });
      // Update the colors of the terms
      var colorScale = d3.scale.category20()
        .domain(_.range(10));
      $scope.selectedDocumentTerms[index] = !$scope.selectedDocumentTerms[index];
      d3.selectAll('.selected-topic-term')
        .style('background-color', function(d, i){
          return $scope.selectedDocumentTerms[i] ? colorScale(i) : 'white';
        });
      // Sort the documents with the selected terms
      // #marker
      // This could be optimized by cacheing the scores for each evidence and term pair
      var evidenceTermMap = {};
      $scope.evidence.forEach(function(evidence) {
        evidenceTermMap[evidence.id] = {};
        for (var i = 0; i < 10; ++i) {
          evidenceTermMap[evidence.id][i] = 0;
          var term = $scope.selectedTopic.terms[i].term;
          var words = evidence.abstract.split(' ');
          for (var j in words) {
            var w = words[j];
            evidenceTermMap[evidence.id][i] += matchesTerm(w, term) ? 1 : 0;  
          }
        }
      });

      console.log('visualize doc decorators');
      // Append labels to each document to indicate which terms it contains
      d3.selectAll('.doc-decorator')
        .selectAll('g')
        .remove();
      d3.selectAll('.doc-decorator')
        .data($scope.evidence)
        .append('g')
        .selectAll('rect')
        .data(function(d, i) {
          console.log(_.pairs(evidenceTermMap[d.id]).length);
          return _.pairs(evidenceTermMap[d.id]).map(function(pair) {
            return {
              termCount: pair[1],
              evidenceId: d.id
            }
          });
        })
        .enter()
        .append('rect')
        .attr('width', function(d, i) {
          console.log(i)
          console.log($scope.selectedDocumentTerms[i])
          return (d.termCount > 0 && $scope.selectedDocumentTerms[i]) ? 10 : 0;
        })
        .attr('height', 20)
        .attr('fill', function(d, i) {
          return colorScale(i);
        })
        .attr('x', function(d, i) {
          var shift = 0;
          var scores = evidenceTermMap[d.evidenceId];
          for (var j = 0; j < i; ++j) {
            shift += (scores[j] > 0 && $scope.selectedDocumentTerms[j]) ? 10 : 0;
          }
          return shift;
          return 'translate(' + shift + ', 0)';
        })
        .on('click', function(d, i) {
          console.log(d, i);
        });

      $scope.evidence = _.sortBy($scope.evidence, function(evidence) {
        var totalScore = 0;
        for (var i = 0; i < 10; ++i) {
          if ($scope.selectedDocumentTerms[i]) {
            totalScore += evidenceTermMap[evidence.id][i];
          }
        }
        return -totalScore;
      });
    };

    $scope.deleteEntry = function(type) {

      /*
      var selectedEvidence = _.keys(_.pick($scope.evidenceSelectionMap, function(value, key) {
        return value;
      })); */
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            return $scope.selectedEvidence.title;
            /*
            if (selectedEvidence.length > 0) {
              return selectedEvidence.length + ' publications';
            }
            else {
              switch (type) {
                case 'text': return $scope.selectedEntry[type].title;
                case 'evidence': return $scope.selectedEntry[type].title;
              }
            } */
          },
          id: function() {
            /*
            if (selectedEvidence.length > 0) {
              return selectedEvidence;
            } */
              return [$scope.selectedEvidence.id];
          },
          type: function() {
            return type;
          },
          userId: function() {
            return userId;
          }
        }
      }); 
    }

    // Deprecated
    function visualizeNodeLinkGraph(texts, concepts, evidence, conceptAssociations) {

      var canvas = d3.select('#graph')
        .style('width', 400)
        .style('height', 400);

      // To get the same graph layout every time the page is loaded
      Math.seedrandom('Chronos');



      var links = conceptAssociations;

      var force = d3.layout.force()
        .nodes(concepts)
        .links(links)
        .size([400, 400])
        .linkStrength(0.1)
        .friction(0.9)
        .linkDistance(50)
        .charge(-30)
        .gravity(0.1)
        .theta(0.8)
        .alpha(0.1)
        .start();

      var linkGroup = canvas.selectAll('line')
        .data(force.links())
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 3);

      var nodeGroup = canvas.selectAll('rect')
        .data(force.nodes())
        .enter()
        .append('rect')
        .attr('class', 'node')
        .attr('width', function(d) {
          return d.term.length * 10;
        })
        .attr('height', 25)
        .attr('fill', '#b5cfe3')
        .attr('ry', 5)
        .on('click', function(d, i) {
          if ($scope.selectedConcepts.indexOf(d) < 0) {
            $scope.selectedConcepts.push(d);
            d3.select(this).classed('selected', true);
          }
          else {
            $scope.selectedConcepts = _.without([$scope.selectedConcepts], d);
            d3.select(this).classed('selected', false);
          }
        });

      var textGroup = canvas.selectAll('text')
        .data(force.nodes())
        .enter()
        .append('text')
        .text(function(d) {
          return d.term;
        })
        .attr('text-anchor', 'middle')

      force.start();
      for (var i = 0; i < 1000; ++i) force.tick();
      force.stop();  

      linkGroup.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      nodeGroup.attr("x", function(d) { return d.x - d.term.length * 5; })
          .attr("y", function(d) { return d.y - 18; });

      textGroup.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });
    }

  }]);

angular.module('focus.v2.controllers')
  .controller('FocusController', ['$scope', '$stateParams', '$modal', 'Core','AssociationMap', 'Argument', 'Logger', 
  function($scope, $stateParams, $modal, Core, AssociationMap, Argument, Logger) {      
    $scope.selectedText = {
      title: ''
    };
    $scope.selectedParagraph = -1;
    $scope.selectedEvidence = null;
    $scope.selectedWords= [];
    $scope.selectedTopic= null;
    $scope.activeParagraphs = [];
    $scope.hasUnsavedChanges = false;
    $scope.recommendedEvidence = [];
    $scope.citedEvidence = [];
    $scope.paragraphInformation =[];
    $scope.paragraphCitation = [];

    $scope.loadingRecommendedEvidence = false;
    $scope.citationTabs = {
      'recommended':{active: true},
      'cited': {active: false},
      'bookmarked': {active: false}
    };

    $scope.collections = [
      { id: 10, name: 'visualization'},
      { id: 11, name: 'pfc and executive functions'},
      { id: 12, name: 'virtual reality'},
      { id: 13, name: 'TVCG'},
    ];

    var userId = parseInt($stateParams.userId);
    var collectionId = parseInt($stateParams.collectionId);

    $scope.userId = userId;
    $scope.collectionId = collectionId;
    $scope.collectionName = _.find($scope.collections, function(c) {
      return c.id === collectionId;
    }).name;    

    $scope.evidence = null;
    var textEvidenceAssociations = null;
    var evidenceIdMap = {};
    var isDebug = false;

    AssociationMap.initialize(userId, function() {
      textEvidenceAssociations = AssociationMap.getAssociationsOfType('evidence', 'text');
      updateCitedEvidence();
    });

    Core.getAllTextsForUser(userId, function(response) {
      $scope.texts = response.data;
      if ($scope.texts.length > 0) {
        $scope.selectText($scope.texts[0], false);
      }
    }, function(response) {
      console.log('server error when retrieving textsfor user ' + userId);
      console.log(response);
    });

    Core.getAllEvidenceForUser(userId, function(response) {
      // This includes both usercreated and bookmarked evidence; they are not necessarily cited.        
      $scope.evidence = _.filter(response.data, function(e) {
        return e.abstract.length > 0;
      });

      $scope.evidence.forEach(function(e){
        e.metadata = JSON.parse(e.metadata);
        evidenceIdMap[e.id]= e;
      })
      updateCitedEvidence();
    }, function(response) {
      console.log('server error when retrieving evidence for user' + userId);
      console.log(response);
    });

    var newParagraphIndex = -1;

    $scope.$watch(function() {
      return d3.selectAll('.text-paragraph')[0].length;
    }, function(newValue, oldValue) {
      var el =document.getElementById('ap-' +newParagraphIndex);
      if (el !== null){
        el.innerText = '';
        el.focus();
      }
    })

    // Check if the current text have changed every 10 secondsand save the contents.
    // if there are changes,  
    setInterval(function(){
      if ($scope.hasUnsavedChanges) {
        saveText();
      }
    }, 5000);

    $scope.selectText = function(text, userInitiated) {
      if (userInitiated) {
        Logger.logAction(userId, 'select proposal', 'v2','1', 'focus', {
          proposal: text.id,
          contentLength: text.content.split(' ').length
        }, function(response) {
          console.log('action logged: select proposal');
        });
      }

      $scope.selectedText = text;
      $scope.paragraphInformation= [];
      $scope.paragraphCitation = [];
      $scope.activeParagraphs = _.filter(text.content.split('/n'), function(text){
        return text !== '';
      }).map(function(p, i) {
        $scope.paragraphInformation.push({});
        $scope.paragraphCitation.push([]);
        updateRecommendedCitations(p, i);
        return {text: p};
      });
      updateCitedEvidence();
    };

    $scope.selectEvidence = function(evidence, sourceList) {
      Logger.logAction(userId, 'select evidence', 'v2', '1', 'focus', {
        evidence: evidence.id,
        sourceList: sourceList
      }, function(response) {
        console.log('action logged: select evidence');
      });

      $scope.selectedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');      
    };

    $scope.selectParagraph = function(index, clickTarget) {
      if (index!== $scope.selectedParagraph) {          
        Logger.logAction(userId, 'select paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,
          paragraph: index,
          clickTarget: clickTarget
        }, function(response) {            
          console.log('actionlogged: select paragraph');
        });

        $scope.selectedParagraph =index;
        updateRecommendedCitations($scope.activeParagraphs[index].text, index);
      }      
    };

    $scope.citeEvidence = function(evidence, sourceList) {

      Logger.logAction(userId, 'cite evidence', 'v2', '1', 'focus', {          
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {          
        console.log('action logged: cite evidence');
      });        
      //Add association
      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;      
      AssociationMap.addAssociation(userId,'evidence', 'text', evidence.id,textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = $scope.citedEvidence.map(function(e) {
          return e.id;
        }).indexOf(evidence.id);          

        if (index === -1) {
          $scope.citedEvidence.push(evidence);
          index =$scope.citedEvidence.length - 1;          
        }

        $scope.paragraphCitation[$scope.selectedParagraph].push({            
          index: index,
          evidence: evidence
        });
      });      
    };

    $scope.showCitation = function(citation) {        
      Logger.logAction(userId, 'show citation', 'v2', '1', 'focus', {
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,          
        citation: citation.evidence.id
      }, function(response) {
        console.log('action logged: show citation');       
      });        

      $scope.selectEvidence(citation.evidence);        
      $scope.citationTabs['cited'].active= true;      
    }      

    $scope.addTextEntry = function() {
      Logger.logAction(userId, 'initiate proposal creation', 'v2','1', 'focus', {
        totalProposals: $scope.texts.length
      }, function(response) {
        console.log('action logged:initiate proposal creation');
      });

      var modalInstance = $modal.open({
        templateUrl: 'modal/textsModal.html',          
        controller: 'TextsModalController',          
        resolve: {
          textsInfo: function() {
            return {
              id: -1,
              title: "",
              content: ""
            }            
          },            
          concepts: function() {
            return null;
          },
          evidence: function() {              
            return $scope.evidence;
          },
          userId: function() {
            return userId;
          }          
        }
      });

      modalInstance.result.then(function (newEntry){          
        Logger.logAction(userId, 'proposal created', 'v2','1', 'focus', {            
          proposal: newEntry.id,
          contentLength: newEntry.content.split(' ').length,            
          totalProposals: $scope.texts.length          
        },function(response) {
          console.log('action logged: proposal created');          
        });

        $scope.texts.push(newEntry);        
      });      
    }

    function updateCitedEvidence() {        
      if (textEvidenceAssociations === null || _.size(evidenceIdMap) === 0) return;

      $scope.citedEvidence = _.uniq(_.filter(textEvidenceAssociations, function(a) {         
        return a.targetId.toString().split('-')[0] == $scope.selectedText.id;        
      }).map(function(a) {  
        return evidenceIdMap[a.sourceId];
      }));

      // Identify citations for each paragraph
      textEvidenceAssociations.forEach(function(a) {          
        var textId = a.targetId.toString().split('-');
        if (textId[0] != $scope.selectedText.id) return;
        var paragraphIndex = parseInt(textId[1]);
        if (paragraphIndex >= $scope.paragraphCitation.length) return;
        var e = evidenceIdMap[a.sourceId];
        var evidenceIndex = $scope.citedEvidence.indexOf(e);
        $scope.paragraphCitation[paragraphIndex].push({            
          index: evidenceIndex,
          evidence: e
        });
      });      
    }

    function insertTextAtCursor(text) { 
      var sel, range, html; 
      sel = window.getSelection();          
      range = sel.getRangeAt(0); 
      range.deleteContents(); 
      var textNode = document.createTextNode(text);       
      range.insertNode(textNode);
      range.setStartAfter(textNode);          
      sel.removeAllRanges();      
      sel.addRange(range);        
    }      

    $scope.cites = function(t, i, e) {
      if (e ===null || t === null) {          
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', e.id, t.id + '-' + i);
    };      

    $scope.checkEnter= function(i, e){        
      if (e.keyCode === 13) {         
        Logger.logAction(userId, 'create new paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,           
          totalParagraphs: $scope.activeParagraphs.length
        }, function(response) {
          console.log('actionlogged: create new paragraph');
        });

        e.preventDefault();
        $scope.activeParagraphs.splice(i+1, 0, {text: ''});
        $scope.paragraphInformation.splice(i+1, 0,{});         
        $scope.paragraphCitation.splice(i+1, 0, []);
        newParagraphIndex = i+1;
        updateRecommendedCitations($scope.activeParagraphs[i].text, i);
        $scope.selectedParagraph = i+1;          
        return;       
      }
      else {
        Logger.logAction(userId, 'edit paragraph', 'v2', '1', 'focus', {
          proposal:$scope.selectedText.id,
          paragraph: $scope.selectedParagraph
        }, function(response) {
          console.log('action logged: edit paragraph');          
        },function(response) {
          console.log('error occurred during logging: edit paragraph')
        }, true);        
      }
    };      

    $scope.hasMadeChanges = function(i,e) {        
      $scope.hasUnsavedChanges = true;
      $scope.activeParagraphs[i].text = document.getElementById('ap-' + i).innerText;      
    };      

    $scope.deleteText = function() {
      Logger.logAction(userId, 'initiate proposal deletion', 'v2', '1', 'focus', {
        length:$scope.selectedText.content.split(' ').length,
        totalProposals: $scope.texts.length
      }, function(response) {
        console.log('action logged: initiate proposal deletion');        
      });
        
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            return $scope.selectedText.title;
          },
          ids: function() {
            return[$scope.selectedText.id];
          },
          type: function() {
            return 'text';
          },
          userId: function() {
            return userId;            
          }          
        }
      });
  
      var target = $scope.texts;       
      modalInstance.result.then(function (deletedEntryId) {          
        Logger.logAction(userId, 'proposal deleted', 'v2','1', 'focus', {
          length: $scope.selectedText.content.split(' ').length,          
          totalProposals: $scope.texts.length   
        },function(response) {
          console.log('action logged: proposal delete');
        });
        for (var i = 0; i < deletedEntryId.length; ++i) {
          var entryId = deletedEntryId[i];
          _.remove(target, function(elem) {
            return elem.id == entryId;
          })
        };
      });      
    };     

    $scope.isTopicTerm = function(w) {
      if (w === 'of') {          
        return false;
      }
      if ($scope.selectedTopic === null) return false;
      var topicTerms = _.take($scope.selectedTopic.terms, 10);    
      for (var i = 0; i < topicTerms.length;++i) {
        var term = topicTerms[i].term;
        var term_parts = term.split(' ');
        var word_parts = w.split('-');      
        if (term_parts.indexOf(w) > -1) {           
          return true;
        }
        for (var j = 0;j < word_parts.length; ++j) {
          var wp= word_parts[j];        
          if(term_parts.indexOf(wp) > -1) {             
            return true;
          }
        }       
      }  
      return false;   
    };

    // Check every 15 secondsif there is unsaved changes; ifthere is, .
    // call this function to save the content.
    function saveText() {      
      if (isDebug) {
        console.log('saving text...');        
      }        
      var newContent = $scope.activeParagraphs.map(function(p) {         
        return p.text;
      }).join('/n');     

      Core.postTextByUserId(userId, $scope.selectedText.title, newContent, false, $scope.selectedText.id, function(response){           
        $scope.texts.forEach(function(t) {             
          if (t.id === response.data[0].id){
            t.content = newContent;
          }
        })
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
      });

      $scope.hasUnsavedChanges =false;      
    }      
      
    function updateRecommendedCitations(text,index) {
      if (text.split(' ').length < 5) {        
        console.log('not enough information to update evidence recommendation');
        return;
      }      
      if ($scope.loadingRecommendedEvidence) {         
          console.log('updating already in progress');
          return;
      }

      console.log('updating evidence recommendations..');        
      $scope.loadingRecommendedEvidence = true;        

      Argument.getEvidenceRecommendation(text, collectionId, function(response) {
        $scope.recommendedEvidence= response.data.evidence;
        $scope.recommendedEvidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
        })
        $scope.paragraphInformation[index].topic = response.data.topics[0];        
        $scope.paragraphInformation[index].topicString = response.data.topics[0].terms.map(function(term) {
          return term[0];
        }).join(' ');       
        $scope.loadingRecommendedEvidence =false;
      }, function(errorResponse) {
          console.log('error occurred while recommending citations');       
          console.log(errorResponse);
      });
  }
      
}]);
angular.module('landing.v2.controllers')
  .controller('LandingController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic', 'Logger',
    function($scope, $modal, Core, AssociationMap, Pubmed, TermTopic, Logger) {
      $scope.userId = '';
      $scope.selected = {};
      $scope.collections = [
        { id: 10, name: 'visualization'},
        { id: 11, name: 'pfc and executive functions'},
        { id: 12, name: 'virtual reality'},
        { id: 13, name: 'TVCG'},
      ];
  }]);

angular.module('v2.controllers')
  .controller('BaselineController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Argument', 'Pubmed', 'Bibtex',
    function($scope, $modal, Core, AssociationMap, Argument, Pubmed, Bibtex) {
  }]);

angular
  .module('termTopic.services')
  .factory('TermTopic', TermTopic);

function TermTopic(Core) {
  var terms = null;
  var topics = null;
  var termTopicMap = null;
  var termIndexMap = null;
  var topicIdMap = null;
  var termOrders = {
    weight: null
  }
  var termFilters = {
    weight: null
  }
  var TermTopic = {
    initialize: initialize,
    getTopTerms: getTopTerms,
    getTopTopics: getTopTopics,
    getAllTerms: getAllTerms,
    getNeighborTopics: getNeighborTopics,
    numOfTerms: numOfTerms,
    numOfTopics: numOfTopics,
    getTermPropertyMax: getTermPropertyMax
  };
  var minTermTopicProb = 1;

  return TermTopic;

  ////////////////////
  function initialize(sourceTopics) {
    topics = sourceTopics;
    terms = getUniqueTerms(topics);
    termTopicMap = getTermTopicCount(terms, topics);
    termIndexMap = _.object(terms.map(function(term, i) {
      return [term, i];
    }));
    topicIdMap = _.object(topics.map(function(topic, i) {
      return [topic.id, topic];
    }));

    termOrders.weight = d3.range(terms.length).sort(function(i, j) { 
        return termTopicMap[terms[j]].weight - termTopicMap[terms[i]].weight;
      });

    termFilters.weight = function(topNum, start) {
      var sortedTermIndice = _.take(_.drop(termOrders.weight, start), topNum);
      return sortedTermIndice.map(function(i) {
        return {
          term: terms[i],
          origIndex: i,
          properties: termTopicMap[terms[i]]
        };
      });
    }
  }

  function getTermPropertyMax(criteria) {
    return _.max(terms.map(function(term) { return termTopicMap[term].weight; }))    
  }

  function numOfTerms() {
    return terms.length;
  }

  function numOfTopics() {
    return topics.length;
  }


  function getAllTerms() {
    return termFilters.weight(terms.length, 0);
  }
  /*
   * criteria: indicates how to sort the terms and topics
   * top: specifies top X entries to be returned
   * start [optional]: if start is specified, throw out entries that 
   * come before the start index;
   * selectedTerms [optional]: 
   */
  function getTopTerms(criteria, top, start, selectedTerms) {
    if (selectedTerms !== undefined && selectedTerms.length > 0) {
      // Get all topics containing the selected terms
      var keyTopics = _.flatten(selectedTerms.map(function(term) {
        console.log(termTopicMap[term])
        return termTopicMap[term].topics.map(function(topic) {
          return topicIdMap[topic.id];
        })
      }));

      var rankedTerms = termFilters.weight(terms.length, 0);

      // Assign weights to every term, based on its related topics
      var termSelectionScoreMap = {};
      rankedTerms.forEach(function(term) {
        termSelectionScoreMap[term.term] = 1;
      });
      keyTopics.forEach(function(topic) {
        topic.terms.forEach(function(t) {
          termSelectionScoreMap[t.term] += 100;
        })
      });
      selectedTerms.forEach(function(term) {
        termSelectionScoreMap[term] += 10000;
      })

      var selectionWeightedTerms = _.sortBy(rankedTerms, function(term) {
        return -termSelectionScoreMap[term.term] * term.properties.weight;
      });

      return _.take(_.drop(selectionWeightedTerms, start), top);
    }
    else {
      return termFilters.weight(top, start);
    }
  }

  /*
   * Given the selected terms, find all terms that share the same topics with 
   * those terms; rank them based on the number of shared topics, then 
   */
  function getTermsGivenSelectedTerms(selectedTerms, num) {

  };

  function getTopTopics(terms, top, selectedTerms) {
    // Compute the total weight for each topic, i.e. the weight of all the topic's terms that are 
    // among the top terms
    var topicMap = {};

    var termTopicConnections = [];

    terms.forEach(function(term) {
      term.properties.topics.forEach(function(topic) {
        if (topicMap[topic.id] === undefined) { 
          topicMap[topic.id] = 0;
        }
        var weight = 1;
        if (selectedTerms !== undefined && selectedTerms.length > 0) {
          if (selectedTerms.indexOf(term.term) >= 0) {
            weight = Math.ceil(1 / minTermTopicProb);
          }
        }
        topicMap[topic.id] += topic.prob * weight;

        termTopicConnections.push({
          term: term,
          topic: topicIdMap[topic.id]
        });
      });
    });

    var sortedTopics = _.keys(topicMap).map(function(topicId) {
      var topic = topicIdMap[topicId];
      topic.variable = {};
      topic.variable.weight = topicMap[topicId];
      return topic;
    }).sort(function(topic1, topic2) {
      return topic2.variable.weight - topic1.variable.weight;
    });

    var topTopics = _.take(sortedTopics, top);
    var topTopicIds = topTopics.map(function(t) {
      return t.id;
    })

    return {
      topics: topTopics,
      termTopicConnections: _.filter(termTopicConnections, function(c) {
        return topTopicIds.indexOf(c.topic.id) >= 0;
      })
    }
  }

  function getNeighborTopics(topic, minSharedTerm) {
    var connections = [];
    var terms = [];
    var neighborTopicIds = _.flatten(_.take(topic.terms, 10).map(function(entry) {
      return termTopicMap[entry.term].topics.map(function(topic) {        
        return topic.id;
      });
    }));

    neighborTopicIds = _.without(neighborTopicIds, topic.id);

    var topicCounts = _.countBy(neighborTopicIds, function(topicId) {
      return topicId;
    });

    var neighborTopics = _.filter(_.pairs(topicCounts), function(topicIdCountPair) {
      return minSharedTerm === undefined ? true : topicIdCountPair[1] >= minSharedTerm;
    }).map(function(topicIdCountPair) {
      var topic = topicIdMap[topicIdCountPair[0]];
      topic.numSharedTerms = topicIdCountPair[1];
      return topic;
    });

    return neighborTopics;
  }

  function getUniqueTerms(topics) {
    return _.uniq(_.flatten(topics.map(function(t) {
      var termTuples = t.terms;
      return termTuples.map(function(tuple) {
        return tuple.term;
      })
    })));
  }

  function getTermTopicCount(terms, topics) {
    var termTopicMap = _.object(terms.map(function(t) {
      return [t, {topics: [], topicCount: 0, weight: 0}];
    }));
    for (var i in topics) {
      var topic = topics[i];
      var termTuples = topic.terms;
      for (var j in termTuples) {
        var term = termTuples[j].term;
        var prob = termTuples[j].prob;
        if (prob < minTermTopicProb) {
          minTermTopicProb = prob;
        }
        var entry = termTopicMap[term];
        entry.topics.push({
          id: topic.id,
          prob: prob
        });
        entry.topicCount += 1;
        entry.weight += prob;
      }
    }
    return termTopicMap;
  }

}
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/english.html',
        "<p class=\"padding-lg\">\n    <em>\"In the end, it's not going to matter how many breaths you took, but how many moments took your breath away.\"</em>\n</p>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/explore.html',
        "<svg id=\"graph\">\n</svg>\n<div id=\"control\">\n  <button class=\"btn\" ng-click=\"getNeighborConcepts()\">Expand</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/explore.ver1.html',
        "<svg id=\"graph\">\n</svg>\n<div id=\"control\">\n  <button class=\"btn\" ng-click=\"getNeighborConcepts()\">Expand</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/focus.html',
        "  <div class=\"column\" id=\"texts-col\">\n    <div class=\"header\">\n      <span>Texts</span>\n    </div>\n    <div class=\"body row\">\n      <div class=\"index col-md-4\">\n        <table class=\"table\">\n          <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n            <td ng-click=\"selectEntry(t, 'text')\">{{t.title}}</td>\n          </tr>\n        </table>\n      </div>\n      <div class=\"content col-md-8\">\n        <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n        </textarea>\n      </div>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addTextEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-click=\"updateTextEntry()\">Edit</button>\n        <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='text'}\" ng-disabled=\"associationInactive('text')\" ng-click=\"showAssociation('text')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"concepts-col\">\n    <div class=\"header\">\n      <span>Concepts</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"c in concepts | filter:filterColumn('concept')\" ng-class=\"{active: hover || c.id == selectedEntry['concept'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n          <td ng-click=\"selectEntry(c, 'concept')\">{{c.term}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addConceptEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-class='{\"btn-success\": associationSource===\"concept\"}' ng-disabled=\"associationInactive('concept')\" ng-click=\"showAssociation('concept')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['concept']===null\" ng-click=\"deleteEntry('concept')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"evidence-col\">\n    <div class=\"header\">\n      <span>Evidence</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"e in evidence | filter:filterColumn('evidence')\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n           <td ng-click=\"selectEntry(e, 'evidence')\">{{e.title}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n        <button class=\"btn btn-default\">Edit</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='evidence'}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"showAssociation('evidence')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n      </div>\n    </div>\n  </div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/focus.ver1.html',
        "  <div class=\"column\" id=\"texts-col\">\n    <div class=\"header\">\n      <span>Texts</span>\n    </div>\n    <div class=\"body row\">\n      <div class=\"index col-md-4\">\n        <table class=\"table\">\n          <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n            <td ng-click=\"selectEntry(t, 'text')\">{{t.title}}</td>\n          </tr>\n        </table>\n      </div>\n      <div class=\"content col-md-8\">\n        <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n        </textarea>\n      </div>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addTextEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-click=\"updateTextEntry()\">Edit</button>\n        <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='text'}\" ng-disabled=\"associationInactive('text')\" ng-click=\"showAssociation('text')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"concepts-col\">\n    <div class=\"header\">\n      <span>Concepts</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"c in concepts | filter:filterColumn('concept')\" ng-class=\"{active: hover || c.id == selectedEntry['concept'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n          <td ng-click=\"selectEntry(c, 'concept')\">{{c.term}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addConceptEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-class='{\"btn-success\": associationSource===\"concept\"}' ng-disabled=\"associationInactive('concept')\" ng-click=\"showAssociation('concept')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['concept']===null\" ng-click=\"deleteEntry('concept')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"evidence-col\">\n    <div class=\"header\">\n      <span>Evidence</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"e in evidence | filter:filterColumn('evidence')\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n           <td ng-click=\"selectEntry(e, 'evidence')\">{{e.title}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n        <button class=\"btn btn-default\">Edit</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='evidence'}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"showAssociation('evidence')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n      </div>\n    </div>\n  </div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/investigate.html',
        "<p class=\"padding-lg\">\n</p>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/language-picker copy.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/language-picker.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/swedish.html',
        "<p class=\"padding-lg\">\n    <em>\"Det är egentligen bara dåliga böcker som äro i behov av förord.\"</em>\n</p>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/ver1-view-picker copy.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/ver1-view-picker.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/ver2-view-picker.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/version-picker.html',
        "<div class=\"container-fluid\" id=\"version-picker-container\">\n    <div class=\"row version-picker-row\">\n      <div class=\"col-md-12\"><button class=\"btn btn-lg btn-default btn-block text-left\" ui-sref-active=\"btn-success\" ui-sref=\"v1\">Baseline</button></div>\n    </div>\n    <div class=\"row version-picker-row\">\n      <div class=\"col-md-12\"><button class=\"btn btn-lg btn-default btn-block\" ui-sref-active=\"btn-success\" ui-sref=\"v2\">Baseline + Concept graph</button></div>\n    </div>\n    <div class=\"row version-picker-row\">\n      <div class=\"col-md-12\"><button class=\"btn btn-lg btn-default btn-block text-left\" ui-sref-active=\"btn-success\" ui-sref=\"v3\">Baseline + Concept graph + Hypothesis tracker</button></div>\n    </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/view-picker.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/view-picker.ver1.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/view-picker.ver2.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver2.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver2.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v1/landing.v1.html',
        "<div class=\"center row\" id=\"v1\">\n  <!-- List of saved arguments -->\n  <div class=\"main col-md-10\">\n    <div class=\"panel\" id=\"texts-col\">\n      <div class=\"header\">\n        <span>Arguments</span>\n      </div>\n      <div class=\"body row\">\n        <div class=\"index col-md-3\">\n          <div style=\"height:90%\"> \n            <table class=\"table\">\n              <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id, success: showCitingTexts && cites(t, selectedEntry['evidence'])}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n                <td ng-click=\"selectEntry(t, 'text')\">\n                  <p>{{t.title}}</p>\n                  <svg class=\"topic-info\" id=\"topic-info-{{t.id}}\" width=\"150\" height=\"25\"></svg>\n                  <div ng-if=\"selectedEntry['text']===t\" style=\"margin-left:80%\">\n                    <div class=\"btn-group btn-group-xs\" role=\"group\">\n                      <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n                    </div>  \n                  </div>\n                </td>\n              </tr>\n            </table>\n          </div>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-default\" ng-click=\"addTextEntry()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">Add new argument</button>\n          </div>\n        </div>\n        <!-- Text area for current argument -->\n        <div class=\"content col-md-5\">\n          <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n          </textarea>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"extractTerms()\">Extract terms</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"recommendCitations()\">Recommend citations</button>\n          </div>\n        </div>\n        <!-- Display of extracted keywords -->\n        <div class=\"side col-md-4\">\n          <div style=\"height:90%;padding:20px\">\n            <div class=\"col-md-6 padding-sm\" ng-repeat=\"t in terms | filter:filterTerms()\">\n              <button class=\"btn btn-default btn\" ng-class=\"{'btn-primary': termSelected(t)}\" ng-click=\"selectTerm(t)\">{{t.term}}</td>\n            </div>\n          </div>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-default\" ng-click=\"addTerm()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">  Add highlighted texts as new term</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedTerms.length===0\" ng-click=\"searchEvidenceForTerms()\">Search evidence</button>\n          </div>\n        </div>   \n      </div>\n    </div>\n    <!-- List of evidence -->\n    <div class=\"panel\" id=\"evidence-col\">\n      <div class=\"loading\" ng-if=\"loadingEvidence\">\n        <div class=\"loader-container\">\n          <div class=\"loader\"></div>\n          <div class=\"loading-text\"><p>{{loadingStatement}}</p></div>\n        </div>\n      </div>\n      <div class=\"header\">\n        <span>Evidence</span>\n      </div>\n      <div class=\"body row\">\n        <div class=\"col-md-3\" id=\"topics\">\n          <div ng-repeat=\"t in topics\" class=\"topic-container\" ng-class=\"{selected: $index == selectedTopic}\" ng-click=\"selectTopic($index)\" ng-attr-id=\"topic-container-{{$index+1}}\">\n            <p style=\"margin:0\"><span ng-repeat=\"w in t\">{{w}}  </span></p>\n            <p style=\"margin-left:90%\"><img  src=\"/static/img/text-icon.svg\" style=\"width:15px; height:15px\"></img><span> {{countEvidenceWithTopic($index)}}</span></p>\n          </div>\n        </div>\n        <div class=\"col-md-5\" id=\"documents\">\n          <div>\n            <div class=\"animate-repeat document-entry\" ng-repeat=\"e in evidence | filter:filterEvidence() | orderBy:evidenceOrder\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id, associated: isAssociated(e, selectedEntry['text'])}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n               <div ng-click=\"selectEntry(e, 'evidence')\" style=\"width:90%;display:inline-block;float:left\">\n                 <p><input type=\"checkbox\" ng-model=\"evidenceSelectionMap[e.id]\"><span> {{e.title}}</span></p>\n                 <p>\n                   <span><i>Search term occurrence:</i></span>\n                   <span ng-repeat=\"t in selectedTerms\"><b>{{t.term}}</b>: {{countSearchTermOccurrence(t.term, e.abstract)}}  </span>\n                 </p>\n               </div>\n               <div style=\"width:10%;display:inline-block\">\n                 <div ng-if=\"evidenceSourceMap[e.id] === 1\">\n                   <img  src=\"/static/img/link-icon.svg\" style=\"width:15px; height:15px\"></img>\n                   <span>{{countTextsReferencingEvidence(e)}}</span>\n                 </div>\n                 <div ng-if=\"evidenceSourceMap[e.id] === 0\"><span class=\"label label-default\">Search result</span></div> \n               </div>\n               <div style=\"clear:both\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"col-md-4\" id=\"details\">\n          <div ng-if=\"selectedEntry['evidence']!==null\">\n            <div class=\"row\" style=\"margin:10px\">\n              <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n            </div>\n            <p><b>Authors</b>: {{selectedEntry['evidence'].metadata.AUTHOR}}</p>\n            <p><b>Affiliation</b>: {{selectedEntry['evidence'].metadata.AFFILIATION}}</p>\n            <p><b>Publication date</b>: {{selectedEntry['evidence'].metadata.DATE}}</p>\n            <p><b>Abstract</b>:</p>\n            <span ng-repeat=\"w in selectedWords track by $index\" ng-class=\"{'is-search-term': isSearchTerm(w), 'is-topic-term': isTopicTerm(w)}\">{{w}} </span>\n          </div>\n        </div>\n      </div>\n      <div class=\"footer\">\n        <div class=\"btn-group btn-group-sm\" role=\"group\">\n          <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n          <button class=\"btn btn-default\">Edit</button>\n          <button class=\"btn btn-primary\" ng-disabled=\"selectedEntry['evidence']===null||selectedEntry['text']===null\" ng-click=\"updateEvidenceAssociation()\" title=\"Mark this publication as relevant to the selected article\">{{evidenceTextAssociated ? 'Mark as irrelevant' : 'Mark as relevant'}}</button>\n          <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"sidebar col-md-2\">\n    <div class=\"panel\">\n      <div class=\"header\">\n        <span>Control panel</span>\n      </div>\n      <div class=\"body\">\n        <div style=\"margin:10px 0 10px 0\">\n          <h5>Import references</h5>\n          <div>\n            <div style=\"margin:10px\"><input type=\"file\"id=\"bibtex-input\"></div>\n            <div style=\"margin:10px\"><button class=\"btn btn-primary btn-xs\" ng-click=\"processBibtexFile()\">Upload</button></div>\n          </div>\n        </div>\n        <div style=\"margin:10px 0 10px 0\">\n          <h5>Export</h5>\n          <div class=\"row\" style=\"margin:0 10px 0 10px\">\n            <button class=\"btn btn-default btn-xs col-md-5\">Documents</button>\n            <span class=\"col-md-1\"></span>\n            <button class=\"btn btn-default btn-xs col-md-5\">References</button>\n            <span class=\"col-md-1\"></span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/explore.v2.html',
        "<div id=\"main-header\" class=\"row\">\n  <div class=\"col-md-11\" style=\"margin-top:6px\">\n    <span class=\"main-header-text\">User ID: </span>\n    <span style=\"font-weight:lighter;padding-right:15px;\">{{userId}}</span>\n    <span class=\"main-header-text\">Document collection: </span>\n    <span style=\"font-weight:lighter\">{{collectionName}}</span>\n  </div>\n  <div class=\"col-md-1\">\n    <button class=\"btn btn-default\" ui-sref=\"v2.focus({userId: userId, collectionId: collectionId})\">Write</button>\n  </div>\n</div>\n\n<div class=\"center row v2\" id=\"explore\">\n  <div class=\"loading\" ng-if=\"loadingEvidence\">\n    <div class=\"loader-container\">\n      <div class=\"loader\"></div>\n      <div class=\"loading-text\"><p>{{loadingStatement}}</p></div>\n    </div>\n  </div>\n\n  <div class=\"row\" id=\"options\" style=\"margin:20px 20px 20px 50px\">\n    <div class=\"col-md-3\">\n      <span>Search for term: </span>\n      <ui-select ng-model=\"selected.searchTerm\" on-select=\"selectSearchTerm($item)\">\n          <ui-select-match>\n              <span ng-bind=\"$select.selected.term\"></span>\n          </ui-select-match>\n          <ui-select-choices repeat=\"t in (terms | filter: $select.search) track by t.origIndex\">\n              <span ng-bind=\"t.term\"></span>\n          </ui-select-choices>\n      </ui-select>\n    </div>\n    <div class=\"col-md-3\">\n      <span>Search for paper: </span>\n      <div class=\"row\">\n         <div class=\"input-group\">\n            <input type=\"text\" class=\"form-control\" placeholder=\"Search for...\" ng-model=\"searchTitle\">\n            <span class=\"input-group-btn\">\n              <button class=\"btn btn-default\" type=\"button\" ng-click=\"searchEvidenceByTitle()\">Search</button>\n            </span>\n          </div>      \n      </div>\n      <div class=\"row\">\n        <ui-select ng-model=\"selected.searchTitle\" on-select=\"selectSearchTitle($item)\">\n            <ui-select-match placeholder=\"Use the search above to get a list of relevant titles\">\n                <span ng-bind=\"$select.selected.title\"></span>\n            </ui-select-match>\n            <ui-select-choices repeat=\"t in (candidateEvidence | filter: $select.search) track by t.id\">\n                <span ng-bind=\"t.title\"></span>\n            </ui-select-choices>\n        </ui-select>\n      </div>\n    </div>\n  </div>\n\n  <svg id=\"topic-term-dist\" style=\"width:1850px;height:700x\">\n  </svg>\n  <div id=\"control\">\n    <button class=\"btn btn-default\" ng-click=\"showPrevTerms()\"><img style=\"width:20px; height:20px\"src=\"/static/img/caret-up-icon.png\"></button>\n    <button class=\"btn btn-default\" ng-click=\"showNextTerms()\"><img style=\"width:20px; height:20px\"src=\"/static/img/caret-down-icon.png\"></button>\n    <button class=\"btn\" ng-click=\"updateTermTopicOrdering()\">Reorder term and topics given selected terms</button>\n    <p style=\"margin:10px 0 10px 5px;font-size:16px\">Selected topic {{selectedTopic.id}}: <span ng-repeat=\"t in selectedTopic.terms | limitTo:10\" id=\"topic-term-$index\" class=\"selected-topic-term\" ng-class=\"{active:hover}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectTermToFilterDocuments(t.term, $index)\">   {{t.term}}   </span></p>\n  </div>\n    <div class=\"panel\" id=\"evidence-col\" style=\"width:1500px;margin-left:50px\">\n      <div class=\"loading\" ng-if=\"loadingTopicEvidence\">\n        <div class=\"loader-container\">\n          <div class=\"spinner\">\n            <div class=\"rect1\"></div>\n            <div class=\"rect2\"></div>\n            <div class=\"rect3\"></div>\n            <div class=\"rect4\"></div>\n            <div class=\"rect5\"></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"header\">\n        <span>Evidence</span>\n      </div>\n      <div class=\"body row\">\n        <div class=\"col-md-7\" id=\"documents\">\n          <div>\n            <div class=\"animate-repeat document-entry row\" ng-repeat=\"e in evidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id, bookmarked: e.bookmarked}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n               <div class=\"col-md-9\" ng-click=\"selectEvidence(e)\">\n                 <p><input type=\"checkbox\" ng-model=\"evidenceSelectionMap[e.id]\"><span> {{e.title}}</span></p>\n               </div>\n               <div class=\"col-md-1\">\n                 <div ng-if=\"evidenceSourceMap[e.id] === 1\">\n                   <img  src=\"/static/img/link-icon.svg\" style=\"width:15px; height:15px\"></img>\n                   <span>{{countTextsReferencingEvidence(e)}}</span>\n                 </div>\n                 <div ng-if=\"evidenceSourceMap[e.id] === 0\"><span class=\"label label-default\">Search result</span></div> \n               </div>\n               <div class=\"col-md-2\">\n                 <svg id=\"doc-decorator-$index\" class=\"doc-decorator\" style=\"width:100px;height:30px;\"></svg>\n               </div>\n               <div style=\"clear:both\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"col-md-5\" id=\"details\">\n          <div ng-if=\"selectedEvidence!==null\">\n            <div class=\"row\" style=\"margin:10px\">\n              <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n            </div>\n            <p><b>Authors</b>: {{selectedEvidence.metadata.AUTHOR}}</p>\n            <p><b>Affiliation</b>: {{selectedEvidence.metadata.AFFILIATION}}</p>\n            <p><b>Publication date</b>: {{selectedEvidence.metadata.DATE}}</p>\n            <p><b>Abstract</b>:</p>\n            <span ng-repeat=\"w in selectedWords track by $index\" ng-class=\"{'is-topic-term': isTopicTerm(w)}\">{{w}} </span>\n          </div>\n        </div>\n      </div>\n      <div class=\"footer\">\n        <div class=\"btn-group btn-group-sm\" role=\"group\">\n          <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n          <button class=\"btn btn-default\">Edit</button>\n          <button class=\"btn btn-primary\" ng-disabled=\"selectedEvidence===null\" ng-click=\"bookmarkEvidence(selectedEvidence)\" title=\"Bookmark this publication\">Bookmark</button>\n          <button class=\"btn btn-danger\" ng-disabled=\"selectedEvidence===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/focus.v2.html',
        "<div id=\"main-header\" class=\"row\">\n  <div class=\"col-md-11\" style=\"margin-top:6px\">\n    <span class=\"main-header-text\">User ID: </span>\n    <span style=\"font-weight:lighter;padding-right:15px;\">{{userId}}</span>\n    <span class=\"main-header-text\">Document collection: </span>\n    <span style=\"font-weight:lighter\">{{collectionName}}</span>\n  </div>\n  <div class=\"col-md-1\">\n    <button class=\"btn btn-default\" ui-sref=\"v2.explore({userId: userId, collectionId: collectionId})\">Explore</button>\n  </div>\n</div>\n\n<div class=\"row v2\" id=\"focus\" style=\"height:900px;padding:15px\">\n  <div class=\"col-md-2\" id=\"argument-list\" style=\"border-bottom: solid 1px #ccc;height:1014px\">\n    <h3>Proposals</h3>\n    <table class=\"table\">\n      <tr ng-repeat=\"t in texts\" ng-class=\"{active: hover || t.id == selectedText.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n        <td ng-click=\"selectText(t)\">\n          <p>{{t.title}}</p>\n          <svg class=\"topic-info\" id=\"topic-info-{{t.id}}\" width=\"150\" height=\"25\"></svg>\n          <div ng-if=\"selectedText===t\" style=\"margin-left:80%\">\n            <div class=\"btn-group btn-group-xs\" role=\"group\">\n              <button class=\"btn btn-danger\" ng-disabled=\"selectedText===null\" ng-click=\"deleteText()\">Delete</button>\n            </div>  \n          </div>\n        </td>\n      </tr>\n    </table>\n    <div class=\"btn-group btn-group-xs\" role=\"group\">\n      <button class=\"btn btn-default\" ng-click=\"addTextEntry()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">Add new proposal</button>\n    </div>\n  </div>\n  <div class=\"col-md-7\" style=\"border-left:solid 1px #ccc;border-bottom: solid 1px #ccc;height:1014px\">\n    <h3>{{selectedText.title}}</h3>\n    <div ng-repeat=\"p in activeParagraphs\">\n      <p class=\"text-paragraph\" contenteditable=\"true\" ng-keydown=\"checkEnter($index, $event)\" ng-keyup=\"hasMadeChanges($index, $event)\" ng-click=\"selectParagraph($index, 'text')\" class=\"activeParagraph\" id=\"ap-{{$index}}\" style=\"outline:0\">{{p.text}}</p>\n      <div style=\"width:15%;height:150px;display:inline-block;float:right\">\n        <div>\n          <p style=\"font-size:10px\" ng-click=\"selectParagraph($index, 'topic')\">Topic: {{paragraphInformation[$index].topicString}}</p>\n          <br/>\n          <p style=\"font-size:10px\">Cited: <span ng-repeat=\"c in paragraphCitation[$index] | orderBy:'index'\">[<a ng-click=\"showCitation(c)\">{{c.index+1}}</a>] </span></p>\n        </div>\n      </div>\n      <div style=\"clear:both\"></div>        \n    </div>\n  </div>\n  <div class=\"col-md-3\" style=\"border-left: solid 1px #ccc;border-bottom: solid 1px #ccc;height:1014px\">\n    <h3>Citations</h3>\n    <uib-tabset>\n      <uib-tab heading=\"Recommended\" active=\"citationTabs['recommended'].active\">\n        <div class=\"loading\" ng-if=\"loadingRecommendedEvidence\">\n          <div class=\"loader-container\">\n            <div class=\"spinner\">\n              <div class=\"rect1\"></div>\n              <div class=\"rect2\"></div>\n              <div class=\"rect3\"></div>\n              <div class=\"rect4\"></div>\n              <div class=\"rect5\"></div>\n            </div>\n          </div>\n        </div>\n        <div id=\"recommendedEvidence\" class=\"citation-container\">\n          <div class=\"animate-repeat document-entry row\" ng-repeat=\"e in recommendedEvidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectEvidence(e, 'recommended')\">\n            <div class=\"col-md-10\">\n              <p class=\"citation-entry\"><span>{{$index+1}}. </span><span>{{e.title}}</span></p>\n            </div>          \n            <div class=\"col-md-2\" style=\"margin:10px 0 0 0\">\n              <div class=\"btn-group btn-group-xs\" role=\"group\" ng-if=\"selectedEvidence===e\">\n                <button class=\"btn btn-primary\" ng-click=\"citeEvidence(e, 'recommended')\">Cite</button>\n              </div>  \n            </div>\n          </div>\n        </div>        \n      </uib-tab>\n      <uib-tab heading=\"Cited\" active=\"citationTabs['cited'].active\">\n        <div id=\"citedEvidence\" class=\"citation-container\">\n          <div class=\"animate-repeat document-entry row\" ng-repeat=\"e in citedEvidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectEvidence(e, 'cited')\">\n            <div class=\"col-md-10\">\n              <p class=\"citation-entry\"><span>{{$index+1}}. </span><span>{{e.title}}</span></p>\n            </div>\n            <div class=\"col-md-2\" style=\"margin:10px 0 0 0\">\n              <div class=\"btn-group btn-group-xs\" role=\"group\" ng-if=\"selectedEvidence===e\">\n                <button class=\"btn btn-primary\" ng-click=\"citeEvidence(e, 'cited')\">Cite</button>\n              </div>  \n            </div>                        \n          </div>\n        </div>        \n      </uib-tab>\n      <uib-tab heading=\"Bookmarked\" active=\"citationTabs['bookmarked'].active\">\n        <div id=\"bookmarkedEvidence\" class=\"citation-container\">\n          <div class=\"animate-repeat document-entry\" ng-repeat=\"e in evidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n            <div ng-click=\"selectEvidence(e, 'bookmarked')\" style=\"width:90%;display:inline-block;float:left\">\n              <p class=\"citation-entry\"><span>{{$index+1}}. </span><span>{{e.title}}</span></p>\n              <div ng-if=\"selectedEvidence===e\" style=\"margin-left:80%\">\n                <div class=\"btn-group btn-group-xs\" role=\"group\">\n                  <button class=\"btn btn-primary\" ng-click=\"citeEvidence(e, 'bookmarked')\">Cite</button>\n                </div>  \n              </div>\n            </div>          \n          </div>\n        </div>            \n      </uib-tab>\n    </uib-tabset>\n    <div id=\"details\" style=\"margin:10px;height:329px\">\n      <h4>Selected citation</h4>\n      <div ng-if=\"selectedEvidence===null\" style=\"300px\">\n        <p style=\"width:70%;margin:auto;padding-top:100px\">\n          <i>Please select a citation to see its details.</i>\n        </p>\n      </div>\n      <div ng-if=\"selectedEvidence!==null\" style=\"overflow-y:scroll;height:300px;\">\n        <div class=\"row\" style=\"margin:10px\">\n          <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n        </div>\n        <p><b>Authors</b>: {{selectedEvidence.metadata.AUTHOR}}</p>\n        <p><b>Affiliation</b>: {{selectedEvidence.metadata.AFFILIATION}}</p>\n        <p><b>Publication date</b>: {{selectedEvidence.metadata.DATE}}</p>\n        <p><b>Abstract</b>:</p>\n        <span ng-repeat=\"w in selectedWords track by $index\" ng-class=\"{'is-topic-term': isTopicTerm(w)}\">{{w}} </span>\n      </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/landing.v2.html',
        "<div ui-view=\"MainView\">\n  <div class=\"v2\" id=\"init-info\">\n    <div class=\"row\" style=\"margin:10px\">\n      <div class=\"col-md-2\"><label>User ID</label></div>\n      <div class=\"col-md-10\"><input type=\"text\" class=\"form-control\" ng-model=\"userId\"></input></div>\n    </div>\n    <div class=\"row\" style=\"margin:10px\">\n      <div class=\"col-md-2\"><label>Collection</label></div>\n      <div class=\"col-md-10\">      \n        <ui-select ng-model=\"selected.collection\" on-select=\"selectCollection($item)\">\n            <ui-select-match placeholder=\"Select a collection\">\n                <span ng-bind=\"$select.selected.name\"></span>\n            </ui-select-match>\n            <ui-select-choices repeat=\"t in (collections | filter: $select.search) track by t.id\">\n                <span ng-bind=\"t.name\"></span>\n            </ui-select-choices>\n        </ui-select>\n      </div>\n    </div>\n    <div style=\"margin:30px auto auto 20px\">\n      <button class=\"btn btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"v2.explore({userId: userId, collectionId: selected.collection.id})\">Explore literature collection</button>\n      <button class=\"btn btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"v2.focus({userId: userId, collectionId: selected.collection.id})\">Write</button>\n    </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/view-picker.v2.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.v2.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.v2.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v3/view-picker.v3.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);