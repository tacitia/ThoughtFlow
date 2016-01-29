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
      $scope.uploadStatus = 'uploading'; 
      console.log('start processing')
      var selectedFile = document.getElementById('textfile-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        console.log(file);
        var title = $scope.textsInfo.title.length > 0 ? $scope.textsInfo.title : 'untitled'
        Core.postTextByUserId(userId, title, fileContent, true, -1, function(response) {
          console.log('upload success');
          $scope.uploadStatus = 'uploaded-success';
        });
        // TODO: find and label citations, assuming brackets
//        var paragraphs = fileContent.split('\n');
      };
      reader.readAsText(selectedFile);
    }

  }]);