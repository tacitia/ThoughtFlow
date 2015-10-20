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
  'angularFileUpload'
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
    'associationMap.services'
  ]);

angular
  .module('core.services', []);

angular
  .module('pubmed.services', []);  

angular
  .module('associationMap.services', ['core.services']);
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
  .module('exploreModule', [
    'explore.controllers',
    'angularFileUpload'
  ]);

angular
  .module('explore.controllers', ['angularFileUpload']);
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
angular.module('mainModule')
    .controller('CoreCtrl', ['CoreFactory', function (CoreFactory) {
        
    }]);
angular.module('mainModule')
    .factory('CoreFactory', ['Restangular', function (Restangular) {
        return {

        }
    }]);
angular
  .module('associationMap.services')
  .factory('AssociationMap', AssociationMap);

AssociationMap.$inject = ['Core'];

function AssociationMap(Core) {
  var associationMap = null;
  Core.getAssociationMap(1, function(response) {
    associationMap = response.data;
    console.log('user association map retrieved');
  }, function(response) {
    console.log('server error when retrieving association map');
    console.log(response);
  });

  var AssociationMap = {
    getAssociatedIds: getAssociatedIds,
    getAssociationsOfType: getAssociationsOfType,
    addAssociation: addAssociation,
  };

  return AssociationMap;

  ////////////////////

  function getAssociatedIds(sourceType, targetType, sourceId) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType && entry.sourceId === sourceId;
    })
    .map(function(entry) {
      return entry.targetId;
    });      
  }

  function getAssociationsOfType(sourceType, targetType) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType;
    })
  }

  function addAssociation(sourceType, targetType, source, target) {
    Core.postAssociationByUserId(1, sourceType, targetType, source, target, 
      function(response) {
        associationMap.push(response.data[0]);
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);        
      })
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
      getAllDataForUser: getAllDataForUser,
      getAssociationMap: getAssociationMap    
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

    function postTextByUserId(userId, title, content, successFn, errorFn) {
      return $http.post('/api/v1/data/texts/', {
        created_by: userId,
        title: title,
        content: content
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

    function deleteEntry(id, type, userId, successFn, errorFn) {
      return $http.post('/api/v1/data/' + type + '/delete/', {
        // switch to using the id of the currently active user
        user_id: userId,
        id: id
      }).then(successFn, errorFn);
    }

    // TODO: implement
    function deleteAssociation() {

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
        terms: terms
      }).then(successFn, errorFn)
    }

    function extractTerms(text, userId, successFn, errorFn) {
      $http.post('api/v1/service/extractTerms/', {
        text: text
      }).then(successFn, errorFn);
    }

  }
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
    function($scope, $modalInstance, Core, id, content, type, userId) {

    $scope.id = id;
    $scope.content = content;
    $scope.type = type;

    $scope.delete = function () {
      console.log($scope.id);
      Core.deleteEntry($scope.id, $scope.type, userId, function() {
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
angular.module('modal.controllers')
  .controller('EvidenceModalController', ['$scope', '$modalInstance', '$modal', 'Core', 'Bibtex',
    function($scope, $modalInstance, $modal, Core, Bibtex) {

    $scope.title = "";
    $scope.abstract = "";

    $scope.ok = function () {
      var newEvidence = Core.postEvidenceByUserId(1, $scope.title, $scope.abstract, {},
        function(response) {
          $modalInstance.close(response.data[0]);
        }, function(response) {
          console.log('server error when saving new evidence');
          console.log(response);
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.processBibtexFile = function() {
      var selectedFile = document.getElementById('bibtex-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        var evidenceList = Bibtex.parseBibtexFile(fileContent);      
        var storedEvidence = [];        
        
        evidenceList.forEach(function(evidence) {
          Core.postEvidenceByUserId(1, evidence.title, evidence.abstract, evidence.metadata, 
            function(response) {
              storedEvidence.push(response.data[0]);
              if (storedEvidence.length === evidenceList.length) {
                $modalInstance.close(storedEvidence);                
              }
            }, function(response) {
              console.log('server error when saving new evidence');
              console.log(response);
            });
        });

      };
      reader.readAsText(selectedFile);
    };

  }]);
angular.module('modal.controllers')
  .controller('SaveModalController', function($scope, $modalInstance, textEntry) {

    $scope.textEntry = textEntry;

    $scope.save = function () {
      $modalInstance.close($scope.textEntry);
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
    var associatedConceptIds = AssociationMap.getAssociatedIds('text', 'concept', textsInfo.id);
    var associatedEvidenceIds = AssociationMap.getAssociatedIds('text', 'evidence', textsInfo.id);
    var tempAssociatedConceptIds = [];
    var tempAssociatedEvidenceIds = [];

    $scope.ok = function () {
      var newText = Core.postTextByUserId(userId, $scope.textsInfo.title, $scope.textsInfo.content, 
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
        "<div class=\"modal-header\">\n    <h3>Add new evidence</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"abstract\">Abstract</label>  \n  <textarea class=\"form-control\" id=\"abstract\" ng-model=\"abstract\"></textarea>\n  <div class=\"row\">\n    <input type=\"file\" class=\"col-md-6\" id=\"bibtex-input\">\n    <div class=\"col-md-2\"><button class=\"btn btn-default\" ng-click=\"processBibtexFile()\">Upload</button></div>\n  </div>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
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
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"textsInfo.title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"textsInfo.content\"></textarea>\n  <table class=\"table\">\n    <tr ng-repeat=\"c in concepts | filter:isAssociated('concept')\">\n      <td>{{c.term}}</td>\n    </tr>\n  </table>\n  <select ng-model=\"selectedConcept\" ng-options=\"c.term for c in concepts\">\n    <option value=\"\">-- choose concept --</option>\n  </select>\n  <button class=\"btn btn-xs\" ng-click=\"addAssociatedConceptLocally()\">Add</button>\n  <select ng-model=\"selectedEvidence\" ng-options=\"e.title for e in evidence\">\n    <option value=\"\">-- choose evidence --</option>\n  </select>\n  <button class=\"btn btn-xs\">Add</button>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
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
  .controller('BaselineController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed',
    function($scope, $modal, Core, AssociationMap, Pubmed) {

    var userId = 101;

    var data = Core.getAllDataForUser(userId, function(response) {
      console.log(response.data)
      $scope.texts = response.data.texts;
      $scope.concepts = response.data.concepts;
      $scope.evidence = response.data.evidence;
    }, function(response) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(response);
    });
    $scope.terms = [];

    $scope.selectedEntry = {};
    $scope.selectedEntry['text'] = null;
    $scope.selectedEntry['evidence'] = null;
    $scope.selectedTerms = [];

    $scope.hasUnsavedChanges = false;
    $scope.associationSource = '';

    $scope.filterSwitches = {};
    $scope.filterSwitches['text'] = false;
    $scope.filterSwitches['evidence'] = false;

    $scope.associatedIds = {};
    $scope.associatedIds['text'] = [];
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

    $scope.selectTerm = function(term) {
      if ($scope.selectedTerms.indexOf(term) >= 0) {
        $scope.selectedTerms = _.without($scope.selectedTerms, term);
      }
      else {
        $scope.selectedTerms.push(term);
      }
    }

    $scope.termSelected = function(term) {
      return $scope.selectedTerms.indexOf(term) >= 0;
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
              case 'evidence': return $scope.selectedEntry[type].title;
            }
          },
          id: function() {
            return $scope.selectedEntry[type].id;
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
            $scope.associatedIds['evidence'] = AssociationMap.getAssociatedIds('text', 'evidence', $scope.selectedEntry['text'].id);
            break;
          }
          case 'evidence': {
            $scope.associatedIds['text'] = AssociationMap.getAssociatedIds('evidence', 'text', $scope.selectedEntry['evidence'].id);
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

    $scope.filterTerms = function() {
      return function(term) {
        return term.frequency > 1 || term.length > 1;
      };
    };

    $scope.extractTerms = function() {
      var text = $scope.activeText;
      Pubmed.extractTerms(text, userId, function(response) {
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
      Pubmed.searchEvidenceForTerms(terms, userId, function(response) {
        console.log(response);
      }, function(errorResponse) {
        console.log('error occurred while searching for evidence');
        console.log(errorResponse)        
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
        "<div class=\"center\">\n  <!-- List of saved arguments -->\n  <div>\n  </div>\n  <div class=\"column\" id=\"texts-col\">\n    <div class=\"header\">\n      <span>Texts</span>\n    </div>\n    <div class=\"body row\">\n      <div class=\"index col-md-4\">\n        <table class=\"table\">\n          <tr ng-repeat=\"t in texts | filter:filterColumn('text')\" ng-class=\"{active: hover || t.id == selectedEntry['text'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n            <td ng-click=\"selectEntry(t, 'text')\">{{t.title}}</td>\n          </tr>\n        </table>\n      </div>\n      <!-- Text area for current argument -->\n      <div class=\"content col-md-8\">\n        <textarea class=\"form-control\" id=\"textContent\" ng-model=\"activeText\" ng-keypress=\"startMakingChanges()\">\n        </textarea>\n      </div>\n    </div>\n    <!-- Controls for the current argument: save and extract keywords -->\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addTextEntry()\">Add</button>\n        <button class=\"btn btn-default\" ng-click=\"updateTextEntry()\">Edit</button>\n        <button class=\"btn btn-primary\" ng-disabled=\"!hasUnsavedChanges\" ng-click=\"saveTextEntry()\">Save</button>\n        <button class=\"btn btn-default\" ng-click=\"extractTerms()\">Extract terms</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='text'}\" ng-disabled=\"associationInactive('text')\" ng-click=\"showAssociation('text')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['text']===null\" ng-click=\"deleteEntry('text')\">Delete</button>\n      </div>\n    </div>\n    <!-- Display of extracted keywords -->\n    <div id=\"terms-col\">\n        <div class=\"col-md-4 padding-sm\" ng-repeat=\"t in terms | filter:filterTerms()\">\n          <button class=\"btn btn-default btn\" ng-class=\"{'btn-primary': termSelected(t)}\" ng-click=\"selectTerm(t)\">{{t.term}}</td>\n        </div>\n    </div>  \n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"searchEvidenceForTerms()\">Search evidence</button>\n      </div>\n    </div>    \n  </div>\n  <!-- List of evidence -->\n  <div class=\"column\" id=\"evidence-col\">\n    <div class=\"header\">\n      <span>Evidence</span>\n    </div>\n    <div class=\"body\">\n      <table class=\"table\">\n        <tr ng-repeat=\"e in evidence | filter:filterColumn('evidence')\" ng-class=\"{active: hover || e.id == selectedEntry['evidence'].id}\" ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n           <td ng-click=\"selectEntry(e, 'evidence')\">{{e.title}}</td>\n        </tr>\n      </table>\n    </div>\n    <div class=\"footer\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button class=\"btn btn-default\" ng-click=\"addEvidenceEntry()\">Add</button>\n        <button class=\"btn btn-default\">Edit</button>\n        <button class=\"btn btn-default\" ng-class=\"{'btn-success': associationSource==='evidence'}\" ng-disabled=\"associationInactive('evidence')\" ng-click=\"showAssociation('evidence')\">Associate</button>\n        <button class=\"btn btn-danger\" ng-disabled=\"selectedEntry['evidence']===null\" ng-click=\"deleteEntry('evidence')\">Delete</button>\n      </div>\n    </div>\n  </div>\n  <!-- Display of topic modeling results of selected evidence-->\n  <div>\n  </div>\n</div>");
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