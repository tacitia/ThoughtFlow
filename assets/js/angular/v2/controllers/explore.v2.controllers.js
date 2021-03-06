angular.module('explore.v2.controllers')
  .controller('ExploreController', ['$scope', '$stateParams', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'TermTopic', 'Logger', 'Collection', 'User', 'ExploreState', 'Paper', 'Bookmark',
    function($scope, $stateParams, $modal, Core, AssociationMap, Pubmed, TermTopic, Logger, Collection, User, ExploreState, Paper, Bookmark) {

    $scope.userService = User;

    var topTermContainer = null;
    var topTopicContainer = null;
    var termTopicConnectionContainer = null;
    var topicNeighborContainer = null;
    var proposalThumbnailsContainer = null;
    var termColorMap = d3.scale.category10();
    var isDebug = true;
    $scope.proposals = null;

    var defaultFill = '#ccc';

    var termBatchSize = 30;
    var topicBatchSize = 30;

    var termColumnWidth = 200;
    var topicColumnWidth = 500;
    var connectionColumnWidth = 50;

    $scope.selectedEvidence = User.selectedEvidence();
    $scope.selectedRelatedEvidence = null;
    $scope.selectedTerms = ExploreState.selectedTerms();
    $scope.selectedWords = [];
    $scope.selectedTopic = ExploreState.selectedTopic();

    $scope.selectedEvidenceCounts = {
      bookmarked: 0,
      total: 0,
      relatedBookmarked: 0,
      relatedTotal: 0
    };

    $scope.candidateEvidence = ExploreState.candidateEvidence();
    $scope.candidateEvidenceTopics = ExploreState.candidateEvidenceTopics();
    $scope.selected = {};

    $scope.loadingEvidence = true;
    $scope.loadingTopicEvidence = false;
    $scope.loadingStatement = 'Retrieving evidence collection and topics...';

    $scope.termStartIndex = 0;

    $scope.numTerms = 0;
    $scope.numTopics = 0;

    $scope.$watch(function() {
      return d3.selectAll('.evidence')[0].length;
    }, function(newValue, oldValue) {
      if ($scope.selectedEvidence !== undefined && $scope.selectedEvidence !== null) {
        var index = _.findIndex($scope.evidence, function(d) {
          return d.title === $scope.selectedEvidence.title;
        });
        var eo = document.getElementById('evidence-' + index);
        if (eo !== null) eo.scrollIntoView();        
      }
    });

    $scope.selectSearchTitle = function(title, callSource) {
      var source = callSource === undefined ? 'default' : callSource;
      Logger.logAction($scope.userId, 'select title by search', 'v2','1', 'explore', {
        evidence: title.id,
        source: source
      }, function(response) {
        console.log('action logged: select title by search');
      });

      ExploreState.selectedSearchTitle(title);
      if (title.topic !== -1 && ($scope.selectedTopic === null || $scope.selectedTopic.id != title.topic)) {
        var topic = _.find($scope.topics, function(t) {
          return t.id === title.topic;
        });
        selectTopic(topic, 'auto - search title', title);
        /*
        $scope.selectedTopic = _.find($scope.topics, function(t) {
          return t.id === title.topic;
        });
        ExploreState.selectedTopic($scope.selectedTopic); */
        $scope.selectedTerms.length = 0;
        for (var i = 0; i < 5; ++i) {
          $scope.selectedTerms.push($scope.selectedTopic.terms[i].term);
        }
        console.log(ExploreState.selectedTerms());
        $scope.updateTermTopicOrdering(false, true);
      }
      else if ($scope.selectedTopic !== null && $scope.selectedTopic.id == title.topic) {
        $scope.selectEvidence(title);
        var index = _.findIndex($scope.evidence, function(d) {
          return d.title === $scope.selectedEvidence.title;
        });
        var eo = document.getElementById('evidence-' + index);
        if (eo !== null) eo.scrollIntoView();   
      }
      updateRelatedEvidence(title);
    }

    $scope.updateTermTopicOrdering = function(manualUpdate, scrollToStart) {
      if (manualUpdate) {
        Logger.logAction($scope.userId, 'reorder term and topics given selected terms', 'v2','1', 'explore', {
          numSelectedTerms: $scope.selectedTerms.length
        }, function(response) {
          console.log('action logged: reorder term and topics given selected terms');
        });
      }

      if (scrollToStart) {
        $scope.termStartIndex = 0;        
      }
      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex, $scope.selectedTerms);
      var topicsAndConnections = TermTopic.getTopTopics(terms, topicBatchSize, $scope.selectedTerms);
      var topics = topicsAndConnections.topics;
      var connections = topicsAndConnections.termTopicConnections;      
      visualizeTopTerms(topTermContainer, termColumnWidth, 600, terms);
      visualizeTopTopics(topTopicContainer, topicColumnWidth, 600, topics);
      visualizeTermTopicConnections(termTopicConnectionContainer, connectionColumnWidth, 600, terms, topics, connections);
      updateTermTopicFills();
      updateConnectionStrokes();
    };

    User.updateSessionInfo($stateParams.userId, $stateParams.collectionId, function(userId, collection) {
      $scope.userId = userId;
      $scope.collection = collection;

      Logger.logAction($scope.userId, 'load explore view', 'v2','1', 'explore', {
        collectionId: $scope.collection.id
      }, function(response) {
        console.log('action logged: load explore view');
      });

      User.proposals(function(_proposals) {
        $scope.proposals = _proposals;
        loadEvidence();
      })
    });

    function loadEvidence() {
      Collection
        .id($scope.collection.id)
        .allTopics(function(topics) {
          $scope.loadingEvidence = false;
          $scope.topics = topics;
          TermTopic.initialize($scope.topics);
          $scope.terms = TermTopic.getAllTerms();
          $scope.selected.searchTerm = $scope.terms[0];
          $scope.numTerms = TermTopic.numOfTerms();
          $scope.numTopics = TermTopic.numOfTopics();
          visualizeTopicTermDistribution();
          if (User.selectedEvidence() === null) {
            $scope.selected.searchTitle = ExploreState.selectedSearchTitle();
          }
          else {
            Core.getEvidenceByTitle($scope.collection.id, $scope.userId, User.selectedEvidence().title, true, 1, function(response) {
              updateCandidateEvidence(response.data);
            });      
          }
          Bookmark
            .userId($scope.userId)
            .evidence(function(evidence, idMap) {});
      });
    }

    function updateCandidateEvidence(evidence) {
      $scope.candidateEvidence = evidence;
      $scope.selected.searchTitle = $scope.candidateEvidence[0];
//      $scope.selectSearchTitle($scope.selected.searchTitle);
      ExploreState.candidateEvidence($scope.candidateEvidence);
      console.log($scope.candidateEvidence);
      var topics = {}
      evidence.forEach(function(e) {
        if (topics[e.topic] === undefined) {
          topics[e.topic] = 0;
        }
        topics[e.topic] += 1;
      });
      $scope.candidateEvidenceTopics = _.sortBy(_.pairs(topics).map(function(t) {
        return [parseInt(t[0]), t[1]];
      }), function(tuple) {
        return -tuple[1];
      });
      ExploreState.candidateEvidenceTopics($scope.candidateEvidenceTopics);
    }

    $scope.evidenceHasTopic = function(topic) {
        return function(evidence) {
            return evidence.topic == topic;
        }
    }

    $scope.clearSelectedTerms = function() {
      Logger.logAction($scope.userId, 'clear selected terms', 'v2','1', 'explore', {
        numSelectedTerms: $scope.selectedTerms.length
      }, function(response) {
        console.log('action logged: clear selected terms');
      });
      $scope.selectedTerms.length = 0;
      $scope.updateTermTopicOrdering(false, false);
    }

    $scope.searchEvidenceByTitle = function() {
      Logger.logAction($scope.userId, 'search evidence by title', 'v2','1', 'explore', {
        query: $scope.searchTitle
      }, function(response) {
        console.log('action logged: search evidence by title');
      });

      Core.getEvidenceByTitle($scope.collection.id, $scope.userId, $scope.searchTitle, true, 25, function(response) {
        updateCandidateEvidence(response.data);
      });
    };

    $scope.selectSearchTerm = function(term) {
      Logger.logAction($scope.userId, 'select search term', 'v2','1', 'explore', {
      }, function(response) {
        console.log('action logged: select search term');
      });
      $scope.selectedTerms.push(term.term);
      $scope.termStartIndex = 0;
      $scope.updateTermTopicOrdering(false, true);
    };

    $scope.citeEvidence = function (evidence, sourceList) {
      var textParaId = User.activeProposal().id+ '-' + User.selectedParagraph();
      if (AssociationMap.hasAssociation('evidence', 'text', evidence.id, textParaId)) {
        return;
      }
      Logger.logAction($scope.userId, 'cite evidence', 'v2', '1', 'explore', {          
        proposal: User.activeProposal().id,
        paragraph: User.selectedParagraph(),
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {
        if (isDebug)
          console.log('action logged: cite evidence');
      });        
      //Add association
      $scope.flipBookmark(evidence);
      AssociationMap.addAssociation($scope.userId,'evidence', 'text', evidence.id, textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = User.citedEvidence().map(function(e) {
          return e.id;
        }).indexOf(evidence.id);          
        if (index === -1) {
          User.citedEvidence().push(evidence);
          index = User.citedEvidence().length - 1;     
          Bookmark.evidenceIdMap()[evidence.id] = evidence;
        }
        // Add the association to text evidence association for book-keeping (since we need to update the association entry
        // when new paragraphs are added)
        // TODO: double check if it's ok for us to skip the following step - I think we are since textEvidenceAssociations is 
        // created every time the focus view is loaded
        /*
        textEvidenceAssociations.push(association); */
        User.paragraphCitation()[User.selectedParagraph()].push({            
          index: index,
          evidence: evidence
        });
        // TODO: double check that it is fine to not update proposal for download here
        // prepareProposalDownload();
      });          
    };

    $scope.showNextTerms = function() {
      if (TermTopic.numOfTerms() > $scope.termStartIndex + termBatchSize) {

        Logger.logAction($scope.userId, 'scroll terms', 'v2','1', 'explore', {
          direction: 'forward'
        }, function(response) {
          console.log('action logged: scroll terms');
        });

        $scope.termStartIndex += termBatchSize;
        $scope.updateTermTopicOrdering(false, false);
      }
    };

    $scope.showPrevTerms = function() {
      if ($scope.termStartIndex - termBatchSize >= 0) {

        Logger.logAction($scope.userId, 'scroll terms', 'v2','1', 'explore', {
          direction: 'backward'
        }, function(response) {
          console.log('action logged: scroll terms');
        });

        $scope.termStartIndex -= termBatchSize;
        $scope.updateTermTopicOrdering(false, false);
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
        if (matchesTerm(w, term)) {
          return true;
        }
      }
      return false;
    };

    function matchesTerm(word, term) {
        var term_parts = term.split(' ');
        var word_parts = word.split('-');
        if (term_parts.indexOf(word) > -1) {
          return true;
        }
        for (var j = 0; j < word_parts.length; ++j) {
          var wp = word_parts[j];
          if (term_parts.indexOf(wp) > -1) {
            return true;
          }
        } 
        return false;    
    }

    $scope.selectEvidence = function(evidence) {
      Logger.logAction($scope.userId, 'select evidence', 'v2', '1', 'explore', {
        evidence: evidence.id,
      }, function(response) {
        console.log('action logged: select evidence');
      });

      $scope.selectedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');
      updateRelatedEvidence(evidence);
    }

    $scope.selectRelatedEvidence = function(evidence) {
      Logger.logAction($scope.userId, 'select related evidence', 'v2', '1', 'explore', {
        evidence: evidence.id,
      }, function(response) {
        console.log('action logged: select related evidence');
      });

      $scope.selectedRelatedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');
    }

    // Get co-occurred terms and publications with those labels
    $scope.getNeighborConcepts = function() {

      Pubmed.findNeighborConcepts($scope.selectedConcepts, 1, function(response) {
        console.log(response);
      }, function(errorRespone) {

      });
    };

    $scope.flipBookmark = function(e, source) {
      Bookmark.flipBookmark(e, 'explore', source); 
    }

    function visualizeTopicTermDistribution(topics) {
      var params = {
        width: 1800,
        height: 600,
        margin: { 
          left: 50,
          top: 25,
          bottom: 20,
          right: 0
        },
        termNum: 50
      };

      var canvas = d3.select('#topic-term-dist')
        .attr('width', params.width + params.margin.left + params.margin.right)
        .attr('height', params.height + params.margin.top + params.margin.bottom);

/*
      canvas.append('text')
        .text('Similar topics')
        .attr('font-size', 18)
        .attr('transform', 'translate(1150, 20)'); */

      canvas.append('text')
        .text('# of docs')
        .attr('font-size', 14)
        .attr('transform', 'translate(450, ' + 10 + ')');

      canvas.append('text')
        .text('term distribution')
        .attr('font-size', 14)
        .attr('transform', 'translate(725, ' + 10 + ')');

      var terms = TermTopic.getTopTerms('weight', termBatchSize, $scope.termStartIndex);
      var topicAndConnections = TermTopic.getTopTopics(terms, topicBatchSize);
      var topics = topicAndConnections.topics;
      var termTopicConnections = topicAndConnections.termTopicConnections;

      topTermContainer = configSvgContainer(canvas.append('svg'), termColumnWidth, params.height, params.margin.left, params.margin.top);
      termTopicConnectionContainer = configSvgContainer(canvas.append('svg'), connectionColumnWidth, params.height, params.margin.left + 200, params.margin.top);
      topTopicContainer = configSvgContainer(canvas.append('svg'), topicColumnWidth, params.height, params.margin.left + 250, params.margin.top);
//      topicNeighborContainer = configSvgContainer(canvas.append('svg'), 600, params.height + 30, params.margin.left + 1050, params.margin.top - 30);
//      proposalThumbnailsContainer = configSvgContainer(canvas.append('svg'), 600, params.height + 30, params.margin.left + 1050, params.margin.top - 30);
      thumbnailSidebarContainer = configSvgContainer(canvas.select('#thumbnail-sidebar'), 60, params.height, params.margin.left + 1050, params.margin.top);
      proposalThumbnailsContainer = d3.select('#selected-thumbnail');

      visualizeTopTerms(topTermContainer, termColumnWidth, 600, terms);
      visualizeTermTopicConnections(termTopicConnectionContainer, connectionColumnWidth, 600, terms, topics, termTopicConnections);
      visualizeTopTopics(topTopicContainer, topicColumnWidth, 600, topics);
//      visualizeThumbnailSidebar(thumbnailSidebarContainer, 60, 600);
//      visualizeProposalThumbnails(proposalThumbnailsContainer, 600, 600);
      if ($scope.selectedTopic !== null) setSelectedTopic($scope.selectedTopic);
      if ($scope.selected.searchTitle !== null && $scope.selected.searchTitle !== undefined) 
        $scope.selectSearchTitle($scope.selected.searchTitle);
      updateTermTopicFills();
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
        .range([10, width-130]); // 100 pixels are allocated to the texts

      var y = d3.scale.ordinal()
        .domain(d3.range(termBatchSize))
        .rangeBands([0, height], 0.05);

      var term = container.selectAll('.term')
        .data(topTerms, function(d) {
          return d.term;
        });

      term.exit().remove();
      var newTerms = term.enter()
        .append('g')
        .attr('class', 'term');
      term.transition()
        .attr('transform', function(d, i) {
          return 'translate(100, ' + y(i) + ')'; // Each group is moved right by 100, to leave 100 pixels for the texts
        });

      newTerms.append('text')
        .text(function(term) {
          return term.term;
        })
        .attr('font-weight', 300)
        .attr('text-anchor', 'end')
        .attr('dy', 13);

      newTerms.append('rect')
        .attr('width', function(d) {
          return x(d.properties.weight);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .attr('transform', 'translate(20, 0)') // Space between rectangles and texts
        .on('mouseover', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) return;
          d3.select(this).attr('fill', '#a6bddb');
          d3.selectAll('.connection')
            .filter(function(curve) {
              return $scope.selectedTerms.indexOf(curve.term.term) < 0;
            })
            .attr('stroke', function(curve, i) {
              return curve.term.term === d.term ? '#a6bddb' : '#ccc';
            })
            .attr('stroke-width', function(curve, i) {
              return curve.term.term === d.term ? 2 : 1;
            })
            .attr('opacity', function(curve, i) {
              return curve.term.term === d.term ? 0.75 : 0.25;
            });
          topTopicContainer.selectAll('.topic-term-selector')
            .attr('fill', function(topicTerm, i) {
              if ($scope.selectedTerms.indexOf(topicTerm.term) >= 0) {
                return termColorMap(topicTerm.term);
              }
              else if (topicTerm.term === d.term) {
                return '#a6bddb';
              }
              else {
                return '#ccc';
              }
            });
        })
        .on('mouseout', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) return;
//          d3.select(this).attr('fill', '#ccc');
          updateTermTopicFills();
          d3.selectAll('.connection')
            .filter(function(curve) {
              return $scope.selectedTerms.indexOf(curve.term.term) < 0;
            })
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5);
        })
        .on('click', function(d) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            Logger.logAction($scope.userId, 'deselect term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              topicCount: d.properties.topicCount,
              target: 'term index'
            }, function(response) {
              console.log('action logged: deselect term');
            });
            $scope.selectedTerms = _.without($scope.selectedTerms, d.term);
          }
          else {
            Logger.logAction($scope.userId, 'select term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              topicCount: d.properties.topicCount,
              target: 'term index'
            }, function(response) {
              console.log('action logged: select term');
            });
            $scope.selectedTerms.push(d.term);
          }
//          $scope.updateTermTopicOrdering();
          updateTermTopicFills();
          updateConnectionStrokes();
        });
    }

    function updateTermTopicFills() {
      // Uncomment the following to color terms by their position in the $scope.selectedTerms array
//      termColorMap.domain($scope.selectedTerms);
      topTermContainer.selectAll('rect')
        .attr('fill', function(d, i) {
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            return termColorMap(d.term);
          }
          else { return '#ccc'; }
        });
      topTopicContainer.selectAll('.topic-term-selector')
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
        .attr('stroke-width', function(d, i) {
          return ($scope.selectedTerms.length === 0 || $scope.selectedTerms.indexOf(d.term.term) >= 0) ? 2 : 1;
        })
        .attr('opacity', function(d, i) {
          return ($scope.selectedTerms.length === 0 || $scope.selectedTerms.indexOf(d.term.term) >= 0) ? 0.75 : 0.25;
        });
    }

    function visualizeTopTopics(container, width, height, topTopics) {

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

      var numDocScale = d3.scale.linear()
        .domain([
            d3.min(topTopics, function(d) {
              return d.evidenceCount;
            }), d3.max(topTopics, function(d) {
              return d.evidenceCount
            })
          ])
        .range([5, 10]);

      visualizeIndividualTopic(newTopics, width-50, y, numDocScale);
    }

    function selectTopic(d, source, selectedEvidence) {
      var highlightOpacity = 0.3;
      Logger.logAction($scope.userId, 'select topic', 'v2','1', 'explore', {
        topic: d.id,
        target: 'individual topic',
        source: source
      }, function(response) {
        console.log('action logged: select topic');
      });

      d3.selectAll('.topic-background').attr('opacity', 0);
      d3.select('#topic-bg-' + d.id).attr('opacity', highlightOpacity);        
      setSelectedTopic(d, selectedEvidence);
    }

    function visualizeIndividualTopic(topic, width, y, numDocScale) {

      var termWidth = width - 10;
      var highlightOpacity = 0.3;

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
        .attr('opacity', 0, function(d) {
          return ($scope.selectedTopic !== null && d.id === $scope.selectedTopic.id) ? highlightOpacity : 0;
        })
        .on('mouseover', function(d) {
          d3.selectAll('.topic-background').attr('opacity', 0);
          d3.select('#topic-bg-' + d.id)
            .attr('opacity', highlightOpacity);          
          if ($scope.selectedTopic !== null) {
            d3.select('#topic-bg-' + $scope.selectedTopic.id).attr('opacity', highlightOpacity); 
          }

        })
        .on('mouseout', function() {
          d3.selectAll('.topic-background').attr('opacity', function(d) {
            return ($scope.selectedTopic !== null && d.id === $scope.selectedTopic.id) ? highlightOpacity : 0;
          });          
        })
        .on('click', function(d) {
          selectTopic(d, 'direct');
        });

      topic.append('circle')
        .attr('class', 'topic-selector')
        .attr('id', function(d) {
          return 'topic-selector-' + d.id;
        })
        .attr('pointer-events', 'none')
        .attr('r', function(d, i) {
          return numDocScale(d.evidenceCount);
        })
        .attr('transform', 'translate(-20, 9)')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('fill', '#e5e5e5');
/*
      topic.append('text')
        .text(function(topic) {
          return topic.evidenceCount;
        })
        .attr('text-anchor', 'end')
        .attr('dy', 13)
        .attr('dx', -20)     */

      var probSum = 1;
      // Hack alert!!!
      if ($scope.collection.id === 12) probSum = 0.2;
      if ($scope.collection.id === 13) probSum = 0.5;
      if ($scope.collection.id === 15) probSum = 0.7;
      if ($scope.collection.id === 16) probSum = 0.2;
      if ($scope.collection.id === 17) probSum = 0.25;

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
        .attr('class', 'topic-term-selector')
        .attr('width', function(d) {
          return Math.max(d.prob * termWidth * (1 / probSum) - 1, 1);
        })
        .attr('height', y.rangeBand())
        .attr('fill', '#ccc')
        .on('click', function(d) {
          // TODO: cannot easily count topic count here, will add if necessary
          if ($scope.selectedTerms.indexOf(d.term) >= 0) {
            Logger.logAction($scope.userId, 'deselect term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              prob: d.prob,
              topic: topic.id,
              target: 'individual topic'
            }, function(response) {
              console.log('action logged: deselect term');
            });
            $scope.selectedTerms = _.without($scope.selectedTerms, d.term);
          }
          else {
            Logger.logAction($scope.userId, 'select term', 'v2','1', 'explore', {
              term: d.term,
              numSelectedTerms: $scope.selectedTerms.length,
              prob: d.prob,
              topic: topic.id,
              target: 'individual topic'
            }, function(response) {
              console.log('action logged: select term');
            });
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
        .attr('font-weight', 350)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .text(function(d, i) {
          return i < 2 ? d.term : '';
        });      
    }

    function setSelectedTopic(d, evidence) {
      $scope.selectedTopic = d;
      ExploreState.selectedTopic($scope.selectedTopic);      
      $scope.selectedEvidence = evidence === undefined ? null : evidence;
//      visualizeTopicNeighborMatrix(topicNeighborContainer, 600, 600, d);
      $scope.selectedDocumentTerms = _.object(_.range(10).map(function(num) {
        return [num, false];
      }));
      $scope.loadingTopicEvidence = true;
      Core.getEvidenceByTopic($scope.collection.id, d.id, $scope.userId, function(response) {
        $scope.evidence = response.data.evidence;
        var bookmarkedEvidence = response.data.evidenceBookmarks.map(function(b) {
          return b.evidence;
        });
        $scope.evidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
          e.bookmarked = bookmarkedEvidence.indexOf(e.id) >= 0;
        })
        response.data.evidencePersonal.forEach(function(e) {
          e.bookmarked = true;
          e.metadata = JSON.parse(e.metadata);
          $scope.evidence.push(e);
        })
        $scope.loadingTopicEvidence = false;
      }, function(errorResponse) {
        console.log(errorResponse);
      })      
    }

    function updateRelatedEvidence(evidence) {
      var citations = Paper.getCitationsForPaper(evidence.id);
      var references = Paper.getReferencesForPaper(evidence.id);
      $scope.selectedEvidenceCounts.relatedBookmarked = 0;
      $scope.selectedEvidenceCounts.relatedTotal = citations.length + references.length;
      $scope.relatedEvidence = [];
      citations.forEach(function(d) {
        $scope.relatedEvidence.push({
          evidence: d,
          relation: 'citation'
        });
        if (d.bookmarked) $scope.selectedEvidenceCounts.relatedBookmarked += 1;
      });
      references.forEach(function(d) {
        $scope.relatedEvidence.push({
          evidence: d,
          relation: 'reference'
        });
        if (d.bookmarked) $scope.selectedEvidenceCounts.relatedBookmarked += 1;
      })      
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
        .interpolate('bundle')
        .tension(1);

      var curve = container.selectAll('.connection')
        .data(connections, function(d, i) {
          return d.term.origIndex + '-' + d.topic.id;
        });

      curve.exit().remove();

      curve.enter()
        .append('path')
        .attr('class', 'connection')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-with', 1)
        .attr('opacity', 0.5);

      curve
        .attr('d', function(d) {
          var termPos = 5 + termY(termIndexMap[d.term.origIndex]);
          var topicPos = 9 + topicY(topicIndexMap[d.topic.id]);
          var points = [
            {x: 0, y: termPos},
            {x: 30, y: termPos},
            {x: 30, y: topicPos},
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

    // Deprecated - replaced by visualizeTopicNeighborMatrix
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

    function visualizeTopicNeighborMatrix(container, assignedWidth, assignedHeight, topic) {
      var topTerms = _.take(topic.terms, 10);
      var neighborTopics = TermTopic.getNeighborTopics(topic, 2);

      var width = Math.min(assignedWidth, topTerms.length * 30);
      var height = Math.min(assignedHeight, neighborTopics.length * 20);

      var margin = {
        top: 80,
        left: 20
      }

      var x = d3.scale.ordinal()
        .domain(topTerms.map(function(term) {
          return term.term;
        }))
        .rangeBands([0, width]);
      var y = d3.scale.ordinal()
        .domain(_.sortBy(neighborTopics, function(topic) {
          return topic.numSharedTerms;
        }).map(function(topic) {
          return topic.id;
        }))
        .rangeBands([0, height]);

      container.selectAll('.topic-row').remove();
      container.selectAll('.term-col').remove();

      var row = container.selectAll('.topic-row')
        .data(neighborTopics)
        .enter()
        .append('g')
        .attr('class', 'topic-row')
        .attr('transform', function(d) {
          return 'translate(' + margin.left + ', ' + (margin.top+y(d.id)) + ')';
        });

      row.append('line')
        .attr('x2', width)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      row.append('rect')
        .attr('class', 'topic-rect')
        .attr('height', 20)
        .attr('width', width)
        .attr('stroke', 'white')
        .attr('fill', '#ccc')
        .on('mouseover', function(d, i) {
          d3.select(this)
            .attr('fill', 'steelblue');
        })
        .on('mouseout', function(d, i) {
          d3.select(this)
            .attr('fill', '#ccc');          
        })
        .on('click', function(d, i) {
          Logger.logAction($scope.userId, 'select topic', 'v2','1', 'explore', {
            topic: d.id,
            target: 'neighbor topic matrix'
          }, function(response) {
            console.log('action logged: select topic');
          });
          setSelectedTopic(d);
        });      

      var column = container.selectAll('.term-col')
        .data(topTerms)
        .enter()
        .append('g')
        .attr('class', 'term-col')
        .attr('transform', function(d) {
          return 'translate(' + (margin.left + x(d.term)) + ', ' + margin.top + ')';
        });

/*
      column.append('line')
        .attr('y2', height)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1); */

      column.append('text')
        .attr('text-anchor', 'start')
        .attr('dx', 10)
        .attr('transform', 'rotate(-45)')
        .text(function(d, i) {
          return d.term;
        });

      column.selectAll('circle')
        .data(function(term) {
          return _.filter(neighborTopics, function(topic) {
            return topic.terms.map(function(t) {
              return t.term;
            }).indexOf(term.term) > -1;
          });
        })
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', 'white')
        .attr('transform', function(d) {
          return 'translate(15, ' + (10+y(d.id)) + ')'
        });
    }

    // Deprecated; replaced by visualizeTopicNeighborMatrix
    function visualizeTopicCentricGraph(container, topic) {

      container.selectAll('.node').remove();
      container.selectAll('.link').remove();
      container.selectAll('text').remove();

      var results = TermTopic.getNeighborTopics(topic, 2);
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
    }

    $scope.selectTermToFilterDocuments = function(term, index) {
      var numSelectedDocTerms = 0;
      for (var i = 0; i < 10; ++i) {
        if ($scope.selectedDocumentTerms[i]) {
          numSelectedDocTerms += 1;
        }
      }
      Logger.logAction($scope.userId, 'select term to filter documents', 'v2','1', 'explore', {
        topic: $scope.selectedTopic.id,
        numSelectedTerms: numSelectedDocTerms,
        numDocuments: $scope.evidence.length
      }, function(response) {
        console.log('action logged: select term to filter documents');
      });
      // Update the colors of the terms
      var colorScale = d3.scale.category20()
        .domain(_.range(10));
      $scope.selectedDocumentTerms[index] = !$scope.selectedDocumentTerms[index];
      d3.selectAll('.selected-topic-term')
        .style('font-weight', function(d, i) {
          return $scope.selectedDocumentTerms[i] ? 600 : 400;
        })

      d3.selectAll('.selected-topic-term')
        .style('color', function(d, i){
          if ($scope.selectedDocumentTerms[i]) {
            return colorScale(i);
          }
          else {
            return 'black';
//            return i % 2 === 0 ? '#eee' : '#fff';
          }
        });
      // Sort the documents with the selected terms
      // #marker
      // This could be optimized by cacheing the scores for each evidence and term pair
      var evidenceTermMap = {};
      $scope.evidence.forEach(function(evidence) {
        evidenceTermMap[evidence.id] = {};
        for (var i = 0; i < 10; ++i) {
          evidenceTermMap[evidence.id][i] = 0;
          var term = $scope.selectedTopic.terms[i].term;
          var words = evidence.abstract.split(' ');
          for (var j in words) {
            var w = words[j];
            evidenceTermMap[evidence.id][i] += matchesTerm(w, term) ? 1 : 0;  
          }
        }
      });

      // Append labels to each document to indicate which terms it contains
      d3.selectAll('.doc-decorator')
        .selectAll('g')
        .remove();
      d3.selectAll('.doc-decorator')
        .data($scope.evidence)
        .append('g')
        .selectAll('rect')
        .data(function(d, i) {
          console.log(_.pairs(evidenceTermMap[d.id]).length);
          return _.pairs(evidenceTermMap[d.id]).map(function(pair) {
            return {
              termCount: pair[1],
              evidenceId: d.id
            }
          });
        })
        .enter()
        .append('rect')
        .attr('width', function(d, i) {
          console.log(i)
          console.log($scope.selectedDocumentTerms[i])
          return (d.termCount > 0 && $scope.selectedDocumentTerms[i]) ? 10 : 0;
        })
        .attr('height', 20)
        .attr('fill', function(d, i) {
          return colorScale(i);
        })
        .attr('x', function(d, i) {
          var shift = 0;
          var scores = evidenceTermMap[d.evidenceId];
          for (var j = 0; j < i; ++j) {
            shift += (scores[j] > 0 && $scope.selectedDocumentTerms[j]) ? 10 : 0;
          }
          return shift;
          return 'translate(' + shift + ', 0)';
        })
        .on('click', function(d, i) {
          console.log(d, i);
        });

      $scope.evidence = _.sortBy($scope.evidence, function(evidence) {
        var totalScore = 0;
        for (var i = 0; i < 10; ++i) {
          if ($scope.selectedDocumentTerms[i]) {
            totalScore += evidenceTermMap[evidence.id][i];
          }
        }
        return -totalScore;
      });
    };

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
