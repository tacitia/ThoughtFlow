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