angular.module('explore.controllers')
  .controller('ExploreController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed',
    function($scope, $modal, Core, AssociationMap, Pubmed) {

    var data = Core.getAllDataForUser(1, function(response) {
      var texts = response.data.texts;
      var concepts = response.data.concepts;
      var evidence = response.data.evidence;
      var conceptAssociations = AssociationMap.getAssociationsOfType('concept', 'concept');
      console.log(conceptAssociations);
      var formattedAssociations = [];
      visualizeGraph(texts, concepts, evidence, formattedAssociations);
    }, function(errorResponse) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(errorResponse);
    });

    $scope.selectedConcepts = [];

    // Get co-occurred terms and publications with those labels
    $scope.getNeighborConcepts = function () {

      Pubmed.findNeighborConcepts($scope.selectedConcepts, 1, function(response) {
        console.log(response);
      }, function(errorRespone) {

      });
    };

    function visualizeGraph(texts, concepts, evidence, conceptAssociations) {

      var canvas = d3.select('#graph')
        .style('width', 400)
        .style('height', 400);
      console.log(concepts);

      // To get the same graph layout every time the page is loaded
      Math.seedrandom('Chronos');

      var links = conceptAssociations;

      var force = d3.layout.force()
        .nodes(concepts)
        .links(links)
        .size([400, 400])
        .linkStrength(0.1)
        .friction(0.9)
        .linkDistance(50)
        .charge(-30)
        .gravity(0.1)
        .theta(0.8)
        .alpha(0.1)
        .start();

      var linkGroup = canvas.selectAll('line')
        .data(force.links())
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 3);

      var nodeGroup = canvas.selectAll('rect')
        .data(force.nodes())
        .enter()
        .append('rect')
        .attr('class', 'node')
        .attr('width', function(d) {
          return d.term.length * 10;
        })
        .attr('height', 25)
        .attr('fill', '#b5cfe3')
        .attr('ry', 5)
        .on('click', function(d, i) {
          if ($scope.selectedConcepts.indexOf(d) < 0) {
            $scope.selectedConcepts.push(d);
            d3.select(this).classed('selected', true);
          }
          else {
            $scope.selectedConcepts = _.without([$scope.selectedConcepts], d);
            d3.select(this).classed('selected', false);
          }
        });

      var textGroup = canvas.selectAll('text')
        .data(force.nodes())
        .enter()
        .append('text')
        .text(function(d) {
          return d.term;
        })
        .attr('text-anchor', 'middle')

      force.start();
      for (var i = 0; i < 1000; ++i) force.tick();
      force.stop();  

      linkGroup.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      nodeGroup.attr("x", function(d) { return d.x - d.term.length * 5; })
          .attr("y", function(d) { return d.y - 18; });

      textGroup.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });
    }

  }]);
