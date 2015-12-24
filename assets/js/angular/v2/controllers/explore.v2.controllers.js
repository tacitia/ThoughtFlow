angular.module('explore.v2.controllers')
  .controller('ExploreController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic',
    function($scope, $modal, Core, AssociationMap, Pubmed, TermTopic) {

    var topTermContainer = null;
    var topTopicContainer = null;
    var termTopicConnectionContainer = null;
    var topicNeighborContainer = null;
    var termColorMap = d3.scale.category10();

    var defaultFill = '#ccc';

    var userId = 113;
    var collectionId = 13;

    var termBatchSize = 30;
    var topicBatchSize = 30;

    $scope.selectedEvidence = null;
    $scope.selectedTerms = [];
    $scope.selectedWords = [];
    $scope.selectedTopic = null;

    $scope.loadingEvidence = true;
    $scope.loadingTopicEvidence = false;
    $scope.loadingStatement = 'Retrieving evidence collection and topics...';

    $scope.termStartIndex = 0;

    Core.getEvidenceCollection(collectionId, function(response) {
      console.log(response.data);
      $scope.loadingEvidence = false;
      $scope.topics = response.data.topics.map(function(topic) {
        return {
          id: topic[0],
          terms: topic[1].map(function(termTuple) {
            return {
              term: termTuple[0],
              prob: termTuple[1]
            }
          })
        }
      });
      TermTopic.initialize($scope.topics);
      visualizeTopicTermDistribution();
//      visualizeTopicTermGraph();
//      visualizeTopicTermMatrix($scope.topics);
    }, function(errorResponse) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(errorResponse);
    });

    function updateTerms() {
      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex);
      var topicAndConnections = TermTopic.getTopTopics(terms, topicBatchSize);
      var topics = topicAndConnections.topics;
      var termTopicConnections = topicAndConnections.termTopicConnections;
      visualizeTopTerms(topTermContainer, 300, 600, terms);
      visualizeTermTopicConnections(termTopicConnectionContainer, 100, 600, terms, topics, termTopicConnections);
      visualizeTopTopics(topTopicContainer, 650, 600, topics);
    }

    $scope.showNextTerms = function() {
      if (TermTopic.numOfTerms() > $scope.termStartIndex + termBatchSize) {
        $scope.termStartIndex += termBatchSize;
        updateTerms();
      }
    };

    $scope.showPrevTerms = function() {
      if ($scope.termStartIndex - termBatchSize >= 0) {
        $scope.termStartIndex -= termBatchSize;
        updateTerms();
      }
    };

    $scope.isTopicTerm = function(w) {
      if (w === 'of') {
        return false;
      }
      if ($scope.selectedTopic === null) return false;
      var topicTerms = _.take($scope.selectedTopic.terms, 10);
      for (var i = 0; i < topicTerms.length; ++i) {
        var term = topicTerms[i].term;
        var term_parts = term.split(' ');
        var word_parts = w.split('-');
        if (term_parts.indexOf(w) > -1) {
          return true;
        }
        for (var j = 0; j < word_parts.length; ++j) {
          var wp = word_parts[j];
          if (term_parts.indexOf(wp) > -1) {
            return true;
          }
        }
      }
      return false;
    };

    $scope.selectEvidence = function(evidence) {
      $scope.selectedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');
    }

    // Get co-occurred terms and publications with those labels
    $scope.getNeighborConcepts = function() {

      Pubmed.findNeighborConcepts($scope.selectedConcepts, 1, function(response) {
        console.log(response);
      }, function(errorRespone) {

      });
    };

    $scope.updateTermTopicOrdering = function() {
      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex);
      var topicsAndConnections = TermTopic.getTopTopics(terms, topicBatchSize, $scope.selectedTerms);
      var topics = topicsAndConnections.topics;
      var connections = topicsAndConnections.termTopicConnections;
      visualizeTopTopics(topTopicContainer, 650, 600, topics);
      visualizeTermTopicConnections(termTopicConnectionContainer, 100, 600, terms, topics, connections);
      updateTermTopicFills();
      updateConnectionStrokes();
    };

    $scope.bookmarkEvidence = function(e) {
      console.log('bookmark evidence triggered')
      Core.addBookmark(userId, e.id, function(response) {
        console.log('bookmark evidence success');
        e.bookmarked = true;
      }, function(errorResponse) {
        console.log(errorResponse);
      });
    };

    function visualizeTopicTermDistribution(topics) {
      var params = {
        width: 1800,
        height: 600,
        margin: { 
          left: 50,
          top: 50,
          bottom: 20,
          right: 0
        },
        termNum: 50
      };

      var canvas = d3.select('#topic-term-dist')
        .attr('width', params.width + params.margin.left + params.margin.right)
        .attr('height', params.height + params.margin.top + params.margin.bottom);

      canvas.append('text')
        .text('Terms (' + TermTopic.numOfTerms() + ' total)')
        .attr('font-size', 18)
        .attr('transform', 'translate(170, 30)');

      canvas.append('text')
        .text('Topics (' + TermTopic.numOfTopics() + ' total)')
        .attr('font-size', 18)
        .attr('transform', 'translate(500, 30)');

      canvas.append('text')
        .text('Similar topics')
        .attr('font-size', 18)
        .attr('transform', 'translate(1150, 30)');

      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex);
      var topicAndConnections = TermTopic.getTopTopics(terms, topicBatchSize);
      var topics = topicAndConnections.topics;
      var termTopicConnections = topicAndConnections.termTopicConnections;

      topTermContainer = configSvgContainer(canvas.append('svg'), 300, params.height, params.margin.left, params.margin.top);
      termTopicConnectionContainer = configSvgContainer(canvas.append('svg'), 100, params.height, params.margin.left + 300, params.margin.top);
      topTopicContainer = configSvgContainer(canvas.append('svg'), 650, params.height, params.margin.left + 400, params.margin.top);
      topicNeighborContainer = configSvgContainer(canvas.append('svg'), 600, params.height, params.margin.left + 1050, params.margin.top);

      console.log(terms)

      visualizeTopTerms(topTermContainer, 300, 600, terms);
      visualizeTermTopicConnections(termTopicConnectionContainer, 100, 600, terms, topics, termTopicConnections);
      visualizeTopTopics(topTopicContainer, 650, 600, topics);
    }

    function configSvgContainer(container, width, height, x, y) {
      container
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y);

      return container;
    }

    function visualizeTopTerms(container, width, height, topTerms) {

      var x = d3.scale.linear()
        .domain([0, TermTopic.getTermPropertyMax('weight')])
        .range([0, width-140]); // 100 pixels are allocated to the texts

      var y = d3.scale.ordinal()
        .domain(d3.range(termBatchSize))
        .rangeBands([0, height], 0.05);

      var term = container.selectAll('.term')
        .data(topTerms, function(d) {
          return d.term;
        });

      term.exit().remove();
      term.enter()
        .append('g')
        .attr('class', 'term');
      term.transition()
        .attr('transform', function(d, i) {
          return 'translate(100, ' + y(i) + ')'; // Each group is moved right by 100, to leave 100 pixels for the texts
        });

      term.append('text')
        .text(function(term) {
          return term.term;
        })
        .attr('text-anchor', 'end')
        .attr('dy', 13);

      term.append('rect')
        .attr('width', function(d) {
          return x(d.properties.weight);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .attr('transform', 'translate(20, 0)') // Space between rectangles and texts
        .on('click', function(d) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            $scope.selectedTerms = _.without($scope.selectedTerms, d.term);
          }
          else {
            $scope.selectedTerms.push(d.term);
          }
          updateTermTopicFills();
          updateConnectionStrokes();
        });
    }

    function updateTermTopicFills() {
      termColorMap.domain($scope.selectedTerms);
      topTermContainer.selectAll('rect')
        .attr('fill', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            return termColorMap(d.term);
          }
          else {
            return '#ccc';
          }
        });
      topTopicContainer.selectAll('rect')
        .attr('fill', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            return termColorMap(d.term);
          }
          else {
            return '#ccc';
          }
        });
    }

    function updateConnectionStrokes() {
      termTopicConnectionContainer.selectAll('path')
        .attr('stroke', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term.term) >= 0) {
            return termColorMap(d.term.term);
          }
          else {
            return '#ccc';
          }          
        })
        .attr('opacity', function(d, i) {
          return ($scope.selectedTerms.length === 0 || $scope.selectedTerms.indexOf(d.term.term) >= 0) ? 1 : 0;
        });
    }

    function visualizeTopTopics(container, width, height, topTopics) {

      console.log(topTopics)

      var y = d3.scale.ordinal()
        .domain(d3.range(topicBatchSize))
        .rangeBands([0, height], 0.05);

      var topic = container.selectAll('.topic')
        .data(topTopics, function(d, i) {
          return d.id;
        });

      topic.exit().remove();

      var newTopics = topic
        .enter()
        .append('g')
        .attr('class', 'topic')

      topic.transition()
        .attr('transform', function(d, i) {
          return 'translate(50, ' + y(i) + ')'; // 50 is allocated to topic ids
        });

      visualizeIndividualTopic(newTopics, width-50, y);
    }

    function visualizeIndividualTopic(topic, width, y) {

      var termWidth = width - 10;

      topic.append('rect')
        .attr('class', 'topic-background')
        .attr('id', function(d) {
          return 'topic-bg-' + d.id;
        })
        .attr('width', 60)
        .attr('height', 20)
        .attr('transform', 'translate(-50, 0)')
        .attr('rx', 5)
        .attr('fill', 'steelblue')
        .attr('opacity', 0);

      topic.append('text')
        .text(function(topic) {
          return topic.id;
        })
        .attr('text-anchor', 'end')
        .attr('dy', 13)
        .attr('dx', -20)
        .on('mouseover', function(d) {
          d3.selectAll('.topic-background').attr('opacity', 0);
          d3.select('#topic-bg-' + d.id).attr('opacity', 0.5); 
          if ($scope.selectedTopic !== null) {
            d3.select('#topic-bg-' + $scope.selectedTopic.id).attr('opacity', 0.5); 
          }
        })
        .on('mouseout', function() {
          d3.selectAll('.topic-background').attr('opacity', function(d) {
            return ($scope.selectedTopic !== null && d.id === $scope.selectedTopic.id) ? 0.5 : 0;
          });          
        })
        .on('click', function(d) {
          d3.selectAll('.topic-background').attr('opacity', 0);
          d3.select('#topic-bg-' + d.id).attr('opacity', 0.5);          
          $scope.selectedTopic = d;
          visualizeTopicCentricGraph(topicNeighborContainer, d);
          $scope.loadingTopicEvidence = true;
          Core.getEvidenceByTopic(collectionId, d.id, userId, function(response) {
            $scope.evidence = response.data.evidence;
            var bookmarkedEvidence = response.data.evidenceBookmarks.map(function(b) {
              return b.evidence;
            });
            $scope.evidence.forEach(function(e) {
              e.metadata = JSON.parse(e.metadata);
              e.bookmarked = bookmarkedEvidence.indexOf(e.id) >= 0;
            })
            $scope.loadingTopicEvidence = false;
          }, function(errorResponse) {
            console.log(errorResponse);
          })
        });      

      var probSum = 1;
      // Hack alert!!!
      if (collectionId === 12) probSum = 0.2;
      if (collectionId === 13) probSum = 0.5;

      var term = topic.selectAll('g')
        .data(function(d, i) {
          var acc = 0;
          var terms = d.terms;
          for (var j = 0; j < terms.length; ++j) {
            var term = terms[j];
            term.prevProb = acc;
            acc += term.prob;
          }
          terms.push({
            prevProb: acc,
            prob: probSum - acc,
            term: 'other terms'
          });
          return terms;
        })
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
          return 'translate(' + (d.prevProb * termWidth * (1 / probSum)) + ', 0)';
        });

      term.append('rect') 
        .attr('width', function(d) {
          return Math.max(d.prob * termWidth * (1 / probSum) - 1, 1);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .on('click', function(d) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            $scope.selectedTerms = _.without($scope.selectedTerms, d.term);
          }
          else {
            $scope.selectedTerms.push(d.term);
          }
          updateTermTopicFills();
        });        

      term.append('text')
        .attr('x', function(d) {
          return d.prob * termWidth * (1 / probSum) / 2;
        })
        .attr('dy', 13)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text(function(d, i) {
          return i < 2 ? d.term : '';
        });      
    }

    function visualizeTermTopicConnections(container, width, height, terms, topics, connections) {

      var termIndexMap = getItemIndexMap(terms, 'origIndex');
      var topicIndexMap = getItemIndexMap(topics, 'id');

      var termY = d3.scale.ordinal()
        .domain(d3.range(termBatchSize))
        .rangeBands([0, height], 0.05);
      var topicY = d3.scale.ordinal()
        .domain(d3.range(topicBatchSize))
        .rangeBands([0, height], 0.05);

      var line = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate('basis');

      var curve = container.selectAll('.connection')
        .data(connections, function(d, i) {
          return d.term.origIndex + '-' + d.topic.id;
        });

      curve.exit().remove();

      curve.enter()
        .append('path')
        .attr('class', 'connection')
        .attr('fill', 'none')
        .attr('stroke', '#ccc');

      curve
        .attr('d', function(d) {
          var termPos = 5 + termY(termIndexMap[d.term.origIndex]);
          var topicPos = 5 + topicY(topicIndexMap[d.topic.id]);
          var points = [
            {x: 0, y: termPos},
            {x: 50, y: termPos},
            {x: 50, y: topicPos},
            {x: 100, y: topicPos}
          ]; 
          return line(points);
        });
    }

    function getItemIndexMap(itemArray, idProperty) {
      return _.object(itemArray.map(function(item, i) {
        return [item[idProperty], i];
      }));
    }

    function visualizeTopicTermMatrix(topics) {
      var params = {
        width: 1000,
        height: 1000,
        margin: {
          left: 100,
          top: 50
        },
        termNum: 50
      };

      var canvas = d3.select('#topic-term-matrix')
        .style('width', params.width)
        .style('height', params.height);

      var x = d3.scale.ordinal()
        .domain(topTopics.map(function(topic) {
          return topic.id;
        }))
        .rangeBands([0, params.width - params.margin.left]);
      var y = d3.scale.ordinal()
        .domain(_.take(termOrders.weight, params.termNum))
        .rangeBands([0, params.height - params.margin.top]);

      var row = canvas.selectAll('.term-row')
        .data(topTerms)
        .enter()
        .append('g')
        .attr('class', 'term-row')
        .attr('transform', function(d) {
          return 'translate(' + params.margin.left + ', ' + (params.margin.top+y(d.origIndex)) + ')';
        });

      row.append('line')
        .attr('x2', params.width)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      row.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'end')
        .text(function(d, i) {
          return d.term;
        });

      var column = canvas.selectAll('.topic-col')
        .data(topTopics)
        .enter()
        .append('g')
        .attr('class', 'topic-col')
        .attr('transform', function(d) {
          return 'translate(' + (params.margin.left+x(d.id)) + ', ' + params.margin.top + ')';
        });

      column.append('line')
        .attr('y2', params.height)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      column.append('text')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(-45)')
        .text(function(d, i) {
          return d.id;
        });

      column.selectAll('circle')
        .data(function(d) {
          return _.filter(d.terms, function(term) {
            return topTerms.map(function(t) {
                return t.term;
              })
              .indexOf(term.term) > -1;
          });
        })
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', '#ccc')
        .attr('transform', function(d) {
          return 'translate(0, ' + y(termIndexMap[d.term]) + ')'
        });
    }

    function visualizeTopicCentricGraph(container, topic) {

      console.log('called')
      container.selectAll('.node').remove();
      container.selectAll('.link').remove();
      container.selectAll('text').remove();

      var results = TermTopic.getNeighborTopics(topic);
      results.topics.forEach(function(topic) {
        topic.isFixed = false;
      })
      topic.isFixed = true;
      topic.x = 200;
      topic.y = 200;
      var nodes = results.terms.concat(results.topics);

      var links = _.filter(results.connections.map(function(connection) {
        return {
          source: connection.term,
          target: connection.topic
        }
      }), function(link) {
        return nodes.indexOf(link.source) >= 0 && nodes.indexOf(link.target) >= 0;
      });

      // To get the same graph layout every time the page is loaded
      Math.seedrandom('Chronos');

      var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([600, 600])
        .linkStrength(0.1)
        .friction(0.9)
        .linkDistance(300)
        .charge(-60)
        .gravity(0.1)
        .theta(0.8)
        .alpha(0.1);

      force.start();
      for (var i = 5000; i > 0; --i) {
        force.tick();
      }
      force.stop();

      var linkGroup = container.selectAll('line')
        .data(force.links())
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr('class', 'link')
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      var termGroup = container.selectAll('rect')
        .data(results.terms)
        .enter()
        .append('rect')
        .attr('class', 'node term')
        .attr('width', function(d) {
          return d.term.length * 10;
        })
        .attr('height', 25)
        .attr('fill', '#1f77b4')
        .attr('opacity', '0.25')
        .attr('ry', 5)
        .attr("x", function(d) { return d.x - d.term.length * 5; })
          .attr("y", function(d) { return d.y - 18; });

      var topicGroup = container.selectAll('circle')
        .data(results.topics)
        .enter()
        .append('circle')
        .attr('class', 'node topic')
        .attr('fill', '#ff7f0e')
        .attr('stroke', function(d) {
          return d.isFixed ? 'steelblue' : 'none';
        })
        .attr('r', function(d, i) {
          return d.isFixed ? 20 : 10;
        })
        .attr('cx', function(d, i) {
          return d.x;
        })
        .attr('cy', function(d, i) {
          return d.y;
        })
        .attr('opacity', 0.5)
        .on('mouseover', function(topic, i) {
          var ownTerms = _.filter(links, function(l) {
            return l.target === topic;
          })
          .map(function(l) {
            return l.source;
          });
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', function(term, i) {
              return ownTerms.indexOf(term) < 0 ? 0.25 : 0.75;
            });
        })
        .on('mouseout', function(d, i) {
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', 0.25);
        });

      var termTextGroup = container.selectAll('text')
        .data(results.terms)
        .enter()
        .append('text')
        .text(function(d) {
          return d.term;
        })
        .attr('text-anchor', 'middle')
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .on('mouseover', function(term) {
          var ownTopics = _.filter(links, function(l) {
            return l.source === term;
          })
          .map(function(l) {
            return l.target;
          });
          d3.select('#graph')
            .selectAll('.topic')
            .attr('opacity', function(topic, i) {
              return ownTopics.indexOf(topic) < 0 ? 0.5 : 1;
            });

        })
        .on('mouseout', function(d, i) {
          d3.select('#graph')
            .selectAll('.topic')
            .attr('opacity', 0.5);
        });

    }

    function visualizeTopicTermGraph() {
      var terms = TermTopic.getTopTerms('weight', 500, 0);
      var topicAndConnections = TermTopic.getTopTopics(terms, 100);
      var topics = topicAndConnections.topics;
      var links = topicAndConnections.termTopicConnections.map(function(connection) {
        return {
          source: connection.term,
          target: connection.topic
        }
      });
      var nodes = terms.concat(topics);

      var canvas = d3.select('#graph')
        .style('width', 1200)
        .style('height', 1200);

      // To get the same graph layout every time the page is loaded
      Math.seedrandom('Chronos');

      var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([1200, 1200])
        .linkStrength(0.1)
        .friction(0.9)
        .linkDistance(300)
        .charge(-60)
        .gravity(0.1)
        .theta(0.8)
        .alpha(0.1);

      force.start();
      for (var i = 5000; i > 0; --i) {
        force.tick();
      }
      force.stop();

      var linkGroup = canvas.selectAll('line')
        .data(force.links())
        .enter()
        .append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      var termGroup = canvas.selectAll('rect')
        .data(terms)
        .enter()
        .append('rect')
        .attr('class', 'node term')
        .attr('width', function(d) {
          return d.term.length * 10;
        })
        .attr('height', 25)
        .attr('fill', '#1f77b4')
        .attr('opacity', '0.25')
        .attr('ry', 5)
        .attr("x", function(d) { return d.x - d.term.length * 5; })
          .attr("y", function(d) { return d.y - 18; });

      var topicGroup = canvas.selectAll('circle')
        .data(topics)
        .enter()
        .append('circle')
        .attr('class', 'node topic')
        .attr('fill', '#ff7f0e')
        .attr('r', 10)
        .attr('cx', function(d, i) {
          return d.x;
        })
        .attr('cy', function(d, i) {
          return d.y;
        })
        .on('mouseover', function(topic, i) {
          var ownTerms = _.filter(links, function(l) {
            return l.target === topic;
          })
          .map(function(l) {
            return l.source;
          });
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', function(term, i) {
              return ownTerms.indexOf(term) < 0 ? 0.25 : 0.75;
            });
        })
        .on('mouseout', function(d, i) {
          d3.select('#graph')
            .selectAll('.term')
            .attr('opacity', '0.25');
        });

      var termTextGroup = canvas.selectAll('text')
        .data(terms)
        .enter()
        .append('text')
        .text(function(d) {
          return d.term;
        })
        .attr('text-anchor', 'middle')
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });


/*
        .on('click', function(d, i) {
          if ($scope.selectedConcepts.indexOf(d) < 0) {
            $scope.selectedConcepts.push(d);
            d3.select(this).classed('selected', true);
          }
          else {
            $scope.selectedConcepts = _.without([$scope.selectedConcepts], d);
            d3.select(this).classed('selected', false);
          }
        }); */

    }

    $scope.deleteEntry = function(type) {

      /*
      var selectedEvidence = _.keys(_.pick($scope.evidenceSelectionMap, function(value, key) {
        return value;
      })); */
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            return $scope.selectedEvidence.title;
            /*
            if (selectedEvidence.length > 0) {
              return selectedEvidence.length + ' publications';
            }
            else {
              switch (type) {
                case 'text': return $scope.selectedEntry[type].title;
                case 'evidence': return $scope.selectedEntry[type].title;
              }
            } */
          },
          id: function() {
            /*
            if (selectedEvidence.length > 0) {
              return selectedEvidence;
            } */
              return [$scope.selectedEvidence.id];
          },
          type: function() {
            return type;
          },
          userId: function() {
            return userId;
          }
        }
      }); 
  }


    // Deprecated
    function visualizeNodeLinkGraph(texts, concepts, evidence, conceptAssociations) {

      var canvas = d3.select('#graph')
        .style('width', 400)
        .style('height', 400);

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
