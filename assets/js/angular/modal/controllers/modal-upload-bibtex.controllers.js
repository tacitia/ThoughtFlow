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
      seedNewCollection: false
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
          Core.initializeNewCollection($scope.newCollection.name, function(response) {
            $scope.newCollection.id = response.data.id;
//            $scope.newCollection.id = 16;
            configUploadFunction(evidenceList);             
          })
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