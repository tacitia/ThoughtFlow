angular.module('explore.controllers')
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