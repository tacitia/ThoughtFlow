angular.module('explore.controllers')
  .controller('TextsModalController', ['$scope', '$modalInstance', '$modal', 'Core', 
    function($scope, $modalInstance, $modal, Core) {

    $scope.title = "";
    $scope.content = ""; 

    $scope.ok = function () {
      var newText = Core.postTextByUserId(1, $scope.title, $scope.content);
      console.log(newText);
      if (newText) {
        $modalInstance.close(newText);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);