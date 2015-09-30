angular.module('explore.controllers')
  .controller('TextsModalController', ['$scope', '$modalInstance', 'textsInfo', 'concepts', 'evidence', 'Core', 'AssociationMap',
    function($scope, $modalInstance, textsInfo, concepts, evidence, Core, AssociationMap) {

    $scope.textsInfo = textsInfo;
    $scope.concepts = concepts;
    $scope.evidence = evidence;
    var associatedConceptIds = AssociationMap.getAssociatedIds('text', 'concept', textsInfo.id);
    var associatedEvidenceIds = AssociationMap.getAssociatedIds('text', 'evidence', textsInfo.id);
    var tempAssociatedConceptIds = [];
    var tempAssociatedEvidenceIds = [];

    $scope.ok = function () {
      var newText = Core.postTextByUserId(1, $scope.textsInfo.title, $scope.textsInfo.content, 
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