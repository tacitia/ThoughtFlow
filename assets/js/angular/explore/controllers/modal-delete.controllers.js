angular.module('explore.controllers')
  .controller('DeleteModalController', ['$scope', '$modalInstance', 'Core', 'id', 'content', 'type',
    function($scope, $modalInstance, Core, id, content, type) {

    $scope.id = id;
    $scope.content = content;
    $scope.type = type;

    $scope.delete = function () {
      Core.deleteEntry($scope.id, $scope.type, function() {
        $modalInstance.close($scope.id);
      }, function(response) {
        console.log('server error when deleting ' + $scope.type)
        console.log(response)
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);