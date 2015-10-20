angular.module('modal.controllers')
  .controller('DeleteModalController', ['$scope', '$modalInstance', 'Core', 'id', 'content', 'type', 'userId',
    function($scope, $modalInstance, Core, id, content, type, userId) {

    $scope.id = id;
    $scope.content = content;
    $scope.type = type;

    $scope.delete = function () {
      console.log($scope.id);
      Core.deleteEntry($scope.id, $scope.type, userId, function() {
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