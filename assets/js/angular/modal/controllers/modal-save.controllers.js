angular.module('modal.controllers')
  .controller('SaveModalController', function($scope, $modalInstance, textEntry) {

    $scope.textEntry = textEntry;

    $scope.save = function () {
      $modalInstance.close($scope.textEntry);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });