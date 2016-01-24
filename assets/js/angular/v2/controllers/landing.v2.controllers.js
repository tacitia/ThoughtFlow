angular.module('landing.v2.controllers')
  .controller('LandingController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic', 'Logger',
    function($scope, $modal, Core, AssociationMap, Pubmed, TermTopic, Logger) {
      $scope.userId = '';
      $scope.selected = {};
      $scope.collections = [
//        { id: 10, name: 'visualization'},
        { id: 11, name: 'pfc and executive functions'},
        { id: 12, name: 'virtual reality'},
        { id: 13, name: 'TVCG'},
        { id: 15, name: 'diffusion tensor imaging'},
      ];
  }]);
