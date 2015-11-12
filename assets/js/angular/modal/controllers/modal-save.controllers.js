angular.module('modal.controllers')
  .controller('SaveModalController', function($scope, $modalInstance, textEntry, userId, Core) {

    $scope.textEntry = textEntry;

    $scope.save = function () {
      Core.postTextByUserId(userId, $scope.textEntry.title, $scope.textEntry.content, false, $scope.textEntry.id, 
        function(response) {
          $modalInstance.close(response.data[0]);
        }, function(response) {
          console.log('server error when saving new concept');
          console.log(response);
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });