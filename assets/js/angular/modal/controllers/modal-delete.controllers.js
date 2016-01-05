angular.module('modal.controllers')
  .controller('DeleteModalController', ['$scope', '$modalInstance', 'Core', 'ids', 'content', 'type', 'userId',
    function($scope, $modalInstance, Core, ids, content, type, userId) {

    $scope.content = content;
    $scope.type = type;

    $scope.delete = function () {
      var counter = 0;
      for (var i = 0; i < ids.length; ++i) {
        var currentId = ids[i];
        Core.deleteEntry(currentId, $scope.type, userId, function() {
          Core.deleteBookmark(userId, currentId, function() {
            counter += 1;
            if (counter === ids.length) $modalInstance.close(ids);
          }, function(response) {
            console.log('server error when deleting evidence bookmark')
            console.log(response)
          });
        }, function(response) {
          console.log('server error when deleting ' + $scope.type)
          console.log(response)
        });
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);