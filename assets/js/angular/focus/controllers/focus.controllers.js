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
