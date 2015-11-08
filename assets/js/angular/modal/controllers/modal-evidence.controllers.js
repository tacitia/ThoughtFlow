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