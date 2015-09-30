angular.module('explore.controllers')
  .controller('EvidenceModalController', ['$scope', '$modalInstance', '$modal', 'Core', 
    function($scope, $modalInstance, $modal, Core) {

    $scope.title = "";
    $scope.abstract = ""; 

    $scope.ok = function () {
      var newEvidence = Core.postEvidenceByUserId(1, $scope.title, $scope.abstract, 
        function(response) {
          console.log(response);
          $modalInstance.close(response.data[0]);
        }, function() {
          console.log('server error when saving new evidence');
          console.log(response);
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);