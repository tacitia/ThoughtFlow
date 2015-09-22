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
