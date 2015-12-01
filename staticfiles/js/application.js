var myAwesomeJSVariable = "I'm so awesome!!";

angular.module('mainModule', [
  'restangular', 
  'ui.router', 
  'ui.bootstrap', 
  'ngPageHeadMeta',
  'authentication',
  'exploreModule',
  'focusModule',
  'coreModule',
  'v1Module',
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
angular
  .module('exploreModule', [
    'explore.controllers',
    'angularFileUpload'
  ]);

angular
  .module('explore.controllers', ['angularFileUpload']);
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
                    }
                }
            })       
            .state('v2.explore', {
                url: "/explore",
                views: {
                    'MainView@v2': {
                        templateUrl: 'core/v2/explore.v2.html',
                        controller: 'ExploreController'
                    }
                }
            })
            .state('v2.focus', {
                url: "/focus",
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
angular
  .module('focusModule', [
    'focus.controllers',
    'angularFileUpload'
  ]);

angular
  .module('focus.controllers', ['angularFileUpload', 'modalModule']);
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
angular.module('explore.controllers')
  .controller('ExploreController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed',
    function($scope, $modal, Core, AssociationMap, Pubmed) {

    var data = Core.getAllDataForUser(1, function(response) {
      var texts = response.data.texts;
      var concepts = response.data.concepts;
      var evidence = response.data.evidence;
      var conceptAssociations = AssociationMap.getAssociationsOfType('concept', 'concept');
      console.log(conceptAssociations);
      var formattedAssociations = [];
      visualizeGraph(texts, concepts, evidence, formattedAssociations);
    }, function(errorResponse) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(errorResponse);
    });

    $scope.selectedConcepts = [];

    // Get co-occurred terms and publications with those labels
    $scope.getNeighborConcepts = function () {

      Pubmed.findNeighborConcepts($scope.selectedConcepts, 1, function(response) {
        console.log(response);
      }, function(errorRespone) {

      });
    };

    function visualizeGraph(texts, concepts, evidence, conceptAssociations) {

      var canvas = d3.select('#graph')
        .style('width', 400)
        .style('height', 400);
      console.log(concepts);

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
  function getAssociatedEvidence() {

  }

  // Get evidence that are judged as most relevant to the piece of argument
  function getEvidenceRecommendation(text, successFn, errorFn) {
      $http.post('/api/v1/service/getEvidenceRecommendation/', {
        text: text
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

  function initialize(userId) {
    Core.getAssociationMap(userId, function(response) {
      associationMap = response.data;
      console.log('>> User association map retrieved...');
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
        successFn();
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
    var Core = {
      deleteEntry: deleteEntry,
      postTextByUserId: postTextByUserId,
      postConceptByUserId: postConceptByUserId,
      postEvidenceByUserId: postEvidenceByUserId,
      postAssociationByUserId: postAssociationByUserId,
      deleteAssociationByUserId: deleteAssociationByUserId,
      deleteBookmark: deleteBookmark,
      getAllDataForUser: getAllDataForUser,
      getAssociationMap: getAssociationMap,
      getEvidenceCollection: getEvidenceCollection,
      getEvidenceTextTopicsForUser: getEvidenceTextTopicsForUser
    };

    return Core;

    ////////////////////

    function getAllDataForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-data/' + userId + '/')
       .then(successFn, errorFn);
    }

    function getAssociationMap(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-associations/' + userId + '/')
        .then(successFn, errorFn);
    }


    function postTextByUserId(userId, title, content, isNew, textId, successFn, errorFn) {
      console.log(textId);
      return $http.post('/api/v1/data/texts/', {
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
      return $http.get('/api/v1/data/collection/' + collectionId + '/')
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

    function postAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn)      
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
angular.module('focus.controllers')
  .controller('FocusController', ['$scope', '$modal', 'Core', 'AssociationMap',
    function($scope, $modal, Core, AssociationMap) {

    var data = Core.getAllDataForUser(1, function(response) {
      $scope.texts = response.data.texts;
      $scope.concepts = response.data.concepts;
      $scope.evidence = response.data.evidence;
    }, function(response) {
      console.log('server error when retrieving data for user 1');
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
        }
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

      modalInstance.result.then(function (newEntries) {
        $scope.evidence = $scope.evidence.concat(newEntries); 
        console.log($scope.evidence);   
      });      
    }


    // TODO: fill in
    $scope.updateTextEntry = function() {
    }

    // TODO: fill in
    $scope.updateConceptEntry = function() {
    }

    // TODO: fill in
    $scope.updateEvidenceEntry = function() {
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
            $scope.associatedIds['concept'] = AssociationMap.getAssociatedIds('text', 'concept', $scope.selectedEntry['text'].id);
            $scope.associatedIds['evidence'] = AssociationMap.getAssociatedIds('text', 'evidence', $scope.selectedEntry['text'].id);
            break;
          }
          case 'concept': {
            $scope.associatedIds['text'] = AssociationMap.getAssociatedIds('concept', 'text', $scope.selectedEntry['concept'].id);
            $scope.associatedIds['evidence'] = AssociationMap.getAssociatedIds('concept', 'evidence', $scope.selectedEntry['concept'].id);
            break;
          }
          case 'evidence': {
            $scope.associatedIds['text'] = AssociationMap.getAssociatedIds('evidence', 'text', $scope.selectedEntry['evidence'].id);
            $scope.associatedIds['concept'] = AssociationMap.getAssociatedIds('evidence', 'concept', $scope.selectedEntry['evidence'].id);
            break;
          }
        }
      }
    };

    function updateAssociationSource(source) {
      _.forOwn($scope.filterSwitches, function(value, key) {
        $scope.filterSwitches[key] = source !== '' && source !== key; 
      });
      $scope.associationSource = source;
    };

    $scope.associationInactive = function(source) {
      return $scope.selectedEntry[source]===null || ($scope.associationSource !== '' && $scope.associationSource !== source)
    };

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

  }]);

angular.module('mainModule')
    .controller('CoreCtrl', ['CoreFactory', function (CoreFactory) {
        
    }]);
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
  .controller('DeleteModalController', ['$scope', '$modalInstance', 'Core', 'id', 'content', 'type', 'userId',
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
    $scope.concepts = concepts;
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
    $templateCache.put('errors/404.html',
        "<page-meta-data status-code=\"404\">\n\t<title>{{ 'meta_title_404' | translate }}</title>\n\t<meta name=\"description\" content=\"{{ meta_description_404 }}\">\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_404' | translate }}\">\n</page-meta-data>\n\n<div>\n    <h1>Page was not found.</h1>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/landing.html',
        "<page-meta-data status-code=\"200\">\n\t<title>{{ 'meta_title_core' }}</title>\n\t<meta name=\"description\" content=\"{{ 'meta_description_core'}}\"/>\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_core' }}\"/>\n</page-meta-data>\n\n<div data-ng-controller=\"CoreCtrl\">\n    <ng-include src=\"'core/partials/version-picker.html'\"></ng-include>\n</div>\n");
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
        "<div class=\"center row\" id=\"v1\">\n  <!-- List of saved arguments -->\n  <div class=\"main col-md-10\">\n    <div class=\"panel\" id=\"texts-col\">\n      <div class=\"header\">\n        <span>Arguments</span>\n      </div>\n      <div class=\"body row\">\n        <div class=\"index col-md-3\">\n          <div style=\"height:90%\"> \n            <table class=\"table\">\n              <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id, success: showCitingTexts && cites(t, selectedEntry['evidence'])}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n                <td ng-click=\"selectEntry(t, 'text')\">\n                  <p>{{t.title}}</p>\n                  <svg class=\"topic-info\" id=\"topic-info-{{t.id}}\" width=\"150\" height=\"25\"></svg>\n                  <div ng-if=\"selectedEntry['text']===t\" style=\"margin-left:80%\">\n                    <div class=\"btn-group btn-group-xs\" role=\"group\">\n                      <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n                    </div>  \n                  </div>\n                </td>\n              </tr>\n            </table>\n          </div>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-default\" ng-click=\"addTextEntry()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">  Add new argument</button>\n          </div>\n        </div>\n        <!-- Text area for current argument -->\n        <div class=\"content col-md-5\">\n          <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n          </textarea>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"extractTerms()\">Extract terms</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"recommendCitations()\">Recommend citations</button>\n          </div>\n        </div>\n        <!-- Display of extracted keywords -->\n        <div class=\"side col-md-4\">\n          <div style=\"height:90%;padding:20px\">\n            <div class=\"col-md-6 padding-sm\" ng-repeat=\"t in terms | filter:filterTerms()\">\n              <button class=\"btn btn-default btn\" ng-class=\"{'btn-primary': termSelected(t)}\" ng-click=\"selectTerm(t)\">{{t.term}}</td>\n            </div>\n          </div>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button class=\"btn btn-default\" ng-click=\"addTerm()\"><img style=\"width:20px; height:20px\"src=\"/static/img/plus-icon.png\">  Add highlighted texts as new term</button>\n            <button class=\"btn btn-default\" ng-disabled=\"selectedTerms.length===0\" ng-click=\"searchEvidenceForTerms()\">Search evidence</button>\n          </div>\n        </div>   \n      </div>\n    </div>\n    <!-- List of evidence -->\n    <div class=\"panel\" id=\"evidence-col\">\n      <div class=\"loading\" ng-if=\"loadingEvidence\">\n        <div class=\"loader-container\">\n          <div class=\"loader\"></div>\n          <div class=\"loading-text\"><p>{{loadingStatement}}</p></div>\n        </div>\n      </div>\n      <div class=\"header\">\n        <span>Evidence</span>\n      </div>\n      <div class=\"body row\">\n        <div class=\"col-md-3\" id=\"topics\">\n          <div ng-repeat=\"t in topics\" class=\"topic-container\" ng-class=\"{selected: $index == selectedTopic}\" ng-click=\"selectTopic($index)\" ng-attr-id=\"topic-container-{{$index+1}}\">\n            <p style=\"margin:0\"><span ng-repeat=\"w in t\">{{w}}  </span></p>\n            <p style=\"margin-left:90%\"><img  src=\"/static/img/text-icon.svg\" style=\"width:15px; height:15px\"></img><span> {{countEvidenceWithTopic($index)}}</span></p>\n          </div>\n        </div>\n        <div class=\"col-md-5\" id=\"documents\">\n          <div>\n            <div class=\"animate-repeat document-entry\" ng-repeat=\"e in evidence | filter:filterEvidence() | orderBy:evidenceOrder\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id, associated: isAssociated(e, selectedEntry['text'])}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n               <div ng-click=\"selectEntry(e, 'evidence')\" style=\"width:90%;display:inline-block;float:left\">\n                 <p><input type=\"checkbox\" ng-model=\"evidenceSelectionMap[e.id]\"><span> {{e.title}}</span></p>\n                 <p>\n                   <span><i>Search term occurrence:</i></span>\n                   <span ng-repeat=\"t in selectedTerms\"><b>{{t.term}}</b>: {{countSearchTermOccurrence(t.term, e.abstract)}}  </span>\n                 </p>\n               </div>\n               <div style=\"width:10%;display:inline-block\">\n                 <div ng-if=\"evidenceSourceMap[e.id] === 1\">\n                   <img  src=\"/static/img/link-icon.svg\" style=\"width:15px; height:15px\"></img>\n                   <span>{{countTextsReferencingEvidence(e)}}</span>\n                 </div>\n                 <div ng-if=\"evidenceSourceMap[e.id] === 0\"><span class=\"label label-default\">Search result</span></div> \n               </div>\n               <div style=\"clear:both\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"col-md-4\" id=\"details\">\n          <div ng-if=\"selectedEntry['evidence']!==null\">\n            <div class=\"row\" style=\"margin:10px\">\n              <button class=\"btn btn-default btn-xs col-md-12\" ng-class=\"{'btn-success': showCitingTexts}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"toggleShowCitingTexts()\">Who cited me?</button>\n            </div>\n            <p><b>Authors</b>: {{selectedEntry['evidence'].metadata.AUTHOR}}</p>\n            <p><b>Affiliation</b>: {{selectedEntry['evidence'].metadata.AFFILIATION}}</p>\n            <p><b>Publication date</b>: {{selectedEntry['evidence'].metadata.DATE}}</p>\n            <p><b>Abstract</b>:</p>\n            <span ng-repeat=\"w in selectedWords track by $index\" ng-class=\"{'is-search-term': isSearchTerm(w), 'is-topic-term': isTopicTerm(w)}\">{{w}} </span>\n          </div>\n        </div>\n      </div>\n      <div class=\"footer\">\n        <div class=\"btn-group btn-group-sm\" role=\"group\">\n          <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n          <button class=\"btn btn-default\">Edit</button>\n          <button class=\"btn btn-primary\" ng-disabled=\"selectedEntry['evidence']===null||selectedEntry['text']===null\" ng-click=\"updateEvidenceAssociation()\" title=\"Mark this publication as relevant to the selected article\">{{evidenceTextAssociated ? 'Mark as irrelevant' : 'Mark as relevant'}}</button>\n          <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"sidebar col-md-2\">\n    <div class=\"panel\">\n      <div class=\"header\">\n        <span>Control panel</span>\n      </div>\n      <div class=\"body\">\n        <div style=\"margin:10px 0 10px 0\">\n          <h5>Import references</h5>\n          <div>\n            <div style=\"margin:10px\"><input type=\"file\"id=\"bibtex-input\"></div>\n            <div style=\"margin:10px\"><button class=\"btn btn-primary btn-xs\" ng-click=\"processBibtexFile()\">Upload</button></div>\n          </div>\n        </div>\n        <div style=\"margin:10px 0 10px 0\">\n          <h5>Export</h5>\n          <div class=\"row\" style=\"margin:0 10px 0 10px\">\n            <button class=\"btn btn-default btn-xs col-md-5\">Documents</button>\n            <span class=\"col-md-1\"></span>\n            <button class=\"btn btn-default btn-xs col-md-5\">References</button>\n            <span class=\"col-md-1\"></span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/explore.v2.html',
        "<svg id=\"graph\">\n</svg>\n<div id=\"control\">\n  <button class=\"btn\" ng-click=\"getNeighborConcepts()\">Expand</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/focus.v2.html',
        "  <div class=\"column\" id=\"texts-col\">\n    <div class=\"header\">\n      <span>Texts</span>\n    </div>\n    <div class=\"body row\">\n      <div class=\"index col-md-4\">\n        <table class=\"table\">\n          <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n            <td ng-click=\"selectEntry(t, 'text')\">{{t.title}}</td>\n          </tr>\n        </table>\n      </div>\n      <div class=\"content col-md-8\">\n        <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n        </textarea>\n      </div>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addTextEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-click=\"updateTextEntry()\">Edit</button>\n        <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='text'}\" ng-disabled=\"associationInactive('text')\" ng-click=\"showAssociation('text')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"concepts-col\">\n    <div class=\"header\">\n      <span>Concepts</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"c in concepts | filter:filterColumn('concept')\" ng-class=\"{active: hover || c.id == selectedEntry['concept'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n          <td ng-click=\"selectEntry(c, 'concept')\">{{c.term}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addConceptEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-class='{\"btn-success\": associationSource===\"concept\"}' ng-disabled=\"associationInactive('concept')\" ng-click=\"showAssociation('concept')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['concept']===null\" ng-click=\"deleteEntry('concept')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"column\" id=\"evidence-col\">\n    <div class=\"header\">\n      <span>Evidence</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"e in evidence | filter:filterColumn('evidence')\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n           <td ng-click=\"selectEntry(e, 'evidence')\">{{e.title}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n        <button class=\"btn btn-default\">Edit</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='evidence'}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"showAssociation('evidence')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n      </div>\n    </div>\n  </div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/landing.v2.html',
        "<div ui-view=\"MainView\"></div>\n<div class=\"text-center\">\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"v2.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"v2.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v2/view-picker.v2.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.v2.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.v2.focus\">Focus</button>\n</div>");
}]);
angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/v3/view-picker.v3.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.ver1.focus\">Focus</button>\n</div>");
}]);