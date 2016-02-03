angular.module('landing.v2.controllers')
  .controller('LandingController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic', 'Logger',
    function($scope, $modal, Core, AssociationMap, Pubmed, TermTopic, Logger) {
      $scope.userId = '';
      $scope.selected = {};
      $scope.idGenerated = false;

      Core.getCollectionList(function(response) {
        $scope.collections = response.data.map(function(d) {
          return {
            id: parseInt(d.collection_id),
            name: d.collection_name,
            description: d.description,
            numPubs: d.num_pubs
          };
        });
      });
      /*
      $scope.collections = [
//        { id: 10, name: 'visualization'},
        { id: 11, name: 'pfc and executive functions', numPubs: 103658, description: 'PubMed search queries "cognitive control", "executive functions", and "prefrontal cortex"'},
        { id: 12, name: 'virtual reality', numPubs: 5634, description: 'PubMed search query "virtual reality"'},
        { id: 13, name: 'TVCG', numPubs: 2490, description: 'IEEE Transactions on Visualization and Computer Graphics'},
        { id: 15, name: 'diffusion tensor imaging', numPubs: 2111, description: 'PubMed entries related to entries from a bibtex file compiled by a diffusion tensor imaging researcher'},
      ];
      */

      $scope.generateNewUserId = function() {
        Core.getNewUserId(function(response) {
          $scope.userId = response.data.userId;
          $scope.idGenerated = true;
        });
      };
  }]);
