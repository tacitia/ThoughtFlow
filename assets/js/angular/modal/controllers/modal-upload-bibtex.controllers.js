// TODO: add collectionId here
angular.module('modal.controllers')
  .controller('UploadBibtexModalController', ['$scope', '$modalInstance', 'userId', 'existingEvidence', 'Core', 'Bibtex',
    function($scope, $modalInstance, userId, existingEvidence, Core, Bibtex) {

    var storedEvidence = [];
    $scope.evidenceIndex = 0;
    $scope.totalAbstractFound = 0;
    $scope.uploadStatus = 'beforeUpload';
    $scope.numErrors = 0;

    var collectionId = 15;

    $scope.processBibtexFile = function() {

      $scope.uploadStatus = 'uploading';
      var selectedFile = document.getElementById('bibtex-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        var evidenceList = Bibtex.parseBibtexFile(fileContent);   

        evidenceList = _.uniq(evidenceList);

        $scope.totalToUpload = evidenceList.length;
        
        var uploadFunction = setInterval(function() {
          if ($scope.evidenceIndex >= $scope.totalToUpload) {
            $scope.uploadStatus = 'uploaded-success';
            clearInterval(uploadFunction);
            return;
          }
          var evidence = evidenceList[$scope.evidenceIndex];
          $scope.esmitatedTimeRemaining = (evidenceList.length - $scope.evidenceIndex) * 3;
          $scope.currentEvidence = evidence.title;

          Core.postEvidenceByUserId(collectionId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), 
            function(response) {
              Core.addBookmark(userId, response.data[0].id, function(response) {

              }, function(errorResponse) {
                console.log('warning: error occurred when bookmarking evidence.');
              });
              if (existingEvidence.indexOf(response.data[0]) > -1) {
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
              $scope.numErrors += 1;
              $scope.lastUploadResult = 'failed';
              $scope.lastUploadedEvidence = $scope.currentEvidence;
              console.log('server error when saving new evidence');
              console.log(response);
              if ($scope.numErrors >= 10) {
                $scope.evidenceIndex = $scope.totalToUpload;
                $scope.uploadStatus = 'uploaded-failed';
              }
            });

          $scope.evidenceIndex += 1;
        }, 3000);
      };
      reader.readAsText(selectedFile);
    };   

    $scope.ok = function () {
      $modalInstance.close(storedEvidence);
      $modalInstance.dismiss('done');
    };

  }]);