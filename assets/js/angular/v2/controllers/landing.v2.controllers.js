angular.module('landing.v2.controllers')
  .controller('LandingController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic', 'Logger',
    function($scope, $modal, Core, AssociationMap, Pubmed, TermTopic, Logger) {
      $scope.userId = '';
      $scope.selected = {};
      $scope.idGenerated = false;
      $scope.loadingCollections = true;

      Core.getCollectionList(function(response) {
        $scope.collections = response.data.map(function(d) {
          return {
            id: parseInt(d.collection_id),
            name: d.collection_name,
            description: d.description,
            numPubs: d.num_pubs
          };
        });
        $scope.loadingCollections = false;
      });

      $scope.generateNewUserId = function() {
        Core.getNewUserId(function(response) {
          $scope.userId = response.data.userId;
          $scope.idGenerated = true;
        });
      };
  }]);
