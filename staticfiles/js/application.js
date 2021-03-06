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
      }])
    .config(['$compileProvider',
      function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
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
    'argument.services',
    'paper.services',
    'bookmark.services',
    'collection.services',
    'user.services',
    'exploreState.services',
  ]);

angular
  .module('core.services', []);

angular
  .module('pubmed.services', []);  

angular
  .module('associationMap.services', ['core.services']);

angular
  .module('argument.services', ['core.services']);

angular
  .module('paper.services', ['core.services']);

angular
  .module('bookmark.services', ['core.services']);

angular
  .module('collection.services', ['core.services']);

angular
  .module('user.services', ['core.services']);

angular
  .module('exploreState.services', ['exploreState.services']);

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

  var cachedTexts = [];

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
    var cachedEntry = _.find(cachedTexts, function(d) {
      return d.text === text;
    }); 
    if (cachedEntry !== undefined) {
      successFn({
        evidence: cachedEntry.evidence,
        topic: cachedEntry.topic
      });
      return;
    }
    else {
      $http.post('/api/v1/service/getEvidenceRecommendation/', {
        text: text,
        collectionId: collectionId
      }).then(function(response) {
        var evidence = response.data.evidence;
        evidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
        })
        cachedTexts.push({
          text: text,
          evidence: evidence,
          topic: response.data.topics[0]
        });
        successFn({
          evidence: evidence,
          topic: response.data.topics[0]
        });
      }, errorFn);
      return;
    }
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
    updateAssociation: updateAssociation,
    removeAssociation: removeAssociation,
    removeAssociationById: removeAssociationById,
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

  function updateAssociation(associationId, source, target, successFn) {
    Core.updateAssociation(associationId, source, target, function(response) {
      for (var i = 0; i < associationMap.length; ++i) {
        var association = associationMap[i];
        if (association.id === associationId) {
          association.sourceId = source;
          association.targetId = target;      
          break;
        }
      }
    });
  }

  function removeAssociation(userId, sourceType, targetType, source, target, successFn) {
    Core.deleteAssociationByUserId(userId, sourceType, targetType, source, target, 
      function(response) {
        _.pull(associationMap, _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: source.toString(), targetId: target}));
        console.log('association map after deleting ' + source + ' ' + target);
        console.log(associationMap);
        successFn();
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);        
      })
  }

  function removeAssociationById(id, successFn) {
    Core.deleteAssociationById(id, 
      function(response) {
        _.pull(associationMap, _.findWhere(associationMap, {id: id}));
        console.log('association map after deleting ' + id);
        console.log(associationMap);
        successFn();
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);        
      })
  }

  function hasAssociation(sourceType, targetType, sourceId, targetId) {
     return _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: sourceId.toString(), targetId: targetId}) != undefined;
  }
}
// This service handles information related to individual publication, e.g. its citation information, additional information about author, venue etc.
 angular
    .module('bookmark.services')
    .factory('Bookmark', Bookmark);

  Bookmark.$inject = ['$cookies', '$http', 'Core', 'Logger'];

  function Bookmark($cookies, $http, Core, Logger) {
    var _userId = null;
    var _evidence = null;
    var _evidenceIdMap = {};
    var Bookmark = {
      userId: userId,
      evidence: evidence,
      evidenceIdMap: evidenceIdMap,
      addBookmark: addBookmark,
      removeBookmark: removeBookmark,
      flipBookmark: flipBookmark
    };

    return Bookmark;

    ////////////////////

    function userId(uid) {
      if (arguments.length === 0) {
        return _userId;
      }
      else {
        _userId = uid;
        return this;
      }
    }

    function evidenceIdMap() {
      return _evidenceIdMap;
    }

    function evidence(callback) {
      if (_evidence === null) {
        Core.getAllEvidenceForUser(_userId, function(response) {
            // This includes both user created and bookmarked evidence; they are not necessarily cited.
            // TODO: apply default sorting.
            _evidence = response.data;
            _evidence.forEach(function(e){
              e.metadata = JSON.parse(e.metadata);
              _evidenceIdMap[e.id]= e;
            })
            callback(_evidence, _evidenceIdMap);
          }, function(response) {
            console.log('server error when retrieving evidence for user' + $scope.userId);
            console.log(response);
          });    
      }
      else {
        callback(_evidence, _evidenceIdMap);
      }
    }

    function addBookmark(e, view, source) {
      logBookmarkUpdate(e, 'bookmark evidence', view, source);
      Core.addBookmark(_userId, e.id, function(response) {
        var index = _evidence.indexOf(e);
        if (index < 0) _evidence.push(e);
        _evidenceIdMap[e.id] = evidence
        e.bookmarked = true;
        console.log('bookmark evidence success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });   
    }

    function removeBookmark(e, view, source) {
      logBookmarkUpdate(e, 'remove evidence bookmark', view, source);
      Core.deleteBookmark(_userId, e.id, function(response) {
        _evidence = _.reject(_evidence, function(i) {
          return i.title === e.title;
        });
        e.bookmarked = false;
        console.log('remove bookmark evidence success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });  
    }

    function flipBookmark(e, view, source) {
      if (!e.bookmarked) {
        addBookmark(e, view, source);
      } 
      else {
        removeBookmark(e, view, source);
      }
    }

    function logBookmarkUpdate(e, action, view, source) {
      Logger.logAction(_userId, 'bookmark evidence', 'v2', '1', view, {
        evidence: e.id,
        numDocuments: _evidence.length,
        source: source
      }, function(response) {
        console.log('action logged: ' + action);
      });
    }
  }
/*
 * This service handles information related to the active collection, including its name, as well as 
 * the list of evidence
 */
angular
  .module('collection.services')
  .factory('Collection', Collection);

Collection.$inject = ['$cookies', '$http', 'Core'];

  function Collection($cookies, $http, Core) {
    var topics = null;
    var _id = 13;
    var Collection = {
      id: id,
      allTopics: allTopics,
    };

    return Collection;

    ////////////////////

    function id(id) {
      if (arguments.length === 0) {
        return _id;
      }
      else {
        _id = id;
        return this;
      }    
    }  

    function allTopics(callback) {
      if (topics === null) {
        Core.getEvidenceCollection(_id, function(response) {
          topics = response.data.map(function(topic) {
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
          callback(topics);
        }, function() {
          console.log('server error when retrieving data for collection ' + _id);
          console.log(errorResponse);
        })
      }
      else {
        callback(topics);
      }
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
      updateAssociation: updateAssociation,
      deleteAssociationByUserId: deleteAssociationByUserId,
      deleteAssociationById: deleteAssociationById,
      deleteBookmark: deleteBookmark,
      getAllTextsForUser: getAllTextsForUser,
      getAllEvidenceForUser: getAllEvidenceForUser,
      getAllDataForUser: getAllDataForUser,
      getAssociationMap: getAssociationMap,
      getEvidenceByTopic: getEvidenceByTopic,
      getEvidenceByTitle: getEvidenceByTitle,
      getEvidenceCollection: getEvidenceCollection,
      getEvidenceTextTopicsForUser: getEvidenceTextTopicsForUser,
      getNewUserId: getNewUserId,
      initializeNewCollection: initializeNewCollection,
      getCollectionList: getCollectionList
    };

    return Core;

    ////////////////////

    function getNewUserId(successFn, errorFn) {
      return $http.get('api/v1/service/getNewUserId/')
        .then(successFn, errorFn);
    }

    function initializeNewCollection(name, successFn, errorFn) {
      return $http.post('api/v1/service/initializeNewCollection/', {
          name: name
        })
        .then(successFn, errorFn);
    }

    function getCollectionList(successFn, errorFn) {
      return $http.get('api/v1/service/getCollectionList/')
        .then(successFn, errorFn);
    }

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
      return $http.post('/api/v1/data/evidence/' + userId + '/', {
        created_by: userId,
        title: title,
        abstract: abstract,
        metadata: metadata,
        find_neighbors: true
      }).then(successFn, errorFn);
    }

    function getEvidenceByTopic(collectionId, topicId, userId, successFn, errorFn) {
      $http.post('/api/v1/service/getEvidenceByTopic/', {
        collection_id: collectionId,
        topic_id: topicId,
        user_id: userId
      }).then(successFn, errorFn);
    }

    function getEvidenceByTitle(collectionId, userId, title, includePersonal, resultLimit, successFn, errorFn) {
      var limit = resultLimit > 0 ? resultLimit : 20;
      $http.post('/api/v1/service/searchEvidenceByTitle/', {
        collection_id: collectionId,
        user_id: userId,
        title: title,
        result_limit: limit,
        include_personal: includePersonal
      }).then(successFn, errorFn);
    }

    function postAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn);
    }

    function updateAssociation(id, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/update/', {
        id: id,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn);      
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
      console.log('deleting')
      console.log(userId)
      return $http.post('/api/v1/data/association/delete/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn)      
    }

    function deleteAssociationById(associationId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/deleteById/', {
        id: associationId
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
/*
 * This service handles information related to the active collection, including its name, as well as 
 * the list of evidence
 */
angular
  .module('exploreState.services')
  .factory('ExploreState', ExploreState);

User.$inject = ['$cookies', '$http', 'Core'];

function ExploreState($cookies, $http, Core) {
  var _selectedTerms = [];
  var _selectedTopic = null;
  var _candidateEvidence = null;
  var _candidateEvidenceTopics = null;
  var _selectedSearchTitle = null;
  var ExploreState = {
    selectedTerms: selectedTerms,
    selectedTopic: selectedTopic,
    candidateEvidence: candidateEvidence,
    candidateEvidenceTopics: candidateEvidenceTopics,
    selectedSearchTitle: selectedSearchTitle
  };

  return ExploreState;

  ////////////////////

  function selectedTerms() {
    return _selectedTerms;
  }

  function selectedTopic(topic) {
    if (arguments.length === 0) {
      return _selectedTopic;
    }
    else {
      _selectedTopic = topic;
    }
  }

  function candidateEvidence(evidence) {
    if (arguments.length === 0) {
      return _candidateEvidence;
    }
    else {
      _candidateEvidence = evidence;
    }
  }

  function candidateEvidenceTopics(evidenceTopics) {
    if (arguments.length === 0) {
      return _candidateEvidenceTopics;
    }
    else {
      _candidateEvidenceTopics = evidenceTopics;
    }
  }

  function selectedSearchTitle(title) {
    if (arguments.length === 0) {
      return _selectedSearchTitle;
    }
    else {
      _selectedSearchTitle = title;
    }
  }
}
// This service handles information related to individual publication, e.g. its citation information, additional information about author, venue etc.
 angular
    .module('paper.services')
    .factory('Paper', Paper);

  Paper.$inject = ['$cookies', '$http', 'Core'];

  function Paper($cookies, $http, Core) {
    var evidence = null;
    var citationMap = null;
    var mapInitialized = false;
    var Paper = {
      getCitationsForPaper: getCitationsForPaper,
      getReferencesForPaper: getReferencesForPaper,
      initializeCitationMap: initializeCitationMap,
      getCitationMap: getCitationMap
    };

    return Paper;

    ////////////////////

    function getCitationMap(collectionId, successFn, errorFn) {
      $http.get('api/v1/service/paper/allCitations/' + collectionId + '/')
        .then(successFn, errorFn);
    }

    function initializeCitationMap(collectionId, userId, response) {
      Core.getAllEvidenceForUser(collectionId, function(evidenceResponse) {
        evidence = evidenceResponse.data;
        // Process the metadata and mark the bookmarked ones
        Core.getAllEvidenceForUser(userId, function(userResponse) {
          var userEvidence = userResponse.data;
          var bookmarkedEvidenceIds = userEvidence.map(function(e) { return e.id; })
          evidence.forEach(function(e) {
            if (typeof e.metadata == 'string') {
              e.metadata = JSON.parse(e.metadata);
            }
            e.bookmarked = bookmarkedEvidenceIds.indexOf(e.id) > -1;
          })
        });
        getCitationMap(collectionId, function(citationMapResponse) {
          citationMap = citationMapResponse.data;
        }, function(errorResponse) {
          console.log(errorResponse);
        })
      }, function(errorResponse) {
        console.log(errorResponse);
      })
    }

    function getCitationsForPaper(eid) {
      var citationIds = _.filter(citationMap, function(d) {
        return d.citation_id == eid;
      }).map(function(d) {
        return d.paper_id;
      });
      var citations = citationIds.map(function(citationId) {
        return _.find(evidence, function(d) {
          return d.id === citationId;
        })
      });
//      console.log(citations);
      return citations;
    }

    function getReferencesForPaper(eid) {
      var referenceIds = _.filter(citationMap, function(d) {
        return d.paper_id == eid;
      }).map(function(d) {
        return d.citation_id;
      });
      return referenceIds.map(function(referenceId) {
        return _.find(evidence, function(d) {
          return d.id === referenceId;
        })
      });
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
/*
 * This service handles information related to the active collection, including its name, as well as 
 * the list of evidence
 */
angular
  .module('user.services')
  .factory('User', User);

User.$inject = ['$cookies', '$http', 'Core'];

function User($cookies, $http, Core) {
  var _userId = null;
  var _activeCollection = null;
  var _collections = null;
  var _proposals = null;
  var _activeProposal = null;
  var _activeParagraphs = null;
  var _paragraphCitation = null;
  var _activeProposalTextAges = [];
  var _selectedEvidence = null;
  var _selectedParagraph = -1;
  var _citedEvidence = null;

  var User = {
    updateSessionInfo: updateSessionInfo,
    userId: userId,
    activeCollection: activeCollection,
    proposals: proposals,
    activeProposal: activeProposal,
    activeParagraphs: activeParagraphs,
    paragraphCitation: paragraphCitation,
    selectedEvidence: selectedEvidence,
    selectedParagraph: selectedParagraph,
    citedEvidence: citedEvidence,
  };

  return User;

  ////////////////////

  function citedEvidence(evidence) {
    if (arguments.length === 0) {
      return _citedEvidence;
    }
    else {
      _citedEvidence = evidence;
      return this;
    }    
  }  

  function selectedEvidence(evidence) {
    if (arguments.length === 0) {
      return _selectedEvidence;
    }
    else {
      _selectedEvidence = evidence;
      return this;
    }    
  }

  function selectedParagraph(paragraphIndex) {
    if (arguments.length === 0) {
      return _selectedParagraph;
    }
    else {
      _selectedParagraph = paragraphIndex;
    }    
  }

  function updateSessionInfo(rawUserId, rawCollectionId, callback) {
    var userId = parseInt(rawUserId);
    var collectionId = parseInt(rawCollectionId);

    if (!isNaN(userId)) {
      _userId = userId;
    }

    if (!isNaN(collectionId)) {
      if (_collections === null) {
        Core.getCollectionList(function(response) {
          _collections = response.data.map(function(d) {
            return {
              id: parseInt(d.collection_id),
              name: d.collection_name
            };
          });
          updateActiveCollection(collectionId);
          callback(_userId, _activeCollection);
        });
      }
      else {
        updateActiveCollection(collectionId);
        callback(_userId, _activeCollection);        
      }
    }      
    else {
      callback(_userId, _activeCollection);
    }
  }

  function updateActiveCollection(collectionId) {
    _activeCollection = {
      id: collectionId,
      name: _.find(_collections, function(c) {
        return c.id === collectionId;
      }).name
    };    
  }

  function userId(newUserId) {
    return _userId;
  }

  function activeCollection(newCollectionId, callback) {
    return _activeCollection;
  }

  // TODO: check that _userId is initialized; currently relying on the caller
  // to do the right thing
  function proposals(callback) {
    if (_proposals === null) {
      Core.getAllTextsForUser(_userId, function(response) {
        _proposals = response.data;
        _activeProposal = _proposals.length > 0 ? _proposals[0] : null;
        callback(_proposals);
      }, function(response) {
        console.log('server error when retrieving textsfor user ' + _userId);
        console.log(response);
      });
    }
    else {
      callback(_proposals);
    }
  }

  function activeProposal(proposal) {
    if (arguments.length === 0) {
      return _activeProposal;
    }
    else {
      _activeProposal = proposal;
    }
  }

  function activeParagraphs(paragraphs) {
    if (arguments.length === 0) {
      return _activeParagraphs;
    }
    else {
      _activeParagraphs = paragraphs;
    }
  }

  function paragraphCitation(citations) {
    if (arguments.length === 0) {
      return _paragraphCitation;
    }
    else {
      _paragraphCitation = citations;
    }
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

    $scope.uploadStatus = 'beforeUpload';

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

    $scope.processTextFile = function() {
      var selectedFile = document.getElementById('textfile-input').files[0];
      if (selectedFile === undefined) {
        $scope.fileError = true;
        return;
      }
      $scope.fileError = false;      
//      $scope.uploadStatus = 'uploading'; 
      console.log('start processing')
       $scope.uploadStatus = 'uploaded-success';
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        var title = $scope.textsInfo.title.length > 0 ? $scope.textsInfo.title : 'untitled';
        // Extract the reference from the end of the text
        var proposal = fileContent;
        var references = '';
        var parts = fileContent.split('References\n');
        if (parts.length === 2) {
          proposal = parts[0];
          references = parts[1];
          console.log(proposal)
          console.log(references)
        } 
        Core.postTextByUserId(userId, title, proposal, true, -1, function(response) {
          $scope.textsInfo.content = proposal;
          $scope.uploadStatus = 'uploaded-success';
          console.log('upload success');
        });
        // TODO: find and label citations, assuming brackets
//        var paragraphs = fileContent.split('\n');
      };
      reader.readAsText(selectedFile);
    }

  }]);
// TODO: add collectionId here
angular.module('modal.controllers')
  .controller('UploadBibtexModalController', ['$scope', '$modalInstance', 'userId', 'collectionId', 'existingEvidence', 'Core', 'Bibtex', '$http',
    function($scope, $modalInstance, userId, collectionId, existingEvidence, Core, Bibtex, $http) {

    var storedEvidence = [];
    $scope.evidenceIndex = 0;

    $scope.totalAbstractFound = 0;
    $scope.totalMatchesFound = 0;
    $scope.totalPersonalEntries = 0;

    $scope.collectionPostProcess = 'notStarted';
    
    $scope.uploadStatus = 'beforeUpload';
    $scope.numErrors = 0;

    $scope.userChoices = {
      seedNewCollection: false,
      whatCollection: 'new'
    };

    $scope.newCollection = {
      id: -1,
      name: 'untitled collection'
    };

    $scope.processBibtexFile = function() {

      $scope.uploadStatus = 'uploading';
      var selectedFile = document.getElementById('bibtex-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        var evidenceList = Bibtex.parseBibtexFile(fileContent);   
        evidenceList = _.uniq(evidenceList);
        $scope.totalToUpload = evidenceList.length;
        
        if ($scope.userChoices.seedNewCollection) {
          if ($scope.userChoices.whatCollection === 'new') {
            Core.initializeNewCollection($scope.newCollection.name, function(response) {
              $scope.newCollection.id = response.data.id;
              configUploadFunction(evidenceList);             
            })
          }
          else {
            configUploadFunction(evidenceList);
          }
        }
        else {
          configUploadFunction(evidenceList);          
        }
      };
      reader.readAsText(selectedFile);
    };

    function configUploadFunction(evidenceList) {
      var uploadFunction = setInterval(function() {
        if ($scope.evidenceIndex >= $scope.totalToUpload) {
          $scope.$apply(function() {
            $scope.uploadStatus = 'uploaded-success';
          });
          clearInterval(uploadFunction);
          if ($scope.userChoices.seedNewCollection) {
            $scope.collectionPostProcess = 'augmentation';
            $http.get('api/v1/ad-hoc/augmentCollection/' + $scope.newCollection.id + '/')
              .then(function() {
                $scope.collectionPostProcess = 'createModel';
                $http.get('api/v1/ad-hoc/createOnlineLDA/' + $scope.newCollection.id + '/')
                  .then(function() {
                    $scope.collectionPostProcess = 'loadModel';
                    $http.get('api/v1/ad-hoc/loadOnlineLDA/' + $scope.newCollection.id + '/')
                      .then(function() {
                        $scope.collectionPostProcess = 'cacheTopics';
                        $http.get('api/v1/ad-hoc/cacheTopics/' + $scope.newCollection.id + '/')
                          .then(function() {
                            $scope.collectionPostProcess = 'done';
                          });
                      })
                  }, function() {

                  })
              }, function(errorResponse) {
                console.log('error occurred when calling augmentCollection')
              });
          }
          return;
        }
        var evidence = evidenceList[$scope.evidenceIndex];
        evidence.title = evidence.title.replace('{', '').replace('}', '');
        $scope.esmitatedTimeRemaining = (evidenceList.length - $scope.evidenceIndex) * 3;
        $scope.currentEvidence = evidence.title;

        if ($scope.userChoices.seedNewCollection) {
          seedNewEvidenceCollection(evidence, parseInt($scope.newCollection.id));              
        }
        else {
          integrateNewEvidenceIntoCollection(evidence, collectionId);
        }
        $scope.evidenceIndex += 1;
      }, 3000);      
    }

    // If the user chooses to integrate the bibtex file into a selected collection, we
    // 1. For entries that are already in the collection, we find the existing evidence, 
    // add a bookmark for it and we are done
    // 2. For entries that are not in there, we 
    // 1) create the evidence with the user as "created_by";
    // 2) we need to make sure that every time we get user-created evidence for a user, 
    // those entries are returned along with their assigned topics (these should be determined
    // during loading time since we don't want to cache for every possible collection; only need 
    // handle this for explore view for now)

    // We have an implementation choice here: we can either add a server side function that 
    // handles situation 2), or just handle it on client side using a combination of existing
    // server calls (i.e. Core.getEvidenceByTitle followed by an addBookmark or postEvidenceByUserId)
    // I'm going with the second option for now to reduce code duplicates; let's see if this 
    // have an significant impact on upload speed
    function integrateNewEvidenceIntoCollection(evidence, collectionId) {
      Core.getEvidenceByTitle(collectionId, userId, evidence.title, false, 1, function(response) {
        var matchedEvidence = response.data[0];
        if (matchedEvidence !== undefined && matchedEvidence.dist <= evidence.title.length * 0.1) {
          Core.addBookmark(userId, matchedEvidence.id, function(response) {
            console.log('uploaded evidence bookmarked.')
            $scope.totalMatchesFound += 1;
            respondToSuccess(evidence, matchedEvidence);
          }, function(error) {
            console.log('server error when adding new bookmark');
            console.log(response);
            respondToError();
          });
        }
        else {
          Core.postEvidenceByUserId(userId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), function(response) {
            if (existingEvidence.indexOf(response.data[0].title) > -1) {
              $scope.lastUploadResult = 'duplicate';
              $scope.lastUploadedEvidence = $scope.currentEvidence;
              return;
            }
            if (evidence.abstract === '' && response.data[0].abstract !== '') {
              $scope.totalAbstractFound += 1;
            }   
            $scope.totalPersonalEntries += 1;
            respondToSuccess(evidence, response.data[0]);
          }, function(response) {
            console.log('server error when saving new evidence');
            console.log(response);
            respondToError();     
          });
        }
      });
    }

    function respondToSuccess(evidence, returnedEvidence) {
      $scope.lastUploadResult = 'success';
      $scope.lastUploadedEvidence = $scope.currentEvidence;
      storedEvidence.push(returnedEvidence);   
    }

    function respondToError() {
      $scope.lastUploadedEvidence = $scope.currentEvidence;
      $scope.numErrors += 1;
      $scope.lastUploadResult = 'failed';
      if ($scope.numErrors >= 10) {
        $scope.evidenceIndex = $scope.totalToUpload;
        $scope.uploadStatus = 'uploaded-failed';
      }            
    }

    function seedNewEvidenceCollection(evidence, collectionId) {
      Core.postEvidenceByUserId(collectionId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), 
        function(response) {
          Core.addBookmark(userId, response.data[0].id, function(response) {

          }, function(errorResponse) {
            console.log('warning: error occurred when bookmarking evidence.');
          });
          if (existingEvidence.indexOf(response.data[0].title) > -1) {
            $scope.lastUploadResult = 'duplicate';
            $scope.lastUploadedEvidence = $scope.currentEvidence;
            return;
          }
          $scope.lastUploadResult = 'success';
          $scope.lastUploadedEvidence = $scope.currentEvidence;
          storedEvidence.push(response.data[0]);
          if (evidence.abstract === '' && response.data[0].abstract !== '') {
            $scope.totalAbstractFound += 1;
          }
        }, function(response) {
          respondToError();
          console.log('server error when saving new evidence');
          console.log(response);
        });
    }

    $scope.ok = function () {
      $modalInstance.close(storedEvidence);
      $modalInstance.dismiss('done');
    };

  }]);
angular
  .module('bibtex.services')
  .factory('Bibtex', Bibtex);

  function Bibtex($http, $q) {
    var Bibtex = {
      parseBibtexFile: parseBibtexFile
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
              title: metadata.TITLE.split('\n').join(' '),
              abstract: metadata.ABSTRACT !== undefined ? metadata.ABSTRACT : '',
              metadata: _.omit(_.omit(metadata, 'TITLE'), 'ABSTRACT')
            });
          }
        }
      });      

      return results;
    }
  }
angular.module('explore.v2.controllers')
  .controller('ExploreController', ['$scope', '$stateParams', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic', 'Logger', 'Collection', 'User', 'ExploreState', 'Paper', 'Bookmark',
    function($scope, $stateParams, $modal, Core, AssociationMap, Pubmed, TermTopic, Logger, Collection, User, ExploreState, Paper, Bookmark) {

    $scope.userService = User;

    var topTermContainer = null;
    var topTopicContainer = null;
    var termTopicConnectionContainer = null;
    var topicNeighborContainer = null;
    var proposalThumbnailsContainer = null;
    var termColorMap = d3.scale.category10();
    var isDebug = true;
    $scope.proposals = null;

    var defaultFill = '#ccc';

    var termBatchSize = 30;
    var topicBatchSize = 30;

    var termColumnWidth = 200;
    var topicColumnWidth = 500;
    var connectionColumnWidth = 50;

    $scope.selectedEvidence = User.selectedEvidence();
    $scope.selectedRelatedEvidence = null;
    $scope.selectedTerms = ExploreState.selectedTerms();
    $scope.selectedWords = [];
    $scope.selectedTopic = ExploreState.selectedTopic();

    $scope.selectedEvidenceCounts = {
      bookmarked: 0,
      total: 0,
      relatedBookmarked: 0,
      relatedTotal: 0
    };

    $scope.candidateEvidence = ExploreState.candidateEvidence();
    $scope.candidateEvidenceTopics = ExploreState.candidateEvidenceTopics();
    $scope.selected = {};

    $scope.loadingEvidence = true;
    $scope.loadingTopicEvidence = false;
    $scope.loadingStatement = 'Retrieving evidence collection and topics...';

    $scope.termStartIndex = 0;

    $scope.numTerms = 0;
    $scope.numTopics = 0;

    $scope.$watch(function() {
      return d3.selectAll('.evidence')[0].length;
    }, function(newValue, oldValue) {
      if ($scope.selectedEvidence !== undefined && $scope.selectedEvidence !== null) {
        var index = _.findIndex($scope.evidence, function(d) {
          return d.title === $scope.selectedEvidence.title;
        });
        var eo = document.getElementById('evidence-' + index);
        if (eo !== null) eo.scrollIntoView();        
      }
    });

    $scope.selectSearchTitle = function(title, callSource) {
      var source = callSource === undefined ? 'default' : callSource;
      Logger.logAction($scope.userId, 'select title by search', 'v2','1', 'explore', {
        evidence: title.id,
        source: source
      }, function(response) {
        console.log('action logged: select title by search');
      });

      ExploreState.selectedSearchTitle(title);
      if (title.topic !== -1 && ($scope.selectedTopic === null || $scope.selectedTopic.id != title.topic)) {
        var topic = _.find($scope.topics, function(t) {
          return t.id === title.topic;
        });
        selectTopic(topic, 'auto - search title', title);
        /*
        $scope.selectedTopic = _.find($scope.topics, function(t) {
          return t.id === title.topic;
        });
        ExploreState.selectedTopic($scope.selectedTopic); */
        $scope.selectedTerms.length = 0;
        for (var i = 0; i < 5; ++i) {
          $scope.selectedTerms.push($scope.selectedTopic.terms[i].term);
        }
        console.log(ExploreState.selectedTerms());
        $scope.updateTermTopicOrdering(false, true);
      }
      else if ($scope.selectedTopic !== null && $scope.selectedTopic.id == title.topic) {
        $scope.selectEvidence(title);
        var index = _.findIndex($scope.evidence, function(d) {
          return d.title === $scope.selectedEvidence.title;
        });
        var eo = document.getElementById('evidence-' + index);
        if (eo !== null) eo.scrollIntoView();   
      }
      updateRelatedEvidence(title);
    }

    $scope.updateTermTopicOrdering = function(manualUpdate, scrollToStart) {
      if (manualUpdate) {
        Logger.logAction($scope.userId, 'reorder term and topics given selected terms', 'v2','1', 'explore', {
          numSelectedTerms: $scope.selectedTerms.length
        }, function(response) {
          console.log('action logged: reorder term and topics given selected terms');
        });
      }

      if (scrollToStart) {
        $scope.termStartIndex = 0;        
      }
      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex, $scope.selectedTerms);
      var topicsAndConnections = TermTopic.getTopTopics(terms, topicBatchSize, $scope.selectedTerms);
      var topics = topicsAndConnections.topics;
      var connections = topicsAndConnections.termTopicConnections;      
      visualizeTopTerms(topTermContainer, termColumnWidth, 600, terms);
      visualizeTopTopics(topTopicContainer, topicColumnWidth, 600, topics);
      visualizeTermTopicConnections(termTopicConnectionContainer, connectionColumnWidth, 600, terms, topics, connections);
      updateTermTopicFills();
      updateConnectionStrokes();
    };

    User.updateSessionInfo($stateParams.userId, $stateParams.collectionId, function(userId, collection) {
      $scope.userId = userId;
      $scope.collection = collection;

      Logger.logAction($scope.userId, 'load explore view', 'v2','1', 'explore', {
        collectionId: $scope.collection.id
      }, function(response) {
        console.log('action logged: load explore view');
      });

      User.proposals(function(_proposals) {
        $scope.proposals = _proposals;
        loadEvidence();
      })
    });

    function loadEvidence() {
      Collection
        .id($scope.collection.id)
        .allTopics(function(topics) {
          $scope.loadingEvidence = false;
          $scope.topics = topics;
          TermTopic.initialize($scope.topics);
          $scope.terms = TermTopic.getAllTerms();
          $scope.selected.searchTerm = $scope.terms[0];
          $scope.numTerms = TermTopic.numOfTerms();
          $scope.numTopics = TermTopic.numOfTopics();
          visualizeTopicTermDistribution();
          if (User.selectedEvidence() === null) {
            $scope.selected.searchTitle = ExploreState.selectedSearchTitle();
          }
          else {
            Core.getEvidenceByTitle($scope.collection.id, $scope.userId, User.selectedEvidence().title, true, 1, function(response) {
              updateCandidateEvidence(response.data);
            });      
          }
          Bookmark
            .userId($scope.userId)
            .evidence(function(evidence, idMap) {});
      });
    }

    function updateCandidateEvidence(evidence) {
      $scope.candidateEvidence = evidence;
      $scope.selected.searchTitle = $scope.candidateEvidence[0];
//      $scope.selectSearchTitle($scope.selected.searchTitle);
      ExploreState.candidateEvidence($scope.candidateEvidence);
      console.log($scope.candidateEvidence);
      var topics = {}
      evidence.forEach(function(e) {
        if (topics[e.topic] === undefined) {
          topics[e.topic] = 0;
        }
        topics[e.topic] += 1;
      });
      $scope.candidateEvidenceTopics = _.sortBy(_.pairs(topics).map(function(t) {
        return [parseInt(t[0]), t[1]];
      }), function(tuple) {
        return -tuple[1];
      });
      ExploreState.candidateEvidenceTopics($scope.candidateEvidenceTopics);
    }

    $scope.evidenceHasTopic = function(topic) {
        return function(evidence) {
            return evidence.topic == topic;
        }
    }

    $scope.clearSelectedTerms = function() {
      Logger.logAction($scope.userId, 'clear selected terms', 'v2','1', 'explore', {
        numSelectedTerms: $scope.selectedTerms.length
      }, function(response) {
        console.log('action logged: clear selected terms');
      });
      $scope.selectedTerms.length = 0;
      $scope.updateTermTopicOrdering(false, false);
    }

    $scope.searchEvidenceByTitle = function() {
      Logger.logAction($scope.userId, 'search evidence by title', 'v2','1', 'explore', {
        query: $scope.searchTitle
      }, function(response) {
        console.log('action logged: search evidence by title');
      });

      Core.getEvidenceByTitle($scope.collection.id, $scope.userId, $scope.searchTitle, true, 25, function(response) {
        updateCandidateEvidence(response.data);
      });
    };

    $scope.selectSearchTerm = function(term) {
      Logger.logAction($scope.userId, 'select search term', 'v2','1', 'explore', {
      }, function(response) {
        console.log('action logged: select search term');
      });
      $scope.selectedTerms.push(term.term);
      $scope.termStartIndex = 0;
      $scope.updateTermTopicOrdering(false, true);
    };

    $scope.citeEvidence = function (evidence, sourceList) {
      var textParaId = User.activeProposal().id+ '-' + User.selectedParagraph();
      if (AssociationMap.hasAssociation('evidence', 'text', evidence.id, textParaId)) {
        return;
      }
      Logger.logAction($scope.userId, 'cite evidence', 'v2', '1', 'explore', {          
        proposal: User.activeProposal().id,
        paragraph: User.selectedParagraph(),
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {
        if (isDebug)
          console.log('action logged: cite evidence');
      });        
      //Add association
      $scope.flipBookmark(evidence);
      AssociationMap.addAssociation($scope.userId,'evidence', 'text', evidence.id, textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = User.citedEvidence().map(function(e) {
          return e.id;
        }).indexOf(evidence.id);          
        if (index === -1) {
          User.citedEvidence().push(evidence);
          index = User.citedEvidence().length - 1;     
          Bookmark.evidenceIdMap()[evidence.id] = evidence;
        }
        // Add the association to text evidence association for book-keeping (since we need to update the association entry
        // when new paragraphs are added)
        // TODO: double check if it's ok for us to skip the following step - I think we are since textEvidenceAssociations is 
        // created every time the focus view is loaded
        /*
        textEvidenceAssociations.push(association); */
        User.paragraphCitation()[User.selectedParagraph()].push({            
          index: index,
          evidence: evidence
        });
        // TODO: double check that it is fine to not update proposal for download here
        // prepareProposalDownload();
      });          
    };

    $scope.showNextTerms = function() {
      if (TermTopic.numOfTerms() > $scope.termStartIndex + termBatchSize) {

        Logger.logAction($scope.userId, 'scroll terms', 'v2','1', 'explore', {
          direction: 'forward'
        }, function(response) {
          console.log('action logged: scroll terms');
        });

        $scope.termStartIndex += termBatchSize;
        $scope.updateTermTopicOrdering(false, false);
      }
    };

    $scope.showPrevTerms = function() {
      if ($scope.termStartIndex - termBatchSize >= 0) {

        Logger.logAction($scope.userId, 'scroll terms', 'v2','1', 'explore', {
          direction: 'backward'
        }, function(response) {
          console.log('action logged: scroll terms');
        });

        $scope.termStartIndex -= termBatchSize;
        $scope.updateTermTopicOrdering(false, false);
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
      Logger.logAction($scope.userId, 'select evidence', 'v2', '1', 'explore', {
        evidence: evidence.id,
      }, function(response) {
        console.log('action logged: select evidence');
      });

      $scope.selectedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');
      updateRelatedEvidence(evidence);
    }

    $scope.selectRelatedEvidence = function(evidence) {
      Logger.logAction($scope.userId, 'select related evidence', 'v2', '1', 'explore', {
        evidence: evidence.id,
      }, function(response) {
        console.log('action logged: select related evidence');
      });

      $scope.selectedRelatedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');
    }

    // Get co-occurred terms and publications with those labels
    $scope.getNeighborConcepts = function() {

      Pubmed.findNeighborConcepts($scope.selectedConcepts, 1, function(response) {
        console.log(response);
      }, function(errorRespone) {

      });
    };

    $scope.flipBookmark = function(e, source) {
      Bookmark.flipBookmark(e, 'explore', source); 
    }

    function visualizeTopicTermDistribution(topics) {
      var params = {
        width: 1800,
        height: 600,
        margin: { 
          left: 50,
          top: 25,
          bottom: 20,
          right: 0
        },
        termNum: 50
      };

      var canvas = d3.select('#topic-term-dist')
        .attr('width', params.width + params.margin.left + params.margin.right)
        .attr('height', params.height + params.margin.top + params.margin.bottom);

/*
      canvas.append('text')
        .text('Similar topics')
        .attr('font-size', 18)
        .attr('transform', 'translate(1150, 20)'); */

      canvas.append('text')
        .text('# of docs')
        .attr('font-size', 14)
        .attr('transform', 'translate(450, ' + 10 + ')');

      canvas.append('text')
        .text('term distribution')
        .attr('font-size', 14)
        .attr('transform', 'translate(725, ' + 10 + ')');

      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex);
      var topicAndConnections = TermTopic.getTopTopics(terms, topicBatchSize);
      var topics = topicAndConnections.topics;
      var termTopicConnections = topicAndConnections.termTopicConnections;

      topTermContainer = configSvgContainer(canvas.append('svg'), termColumnWidth, params.height, params.margin.left, params.margin.top);
      termTopicConnectionContainer = configSvgContainer(canvas.append('svg'), connectionColumnWidth, params.height, params.margin.left + 200, params.margin.top);
      topTopicContainer = configSvgContainer(canvas.append('svg'), topicColumnWidth, params.height, params.margin.left + 250, params.margin.top);
//      topicNeighborContainer = configSvgContainer(canvas.append('svg'), 600, params.height + 30, params.margin.left + 1050, params.margin.top - 30);
//      proposalThumbnailsContainer = configSvgContainer(canvas.append('svg'), 600, params.height + 30, params.margin.left + 1050, params.margin.top - 30);
      thumbnailSidebarContainer = configSvgContainer(canvas.select('#thumbnail-sidebar'), 60, params.height, params.margin.left + 1050, params.margin.top);
      proposalThumbnailsContainer = d3.select('#selected-thumbnail');

      visualizeTopTerms(topTermContainer, termColumnWidth, 600, terms);
      visualizeTermTopicConnections(termTopicConnectionContainer, connectionColumnWidth, 600, terms, topics, termTopicConnections);
      visualizeTopTopics(topTopicContainer, topicColumnWidth, 600, topics);
//      visualizeThumbnailSidebar(thumbnailSidebarContainer, 60, 600);
//      visualizeProposalThumbnails(proposalThumbnailsContainer, 600, 600);
      if ($scope.selectedTopic !== null) setSelectedTopic($scope.selectedTopic);
      if ($scope.selected.searchTitle !== null && $scope.selected.searchTitle !== undefined) 
        $scope.selectSearchTitle($scope.selected.searchTitle);
      updateTermTopicFills();
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
        .range([10, width-130]); // 100 pixels are allocated to the texts

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
        .attr('font-weight', 300)
        .attr('text-anchor', 'end')
        .attr('dy', 13);

      newTerms.append('rect')
        .attr('width', function(d) {
          return x(d.properties.weight);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .attr('transform', 'translate(20, 0)') // Space between rectangles and texts
        .on('mouseover', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) return;
          d3.select(this).attr('fill', '#a6bddb');
          d3.selectAll('.connection')
            .filter(function(curve) {
              return $scope.selectedTerms.indexOf(curve.term.term) < 0;
            })
            .attr('stroke', function(curve, i) {
              return curve.term.term === d.term ? '#a6bddb' : '#ccc';
            })
            .attr('stroke-width', function(curve, i) {
              return curve.term.term === d.term ? 2 : 1;
            })
            .attr('opacity', function(curve, i) {
              return curve.term.term === d.term ? 0.75 : 0.25;
            });
          topTopicContainer.selectAll('.topic-term-selector')
            .attr('fill', function(topicTerm, i) {
              if ($scope.selectedTerms.indexOf(topicTerm.term) >= 0) {
                return termColorMap(topicTerm.term);
              }
              else if (topicTerm.term === d.term) {
                return '#a6bddb';
              }
              else {
                return '#ccc';
              }
            });
        })
        .on('mouseout', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) return;
//          d3.select(this).attr('fill', '#ccc');
          updateTermTopicFills();
          d3.selectAll('.connection')
            .filter(function(curve) {
              return $scope.selectedTerms.indexOf(curve.term.term) < 0;
            })
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5);
        })
        .on('click', function(d) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            Logger.logAction($scope.userId, 'deselect term', 'v2','1', 'explore', {
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
            Logger.logAction($scope.userId, 'select term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              topicCount: d.properties.topicCount,
              target: 'term index'
            }, function(response) {
              console.log('action logged: select term');
            });
            $scope.selectedTerms.push(d.term);
          }
//          $scope.updateTermTopicOrdering();
          updateTermTopicFills();
          updateConnectionStrokes();
        });
    }

    function updateTermTopicFills() {
      // Uncomment the following to color terms by their position in the $scope.selectedTerms array
//      termColorMap.domain($scope.selectedTerms);
      topTermContainer.selectAll('rect')
        .attr('fill', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            return termColorMap(d.term);
          }
          else { return '#ccc'; }
        });
      topTopicContainer.selectAll('.topic-term-selector')
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
        .attr('stroke-width', function(d, i) {
          return ($scope.selectedTerms.length === 0 || $scope.selectedTerms.indexOf(d.term.term) >= 0) ? 2 : 1;
        })
        .attr('opacity', function(d, i) {
          return ($scope.selectedTerms.length === 0 || $scope.selectedTerms.indexOf(d.term.term) >= 0) ? 0.75 : 0.25;
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

      var numDocScale = d3.scale.linear()
        .domain([
            d3.min(topTopics, function(d) {
              return d.evidenceCount;
            }), d3.max(topTopics, function(d) {
              return d.evidenceCount
            })
          ])
        .range([5, 10]);

      visualizeIndividualTopic(newTopics, width-50, y, numDocScale);
    }

    function selectTopic(d, source, selectedEvidence) {
      var highlightOpacity = 0.3;
      Logger.logAction($scope.userId, 'select topic', 'v2','1', 'explore', {
        topic: d.id,
        target: 'individual topic',
        source: source
      }, function(response) {
        console.log('action logged: select topic');
      });

      d3.selectAll('.topic-background').attr('opacity', 0);
      d3.select('#topic-bg-' + d.id).attr('opacity', highlightOpacity);        
      setSelectedTopic(d, selectedEvidence);
    }

    function visualizeIndividualTopic(topic, width, y, numDocScale) {

      var termWidth = width - 10;
      var highlightOpacity = 0.3;

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
        .attr('opacity', 0, function(d) {
          return ($scope.selectedTopic !== null && d.id === $scope.selectedTopic.id) ? highlightOpacity : 0;
        })
        .on('mouseover', function(d) {
          d3.selectAll('.topic-background').attr('opacity', 0);
          d3.select('#topic-bg-' + d.id)
            .attr('opacity', highlightOpacity);          
          if ($scope.selectedTopic !== null) {
            d3.select('#topic-bg-' + $scope.selectedTopic.id).attr('opacity', highlightOpacity); 
          }

        })
        .on('mouseout', function() {
          d3.selectAll('.topic-background').attr('opacity', function(d) {
            return ($scope.selectedTopic !== null && d.id === $scope.selectedTopic.id) ? highlightOpacity : 0;
          });          
        })
        .on('click', function(d) {
          selectTopic(d, 'direct');
        });

      topic.append('circle')
        .attr('class', 'topic-selector')
        .attr('id', function(d) {
          return 'topic-selector-' + d.id;
        })
        .attr('pointer-events', 'none')
        .attr('r', function(d, i) {
          return numDocScale(d.evidenceCount);
        })
        .attr('transform', 'translate(-20, 9)')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('fill', '#e5e5e5');
/*
      topic.append('text')
        .text(function(topic) {
          return topic.evidenceCount;
        })
        .attr('text-anchor', 'end')
        .attr('dy', 13)
        .attr('dx', -20)     */

      var probSum = 1;
      // Hack alert!!!
      if ($scope.collection.id === 12) probSum = 0.2;
      if ($scope.collection.id === 13) probSum = 0.5;
      if ($scope.collection.id === 15) probSum = 0.7;
      if ($scope.collection.id === 16) probSum = 0.2;
      if ($scope.collection.id === 17) probSum = 0.25;

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
        .attr('class', 'topic-term-selector')
        .attr('width', function(d) {
          return Math.max(d.prob * termWidth * (1 / probSum) - 1, 1);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .on('click', function(d) {
          // TODO: cannot easily count topic count here, will add if necessary
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            Logger.logAction($scope.userId, 'deselect term', 'v2','1', 'explore', {
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
            Logger.logAction($scope.userId, 'select term', 'v2','1', 'explore', {
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
        .attr('font-weight', 350)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .text(function(d, i) {
          return i < 2 ? d.term : '';
        });      
    }

    function setSelectedTopic(d, evidence) {
      $scope.selectedTopic = d;
      ExploreState.selectedTopic($scope.selectedTopic);      
      $scope.selectedEvidence = evidence === undefined ? null : evidence;
//      visualizeTopicNeighborMatrix(topicNeighborContainer, 600, 600, d);
      $scope.selectedDocumentTerms = _.object(_.range(10).map(function(num) {
        return [num, false];
      }));
      $scope.loadingTopicEvidence = true;
      Core.getEvidenceByTopic($scope.collection.id, d.id, $scope.userId, function(response) {
        $scope.evidence = response.data.evidence;
        var bookmarkedEvidence = response.data.evidenceBookmarks.map(function(b) {
          return b.evidence;
        });
        $scope.evidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
          e.bookmarked = bookmarkedEvidence.indexOf(e.id) >= 0;
        })
        response.data.evidencePersonal.forEach(function(e) {
          e.bookmarked = true;
          e.metadata = JSON.parse(e.metadata);
          $scope.evidence.push(e);
        })
        $scope.loadingTopicEvidence = false;
      }, function(errorResponse) {
        console.log(errorResponse);
      })      
    }

    function updateRelatedEvidence(evidence) {
      var citations = Paper.getCitationsForPaper(evidence.id);
      var references = Paper.getReferencesForPaper(evidence.id);
      $scope.selectedEvidenceCounts.relatedBookmarked = 0;
      $scope.selectedEvidenceCounts.relatedTotal = citations.length + references.length;
      $scope.relatedEvidence = [];
      citations.forEach(function(d) {
        $scope.relatedEvidence.push({
          evidence: d,
          relation: 'citation'
        });
        if (d.bookmarked) $scope.selectedEvidenceCounts.relatedBookmarked += 1;
      });
      references.forEach(function(d) {
        $scope.relatedEvidence.push({
          evidence: d,
          relation: 'reference'
        });
        if (d.bookmarked) $scope.selectedEvidenceCounts.relatedBookmarked += 1;
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
        .interpolate('bundle')
        .tension(1);

      var curve = container.selectAll('.connection')
        .data(connections, function(d, i) {
          return d.term.origIndex + '-' + d.topic.id;
        });

      curve.exit().remove();

      curve.enter()
        .append('path')
        .attr('class', 'connection')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-with', 1)
        .attr('opacity', 0.5);

      curve
        .attr('d', function(d) {
          var termPos = 5 + termY(termIndexMap[d.term.origIndex]);
          var topicPos = 9 + topicY(topicIndexMap[d.topic.id]);
          var points = [
            {x: 0, y: termPos},
            {x: 30, y: termPos},
            {x: 30, y: topicPos},
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
          Logger.logAction($scope.userId, 'select topic', 'v2','1', 'explore', {
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
      Logger.logAction($scope.userId, 'select term to filter documents', 'v2','1', 'explore', {
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
        .style('font-weight', function(d, i) {
          return $scope.selectedDocumentTerms[i] ? 600 : 400;
        })

      d3.selectAll('.selected-topic-term')
        .style('color', function(d, i){
          if ($scope.selectedDocumentTerms[i]) {
            return colorScale(i);
          }
          else {
            return 'black';
//            return i % 2 === 0 ? '#eee' : '#fff';
          }
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
  .controller('FocusController', ['$scope', '$stateParams', '$modal', 'Core','AssociationMap', 'Argument', 'Logger', 'Bibtex', 'Paper', 'User', 'Bookmark',
  function($scope, $stateParams, $modal, Core, AssociationMap, Argument, Logger, Bibtex, Paper, User, Bookmark) {      
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

    $scope.editHistory = [];

    $scope.loadingTexts = true;
    $scope.loadingStatement = 'Retrieving proposals and bookmarked evidence...';

    $scope.loadingRecommendedEvidence = false;
    $scope.selectedEvidenceCiteStatus = 'uncited';
    $scope.savingStatus = 'saved';
    $scope.citationTabs = {
      'recommended':{active: true},
      'cited': {active: false},
      'bookmarked': {active: false}
    };

    var currentText = '';
    var previousText = '';

    $scope.logStateTransition = function() {
      Logger.logAction($scope.userId, 'explore recommended citation', 'v2','1', 'focus', {
      }, function(response) {
        if (isDebug)
          console.log('action logged: explore recommended citation');
      });      
    }

    $scope.selectText = function(text, userInitiated) {
      if (userInitiated) {
        Logger.logAction($scope.userId, 'select proposal', 'v2','1', 'focus', {
          proposal: text.id,
          contentLength: text.content.split(' ').length
        }, function(response) {
          if (isDebug)
            console.log('action logged: select proposal');
        });
      }

      $scope.selectedText = text;
      User.activeProposal($scope.selectedText);
      $scope.paragraphInformation= [];
      $scope.paragraphCitation = [];
      $scope.activeParagraphs = _.filter(text.content.split('\n'), function(text){
        return text !== '';
      }).map(function(p, i) {
        $scope.paragraphInformation.push({});
        $scope.paragraphCitation.push([]);
        $scope.editHistory.push([]);
        updateRecommendedCitations(p, i);
        var timestamps = [];
        p.split('').forEach(function() {
          timestamps.push(new Date());
        });
        return {
          text: p,
          timestamps: timestamps
        };
      });
      User.activeParagraphs($scope.activeParagraphs);
      User.paragraphCitation($scope.paragraphCitation);
      updateCitedEvidence();
    };

    var blob = null;
    var textEvidenceAssociations = null;
    var evidenceIdMap = null;
    var isDebug = true;
    $scope.evidence = null;

    User.updateSessionInfo($stateParams.userId, $stateParams.collectionId, function(userId, collection) {
      $scope.userId = userId;
      $scope.collection = collection;

      Paper.initializeCitationMap($scope.collection.id, $scope.userId);

      AssociationMap.initialize($scope.userId, function() {
        textEvidenceAssociations = AssociationMap.getAssociationsOfType('evidence', 'text');
        updateCitedEvidence();
      });

      loadEvidence();
    });

    // Check if the current text have changed every 10 secondsand save the contents.
    // if there are changes,  
    setInterval(function(){
      if ($scope.hasUnsavedChanges) {
        $scope.saveText();
      }
    }, 5000);

    function loadEvidence() {
      Bookmark
        .userId($scope.userId)
        .evidence(function(evidence, idMap) {
          $scope.evidence = evidence;
          evidenceIdMap = idMap;
          updateCitedEvidence();
          loadTexts();
        });

      var newParagraphIndex = -1;

      $scope.$watch(function() {
        return d3.selectAll('.text-paragraph')[0].length;
      }, function(newValue, oldValue) {
        if (isDebug)
          console.log('watch on # of .text-paragraph executing...')
        var el =document.getElementById('ap-' +newParagraphIndex);
        if (el !== null && newValue > oldValue){
          el.innerText = '';
          el.focus();
        }
      });
    }

    function loadTexts() {
      User.proposals(function(proposals) {
        $scope.texts = proposals;
        if ($scope.texts.length > 0) {
          $scope.selectText(User.activeProposal(), false);
        }
        $scope.loadingTexts = false;
        Logger.logAction($scope.userId, 'load focus view', 'v2','1', 'focus', {
          numProposals: $scope.texts.length
        }, function(response) {
          if (isDebug)
            console.log('action logged: load view');
        });
      });
    }

    // TODO: known bug: if 1) add a new paragraph at the end of the proposal (it's fine if the paragraph is added in the middle), 
    // 2) download the proposal, then the new paragraph will beome invisible in the text area 
    // (the sorrounding spans are removed somehow), but it will appear if refresh the page (i.e. the paragraph itself is stored)
    function prepareProposalDownload() {
      var content = '';
      for (var i = 0; i < $scope.activeParagraphs.length; ++i) {
        var paragraph = $scope.activeParagraphs[i];
        var citations = $scope.paragraphCitation[i].map(function(c) {
          return c.index;
        }).sort();
        content += paragraph.text;
        for (var j = 0; j < citations.length; ++j) {
          content += '[' + (citations[j] + 1) + ']';
        }
        content += '\n';
      }
      for (var i = 0; i < $scope.activeParagraphs.length; ++i) {
        console.assert($scope.paragraphCitation[i] !== undefined);
      }
      content += '\nReferences\n'
      for (var i = 0; i < $scope.citedEvidence.length; ++i) {
        var evidence = $scope.citedEvidence[i];
        if (evidence.metadata === undefined) continue;
        content += (i+1) + '. ';
        content += evidence.metadata.AUTHOR + ' ';
        content += evidence.title + '. ';
        if (evidence.metadata.JOURNAL !== undefined) {
          content += evidence.metadata.JOURNAL + ' ';
        }
        if (evidence.metadata.DATE !== undefined) {
          content += evidence.metadata.DATE + ' ';
        }
        content += '\n';
      }

      blob = new Blob([ content ], { type : 'text/plain' });
      $scope.proposalUrl = (window.URL || window.webkitURL).createObjectURL( blob );
    };

    // TODO
    $scope.loadPlainTextProposalFile = function() {
    };

    // TODO
    $scope.loadLatexProposalFile = function() {
      // Need to find and remove latex commands...       
    }

    $scope.selectEvidence = function(evidence, sourceList, userInitiated) {
      if (userInitiated) {
        Logger.logAction($scope.userId, 'select evidence', 'v2', '1', 'focus', {
          evidence: evidence.id,
          sourceList: sourceList
        }, function(response) {
          if (isDebug)
            console.log('action logged: select evidence');
        });
      }

      $scope.selectedEvidence = evidence;
      User.selectedEvidence($scope.selectedEvidence);
      $scope.selectedWords = evidence.abstract.split(' ');

      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;
      if (AssociationMap.hasAssociation('evidence', 'text', $scope.selectedEvidence.id, textParaId)) {
        $scope.selectedEvidenceCiteStatus = 'cited';
      }
      else {
        $scope.selectedEvidenceCiteStatus = 'uncited';        
      }

    };

    $scope.selectParagraph = function(index, clickTarget) {
      if (index!== $scope.selectedParagraph) {          
        Logger.logAction($scope.userId, 'select paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,
          paragraph: index,
          clickTarget: clickTarget
        }, function(response) {        
          if (isDebug)    
            console.log('action logged: select paragraph');
        });

        $scope.selectedParagraph =index;
//        currentParagraph = $scope.activeParagraphs[$scope.selectedParagraph];
        updateRecommendedCitations($scope.activeParagraphs[index].text, index);
      }      
    };

    $scope.flipBookmark = function(e, source) {
      Bookmark.flipBookmark(e, 'focus', source);
    }

    $scope.bookmarkEvidence = function(e, source) {
      Logger.logAction($scope.userId, 'bookmark evidence', 'v2', '1', 'focus', {
        evidence: e.id,
        numDocuments: $scope.evidence.length,
        source: source
      }, function(response) {
        console.log('action logged: bookmark evidence');
      });
      Core.addBookmark($scope.userId, e.id, function(response) {
        $scope.evidence.push(e);
        e.bookmarked = true;
        console.log('bookmark evidence success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });  
    }

    $scope.unbookmarkEvidence = function(e, source) {
      Logger.logAction($scope.userId, 'remove evidence bookmark', 'v2', '1', 'focus', {
        evidence: e.id,
        numDocuments: $scope.evidence.length,
        source: source
      }, function(response) {
        console.log('action logged: remove evidence bookmark');
      });
      Core.deleteBookmark($scope.userId, e.id, function(response) {
        $scope.evidence = _.without($scope.evidence, e);
        e.bookmarked = false;
        console.log('remove evidence bookmark success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });  
    }

    $scope.citeEvidence = function(evidence, sourceList) {
      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;
      if (AssociationMap.hasAssociation('evidence', 'text', evidence.id, textParaId)) {
        return;
      }
      Logger.logAction($scope.userId, 'cite evidence', 'v2', '1', 'focus', {          
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {
        if (isDebug)
          console.log('action logged: cite evidence');
      });        
      //Add association
      AssociationMap.addAssociation($scope.userId,'evidence', 'text', evidence.id, textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = $scope.citedEvidence.map(function(e) {
          return e.id;
        }).indexOf(evidence.id);          
        if (index === -1) {
          $scope.citedEvidence.push(evidence);
          index = $scope.citedEvidence.length - 1;     
          Bookmark.addBookmark(evidence, 'focus', 'cite');
        }
        // Add the association to text evidence association for book-keeping (since we need to update the association entry
        // when new paragraphs are added)
        textEvidenceAssociations.push(association);
        $scope.paragraphCitation[$scope.selectedParagraph].push({            
          index: index,
          evidence: evidence
        });
        prepareProposalDownload();
      });      
    };

    $scope.unciteEvidence = function(evidence, sourceList) {
      console.log('unciting')
      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;
      Logger.logAction($scope.userId, 'uncite evidence', 'v2', '1', 'focus', {
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {
        if (isDebug)
          console.log('action logged: uncite evidence');
      });        
      //Add association
      AssociationMap.removeAssociation($scope.userId,'evidence', 'text', evidence.id, textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = $scope.citedEvidence.map(function(e) {
          return e.id;
        }).indexOf(evidence.id);        
        var lengthBefore = textEvidenceAssociations.length;  
        _.pull(textEvidenceAssociations, _.findWhere(textEvidenceAssociations, {sourceId: evidence.id.toString(), targetId: textParaId}))
        console.assert(textEvidenceAssociations.length === lengthBefore - 1);
        var lengthBefore = $scope.paragraphCitation[$scope.selectedParagraph].length;
        _.pull($scope.paragraphCitation[$scope.selectedParagraph], _.findWhere($scope.paragraphCitation[$scope.selectedParagraph], {index: index, evidence: evidence}));
        console.assert($scope.paragraphCitation[$scope.selectedParagraph].length === lengthBefore - 1);
        prepareProposalDownload();
      });      
    }

    $scope.showCitation = function(citation) {        
      Logger.logAction($scope.userId, 'show citation', 'v2', '1', 'focus', {
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,          
        citation: citation.evidence.id
      }, function(response) {
        if (isDebug)
          console.log('action logged: show citation');       
      });        

      $scope.selectEvidence(citation.evidence, null, false);        
      $scope.citationTabs['cited'].active= true;      
    }

    $scope.openUploadBibtexWindow = function() {
      Logger.logAction($scope.userId, 'open upload bibtex window', 'v2', '1', 'focus', {
      }, function(response) {
        if (isDebug)
          console.log('action logged: open upload bibtex window');       
      });        

      var modalInstance = $modal.open({
        templateUrl: 'modal/uploadBibtexModal.html',          
        controller: 'UploadBibtexModalController',          
        resolve: {
          userId: function() {
            return $scope.userId;
          },
          collectionId: function() {
            return $scope.collection.id;
          },
          existingEvidence: function() {
            return $scope.evidence.map(function(e) {
              return e.title;
            });
          }
        }
      });

      modalInstance.result.then(function (uploadedEvidence) {
        $scope.evidence = $scope.evidence.concat(uploadedEvidence);
      });  
    }

    $scope.processBibtexFile = function() {
      var selectedFile = document.getElementById('bibtex-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        var evidenceList = Bibtex.parseBibtexFile(fileContent);      
        var storedEvidence = [];

        var evidenceIndex = 0;
        var totalAbstractFound = 0;
        var uploadFunction = setInterval(function() {
          console.log(evidenceIndex);
          if (evidenceIndex >= evidenceList.length) {
            clearInterval(uploadFunction);
            return;
          }
          var evidence = evidenceList[evidenceIndex];
          Core.postEvidenceByUserId($scope.userId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), 
            function(response) {
              // TODO: probably more efficient to deal with this server side
              if ($scope.evidence.indexOf(response.data[0]) > -1 || storedEvidence.indexOf(response.data[0]) > -1) {
                return;
              }
              storedEvidence.push(response.data[0]);
              if (evidence.abstract === '' && response.data[0].abstract !== '') {
                totalAbstractFound += 1;
              }
              if (storedEvidence.length === evidenceList.length) {
                $scope.evidence = $scope.evidence.concat(storedEvidence); 
                console.log('total bibtex entry processed: ' + evidenceList.length);
                console.log('total abstracts found: ' + totalAbstractFound);
//                extendEvidenceMap(storedEvidence, 1);
              }
            }, function(response) {
              console.log('server error when saving new evidence');
              console.log(response);
            });

          evidenceIndex += 1;
        }, 3000);
      };
      reader.readAsText(selectedFile);
    };    

    $scope.addTextEntry = function() {
      Logger.logAction($scope.userId, 'initiate proposal creation', 'v2','1', 'focus', {
        totalProposals: $scope.texts.length
      }, function(response) {
        if (isDebug)
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
            return $scope.userId;
          }          
        }
      });

      modalInstance.result.then(function (newEntry){          
        Logger.logAction($scope.userId, 'proposal created', 'v2','1', 'focus', {            
          proposal: newEntry.id,
          contentLength: newEntry.content.split(' ').length,            
          totalProposals: $scope.texts.length          
        },function(response) {
          if (isDebug)
            console.log('action logged: proposal created');          
        });

        $scope.texts.push(newEntry);
        $scope.selectText(newEntry, false);
      });      
    }

    // WIP: this function needs to do the following:
    // 1. for every user keystroke, figure out which words is being updated 
    // 2. update the timestamp for the corresponding word
    // We could use a diff here. Every time the user makes a change (not necessarily changing one character), 
    // we compute the diff, and figure out indexes for the words that have been changed; then we update the timestamp
    // in the corresponding container
    function updateTextAge(paraIndex) {
      var currentText = document.getElementById('ap-' + paraIndex).innerText;
      var startDiffPos = 0;
      var prevChars = previousText.split('');
      var currentChars = currentText.split('');
      var maxTextLength = Math.max(prevChars.length, currentChars.length);
      var minTextLength = Math.min(prevChars.length, currentChars.length);
      for (var i = 0; i < maxTextLength; ++i) {
        if (prevChars[i] !== currentChars[i]) {
          startDiffPos = i;
          break;
        }
      }
      var endDiffPosPrev = prevChars.length;
      var endDiffPosNow = currentChars.length;
      for (var delta = 0; delta < minTextLength; ++delta) {
        if (prevChars[endDiffPosPrev-delta] !== currentChars[endDiffPosNow-delta]) {
          endDiffPosPrev -= delta;
          endDiffPosNow -= delta;
          break;
        }
      }
      // everything was changed in place
      if (endDiffPosPrev === endDiffPosNow) {
        for (var counter = endDiffPosPrev; counter < endDiffPosNow; ++counter) {
          $scope.activeParagraphs[paraIndex].timestamps[counter] = new Date();
        }
      }
      else if (endDiffPosPrev > endDiffPosNow) {// some characters are deleted
        $scope.activeParagraphs[paraIndex].timestamps.splice(endDiffPosNow, endDiffPosPrev - endDiffPosNow);
        if (startDiffPos <= endDiffPosNow) {
          for (var counter = startDiffPos; counter < endDiffPosPrev; ++counter) {
            $scope.activeParagraphs[paraIndex].timestamps[counter] = new Date();
          }
        }
      }
      else { // some characters were added
        for (var counter = endDiffPosPrev; counter < endDiffPosNow; ++counter) {
          $scope.activeParagraphs[paraIndex].timestamps.splice(counter, 0, new Date());
        }
        if (startDiffPos <= endDiffPosPrev) {
          for (var counter = startDiffPos; counter < endDiffPosPrev; ++counter) {
            $scope.activeParagraphs[paraIndex].timestamps[counter] = new Date();
          }
        }
      }
//      User.activeParagraphs($scope.activeParagraphs);
    } 

    function updateCitedEvidence() {        
      if ($scope.selectedText === undefined) return;
      if (textEvidenceAssociations === null || _.size(evidenceIdMap) === 0) {
        $scope.citedEvidence = [];
        User.citedEvidence($scope.citedEvidence);
        return;
      }

      $scope.citedEvidence = _.without(_.uniq(_.filter(textEvidenceAssociations, function(a) {  
        var textId = a.targetId.toString().split('-');
        return textId[0] == $scope.selectedText.id && textId.length===2;        
      }).map(function(a) {  
        if (evidenceIdMap[a.sourceId] === undefined) {
          console.log(a.sourceId)
          console.log(evidenceIdMap)
          console.log('Warning: inconsistency between citations and bookmarks detected.');
        }
        return evidenceIdMap[a.sourceId];
      })), undefined);

      User.citedEvidence($scope.citedEvidence);

      // Identify citations for each paragraph
      textEvidenceAssociations.forEach(function(a) {          
        var textId = a.targetId.toString().split('-');
        if (textId[0] != $scope.selectedText.id || textId.length>2) return;
        var paragraphIndex = parseInt(textId[1]);
        if (paragraphIndex >= $scope.paragraphCitation.length) return;
        var e = evidenceIdMap[a.sourceId];
        var evidenceIndex = $scope.citedEvidence.indexOf(e);
        $scope.paragraphCitation[paragraphIndex].push({            
          index: evidenceIndex,
          evidence: e
        });
      }); 
      prepareProposalDownload();
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
        Logger.logAction($scope.userId, 'create new paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,           
          totalParagraphs: $scope.activeParagraphs.length
        }, function(response) {
          if (isDebug)
            console.log('action logged: create new paragraph');
        });
        e.preventDefault();
        var enterPosition = getCaretCharacterOffsetWithin(document.getElementById('ap-' + i));
        if (enterPosition === 0) {
          newParagraphIndex = i;
        }
        else {
          newParagraphIndex = i+1;
          // TODO: handle enter in the middle of paragraph
        }
        updateParagraphs(newParagraphIndex, i, true);
        updateTextEvidenceAssociations(newParagraphIndex, true);
        return;
      }
      // Delete a paragraph if user presses backspace when it's already empty
      // Known issue: Does not move the cursor anywhere if the first paragraph is deleted
      else if (e.keyCode === 8 && $scope.activeParagraphs[i].text.trim().length === 0) {
        e.preventDefault();
        newParagraphIndex = Math.max(0, i-1);
        updateParagraphs(newParagraphIndex, i, false);
        updateTextEvidenceAssociations(i, false);
        // We are forcing a focus here instead of waiting for the watch on d3.selectAll('.text-paragraph') to trigger, 
        // because it does not trigger sometimes or has a delay. Can't tell when it is triggered immediately when it is not
        var el =document.getElementById('ap-' +newParagraphIndex);
        if (el !== null){
          el.focus();
          setEndOfContenteditable(el);
        }
        return;
        // TODO: update citedEvidence, textEvidenceAssociations
      }
      else {
        previousText = document.getElementById('ap-' + i).innerText;
        Logger.logAction($scope.userId, 'edit paragraph', 'v2', '1', 'focus', {
          proposal:$scope.selectedText.id,
          paragraph: $scope.selectedParagraph
        }, function(response) {
          if (isDebug)
            console.log('action logged: edit paragraph');          
        },function(response) {
          if (isDebug)
            console.log('error occurred during logging: edit paragraph')
        }, true);
        return;
      }
    };

    function compareString( s1, s2, splitChar ){
        if ( typeof splitChar == "undefined" ){
            splitChar = " ";
        }
        var string1 = new Array();
        var string2 = new Array();

        string1 = s1.split( splitChar );
        string2 = s2.split( splitChar );
        var diff = new Array();

        if(s1.length>s2.length){
            var long = string1;
        }
        else {
            var long = string2;
        }
        for(x=0;x<long.length;x++){
            if(string1[x]!=string2[x]){
                diff.push(string2[x]);
            }
        }

        return diff;    
    }

    function updateParagraphs(newParagraphIndex, i, add) {
      if (add) {
        $scope.activeParagraphs.splice(newParagraphIndex, 0, {text: '', timestamps: []});
        $scope.paragraphInformation.splice(newParagraphIndex, 0,{});         
        $scope.paragraphCitation.splice(newParagraphIndex, 0, []);
        $scope.editHistory.splice(newParagraphIndex, 0, []);
        updateRecommendedCitations($scope.activeParagraphs[i].text, i);
      }
      else {
        $scope.activeParagraphs.splice(i, 1);
        $scope.paragraphInformation.splice(i, 1);
        $scope.paragraphCitation.splice(i, 1);
        $scope.editHistory.splice(i, 1);
        updateRecommendedCitations($scope.activeParagraphs[newParagraphIndex].text, newParagraphIndex);
      }
      $scope.selectedParagraph = newParagraphIndex; 
//      currentParagraph = $scope.activeParagraphs[$scope.selectedParagraph];
    }

    function updateTextEvidenceAssociations(startIndex, shiftRight) {
      if (!shiftRight) {
        var deletedAssociations = [];
        textEvidenceAssociations.forEach(function(association) {
          var ids = association.targetId.split('-');
          var textId = parseInt(ids[0]);
          var paragraphId = parseInt(ids[1]);
          if (paragraphId === startIndex) {
            console.log('ready to delete citation')
            console.log(association)
            AssociationMap.removeAssociationById(association.id, function(response) {
              console.log('association with evidence ' + association.sourceId + ' deleted')
              deletedAssociations.push(association.id);
            });
          }
        });
        textEvidenceAssociations = _.reject(textEvidenceAssociations, function(association) {
          return deletedAssociations.indexOf(association.id) > -1;
        })
      }
      console.log(textEvidenceAssociations)
      // Update evidence association for all shifted paragraphs
      textEvidenceAssociations.forEach(function(association) {
        var ids = association.targetId.split('-');
        var textId = parseInt(ids[0]);
        var paragraphId = parseInt(ids[1]);

        if (textId === $scope.selectedText.id && paragraphId > startIndex) {
          var offset = shiftRight ? 1 : -1;
          var newTargetId = $scope.selectedText.id + '-' + (paragraphId + offset);
          AssociationMap.updateAssociation(association.id, association.sourceId, newTargetId);
        }
      });      
    }

    function setEndOfContenteditable(contentEditableElement) {
        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        { 
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

    function getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ( (sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    $scope.hasMadeChanges = function(i,e) {       
      $scope.savingStatus = 'unsaved';
      $scope.hasUnsavedChanges = true;
      $scope.activeParagraphs[i].text = document.getElementById('ap-' + i).innerText;
      // Hacky: relying on the assumption that the value equality test fails only when the user enters anything in the new 
      // paragraph for the firs time.
      if (document.getElementById('ap-' + i).childNodes[0].nodeValue !== '') {
        document.getElementById('ap-' + i).childNodes[0].nodeValue = '';
      }
//      previousText = currentParagraph.text;
//      currentParagraph = $scope.activeParagraphs[i];
      updateTextAge(i)
    };

    $scope.downloadText = function() {
      Logger.logAction($scope.userId, 'download proposal', 'v2', '1', 'focus', {
        length:$scope.selectedText.content.split(' ').length,
        totalProposals: $scope.texts.length
      }, function(response) {
        if (isDebug)
          console.log('action logged: download proposal');        
      });
    };

    $scope.deleteText = function() {
      Logger.logAction($scope.userId, 'initiate proposal deletion', 'v2', '1', 'focus', {
        length:$scope.selectedText.content.split(' ').length,
        totalProposals: $scope.texts.length
      }, function(response) {
        if (isDebug)
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
            return $scope.userId;            
          }          
        }
      });
  
      var target = $scope.texts;       
      modalInstance.result.then(function (deletedEntryId) {          
        Logger.logAction($scope.userId, 'proposal deleted', 'v2','1', 'focus', {
          length: $scope.selectedText.content.split(' ').length,          
          totalProposals: $scope.texts.length   
        },function(response) {
          if (isDebug)
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

    // Check every 15 seconds if there is unsaved changes; ifthere is, .
    // call this function to save the content.
    $scope.saveText = function(userInitiated) {
      $scope.savingStatus = 'saving';
      if (isDebug) {
        console.log('saving text...');
        console.log($scope.savingStatus)        
      }        

      var newContent = $scope.activeParagraphs.map(function(p) {         
        return p.text;
      }).join('\n');

      if (userInitiated) {
        Logger.logAction($scope.userId, 'save proposal', 'v2','1', 'focus', {
          proposal: $scope.selectedText.id,
          contentLength: newContent.split(' ').length
        }, function(response) {
          if (isDebug)
            console.log('action logged: save proposal');
        });
      }

      Core.postTextByUserId($scope.userId, $scope.selectedText.title, newContent, false, $scope.selectedText.id, function(response){           
        $scope.texts.forEach(function(t) {             
          if (t.id === response.data[0].id){
            t.content = newContent;
          }
        })
        $scope.hasUnsavedChanges = false;
        $scope.savingStatus = 'saved';   
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
        $scope.savingStatus = 'failed';
      });
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
      if (isDebug)
        console.log('updating evidence recommendations..');        
      $scope.loadingRecommendedEvidence = true;        

      Argument.getEvidenceRecommendation(text, $scope.collection.id, function(results) {
        $scope.recommendedEvidence = results.evidence;
        var bookmarkedEvidenceIds = $scope.evidence === null ? [] : $scope.evidence.map(function(e) { return e.id; })
        $scope.recommendedEvidence.forEach(function(e) {
          if ($scope.evidence !== null) {
            e.bookmarked = bookmarkedEvidenceIds.indexOf(e.id) > -1;
          }
          else {
            e.bookmarked = false;
          }
        })
        $scope.paragraphInformation[index].topic = results.topic;
        if (results.topic.terms !== '') {
          $scope.paragraphInformation[index].topicString = results.topic.terms.map(function(term) {
            return term[0];
          }).join(' ');
        }
        else {
          $scope.paragraphInformation[index].topicString = '';          
        }
        $scope.loadingRecommendedEvidence = false;
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
      $scope.idGenerated = false;
      $scope.loadingCollections = true;

      Core.getCollectionList(function(response) {
        $scope.collections = response.data.map(function(d) {
          return {
            id: parseInt(d.collection_id),
            name: d.collection_name,
            description: d.description,
            numPubs: d.num_pubs
          };
        });
        $scope.loadingCollections = false;
      });

      $scope.generateNewUserId = function() {
        Core.getNewUserId(function(response) {
          $scope.userId = response.data.userId;
          $scope.idGenerated = true;
        });
      };
  }]);

angular.module('v2.controllers')
  .controller('BaselineController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Argument', 'Pubmed', 'Bibtex',
    function($scope, $modal, Core, AssociationMap, Argument, Pubmed, Bibtex) {
  }]);

angular.module('focus.v2.controllers')
  .directive('paperThumbnailSidebarDirective', ['User', function(User) {

    var charWidth = 1;
    var charHeight = 1;
    var citationWidth = 20;
    var previewWidth = 35;
    var citationGroups = null;
    var tip = null;

    function computeParagraphPreviewHeight(i) {
      var paragraphs = User.activeParagraphs();
      var height = Math.floor(paragraphs[i].timestamps.length * charWidth / previewWidth) * (charHeight+1);
      return Math.max(height, 50);
    }

    function drawParagraphSelector(group) {
      group.append('rect')
        .attr('id', 'bound')
        .attr('width', previewWidth)
        .attr('height', function(d, i) {
          return computeParagraphPreviewHeight(i);
        })
        .attr('fill', 'white')
        .attr('fill-opacity', 0)
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .attr('rx', 3)
        .on('mouseenter', function(d, i) {
          if (i === User.selectedParagraph()) return;
          d3.select(this).attr('stroke', '#ccc');
        })
        .on('mouseleave', function(d, i) {
          if (i === User.selectedParagraph()) return;
          d3.select(this).attr('stroke', 'white');
        })
        .on('click', function(d, i) {
          var myElement = document.getElementById('paragraph-' + i);
          var topPos = myElement.offsetTop;         
          document.getElementById('selected-thumbnail').scrollTop = topPos;
          if (i === User.selectedParagraph()) {
            User.selectedParagraph(-1);
          }
          else {
            User.selectedParagraph(i);            
          }
        });
      }

    function updateCitationMarkers(scope) {
      if (citationGroups === null) return;
      var paragraphs = User.activeParagraphs();
      var citations = User.paragraphCitation();
      var markers = citationGroups.selectAll('.citationMarker')
        .data(function(d, i) {
          return d.map(function(c) {
            return {
              citation: c,
              groupIndex: i
            }
          });
        })
      markers.exit().remove();
      markers.enter()
        .append('rect')
        .attr('class', 'citationMarker')
        .attr('width', 10)
        .attr('height', 5)
        .attr('stroke-width', 0)
        .attr('fill', '#feb24c');

      markers
        .attr('transform', function(d, i) {
          var left = 1;
          var top = computeParagraphPreviewHeight(d.groupIndex) - (i+1) * 7;
          return 'translate(' + left + ',' + top + ')';
        })
        .on('mouseover', function(d, i) {
          var top = Math.floor(paragraphs[d.groupIndex].timestamps.length * charWidth / previewWidth) * (charHeight+1) - d.citation.index * 7;
          console.log(d)
          tip.show(d);
        })
        .on('mouseout', tip.hide)
        .on('click', function(d) {
          scope.searchTitle = d.citation.evidence.title;
          scope.searchEvidenceByTitle();    
        });
    }

    function visualize(container, totalWidth, height, scope) {
      var paragraphs = User.activeParagraphs();
      var citations = User.paragraphCitation();

      if (paragraphs === null || paragraphs === undefined || paragraphs.length === 0) return;
      var minTime = paragraphs[0].timestamps[0].getTime();
      var maxTime = 0;
      paragraphs.forEach(function(p) {
        p.timestamps.forEach(function(ts) {
          var tsm = ts.getTime();
          minTime = tsm < minTime ? tsm : minTime;
          maxTime = tsm > maxTime ? tsm : maxTime;
        })
      })

      var timeColorScale = d3.scale.linear()
        .domain([minTime, maxTime])
        .range(['#e9f5ef', '#2ca25f']);

      container.selectAll('g').remove();
      var freshness = container.selectAll('.freshness')
        .data(paragraphs)
        .enter()
        .append('g')
        .attr('class', 'freshness')
        .attr('transform', function(d, i) {
          var top = 20;
          for (var j = 0; j < i; ++j) {
            top += computeParagraphPreviewHeight(j) + 5;
//            top += Math.floor(paragraphs[j].timestamps.length * charWidth / previewWidth) * (charHeight+1) + 5;
          }
          return 'translate(20, ' + top + ')';
        });

      freshness.selectAll('rect')
        .data(function(d) {
          return d.timestamps;
        })
        .enter()
        .append('rect')
        .attr('width', charWidth)
        .attr('height', charHeight)
        .attr('transform', function(d, i) {
          var left = (i * charWidth) % previewWidth;
          var top = Math.floor(i / (previewWidth / charWidth)) * (charHeight+1);
          return 'translate(' + left + ', ' + top + ')';          
        })
        .attr('fill', function(d, i) {
          return timeColorScale(d.getTime());
        });

      drawParagraphSelector(freshness);

      citationGroups = container.selectAll('.citation')
        .data(citations)
        .enter()
        .append('g')
        .attr('class', 'citation')
        .attr('transform', function(d, i) {
          var top = 20;
          for (var j = 0; j < i; ++j) {
            top += computeParagraphPreviewHeight(j) + 5;
//            top += Math.floor(paragraphs[j].timestamps.length * charWidth / previewWidth) * (charHeight+1) + 5;
          }
          return 'translate(0, ' + top + ')';
        });

      citationGroups.append('rect')
        .attr('rx', 2)
        .attr('width', 12)
        .attr('height', function(d, i) { return computeParagraphPreviewHeight(i); })
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr('fill', 'white');

      tip = d3.tip()
        .attr('class', 'd3-tip')
        .direction('n')
        .offset([-10, 0])
        .html(function(d) {
          return d.citation.evidence.title;
        })
      citationGroups.call(tip);

      updateCitationMarkers(scope);
    }
    
    return function(scope, element, attrs) {
      visualize(d3.select(element[0]), 60, 600, scope);
      scope.$watch(function () {
          return User.paragraphCitation();
      },
      function (newVal) {
        if (typeof newVal !== 'undefined') {
          updateCitationMarkers(scope);
        }
      }, true);
    };
  
  }]);


angular.module('focus.v2.controllers')
  .directive('paperThumbnailDirective', ['User', function(User) {

    // Construct "word" objects
    function processWordsDistance(content) {

      // TODO: substitute this with user selections in focus mode
      var focusKeywords = ['evaluate', 'interaction'];

      var words = content.split('\n')
        .map(function(paragraph) {
          var contents = paragraph.split(' ').map(function(word) {
            return {
              text: word,
              distanceToKeyword: focusKeywords.indexOf(word) > -1 ? 0 : 10,
              totalCharBefore: 0,
              length: word.length
            };
          });
          return {
            length: 0,
            prevParagraphLength: 0,
            contents: contents,
          }
        });

      // Compute distance to keywords
      words.forEach(function(paragraph) {
        var contents = paragraph.contents;
        for (var i = 0; i < contents.length; ++i) {
          var word = contents[i];
          if (word.distanceToKeyword === 0) {
            [1,2,3,4,5].forEach(function(offset) {
              if (i-offset >= 0) {
                contents[i-offset].distanceToKeyword = offset;
              }
              if (i+offset < paragraph.contents.length) {
                contents[i+offset].distanceToKeyword = offset;
              }
            })
          }
        }
      });

      // Assign length to words
      words.forEach(function(paragraph) {
        var accumulatedChar = 0;
        var contents = paragraph.contents;
        contents.forEach(function(word) {
          if (word.distanceToKeyword < 6) {
            word.length = word.length * 3;
          }
          word.totalCharBefore = accumulatedChar;
          accumulatedChar += word.length + 1;
        });
        paragraph.length = accumulatedChar;
      });

      var accumParaLength = 0;
      for (var i = 0; i < words.length; ++i) {
        words[i].prevParagraphLength = accumParaLength;
        accumParaLength += words[i].length;
      }

      return words;
    }

    function visualizeTextAge(container) {
      container.selectAll('.paragraph').remove();
      var paragraphs = User.activeParagraphs();

      if (paragraphs === null || paragraphs === undefined || paragraphs.length === 0) return;
      var minTime = paragraphs[0].timestamps[0].getTime();
      var maxTime = 0;
      paragraphs.forEach(function(p) {
        p.timestamps.forEach(function(ts) {
          var tsm = ts.getTime();
          minTime = tsm < minTime ? tsm : minTime;
          maxTime = tsm > maxTime ? tsm : maxTime;
        })
      })

      var textColorScale = d3.scale.linear()
        .domain([minTime, maxTime])
        .range(['#e9f5ef', '#2ca25f']);
      var textLinearScale = d3.scale.linear()
        .domain([minTime, maxTime])
        .range([0, 1]);

      var paragraphGroups = container.selectAll('.paragraph')
        .data(User.activeParagraphs())
        .enter()
        .append('p')
        .attr('class', 'paragraph')
        .attr('id', function(d, i) { return 'paragraph-' + i; })
        .style('line-height', '120%');

      paragraphGroups
        .selectAll('.word-text')
        .data(function(d) { return d.text.split('').map(function(currentChar, j) {
          return {
            text: currentChar,
            timestamp: d.timestamps[j]
          }
        }); })
        .enter()
        .append('span')
        .attr('class', 'word-text')
        .text(function(d) {
          return d.text;
        })
        .style('color', function(d) { return textColorScale(d.timestamp.getTime()); })
/*        .style('background', function(d) {
          return textLinearScale(d.timestamp.getTime()) <= 0.01 ? '#d6d6d6' : '#fff';                              
        }) */
        .style('font-size', function(d) {
          return d.distanceToKeyword > 6 ? '6px' : '12px';                    
        })

      return;
    }

    function visualizeKeywordsMarkup() {
      container.selectAll('.paragraph').remove();
      var paragraphGroups = container.selectAll('.paragraph')
        .data(words)
        .enter()
        .append('p')
        .attr('class', 'paragraph')
        .style('line-height', '90%');

      paragraphGroups
        .selectAll('.word-text')
        .data(function(d) { return d.contents; })
        .enter()
        .append('span')
        .attr('class', 'word-text')
        .text(function(d) { return d.text + ' '; })
/*        .style('opacity', function(d) {
          return d.distanceToKeyword > 6 ? 0.3 : (1 - 0.1 * d.distanceToKeyword);          
        }) */
        .style('color', function(d) {
          var index = focusKeywords.indexOf(d.text);
          if (index >= 0) {
            return termColorMap(index);  
          }
          else {        
            return d.distanceToKeyword > 6 ? '#ccc' : 'black';      
          }   
        })
        .style('font-size', function(d) { return d.distanceToKeyword > 6 ? '6px' : '12px'; })
        .style('background', function(d) { return d.distanceToKeyword > 6 ? '#ccc' : '#fff'; })
        .on('mouseover', function(d) {
          if (d.distanceToKeyword > 6) return;
          d3.select(this).style('font-size', '14px');
        })
        .on('mouseout', function(d) {
          if (d.distanceToKeyword > 6) return;
          if ($scope.selectedTerms.indexOf(d.text) === -1) {
            d3.select(this).style('font-size', '12px');
          };
        })
        .on('click', function(d) {
          if ($scope.selectedTerms.indexOf(d.text) > -1) {
            $scope.selectedTerms = _.without($scope.selectedTerms, d.text);
          }
          else {
            var textTerms = $scope.terms.map(function(t) { return t.term; });
            if (textTerms.indexOf(d.text) > -1) {
              $scope.selectedTerms.push(d.text);        
            }    
          }
          d3.selectAll('.word-text')
            .filter(function(d) {
              return d.distanceToKeyword <= 6;
            })
            .style('font-size', function(d) {
              return $scope.selectedTerms.indexOf(d.text) > -1 ? '14px' : '12px';
            })
            .style('font-weight', function(d) {
              return $scope.selectedTerms.indexOf(d.text) > -1 ? 800 : 400;              
            });
          $scope.updateTermTopicOrdering();
        });
    }

    function visualize(container, width, height, scope) {
      if (scope.proposals === null) return;
//      var words = processWordsDistance(scope.proposals[0].content);
      visualizeTextAge(container);
    }
    
    return function(scope, element, attrs) {
      visualize(d3.select(element[0]), 600, 600, scope);
    };    
  
  }]);


angular.module('focus.v2.controllers')
  .directive('evidenceRecommendationDirective', ['Paper', function(Paper) {
    // WIP
    // Implementation plan: 
    // 1. Server side: Add an API that returns the number of 
    // 2. Vis: need information: 1) # of bookmarked evidence that cites the current paper; 2) # of bookmarked evidence that is cited
    // by the current paper; 3) total # of cites / citations among the dataset
    // Need to be able to get the year range for all the references and citations given a list of recommendations
    function randomIntFromInterval(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    function generateRandomRefsCites(evidenceYear) {
      var numRefs = randomIntFromInterval(15, 40);
      var numCites = randomIntFromInterval(10, 200);
      var refs = [];
      var cites = [];
      for (var i = 0; i < numRefs; ++i) {
        refs.push({
          metadata: {DATE: randomIntFromInterval(1990, evidenceYear-1)},
          bookmarked: randomIntFromInterval(0, 5)
        })
      }
      for (var j = 0; j < numCites; ++j) {
        cites.push({
          metadata: {DATE: randomIntFromInterval(evidenceYear+1, 2016)},
          bookmarked: randomIntFromInterval(0, 5)
        })
      }
      return {
        refs: refs,
        cites: cites
      }
    }

    function countDates(eArray, targetMap, minYear, maxYear, evidence) {
      for (var i = minYear; i <= maxYear; ++i) {
        targetMap.total[i] = 0;
        targetMap.bookmarked[i] = 0;
      }
      eArray.forEach(function(e) {
        if (typeof e.metadata == 'string') {
          e.metadata = JSON.parse(e.metadata);
        }
        var date = getEvidenceDate(e);
        if (date === 0 || date < minYear || date > maxYear) return;
        targetMap.total[date] += 1;
        if (e.bookmarked === 0) {
          targetMap.bookmarked[date] += 1;
        }
      })
      return _.max(_.values(targetMap.total));
    }

    function getEvidenceDate(evidence) {
      var evidenceYear = 0;
      if (evidence.metadata.DATE !== undefined) {
        evidenceYear = parseInt(evidence.metadata.DATE);
      }
      else if (evidence.metadata.YEAR !== undefined) {
        evidenceYear = parseInt(evidence.metadata.YEAR);        
      }
      return evidenceYear;
    }

    function drawBar(svg, dateScale, paperCountScale, paperMap, type, color, offset) {
      var years = _.keys(paperMap).map(function(d) {
        return parseInt(d);
      })
      svg.selectAll('.' + type + '-line')
        .data(years)
        .enter()
        .append('line')
        .attr('class', type + '-line')
        .attr('x2', function(d) { return dateScale(d) + offset; })
        .attr('x1', function(d) { return dateScale(d) + offset; })
        .attr('y2', function(d) { return paperCountScale(paperMap[d]); })
        .attr('y1', function(d) { return paperCountScale(0); })
        .attr('stroke', color)
        .attr('stroke-width', 4);
      return;
    }

    function drawPointer(svg, svgHeight) {
      svg.append('line')
        .attr('id', 'pointer')
        .attr('x1', -1)
        .attr('x2', -1)
        .attr('y1', 0)
        .attr('y2', svgHeight)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    }

    function updatePointer(svg, x, dateScale, citationInfo, evidenceYear) {
      svg.select('#pointer')
        .attr('x1', x)
        .attr('x2', x);
      var infoText = '';
      if (x !== -1) {
        year = Math.ceil(dateScale.invert(x));
        if (year < evidenceYear) {
          totalPaper = citationInfo.references.total[year];          
          bookmarkedPaper = citationInfo.references.bookmarked[year]; 
          infoText += 'References from ' + year + ':';
          infoText += totalPaper + ' (bookmarked ' + bookmarkedPaper + ')';     
        }
        else if (year > evidenceYear) {
          totalPaper = citationInfo.citations.total[year];
          bookmarkedPaper = citationInfo.citations.bookmarked[year];
          infoText += 'Citations from ' + year + ':';
          infoText += totalPaper + ' (bookmarked ' + bookmarkedPaper + ')';
          svg.selectAll('.cite-total-circle').attr('r', 1);
          svg.selectAll('.cite-bookmarked-circle').attr('r', 1);  
          svg.select('#cite-total-circle-' + year).attr('r', 2);          
          svg.select('#cite-bookmarked-circle-' + year).attr('r', 2);     
        }
        else {
          infoText += 'Paper published in ' + year
        }
      }
      svg.select('#dateInfo')
        .text(infoText);
    }

    function drawLine(svg, dateScale, paperCountScale, paperMap, type, color, fillArea) {
      var line = d3.svg.line()
        .x(function(d) { return dateScale(d); })
        .y(function(d) { return paperCountScale(paperMap[d]); })
        .interpolate("linear");
      var years = _.keys(paperMap).map(function(d) {
        return parseInt(d);
      })
      svg.selectAll('.' + type + '-circle')
        .data(years)
        .enter()
        .append('circle')
        .attr('class', type + '-circle')
        .attr('id', function(d) {
          return type + '-circle-' + d ;
        })
        .attr('r', 1)
        .attr('stroke', 'steelblue')
        .attr('fill', 'white')
        .attr('cx', function(d) {
          return dateScale(d);
        })
        .attr('cy', function(d) {
          return paperCountScale(paperMap[d]);
        });

      svg.append('path')      
        .datum(years)  
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none')
      if (fillArea) {
        var area = d3.svg.area()
          .y0(paperCountScale(0))
          .x(function(d) { return dateScale(d); })
          .y1(function(d) { return paperCountScale(paperMap[d]); })
        svg.append('path')      
          .datum(years)  
          .attr('d', area)
          .attr('fill', color);
        }
      }

    return function(scope, element, attrs) {
      var svgWidth = 300;
      var svgHeight = 50;
      var svg = d3.select(element[0]).append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight + 20)
        .attr('transform', 'translate(10, 0)');


      var citeInfo = {
        citations: {
          total: {},
          bookmarked: {},
          // The keys should come in the same order in citations and references
          topics: {}
        },
        references: {
          total:{},
          bookmarked: {},
          topics: {}
        }
      };

      var evidenceYear = getEvidenceDate(scope.e);
      var refs = Paper.getReferencesForPaper(scope.e.id);
      var cites = Paper.getCitationsForPaper(scope.e.id);
      var maxCountCite = countDates(cites, citeInfo.citations, Math.min(2016, evidenceYear+1), 2016, evidenceYear);
      var maxCountRef = countDates(refs, citeInfo.references, 1985, Math.max(1985, evidenceYear-1), evidenceYear);
      var dateScale = d3.scale.linear()
        .domain([1985, 2016])
        .range([5, svgWidth-5]);
      var paperCountScale = d3.scale.pow().exponent(1)
        .domain([Math.max(maxCountCite, maxCountRef), 0])
        .range([10, svgHeight-10]);
      // Now we can start visualizing...
      drawPointer(svg, svgHeight);
      drawLine(svg, dateScale, paperCountScale, citeInfo.citations.total, 'cite-total', 'grey', false);
      drawBar(svg, dateScale, paperCountScale, citeInfo.references.total, 'ref-total', 'grey', -2);
      drawLine(svg, dateScale, paperCountScale, citeInfo.citations.bookmarked, 'cite-bookmarked', 'steelblue', true);
      drawBar(svg, dateScale, paperCountScale, citeInfo.references.bookmarked, 'ref-bookmarked', 'steelblue', 2);
      svg.on('mousemove', function(d) {
        updatePointer(svg, d3.mouse(this)[0], dateScale, citeInfo, evidenceYear);
      });
      svg.on('mouseout', function(d) {
        updatePointer(svg, -1);
      })
      svg.selectAll('#this-paper')
        .data([scope.e])
        .enter()
        .append('circle')
        .attr('r', 4)
        .attr('fill', 'crimson')
        .attr('cx', dateScale(evidenceYear))
        .attr('cy', paperCountScale(0))
        .attr('uib-tooltip', 'Hello')
        .attr('tooltip-append-to-body', true)
        .attr('tooltip-placement', 'right');

      svg.append('text')
        .attr('id', 'dateInfo')
        .attr('transform', 'translate(20, ' + (svgHeight + 1) + ')')
        .text(function(d) {
          return '';
        })
        .attr('font-size', 10);
    };
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
    return _.without(_.uniq(_.flatten(topics.map(function(t) {
      var termTuples = t.terms;
      return termTuples.map(function(tuple) {
        return tuple.term;
      })
    }))), 'other terms');
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
        if (term === 'other terms') continue;
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
    $templateCache.put('core/introduction.html',
        "");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/landing copy.html',
        "<page-meta-data status-code=\"200\">\n\t<title>{{ 'meta_title_core' }}</title>\n\t<meta name=\"description\" content=\"{{ 'meta_description_core'}}\"/>\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_core' }}\"/>\n</page-meta-data>\n\n<div data-ng-controller=\"CoreCtrl\">\n    <ng-include src=\"'core/partials/version-picker.html'\"></ng-include>\n</div>\n");
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
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"textsInfo.title\"/>\n  <label for=\"content\" style=\"margin-top:10px\">Option 1: </label><span> Copy the contents of your proposal draft below</span>  \n  <textarea class=\"form-control\" rows=\"10\" id=\"content\" ng-model=\"textsInfo.content\"></textarea>\n\n<!--  <table class=\"table\">\n    <tr ng-repeat=\"c in concepts | filter:isAssociated('concept')\">\n      <td>{{c.term}}</td>\n    </tr>\n  </table> -->\n  <label style=\"margin-top:10px\">Option 2: </label><span> Upload your proposal as a plain text file <b>(uploaded texts will override contents entered above)</b></span>    \n  <div class=\"container\" style=\"width:100%;margin:10px;\">\n    <div class=\"row\">\n      <div class=\"col-md-8\" style=\"padding-top:4px;\"><input type=\"file\" id=\"textfile-input\"></div>\n      <div class=\"col-md-4\">\n        <button class=\"btn btn-primary btn-sm\" ng-click=\"processTextFile()\">Upload</button>\n      </div>\n    </div>\n  </div>\n  <div ng-if=\"fileError\">\n    <div class=\"alert alert-danger\">\n      <p>No file chosen or error occurred during file processing.</p>\n    </div>\n  </div>\n  <div ng-if=\"uploadStatus==='uploaded-success'\">\n    <div class=\"alert alert-success\">\n      Proposal loaded!\n    </div>\n  </div>\n<!--  <select ng-model=\"selectedConcept\" ng-options=\"c.term for c in concepts\">\n    <option value=\"\">-- choose concept --</option>\n  </select>\n  <button class=\"btn btn-xs\" ng-click=\"addAssociatedConceptLocally()\">Add</button> -->\n<!--  <select class=\"form-control\" ng-model=\"selectedEvidence\" ng-options=\"e.title for e in evidence\">\n    <option value=\"\">-- choose evidence --</option>\n  </select> \n  <button class=\"btn btn-xs\">Add</button> -->\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/uploadBibtex.html',
        "<div class=\"modal-header\">\n    <h3>Upload Bibtex File</h3>\n</div>\n<div class=\"modal-body\">\n  <div style=\"margin:10px\"><input type=\"file\"id=\"bibtex-input\"></div>\n  <div><button class=\"btn btn-default\" ng-click=\"processBibtexFile()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\"></div>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Close</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/uploadBibtexModal.html',
        "<div class=\"modal-header\">\n    <h3>Upload Bibtex File</h3>\n</div>\n<div class=\"modal-body\">\n  <div ng-switch on=\"uploadStatus\" ng-if=\"collectionPostProcess === 'notStarted'\">\n    <div ng-switch-when=\"beforeUpload\" class=\"container\" style=\"width:100%;margin:10px;\">\n      <div>\n        <p>Choose what to do with the uploaded bibtex entries</p>\n        <label>\n          <input type=\"radio\" ng-model=\"userChoices.seedNewCollection\" ng-value=\"false\">\n          Bookmark the uploaded bibtex entries\n        </label><br/>\n        <label>\n          <input type=\"radio\" ng-model=\"userChoices.seedNewCollection\" ng-value=\"true\">\n          Create a new collection from the uploaded bibtex entries\n        </label><br/>\n      </div>\n      <div ng-if=\"!userChoices.seedNewCollection\" class=\"alert alert-info\">\n        <p>Entries contained in the file will appear in the \"Bookmarked\" column, as well as becoming available during recommendation and in the Explore view.</p>\n      </div>\n      <div ng-if=\"userChoices.seedNewCollection\">\n        <div class=\"alert alert-info\">\n          <p>A document collection will be created which contain not only entries from the bibtex file but also related publications (e.g. those that have cited or share similar keywords with the uploaded entries). </p>\n        </div>\n        <div class=\"alert alert-danger\">\n          <p>This feature is experimental and will take much longer time than the first option. For now please email hua_guo@brown.edu. to obtain more information before proceeding with this option.</p>\n        </div>\n        <label>\n          <input type=\"radio\" ng-model=\"userChoices.whatCollection\" value=\"existing\">\n          Use an existing collection with id:\n          <input type=\"text\" name=\"collectionId\" ng-model=\"newCollection.id\">\n        </label>\n        <label>\n          <input type=\"radio\" ng-model=\"userChoices.whatCollection\" value=\"new\">\n          Create a new collection with name:\n          <input type=\"text\" name=\"collectionName\" ng-model=\"newCollection.name\">\n        </label>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-8\" style=\"padding-top:4px;\"><input type=\"file\"id=\"bibtex-input\"></div>\n        <div class=\"col-md-4\">\n          <button class=\"btn btn-primary btn-sm\" ng-click=\"processBibtexFile()\">Upload</button>\n        </div>\n      </div>\n    </div>\n    <div ng-switch-when=\"uploading\">\n      <div ng-switch on=\"lastUploadResult\">\n        <div ng-switch-when=\"success\" class=\"alert alert-success\">\n          <i>{{lastUploadedEvidence}}</i> successfully processed.\n        </div>\n        <div ng-switch-when=\"failed\" class=\"alert alert-danger\">\n          <i>{{lastUploadedEvidence}}</i> was not uploaded due to server error.\n        </div>\n        <div ng-switch-when=\"duplicate\" class=\"alert alert-warning\">\n          <i>{{lastUploadedEvidence}}</i> has already been bookmarked or uploaded in the past.\n        </div>\n      </div>\n      <div class=\"alert alert-info\">\n        <p>Processing: <i>{{currentEvidence}}</i> </p>\n        <p>Entries processed: {{evidenceIndex}}</p>\n        <p>Estimated remaining time: {{esmitatedTimeRemaining}} seconds</p>\n      </div>\n    </div>\n    <div ng-switch-when=\"uploaded-success\">\n      <div class=\"alert alert-success\">\n        <p>All {{totalToUpload}} entries processed.</p>\n        <div ng-if=\"!seedNewCollection\">\n          <p>{{totalMatchesFound}} entries already exist in the collection and have been bookmarked.</p>\n          <p>{{totalPersonalEntries}} entries are not found in the collection and have been added as personal references.</p>\n        </div>\n        <p>Found and added {{totalAbstractFound}} abstracts from PubMed.</p>\n      </div>\n    </div>\n    <div ng-switch-when=\"uploaded-failed\">\n      <div class=\"alert alert-danger\">\n        <p>Encountered more than 10 upload failure. Upload aborted. Please notify admin at hua_guo@brown.edu about the issue if it persists.</p>\n      </div>\n    </div>\n  </div>\n  <div ng-switch on=\"collectionPostProcess\" class='alert alert-info' ng-if=\"collectionPostProcess !== 'notStarted'\">\n    <div ng-switch-when=\"augmentation\">\n      <p>Retrieving and storing related publications from PubMed...</p>\n    </div>\n    <div ng-switch-when=\"createModel\">\n      <p>Creating Latent Dirichlet Model...</p>\n    </div>\n    <div ng-switch-when=\"loadModel\">\n      <p>Saving evidence topic assignments...</p>\n    </div>\n    <div ng-switch-when=\"cacheTopics\">\n      <p>Caching topic distributions...</p>\n    </div>\n    <div ng-switch-when=\"done\">\n      <p>Document collection {{newCollection.name}} created! You'll now be able to select the collection from the landing page.</p>\n    </div>\n  </div>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"ok()\">Close</button>\n</div>");
}]);
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

angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v1/landing.v1.html',
        "<div class=\"center row\" id=\"v1\">\n  <!-- List of saved arguments -->\n  <div class=\"main col-md-10\">\n    <div class=\"panel\" id=\"texts-col\">\n      <div class=\"header\">\n        <span>Arguments</span>\n      </div>\n      <div class=\"body row\">\n        <div class=\"index col-md-3\">\n          <div style=\"height:90%\"> \n            <table class=\"table\">\n              <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id, success: showCitingTexts && cites(t, selectedEntry['evidence'])}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n                <td ng-click=\"selectEntry(t, 'text')\">\n                  <p>{{t.title}}</p>\n                  <svg class=\"topic-info\" id=\"topic-info-{{t.id}}\" width=\"150\" height=\"25\"></svg>\n                  <div ng-if=\"selectedEntry['text']===t\" style=\"margin-left:80%\">\n                    <div class=\"btn-group btn-group-xs\" role=\"group\">\n                      <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n                    </div>  \n                  </div>\n                </td>\n              </tr>\n            </table>\n          </div>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-default\" ng-click=\"addTextEntry()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">Add new argument</button>\n          </div>\n        </div>\n        <!-- Text area for current argument -->\n        <div class=\"content col-md-5\">\n          <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n          </textarea>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"extractTerms()\">Extract terms</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"recommendCitations()\">Recommend citations</button>\n          </div>\n        </div>\n        <!-- Display of extracted keywords -->\n        <div class=\"side col-md-4\">\n          <div style=\"height:90%;padding:20px\">\n            <div class=\"col-md-6 padding-sm\" ng-repeat=\"t in terms | filter:filterTerms()\">\n              <button class=\"btn btn-default btn\" ng-class=\"{'btn-primary': termSelected(t)}\" ng-click=\"selectTerm(t)\">{{t.term}}</td>\n            </div>\n          </div>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-default\" ng-click=\"addTerm()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">  Add highlighted texts as new term</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedTerms.length===0\" ng-click=\"searchEvidenceForTerms()\">Search evidence</button>\n          </div>\n        </div>   \n      </div>\n    </div>\n    <!-- List of evidence -->\n    <div class=\"panel\" id=\"evidence-col\">\n      <div class=\"loading\" ng-if=\"loadingEvidence\">\n        <div class=\"loader-container\">\n          <div class=\"loader\"></div>\n          <div class=\"loading-text\"><p>{{loadingStatement}}</p></div>\n        </div>\n      </div>\n      <div class=\"header\">\n        <span>Evidence</span>\n      </div>\n      <div class=\"body row\">\n        <div class=\"col-md-3\" id=\"topics\">\n          <div ng-repeat=\"t in topics\" class=\"topic-container\" ng-class=\"{selected: $index == selectedTopic}\" ng-click=\"selectTopic($index)\" ng-attr-id=\"topic-container-{{$index+1}}\">\n            <p style=\"margin:0\"><span ng-repeat=\"w in t\">{{w}}  </span></p>\n            <p style=\"margin-left:90%\"><img  src=\"/static/img/text-icon.svg\" style=\"width:15px; height:15px\"></img><span> {{countEvidenceWithTopic($index)}}</span></p>\n          </div>\n        </div>\n        <div class=\"col-md-5\" id=\"documents\">\n          <div>\n            <div class=\"animate-repeat document-entry\" ng-repeat=\"e in evidence | filter:filterEvidence() | orderBy:evidenceOrder\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id, associated: isAssociated(e, selectedEntry['text'])}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n               <div ng-click=\"selectEntry(e, 'evidence')\" style=\"width:90%;display:inline-block;float:left\">\n                 <p><input type=\"checkbox\" ng-model=\"evidenceSelectionMap[e.id]\"><span> {{e.title}}</span></p>\n                 <p>\n                   <span><i>Search term occurrence:</i></span>\n                   <span ng-repeat=\"t in selectedTerms\"><b>{{t.term}}</b>: {{countSearchTermOccurrence(t.term, e.abstract)}}  </span>\n                 </p>\n               </div>\n               <div style=\"width:10%;display:inline-block\">\n                 <div ng-if=\"evidenceSourceMap[e.id] === 1\">\n                   <img  src=\"/static/img/link-icon.svg\" style=\"width:15px; height:15px\"></img>\n                   <span>{{countTextsReferencingEvidence(e)}}</span>\n                 </div>\n                 <div ng-if=\"evidenceSourceMap[e.id] === 0\"><span class=\"label label-default\">Search result</span></div> \n               </div>\n               <div style=\"clear:both\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"col-md-4\" id=\"details\">\n          <div ng-if=\"selectedEntry['evidence']!==null\">\n            <div class=\"row\" style=\"margin:10px\">\n              <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n            </div>\n            <p><b>Authors</b>: {{selectedEntry['evidence'].metadata.AUTHOR}}</p>\n            <p><b>Affiliation</b>: {{selectedEntry['evidence'].metadata.AFFILIATION}}</p>\n            <p><b>Publication date</b>: {{selectedEntry['evidence'].metadata.DATE}}</p>\n            <p><b>Abstract</b>:</p>\n            <span ng-repeat=\"w in selectedWords track by $index\" ng-class=\"{'is-search-term': isSearchTerm(w), 'is-topic-term': isTopicTerm(w)}\">{{w}} </span>\n          </div>\n        </div>\n      </div>\n      <div class=\"footer\">\n        <div class=\"btn-group btn-group-sm\" role=\"group\">\n          <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n          <button class=\"btn btn-default\">Edit</button>\n          <button class=\"btn btn-primary\" ng-disabled=\"selectedEntry['evidence']===null||selectedEntry['text']===null\" ng-click=\"updateEvidenceAssociation()\" title=\"Mark this publication as relevant to the selected article\">{{evidenceTextAssociated ? 'Mark as irrelevant' : 'Mark as relevant'}}</button>\n          <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"sidebar col-md-2\">\n    <div class=\"panel\">\n      <div class=\"header\">\n        <span>Control panel</span>\n      </div>\n      <div class=\"body\">\n        <div style=\"margin:10px 0 10px 0\">\n          <h5>Import references</h5>\n          <div>\n            <div style=\"margin:10px\"><input type=\"file\"id=\"bibtex-input\"></div>\n            <div style=\"margin:10px\"><button class=\"btn btn-primary btn-xs\" ng-click=\"processBibtexFile()\">Upload</button></div>\n          </div>\n        </div>\n        <div style=\"margin:10px 0 10px 0\">\n          <h5>Export</h5>\n          <div class=\"row\" style=\"margin:0 10px 0 10px\">\n            <button class=\"btn btn-default btn-xs col-md-5\">Documents</button>\n            <span class=\"col-md-1\"></span>\n            <button class=\"btn btn-default btn-xs col-md-5\">References</button>\n            <span class=\"col-md-1\"></span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>");
}]);
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
    $templateCache.put('core/v2/explore.v2.html',
        "<div id=\"main-header\" class=\"row\">\n  <div class=\"col-md-2\" style=\"margin-top:6px;margin-bottom:6px\">\n    <span style=\"font-size:18px; cursor:pointer\" ui-sref=\"v2\">ThoughtFlow<sup>alpha</sup></span>\n  </div>\n  <div class=\"col-md-10 text-right\" style=\"margin-top:4px;\">\n    <span class=\"main-header-text\">User ID: </span>\n    <span style=\"font-weight:lighter;padding-right:15px;\">{{userId}}</span>\n    <span class=\"main-header-text\">Document collection: </span>\n    <span style=\"font-weight:lighter\">{{collection.name}}</span>\n    <button class=\"btn btn-default\" ui-sref=\"v2.focus({userId: userId, collectionId: collection.id})\" style=\"margin-left:30px\">Write</button>\n  </div>\n</div>\n\n<div class=\"center row v2\" id=\"explore\">\n  <div class=\"loading\" ng-if=\"loadingEvidence\">\n    <div class=\"loader-container\">\n      <div class=\"loader\"></div>\n      <div class=\"loading-text\"><p>{{loadingStatement}}</p></div>\n    </div>\n  </div>\n\n  <div class=\"row\" id=\"options\" style=\"margin:20px 20px 20px 50px\">\n    <div class=\"col-md-2\">\n      <span>Search for term: </span>\n      <ui-select ng-model=\"selected.searchTerm\" on-select=\"selectSearchTerm($item)\">\n          <ui-select-match>\n              <span ng-bind=\"$select.selected.term\"></span>\n          </ui-select-match>\n          <ui-select-choices repeat=\"t in (terms | filter: $select.search | limitTo: 100) track by t.origIndex\">\n              <span ng-bind=\"t.term\"></span>\n          </ui-select-choices>\n      </ui-select>\n    </div>\n    <div class=\"col-md-5\">\n      <span>Search for paper: </span>\n      <div class=\"row\">\n        <div class=\"input-group\">\n            <input type=\"text\" class=\"form-control\" placeholder=\"Search for...\" ng-model=\"searchTitle\">\n            <span class=\"input-group-btn\">\n              <button class=\"btn btn-default\" type=\"button\" ng-click=\"searchEvidenceByTitle()\">Search</button>\n            </span>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-5\">\n<!--      <div class=\"row\" style=\"margin-top:20px;\">\n        <ui-select ng-model=\"selected.searchTitle\" on-select=\"selectSearchTitle($item)\">\n            <ui-select-match placeholder=\"Use the search to the left to get a list of relevant titles\">\n                <span ng-bind=\"$select.selected.title\"></span>\n            </ui-select-match>\n            <ui-select-choices repeat=\"t in (candidateEvidence | filter: $select.search) track by t.id\">\n                <span ng-bind=\"t.title\"></span>\n            </ui-select-choices>\n        </ui-select>\n      </div> -->\n    </div>\n  </div>\n\n  <div id=\"vis\">\n    <div id=\"headers\" class=\"row\" style=\"width:760px;margin:30px 0px 0px 75px;\">\n      <h4 class=\"col-md-6\">Terms ({{numTerms}} total)</h4>\n      <h4 class=\"col-md-6\">Topics ({{numTopics}} total)</h4>\n    </div>\n    <div class=\"control\">\n      <button uib-tooltip=\"Scroll term list down\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\"\n        class=\"btn btn-default btn-xs\" ng-click=\"showNextTerms()\"><img class=\"btn-img-default\" src=\"/static/img/caret-down-icon.png\"></button>\n      <button uib-tooltip=\"Scroll term list up\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\"\n        class=\"btn btn-default btn-xs\" ng-click=\"showPrevTerms()\"><img class=\"btn-img-default\" src=\"/static/img/caret-up-icon.png\"></button>\n      <button uib-tooltip=\"Clear selected terms\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\"\n        class=\"btn btn-default btn-xs\" ng-click=\"clearSelectedTerms()\"><img class=\"btn-img-default\" src=\"/static/img/eraser-icon.png\"></button>\n      <button uib-tooltip=\"Reorder based on selected terms\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\"\n        class=\"btn btn-default btn-xs\" ng-click=\"updateTermTopicOrdering(true, true)\"><img class=\"btn-img-default\" src=\"/static/img/shuffle-icon.png\"></button>\n    </div>\n    <svg id=\"topic-term-dist\" style=\"width:1850px;height:700x;\">\n      <svg id=\"thumbnail-sidebar\" paper-thumbnail-sidebar-directive></svg>\n    </svg>\n    <div style=\"width:260px;height:580px;position:absolute;top:260px;left:800px;overflow-y:auto;\">\n      <div style=\"border-radius: 5px;border: #ccc solid 1px;padding: 5px;margin-bottom:5px\" ng-repeat=\"topicTuple in candidateEvidenceTopics\">\n        <p class=\"search-entry\" ng-repeat=\"e in candidateEvidence | filter:evidenceHasTopic(topicTuple[0])\" ng-class=\"{active: hover || e.id == selectedEvidence.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectSearchTitle(e)\">{{e.title}}</p>\n      </div>\n    </div>\n    <div id=\"proposal-thumbnail\" style=\"width:600px;height:580px;position:absolute;top:280px;left:1150px;\">\n      <div id=\"selected-thumbnail\" style=\"width:400px;height:580px;overflow-y:auto;\" paper-thumbnail-directive></div>\n    </div>\n    <div class=\"control\">\n      <p style=\"margin:10px 0 10px 5px;font-size:16px\"><span style=\"font-variant:small-caps\">Selected topic:</span> <span style=\"padding:3px;\" ng-repeat=\"t in selectedTopic.terms | limitTo:10\" id=\"topic-term-$index\" class=\"selected-topic-term\" ng-class=\"{dark:$index%2==0,active:hover}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectTermToFilterDocuments(t.term, $index)\">    {{t.term}}   </span><span style=\"font-size:12px;font-weight:500\">(# of documents: {{selectedTopic.evidenceCount}})</span></p>\n    </div>\n  </div>\n\n  <div id=\"evidence-col container\" style=\"width:95%;margin-left:50px\">\n    <div class=\"loading\" ng-if=\"loadingTopicEvidence\">\n      <div class=\"loader-container\">\n        <div class=\"spinner\">\n          <div class=\"rect1\"></div>\n          <div class=\"rect2\"></div>\n          <div class=\"rect3\"></div>\n          <div class=\"rect4\"></div>\n          <div class=\"rect5\"></div>\n        </div>\n      </div>\n    </div>\n    <uib-tabset>\n      <uib-tab heading=\"Documents with the selected topic\" active=\"true\">    \n        <div class=\"panel panel-default\">\n          <div class=\"panel-body body\">\n            <div class=\"row\">\n              <div class=\"col-md-6\" id=\"documents\">\n                <div ng-if=\"selectedTopic===null\" style=\"margin-top:170px\">\n                  <p class=\"text-center\" ><i>Select a topic to view associated documents here.</i></p>\n                </div>\n                <div>\n                  <div class=\"animate-repeat document-entry row evidence\" ng-repeat=\"e in evidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id, bookmarked: e.bookmarked}\" id=\"evidence-{{$index}}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectEvidence(e)\">\n                    <div class=\"col-md-9\">\n                      <p>\n                        <span ng-switch on=\"e.bookmarked\">\n                          <img ng-switch-when=\"false\" class=\"btn-img-default\" src=\"/static/img/bookmark-no-icon.png\" \n                            uib-tooltip=\"Not bookmarked\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"flipBookmark(e, 'selected topic')\" style=\"cursor:pointer;\"/>\n                          <img ng-switch-when=\"true\" class=\"btn-img-default\" src=\"/static/img/bookmark-yes-icon.png\"\n                            uib-tooltip=\"Bookmarked\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"flipBookmark(e, 'selected topic')\" style=\"cursor:pointer;\"/>\n                        </span>                    \n    <!--                    <input type=\"checkbox\" ng-model=\"e.bookmarked\" ng-click=\"updateBookmark(e)\"> -->\n                        <span style=\"font-weight:300\"> {{e.title}}</span>\n                      </p>\n                    </div>\n                    <div class=\"col-md-2\">\n                       <svg id=\"doc-decorator-$index\" class=\"doc-decorator\" style=\"width:100px;height:30px;\"></svg>\n                    </div>\n                    <div class=\"col-md-1\">\n                      <img class=\"btn-img-default\" ng-if=\"selectedEvidence.id===e.id && userService.selectedParagraph()!==-1\" src=\"/static/img/link-icon.svg\"\n                      uib-tooltip=\"Cite\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"citeEvidence(e, 'topic')\"\n                      style=\"cursor:pointer; cursor:hand;\"/>\n                    </div>\n    <!--                <div class=\"col-md-1\">\n                       <div ng-if=\"evidenceSourceMap[e.id] === 1\">\n                         <img  src=\"/static/img/link-icon.svg\" style=\"width:15px; height:15px\"></img>\n                         <span>{{countTextsReferencingEvidence(e)}}</span>\n                       </div>\n                       <div ng-if=\"evidenceSourceMap[e.id] === 0\"><span class=\"label label-default\">Search result</span></div> \n                    </div> -->\n                  </div>\n                </div>\n              </div>\n              <div class=\"col-md-6\" id=\"details\">\n                <div ng-if=\"selectedEvidence===null\" style=\"margin-top:170px\">\n                  <p class=\"text-center\" ><i>Select a document to view its metadata here.</i></p>\n                </div>\n                <div ng-if=\"selectedEvidence!==null\">\n                  <div class=\"row\" style=\"margin:10px\">\n                    <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n                  </div>\n                  <p>\n                    <b><span class=\"small-cap-text\">Authors</span></b>: \n                    <span class=\"thin-text\">{{selectedEvidence.metadata.AUTHOR}}</span>\n                  </p>\n                  <p>\n                    <b><span class=\"small-cap-text\">Affiliation</span></b>: \n                    <span class=\"thin-text\">{{selectedEvidence.metadata.AFFILIATION}}</span>\n                  </p>\n                  <p>\n                    <b><span class=\"small-cap-text\">Publication date</span></b>: \n                    <span class=\"thin-text\">{{selectedEvidence.metadata.DATE}}</span>\n                  </p>\n                  <p>\n                    <b><span class=\"small-cap-text\">Journal</span></b>: \n                    <span class=\"thin-text\">{{selectedEvidence.metadata.JOURNAL}}</span>\n                  </p>\n                  <p\n                  ><b><span class=\"small-cap-text\">Abstract</span></b>:</p>\n                  <span style=\"font-size:13px\" ng-repeat=\"w in selectedWords track by $index\" ng-class=\"{'is-topic-term': isTopicTerm(w)}\">{{w}} </span>\n                </div>\n              </div>\n            </div>\n          </div>\n    <!--      <div class=\"panel-footer\">\n            <div class=\"btn-group btn-group-sm\" role=\"group\">\n              <button class=\"btn btn-primary\" ng-disabled=\"selectedEvidence===null\" ng-click=\"bookmarkEvidence(selectedEvidence)\" title=\"Bookmark this publication\">Bookmark</button>\n              <button class=\"btn btn-danger\" ng-disabled=\"selectedEvidence===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n            </div>\n          </div> -->\n        </div>\n      </uib-tab>\n      <uib-tab>  \n        <uib-tab-heading>\n          <span>Citations / References of the selected document</span>\n          <span class=\"label label-pill label-default\" uib-tooltip=\"bookmarked / total # of documents\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\">{{selectedEvidenceCounts.relatedBookmarked}}/{{selectedEvidenceCounts.relatedTotal}}</span>\n        </uib-tab-heading>\n        <div class=\"panel panel-default\">\n          <div class=\"panel-body body\">\n            <div class=\"row\">\n              <div class=\"col-md-6\" id=\"documents\">\n                <div ng-if=\"selectedEvidence===null\" style=\"margin-top:170px\">\n                  <p class=\"text-center\" ><i>Select a document to view its references and citations here.</i></p>\n                </div>\n                <div ng-if=\"relatedEvidence.length===0\" style=\"margin-top:170px\">\n                  <p class=\"text-center\" ><i>No references or citations available for the selected evidence.</i></p>\n                </div>\n                <div>\n                  <div class=\"animate-repeat document-entry row\" ng-repeat=\"e in relatedEvidence\" ng-class=\"{active: hover || e.evidence.id == selectedRelatedEvidence.id, bookmarked: e.evidence.bookmarked}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectRelatedEvidence(e.evidence)\">\n                    <div class=\"col-md-9\">\n                      <p>\n                        <span ng-switch on=\"e.evidence.bookmarked\">\n                          <img ng-switch-when=\"false\" class=\"btn-img-default\" src=\"/static/img/bookmark-no-icon.png\" \n                            uib-tooltip=\"Not bookmarked\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"flipBookmark(e.evidence, 'selected document')\" style=\"cursor:pointer;\"/>\n                          <img ng-switch-when=\"true\" class=\"btn-img-default\" src=\"/static/img/bookmark-yes-icon.png\"\n                            uib-tooltip=\"Bookmarked\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"flipBookmark(e.evidence, 'selected document')\" style=\"cursor:pointer;\"/>\n                        </span>                    \n                        <span style=\"font-weight:300\"> {{e.evidence.title}}</span>\n                      </p>\n                    </div>\n                    <div class=\"col-md-2\">\n                      <span ng-switch on=\"e.relation\">\n                        <span class=\"label label-success\" ng-switch-when=\"citation\">citation</span>\n                        <span class=\"label label-info\" ng-switch-when=\"reference\">reference</span>\n                      </span>                        \n                    </div>\n                    <div class=\"col-md-1\">\n                      <img class=\"btn-img-default\" ng-if=\"selectedRelatedEvidence.id===e.evidence.id && User.selectedParagraph()!==-1\" src=\"/static/img/link-icon.svg\"\n                      uib-tooltip=\"Cite\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"citeEvidence(e.evidence, 'topic')\"\n                      style=\"cursor:pointer; cursor:hand;\"/>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class=\"col-md-6\" id=\"details\">\n                <div ng-if=\"selectedRelatedEvidence===null\" style=\"margin-top:170px\">\n                  <p class=\"text-center\" ><i>Select a document to view its metadata here.</i></p>\n                </div>\n                <div ng-if=\"selectedRelatedEvidence!==null\">\n                  <div class=\"row\" style=\"margin:10px\">\n                    <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n                  </div>\n                  <p>\n                    <b><span class=\"small-cap-text\">Authors</span></b>: \n                    <span class=\"thin-text\">{{selectedRelatedEvidence.metadata.AUTHOR}}</span>\n                  </p>\n                  <p>\n                    <b><span class=\"small-cap-text\">Affiliation</span></b>: \n                    <span class=\"thin-text\">{{selectedRelatedEvidence.metadata.AFFILIATION}}</span>\n                  </p>\n                  <p>\n                    <b><span class=\"small-cap-text\">Publication date</span></b>: \n                    <span class=\"thin-text\">{{selectedRelatedEvidence.metadata.DATE}}</span>\n                  </p>\n                  <p>\n                    <b><span class=\"small-cap-text\">Journal</span></b>: \n                    <span class=\"thin-text\">{{selectedRelatedEvidence.metadata.JOURNAL}}</span>\n                  </p>\n                  <p\n                  ><b><span class=\"small-cap-text\">Abstract</span></b>:</p>\n                  <span style=\"font-size:13px\" ng-repeat=\"w in selectedWords track by $index\">{{w}} </span>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </uib-tab>\n    </uib-tabset>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/focus.v2.html',
        "<div id=\"main-header\" class=\"row\">\n  <div class=\"col-md-2\" style=\"margin-top:6px;margin-bottom:6px\">\n    <span style=\"font-size:18px; cursor:pointer\" ui-sref=\"v2\">ThoughtFlow<sup>alpha</sup></span>\n  </div>\n  <div class=\"col-md-10 text-right\" style=\"margin-top:4px;\">\n    <span class=\"main-header-text\">User ID: </span>\n    <span style=\"font-weight:lighter;padding-right:15px;\">{{userId}}</span>\n    <span class=\"main-header-text\">Document collection: </span>\n    <span style=\"font-weight:lighter\">{{collectionName}}</span>\n    <button class=\"btn btn-default\" ui-sref=\"v2.explore({userId: userId, collectionId: collection.id})\" style=\"margin-left:30px\">Explore</button>\n  </div>\n</div>\n\n<div class=\"row v2\" id=\"focus\" style=\"height:900px;padding:15px\">\n  <div class=\"loading\" ng-if=\"loadingTexts\">\n    <div class=\"loader-container\">\n      <div class=\"loader\"></div>\n      <div class=\"loading-text\"><p>{{loadingStatement}}</p></div>\n    </div>\n  </div>\n  <div class=\"col-md-2\" id=\"argument-list\" style=\"border-bottom: solid 1px #ccc;height:1014px;overflow-y:auto\">\n    <h4>Proposals</h4>\n    <table class=\"table\">\n      <tr ng-repeat=\"t in texts\" ng-class=\"{active: hover || t.id == selectedText.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n        <td ng-click=\"selectText(t)\">\n          <p>{{t.title}}</p>\n          <svg class=\"topic-info\" id=\"topic-info-{{t.id}}\" width=\"150\" height=\"25\"></svg>\n          <div ng-if=\"selectedText===t\" style=\"margin-left:70%\">\n            <div class=\"btn-group btn-group-xs\" role=\"group\">\n              <a download=\"{{selectedText.title}}.txt\" ng-href=\"{{proposalUrl}}\"><img style=\"width:20px; height:20px\"src=\"/static/img/download-icon.png\"/></a>\n              <a ng-click=\"deleteText()\"><img style=\"width:20px; height:20px\"src=\"/static/img/trash-icon.svg\"/></a>\n            </div>  \n          </div>\n        </td>\n      </tr>\n    </table>\n    <div class=\"btn-group btn-group-xs\" role=\"group\">\n      <button class=\"btn btn-default\" ng-click=\"addTextEntry()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">Add new proposal</button>\n    </div>\n  </div>\n  <div class=\"col-md-7\" style=\"border-left:solid 1px #ccc;border-bottom: solid 1px #ccc;height:1014px;overflow-y:auto\">\n    <div>\n      <h4 style=\"display:inline-block\">{{selectedText.title}}</h4>\n      <div style=\"display:inline-block;margin-left:40px\" ng-switch on=\"savingStatus\"\n        uib-tooltip=\"Changes are auto-saved every 5 seconds\"\n        tooltip-placement=\"right\" tooltip-trigger=\"mouseenter\"\n      >\n        <div ng-switch-when=\"saved\">\n          <button class=\"btn btn-default btn-xs disabled\"><span style=\"padding:0px 5px 0px 5px\">Saved</span></button>\n        </div>\n        <div ng-switch-when=\"unsaved\">\n          <button class=\"btn btn-primary btn-xs\" ng-click=\"saveText(true)\"><span style=\"padding:0px 5px 0px 5px\">Save</span></button>\n        </div>\n        <div ng-switch-when=\"saving\">\n          <button class=\"btn btn-default btn-xs disabled\"><span style=\"padding:0px 5px 0px 5px\">Saving...</span></button>\n        </div>\n        <div ng-switch-when=\"failed\">\n          <button class=\"btn btn-danger btn-xs disabled\"><span style=\"padding:0px 5px 0px 5px\">Error occurred while saving!</span></button>\n        </div>\n      </div>\n    </div>\n    <div ng-repeat=\"p in activeParagraphs\">\n      <p class=\"text-paragraph\" contenteditable=\"true\" ng-keydown=\"checkEnter($index, $event)\" ng-keyup=\"hasMadeChanges($index, $event)\" ng-click=\"selectParagraph($index, 'text')\" class=\"activeParagraph\" id=\"ap-{{$index}}\" style=\"outline:0\"><span class=\"thin-text\" style=\"font-size:15px\">{{p.text}}</span></p>\n      <div style=\"width:15%;height:150px;display:inline-block;float:right\">\n        <div>\n          <p style=\"font-size:10px\" ng-click=\"selectParagraph($index, 'topic')\">Topic: {{paragraphInformation[$index].topicString}}</p>\n          <br/>\n          <p style=\"font-size:10px\">Cited: <span ng-repeat=\"c in paragraphCitation[$index] | orderBy:'index'\">[<a ng-click=\"showCitation(c)\">{{c.index+1}}</a>] </span></p>\n        </div>\n      </div>\n      <div style=\"clear:both\"></div>        \n    </div>\n  </div>\n  <div class=\"col-md-3\" style=\"border-left: solid 1px #ccc;border-bottom: solid 1px #ccc;height:1014px\">\n    <div class=\"container\" style=\"width:100%;\">\n      <div class=\"row\">\n        <div class=\"col-md-7\">\n          <h4>Citations</h4>\n        </div>\n        <div class=\"col-md-5\">\n          <div style=\"padding-top:5px\">\n            <button class=\"btn btn-default btn-xs\" ng-click=\"openUploadBibtexWindow()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\"> Upload bibtex file\n          </div>\n        </div>\n      </div>\n    </div>\n    <uib-tabset>\n      <uib-tab heading=\"Recommended\" active=\"citationTabs['recommended'].active\">\n        <div class=\"loading\" ng-if=\"loadingRecommendedEvidence\">\n          <div class=\"loader-container\">\n            <div class=\"spinner\">\n              <div class=\"rect1\"></div>\n              <div class=\"rect2\"></div>\n              <div class=\"rect3\"></div>\n              <div class=\"rect4\"></div>\n              <div class=\"rect5\"></div>\n            </div>\n          </div>\n        </div>\n        <div id=\"recommendedEvidence\" class=\"citation-container\">\n          <div class=\"animate-repeat document-entry row\" ng-repeat=\"e in recommendedEvidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectEvidence(e, 'recommended', true)\" evidence-recommendation-directive>\n            <div class=\"col-md-10\">\n              <p class=\"citation-entry\"><span>{{$index+1}}. </span><span class=\"thin-text\">{{e.title}}</span></p>\n            </div>          \n            <div class=\"col-md-2\" style=\"margin:10px 0 0 0\">\n              <img ng-if=\"!e.bookmarked\" class=\"btn-img-default\" src=\"/static/img/bookmark-no-icon.png\" \n                uib-tooltip=\"Not in your bookmark\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"flipBookmark(e, 'recommendation')\" style=\"cursor:pointer;\"/>\n              <img ng-if=\"e.bookmarked\" class=\"btn-img-default\" src=\"/static/img/bookmark-yes-icon.png\"\n                uib-tooltip=\"From your bookmark\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"flipBookmark(e, 'recommendation')\" style=\"cursor:pointer;\"/>\n              <div ng-if=\"selectedEvidence===e\" && selectedParagraph!==-1>\n                <img class=\"btn-img-default\" src=\"/static/img/link-icon.svg\"\n                  uib-tooltip=\"Cite\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"citeEvidence(e, 'recommended')\"\n                  style=\"cursor:pointer;\"/>\n              </div>  \n              <div ng-if=\"selectedEvidence===e\">\n                <img style=\"width:20px; height:20px\" src=\"/static/img/right-arrows-icon.svg\" ui-sref=\"v2.explore({userId: userId, collectionId: collection.id})\" uib-tooltip=\"Explore\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"logStateTransition()\" style=\"cursor:pointer;\"/>\n              </div>  \n            </div>\n          </div>\n        </div>        \n      </uib-tab>\n      <uib-tab heading=\"Cited\" active=\"citationTabs['cited'].active\">\n        <div id=\"citedEvidence\" class=\"citation-container\">\n          <div class=\"animate-repeat document-entry row\" ng-repeat=\"e in citedEvidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\" ng-click=\"selectEvidence(e, 'cited', true)\">\n            <div class=\"col-md-10\">\n              <p class=\"citation-entry\"><span>{{$index+1}}. </span><span class=\"thin-text\">{{e.title}}</span></p>\n            </div>\n            <div class=\"col-md-2\" style=\"margin:10px 0 0 0\">\n              <div ng-switch on=\"selectedEvidenceCiteStatus\" ng-if=\"selectedEvidence===e && selectedParagraph !== -1\">\n                <div ng-switch-when=\"uncited\">\n                <img class=\"btn-img-default\" src=\"/static/img/link-icon.svg\"\n                  uib-tooltip=\"Cite\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"citeEvidence(e, 'cited')\"\n                  style=\"cursor:pointer; cursor:hand;\"/>\n                </div>\n                <div ng-switch-when=\"cited\" class=\"btn-group btn-group-xs\" role=\"group\">\n                  <button class=\"btn btn-danger\" ng-class=\"{disabled: selectedParagraph===-1}\" ng-click=\"unciteEvidence(e, 'cited')\"\n                    uib-tooltip=\"Uncite\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\"\n                    ><img class=\"btn-img-default\" src=\"/static/img/uncite-icon.png\"</button>\n                </div>\n              </div>\n            </div>                        \n          </div>\n        </div>        \n      </uib-tab>\n      <uib-tab heading=\"Bookmarked\" active=\"citationTabs['bookmarked'].active\">\n        <div id=\"bookmarkedEvidence\" class=\"citation-container\">\n          <div class=\"container animate-repeat document-entry\" ng-repeat=\"e in evidence\" ng-class=\"{active: hover || e.id == selectedEvidence.id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n            <div class=\"row\" ng-click=\"selectEvidence(e, 'bookmarked', true)\">\n              <p class=\"col-md-10 citation-entry\"><span>{{$index+1}}. </span><span class=\"thin-text\">{{e.title}}</span></p>\n              <div class=\"col-md-2\" style=\"padding-top:5px\">\n                <div ng-if=\"e.abstract.length===0\">\n                  <img style=\"width:15px; height:15px\"src=\"/static/img/warning-icon.png\"\n                    uib-tooltip=\"No abstract found.\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\"/>\n                </div>\n              <div ng-if=\"selectedEvidence===e\">\n                <img style=\"width:20px; height:20px\" src=\"/static/img/right-arrows-icon.svg\" ui-sref=\"v2.explore({userId: userId, collectionId: collection.id})\" uib-tooltip=\"Explore\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"logStateTransition()\" style=\"cursor:pointer;\"/>\n              </div>\n                <div ng-if=\"selectedEvidence===e && selectedParagraph !== -1\" class=\"btn-group btn-group-xs\" role=\"group\">\n                  <img class=\"btn-img-default\" src=\"/static/img/link-icon.svg\"\n                    uib-tooltip=\"Cite\" tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" ng-click=\"citeEvidence(e, 'bookmarked')\"\n                    style=\"cursor:pointer; cursor:hand;\"/>\n                </div>  \n              </div>\n            </div>          \n          </div>\n        </div>            \n      </uib-tab>\n    </uib-tabset>\n    <div id=\"details\" style=\"margin:10px;height:329px\">\n      <h4>Selected citation</h4>\n      <div ng-if=\"selectedEvidence===null\" style=\"300px\">\n        <p style=\"width:70%;margin:auto;padding-top:100px\">\n          <i>Please select a citation to see its details.</i>\n        </p>\n      </div>\n      <div ng-if=\"selectedEvidence!==null\" style=\"overflow-y:scroll;height:300px;\">\n        <div class=\"row\" style=\"margin:10px\">\n          <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n        </div>\n        <p>\n          <b><span class=\"small-cap-text\">Authors</span></b>: \n          <span class=\"thin-text\">{{selectedEvidence.metadata.AUTHOR}}</span>\n        </p>\n        <p>\n          <b><span class=\"small-cap-text\">Affiliation</span></b>: \n          <span class=\"thin-text\">{{selectedEvidence.metadata.AFFILIATION}}</span>\n        </p>\n        <p>\n          <b><span class=\"small-cap-text\">Publication date</span></b>: \n          <span class=\"thin-text\">{{selectedEvidence.metadata.DATE}}</span>\n        </p>\n        <p><b><span class=\"small-cap-text\">Abstract</span></b>:</p>\n        <span style=\"font-size:13px\" ng-repeat=\"w in selectedWords track by $index\" ng-class=\"{'is-topic-term': isTopicTerm(w)}\">{{w}} </span>\n      </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/landing.v2.html',
        "<div ui-view=\"MainView\">\n  <div class=\"v2\" id=\"init-info\">\n    <div style=\"width:90%;height:80%\" class=\"loading\" ng-if=\"loadingCollections\">\n      <div>\n        <div style=\"margin:75px 40px 0px 250px\" class=\"spinner\">\n          <div class=\"rect1\"></div>\n          <div class=\"rect2\"></div>\n          <div class=\"rect3\"></div>\n          <div class=\"rect4\"></div>\n          <div class=\"rect5\"></div>\n        </div>\n        <p style=\"margin:20px 0px 0px 170px;color:#ddd;font-variant:small-caps\">Loading document collection list...</p>\n      </div>\n    </div>\n    <div>\n      <div class=\"row\" style=\"margin:10px\">\n        <div class=\"col-md-2\" style=\"padding-top:5px\"><label>User ID</label></div>\n        <div class=\"col-md-10\"><input type=\"text\" class=\"form-control\" ng-model=\"userId\"></input></div>\n      </div>\n      <div class=\"row\" style=\"margin:0px 0px 0px 3px; padding:0px\">\n        <div class=\"col-md-2\">{{newUserId}}</div>\n        <div class=\"col-md-10\"><button class=\"btn btn-link\" style=\"outline:none\" ng-click=generateNewUserId()>New User? Click here for an ID.</button></div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-2\"></div>\n        <div class=\"col-md-10\" ng-if=\"idGenerated\">\n          <div class=\"alert alert-success\" style=\"margin:0px 25px 0px 20px;padding:5px\">\n            <p>User ID created! <b>Please save the ID</b> - you will need it to continue working on your proposal(s) next time. If you need to recover it, please email hua_guo@brown.edu.<p>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\" style=\"margin:10px\">\n        <div class=\"col-md-2\" style=\"padding-top:5px\"><label>Collection</label></div>\n        <div class=\"col-md-10\">      \n          <ui-select ng-model=\"selected.collection\" on-select=\"selectCollection($item)\">\n              <ui-select-match placeholder=\"Select a collection\">\n                  <span ng-bind=\"$select.selected.name\"></span>\n              </ui-select-match>\n              <ui-select-choices repeat=\"t in (collections | filter: $select.search) track by t.id\">\n                  <span style=\"font-size:15px\" ng-bind=\"t.name\"></span></br>\n                  <b style=\"font-size:12px\"># of publications contained: <span ng-bind=\"t.numPubs\"></span></b></br>\n                  <i style=\"font-size:12px\">Source: <span ng-bind=\"t.description\"></span></i>\n              </ui-select-choices>\n          </ui-select>\n        </div>\n      </div>\n      <div style=\"margin:40px auto auto 20px\">\n        <div uib-tooltip=\"Please enter a user ID and select a collection before proceeding\"\n            tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" tooltip-enable=\"userId === '' || selected.collection.id === undefined\"\n            style=\"display:inline-block\">\n          <button class=\"btn btn-primary\" \n            ng-disabled=\"userId === '' || selected.collection.id === undefined\" \n            ui-sref-active=\"btn-success\" ui-sref=\"v2.explore({userId: userId, collectionId: selected.collection.id})\" >Explore literature collection</button>\n        </div>\n        <div uib-tooltip=\"Please enter a user ID and select a collection before proceeding\"\n            tooltip-placement=\"top\" tooltip-trigger=\"mouseenter\" tooltip-enable=\"userId === '' || selected.collection.id === undefined\"\n            style=\"display:inline-block\">\n          <button class=\"btn btn-primary\" \n            ng-disabled=\"userId === '' || selected.collection.id === undefined\" \n            ui-sref-active=\"btn-success\" ui-sref=\"v2.focus({userId: userId, collectionId: selected.collection.id})\">Write</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"v2\" style=\"width: 50%;margin: 50px auto auto auto;\">\n    <p><a href=\"https://github.com/tacitia/ThoughtFlow/wiki/Overview---for-users\" target=\"_blank\">What is this tool?</a></p>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/view-picker.v2.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.v2.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.v2.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v3/view-picker.v3.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);