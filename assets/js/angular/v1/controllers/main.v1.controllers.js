angular.module('v1.controllers')
  .controller('BaselineController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed', 'Bibtex',
    function($scope, $modal, Core, AssociationMap, Pubmed, Bibtex) {

    var userId = 101;
    var topicColors = ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"];

    Core.getAllDataForUser(userId, function(response) {
      console.log(response.data)
      $scope.texts = response.data.texts;
      $scope.concepts = response.data.concepts;
      console.log(d3.selectAll('.topic-info'));
    }, function(response) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(response);
    });

    $scope.loadingEvidence = true;
    $scope.loadingStatement = 'Generating topic models over bookmarked evidence...';
    Core.getEvidenceTextTopicsForUser(userId, function(response) {
      $scope.topics = response.data.topics;
      $scope.evidence = response.data.evidence.map(function(e) {
        e.metadata = JSON.parse(e.metadata);
        return e;
      });
      console.log(response.data.evidenceTextTopicMap);
      $scope.evidenceTopicMap = _.object(_.map(_.omit(response.data.evidenceTextTopicMap, function(value, key) {
        return !key.startsWith('e');
      }), function(value, key) {
        return [key.split('-')[1], value.max]
      }));
      $scope.textTopicMap = _.object(_.map(_.omit(response.data.evidenceTextTopicMap, function(value, key) {
        return !key.startsWith('t');
      }), function(value, key) {
        return [key.split('-')[1], value.dist]
      }));
      $scope.evidenceSourceMap = _.object(_.map($scope.evidence, function(e) {
        return [e.id, 1];
      }));
      $scope.loadingEvidence = false;
      console.log($scope.texts);
      console.log(d3.selectAll('.topic-info'));
      d3.selectAll('.topic-info')
        .data($scope.texts)
        .append('g')        
        .selectAll('rect')
        .data(function(t) {
          var distribution = $scope.textTopicMap[t.id];
          var accumulation = distribution.reduce(function(prev, curr, index) {
            if (index === 0) {
              return prev.concat([curr]);
            }
            else {
              return prev.concat([curr + prev[prev.length-1]])
            }
          }, [0]);
          return distribution.map(function(d, i) {
            console.log(i);
            return {
              'dist': d,
              'acc': accumulation[i]
            };
          });
        })
        .enter()
        .append('rect')
        .attr('fill', function(d, i) {
          return topicColors[i];
        })
        .attr('width', function(d) {
          return d.dist * 150;
        })
        .attr('height', 20)
        .attr('transform', function(d, i) {
          var left = d.acc * 150;
          return 'translate(' + left + ',0)';
        });
    });

    AssociationMap.initialize(userId);

    // TODO: get peronal evidence after being processed by topic modeling; also
    // throw in user created articles into the topic modeling process; this way, 
    // personal references are automatically grouped with existing user created 
    // articles

    // terms extracted from the selected text
    $scope.terms = [];
    $scope.topics = null;
    $scope.evidenceSourceMap = {};

    $scope.selectedEntry = {};
    $scope.selectedEntry['text'] = null;
    $scope.selectedEntry['evidence'] = null;
    $scope.selectedTerms = [];
    $scope.selectedTopic = -1;

    $scope.hasUnsavedChanges = false;
    $scope.associationSource = '';
    $scope.evidenceTextAssociated = false;

    $scope.filterSwitches = {};
    $scope.filterSwitches['text'] = false;
    $scope.filterSwitches['evidence'] = false;

    $scope.associatedIds = {};
    $scope.associatedIds['text'] = [];
    $scope.associatedIds['evidence'] = [];

    $scope.topics = [];
    $scope.evidence = [];
    $scope.evidenceTopicMap = {};
    $scope.textTopicMap = {};

    /* ========== Selector functions Begin ========== */

    $scope.selectEntry = function(elem, type) {
      if (elem === $scope.selectedEntry[type]) {
        $scope.selectedEntry[type] = null;
        if (type === 'text') $scope.activeText = '';
      }
      else {
        $scope.selectedEntry[type] = elem;
        if (type === 'text') $scope.activeText = $scope.selectedEntry['text'].content;
      }
      if ($scope.selectedEntry['evidence'] != null && $scope.selectedEntry['text'] != null) {
        $scope.evidenceTextAssociated = AssociationMap.hasAssociation('evidence', 'text',
          $scope.selectedEntry['evidence'].id,
          $scope.selectedEntry['text'].id
        );
      }
    } 

    $scope.selectTerm = function(term) {
      if ($scope.selectedTerms.indexOf(term) >= 0) {
        $scope.selectedTerms = _.without($scope.selectedTerms, term);
      }
      else {
        $scope.selectedTerms.push(term);
      }
    }

    $scope.selectTopic = function(topicIndex) {
      $scope.selectedTopic = ($scope.selectedTopic === topicIndex) ? -1 : topicIndex;
    }

    /* ========== Selector functions End ========== */

    /* ========== Input handling functions Begin ========== */

    $scope.addTextEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/textsModal.html',
        controller: 'TextsModalController',
        resolve: {
          textsInfo: function() {
            return {
              id: -1,
              title: "",
              content: ""
            }
          },
          concepts: function() {
            return $scope.concepts;
          },
          evidence: function() {
            return $scope.evidence;
          },
          userId: function() {
            return userId;
          }
        }
      });

      modalInstance.result.then(function (newEntry) {
        $scope.texts.push(newEntry);  
      });
    }

    $scope.addEvidenceEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/evidenceModal.html',
        controller: 'EvidenceModalController',
        resolve: {
          userId: function() {
            return userId;
          }
        }
      });

      modalInstance.result.then(function (newEntries) {
        console.log(newEntries);
        $scope.evidence = $scope.evidence.concat(newEntries); 
        extendEvidenceMap(newEntries, 1);
      });      
    }


    // TODO: fill in
    $scope.updateEvidenceEntry = function() {
    }

    $scope.saveTextEntry = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modal/saveModal.html',
        controller: 'SaveModalController',
        resolve: {
          textEntry: function() {
            return $scope.selectedEntry['text'];
          }
        }
      });

      modalInstance.result.then(function (newEntry) {
        $scope.selectedEntry['text'].content = $scope.activeText;
        $scope.hasUnsavedChanges = false;
      });      
    }

    $scope.deleteEntry = function(type) {
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            switch (type) {
              case 'text': return $scope.selectedEntry[type].title;
              case 'evidence': return $scope.selectedEntry[type].title;
            }
          },
          id: function() {
            return $scope.selectedEntry[type].id;
          },
          type: function() {
            return type;
          },
          userId: function() {
            return userId;
          }
        }
      });      

      var target = (type === 'text') 
        ? $scope.texts : $scope.evidence;
      modalInstance.result.then(function (deletedEntryId) {
        _.remove(target, function(elem) {
          return elem.id === deletedEntryId;
        })
      });
    }

    /* ========== Input handling functions End ========== */

    /* ========== Boolean functions Begin ========== */

    $scope.termSelected = function(term) {
      return $scope.selectedTerms.indexOf(term) >= 0;
    };

    $scope.evidenceTextAssociated = function() {
      if ($scope.selectedEntry['evidence']===null || $scope.selectedEntry['text']===null) {
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', 
        $scope.selectedEntry['evidence'].id, 
        $scope.selectedEntry['text'].id
      );
    };

    $scope.isAssociated = function(e, t) {
      if (t === null) {
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', e.id, t.id);
    };

    /* ========== Boolean functions En ========== */

    /* ========== Event handling functions Begin ========== */

    $scope.startMakingChanges = function() {
      $scope.hasUnsavedChanges = true;
    }

    $scope.showAssociation = function(type) {
      if ($scope.associationSource === type) {
        updateAssociationSource('');
      }
      else {
        updateAssociationSource(type);
        switch (type) {
          case 'text': {
            $scope.associatedIds['evidence'] = AssociationMap.getAssociatedIdsByTarget('evidence', 'text', $scope.selectedEntry['text'].id);
            break;
          }
          case 'evidence': {
            $scope.associatedIds['text'] = AssociationMap.getAssociatedIdsBySource('evidence', 'text', $scope.selectedEntry['evidence'].id);
            break;
          }
        }
      }
    };

    function updateAssociationSource(source) {
      _.forOwn($scope.filterSwitches, function(value, key) {
        $scope.filterSwitches[key] = source !== '' && source !== key; 
      });
      $scope.associationSource = source;
    };

    $scope.associationInactive = function(source) {
      return $scope.selectedEntry[source]===null || ($scope.associationSource !== '' && $scope.associationSource !== source)
    };

    // Add an association between the selected evidence and the active text
    $scope.updateEvidenceAssociation = function() {
      console.log('updare evidence association');
      var eid = $scope.selectedEntry['evidence'].id;
      var tid = $scope.selectedEntry['text'].id;
      console.log('association map shows having association? ' + AssociationMap.hasAssociation('evidence', 'text', eid, tid));
      if ($scope.evidenceTextAssociated) {
        AssociationMap.removeAssociation(userId, 'evidence', 'text', eid, tid, function() {
          $scope.evidenceTextAssociated = false;          
        });   
      }
      else {
        AssociationMap.addAssociation(userId, 'evidence', 'text', 
          eid, tid, function() {
            $scope.evidenceSourceMap[eid] = 1;
            $scope.evidenceTextAssociated = true;
          });        
      }
    };

    /* ========== Event handling functions End ========== */

    /* ========== Filter functions Begin ========== */
    $scope.filterColumn = function(source) {
      if ($scope.filterSwitches[source]) {
        return function(entry) {
          return $scope.associatedIds[source].indexOf(entry.id) > -1;
        }
      }
      else {
        return function() {
          return true;
        }
      }
    };

    $scope.filterTerms = function() {
      return function(term) {
        return term.frequency > 1 || term.length > 1;
      };
    };

    $scope.filterEvidence = function() {
      return function(evidence) {
        return $scope.selectedTopic === -1 || $scope.evidenceTopicMap[evidence.id] == $scope.selectedTopic;
      }
    };

    $scope.evidenceOrder = function(e) {
      return $scope.isAssociated(e, $scope.selectedEntry['text']) ? 0 : 1;
    };


    /* ========== Filter functions End ========== */

    /* ========== Service requests functions Begin ========== */

    $scope.extractTerms = function() {
      var text = $scope.activeText;
      Pubmed.extractTerms(text, userId, function(response) {
        $scope.selectedTerms = [];
        $scope.terms = response.data;
      }, function(errorResponse) {
        console.log('error occurred while extracting terms');
        console.log(errorResponse)
      })
    }

    $scope.searchEvidenceForTerms = function() {
      var terms = $scope.selectedTerms.map(function(d) {
        return d.term;
      })

      $scope.loadingEvidence = true;
      $scope.loadingStatement = 'Searching PubMed for related publications...';
      // This function is called when the user wants to search the PubMed repo; 
      // There should be another function to handle search within personal reference
      Pubmed.searchEvidenceForTerms(terms, userId, function(response) {
        // After receiving the response, update the evidence list
        $scope.topics = response.data.topics;
        $scope.evidence = response.data.evidence.map(function(e) {
          console.log(e.metadata);
          e.metadata = JSON.parse(e.metadata);
          return e;
        });
        $scope.evidenceTopicMap = response.data.evidenceTopicMap;
        // Merge the new evidence into the existing evidenceSourceMap; make sure we don't
        // overwrite any existing entry
        extendEvidenceMap(response.data.evidence, 0);

        $scope.loadingEvidence = false;
      }, function(errorResponse) {
        console.log('error occurred while searching for evidence');
        console.log(errorResponse)        
      });
      setTimeout(function(){ 
        $scope.$apply(function(){
          $scope.loadingStatement = 'Generating topic models over retrieved evidence...';
        });
      }, 5000);
    }

    function extendEvidenceMap(evidence, source) {
        var newEvidenceMap = _.object(_.map(_.filter(evidence, function(e) {
          return $scope.evidenceSourceMap[e.id] === undefined;
        }), function(e) {
          console.log(e);
          return [e.id, source];
        }));
        _.extend($scope.evidenceSourceMap, newEvidenceMap); 
    }

    /* ========== Service requests functions End ========== */    

    $scope.processBibtexFile = function() {
      var selectedFile = document.getElementById('bibtex-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        var evidenceList = Bibtex.parseBibtexFile(fileContent);      
        var storedEvidence = [];        
        
        evidenceList.forEach(function(evidence) {
          Core.postEvidenceByUserId(userId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), 
            function(response) {
              storedEvidence.push(response.data[0]);
              if (storedEvidence.length === evidenceList.length) {
                $scope.evidence = $scope.evidence.concat(storedEvidence); 
                extendEvidenceMap(storedEvidence, 1);
              }
            }, function(response) {
              console.log('server error when saving new evidence');
              console.log(response);
            });
        });

      };
      reader.readAsText(selectedFile);
    };

  }]);
