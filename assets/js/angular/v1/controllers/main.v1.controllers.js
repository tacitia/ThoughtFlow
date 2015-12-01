angular.module('v1.controllers')
  .controller('BaselineController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Argument', 'Pubmed', 'Bibtex',
    function($scope, $modal, Core, AssociationMap, Argument, Pubmed, Bibtex) {

    var userId = 105;
    var topicColors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]

    Core.getAllDataForUser(userId, function(response) {
      console.log(response.data)
      $scope.texts = response.data.texts;
      $scope.concepts = response.data.concepts;
    }, function(response) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(response);
    });

    $scope.loadingEvidence = true;
    $scope.loadingStatement = 'Generating topic models over bookmarked evidence...';
    Core.getEvidenceTextTopicsForUser(userId, function(response) {
      processEvidenceTextTopics(response, 's');
      $scope.evidenceSourceMap = _.object(_.map($scope.evidence, function(e) {
        return [e.id, 1];
      }));
      visualizeTextTopicDistribution();
    });

    AssociationMap.initialize(userId);

    // terms extracted from the selected text
    $scope.terms = [];
    $scope.topics = null;
    $scope.evidenceSourceMap = {};

    $scope.selectedEntry = {};
    $scope.selectedEntry['text'] = null;
    $scope.selectedEntry['evidence'] = null;
    $scope.selectedWords = [];
    $scope.selectedTerms = [];
    $scope.selectedTopic = -1;
    $scope.evidenceSelectionMap = {};

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

    $scope.showCitingTexts = false;

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
      if ($scope.selectedEntry['evidence'] != null) {
        $scope.selectedWords = $scope.selectedEntry['evidence'].abstract.split(' ');
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

    $scope.addTerm = function() {
      var textComponent = document.getElementById('textContent');
      var selectedText;
      console.log(textComponent.selectionStart)
      // IE version
      if (document.selection != undefined)
      {
        textComponent.focus();
        var sel = document.selection.createRange();
        selectedText = sel.text;
      }
      // Mozilla version
      else if (textComponent.selectionStart != undefined)
      {
        var startPos = textComponent.selectionStart;
        var endPos = textComponent.selectionEnd;
        selectedText = textComponent.value.substring(startPos, endPos)
      }
      $scope.terms.push({
        frequency: -1,
        length: selectedText.split(' ').length,
        term:selectedText
      });
      console.log($scope.terms);
    };

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
      var newText = $scope.selectedEntry['text'];
      newText.content = $scope.activeText;
      var modalInstance = $modal.open({
        templateUrl: 'modal/saveModal.html',
        controller: 'SaveModalController',
        resolve: {
          textEntry: function() {
            return $scope.selectedEntry['text'];
          },
          userId: function() {
            return userId;
          }
        }
      });

      modalInstance.result.then(function (newEntry) {
        $scope.selectedEntry['text'].content = $scope.activeText;
        $scope.hasUnsavedChanges = false;
      });      
    }

    $scope.deleteEntry = function(type) {
      var selectedEvidence = _.keys(_.pick($scope.evidenceSelectionMap, function(value, key) {
        return value;
      }));
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            if (selectedEvidence.length > 0) {
              return selectedEvidence.length + ' publications';
            }
            else {
              switch (type) {
                case 'text': return $scope.selectedEntry[type].title;
                case 'evidence': return $scope.selectedEntry[type].title;
              }
            }
          },
          id: function() {
            if (selectedEvidence.length > 0) {
              return selectedEvidence;
            }
            else {
              return [$scope.selectedEntry[type].id];
            }
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
        for (var i = 0; i < deletedEntryId.length; ++i) {
          var entryId = deletedEntryId[i];
          _.remove(target, function(elem) {
            return elem.id == entryId;
          })
          if (type === 'evidence') {
            $scope.evidenceSelectionMap[entryId] = false;
          }
        };
      });
    }

    /* ========== Input handling functions End ========== */

    /* ========== Boolean functions Begin ========== */

    $scope.isSearchTerm = function(w) {
      if (w === 'of') {
        return false;
      }
      for (var i = 0; i < $scope.selectedTerms.length; ++i) {
        var term = $scope.selectedTerms[i].term;
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

    $scope.isTopicTerm = function(w) {
      if (w === 'of') {
        return false;
      }
      if ($scope.selectedTopic === -1) return false;
      var topicTerms = $scope.topics[$scope.selectedTopic];
      for (var i = 0; i < topicTerms.length; ++i) {
        var term = topicTerms[i];
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
    }

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
      if (e ===null || t === null) {
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', e.id, t.id);
    };
    $scope.cites = function(t, e) {
      if (e ===null || t === null) {
        return false;
      }
      return AssociationMap.hasAssociation('evidence', 'text', e.id, t.id);
    };
    $scope.toggleShowCitingTexts = function() {
        $scope.showCitingTexts = !$scope.showCitingTexts;
      console.log('show citing texts');
      console.log($scope.showCitingTexts);
    };


    /* ========== Boolean functions En ========== */

    /* ========== Event handling functions Begin ========== */

    $scope.startMakingChanges = function() {
      $scope.hasUnsavedChanges = true;
    }

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
        return true;
//        return term.frequency > 1 || term.length > 1;
      };
    };

    $scope.filterEvidence = function() {
      return function(evidence) {
        return $scope.selectedTopic === -1 || $scope.evidenceTopicMap[evidence.id] == $scope.selectedTopic;
      }
    };

    $scope.evidenceOrder = function(e) {
      // 1000 and 500 are random...
      var order = 1000 - $scope.countTextsReferencingEvidence(e);
      if ($scope.isAssociated(e, $scope.selectedEntry['text'])) {
        order -= 1000;
      }
      if ($scope.evidenceSourceMap[e.id] === 0) {
        order = 1000;
      }

      return order;
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
        processEvidenceTextTopics(response, 's');
        extendEvidenceMap(response.data.evidence, 0);
        visualizeTextTopicDistribution();
      }, function(errorResponse) {
        console.log('error occurred while searching for evidence');
        console.log(errorResponse)        
      });
      setTimeout(function(){ 
        $scope.$apply(function(){
          $scope.loadingStatement = 'Generating topic models over retrieved evidence...';
        });
      }, 5000);
    };

    $scope.recommendCitations = function() {
      Argument.getEvidenceRecommendation($scope.activeText, function(response) {
        processEvidenceTextTopics(response, 'r');
        extendEvidenceMap(response.data.evidence, 0);
        visualizeTextTopicDistribution();
      }, function(errorResponse) {
        console.log('error occurred while recommending citations');
        console.log(errorResponse);
      });
    };

    function extendEvidenceMap(evidence, source) {
        var newEvidenceMap = _.object(_.map(_.filter(evidence, function(e) {
          return $scope.evidenceSourceMap[e.id] === undefined;
        }), function(e) {
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

    $scope.countTextsReferencingEvidence = function(e) {
      return AssociationMap.getAssociatedIdsBySource('evidence', 'text', e.id).length;
    };

    $scope.countEvidenceWithTopic = function(topicIndex) {
      var result = 0;
      for (var key in $scope.evidenceTopicMap) {
        if ($scope.evidenceTopicMap[key] === topicIndex) {
          result += 1;
        }
      }
      return result;
    };

    $scope.countSearchTermOccurrence = function(term, abstract) {
      var result = 0;
      var abstractWords = abstract.split(' ');
      for (var i = 0; i < abstractWords.length; ++i) {
        var word = abstractWords[i];
        if (word === 'of') {
          continue
        }
        var term_parts = term.split(' ');
        if (term_parts.indexOf(word) > -1) result += 1;
        if (word.split('-').length>1) {
          for (var j = 0; j < term_parts.length; ++j) {
            if (word.split('-').indexOf(term_parts[j]) > -1) {
              result += 1;
            }
          }
        }
      }
      return result;
    };

    function processEvidenceTextTopics(response, mode) {
      if (mode === 's') {
        $scope.topics = response.data.topics;
        $scope.evidence = _.uniq(response.data.evidence, function(n) {
          return n.id;
        }).map(function(e) {
          e.metadata = JSON.parse(e.metadata);
          return e;
        });
        $scope.evidenceSelectionMap = _.object(_.map($scope.evidence, function(e) {
          return [e.id, false];
        }));
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
        $scope.loadingEvidence = false;
      }
      else if (mode === 'r') {
        var data = response.data;
        console.log(data);
        $scope.topics = _.map(data.topics, function(d) {
          return d.terms.map(function(t) {
            return t[0];
          });
        });
        $scope.evidence = data.evidence.map(function(e) {
          e.metadata = JSON.parse(e.metadata);
          return e;
        });
        $scope.evidenceSelectionMap = _.object(_.map($scope.evidence, function(e) {
          return [e.id, false];
        }));
        $scope.evidenceTopicMap = _.object(_.map($scope.evidence, function(e) {
          return [e.id, 0];
        }));
        // TODO: update $scope.textTopicMap
        $scope.loadingEvidence = false;           
      }
    };

    function visualizeTextTopicDistribution() {
      d3.selectAll('.topic-info').selectAll('g').remove();
      if ($scope.topics.length === 0) {
        return;
      }
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
    }

  }]);
