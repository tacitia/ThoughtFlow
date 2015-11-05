angular.module('v1.controllers')
  .controller('BaselineController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Pubmed',
    function($scope, $modal, Core, AssociationMap, Pubmed) {

    var userId = 101;

    Core.getAllDataForUser(userId, function(response) {
      console.log(response.data)
      $scope.texts = response.data.texts;
      $scope.concepts = response.data.concepts;
    }, function(response) {
      console.log('server error when retrieving data for user ' + userId);
      console.log(response);
    });

    Core.getEvidenceTextTopicsForUser(userId, function(response) {
      $scope.topics = response.data.topics;
      $scope.evidence = response.data.evidence;
      $scope.evidenceTopicMap = _.object(_.map(_.omit(response.data.evidenceTextTopicMap, function(value, key) {
        return !key.startsWith('e');
      }), function(value, key) {
        return [key.split('-')[1], value]
      }));
      $scope.textTopicMap = _.object(_.map(_.omit(response.data.evidenceTextTopicMap, function(value, key) {
        return key.startsWith('t');
      }), function(value, key) {
        return [key.split('-')[1], value]
      }));
      $scope.evidenceSourceMap = _.object(_.map($scope.evidence, function(e) {
        return [e.id, 1];
      }));
      console.log($scope.evidenceSourceMap);
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
      });

      modalInstance.result.then(function (newEntries) {
        $scope.evidence = $scope.evidence.concat(newEntries); 
        console.log($scope.evidence);   
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

      // This function is called when the user wants to search the PubMed repo; 
      // There should be another function to handle search within personal reference
      Pubmed.searchEvidenceForTerms(terms, userId, function(response) {
        console.log(response);
        // After receiving the response, update the evidence list
        $scope.topics = response.data.topics;
        $scope.evidence = response.data.evidence;
        $scope.evidenceTopicMap = response.data.evidenceTopicMap;
        // Merge the new evidence into the existing evidenceSourceMap; make sure we don't
        // overwrite any existing entry
        var newEvidenceMap = _.object(_.map(_.filter(response.data.evidence, function(e) {
          return $scope.evidenceSourceMap[e.id] === undefined;
        }), function(e) {
          return [e.id, 0];
        }));
        _.extend($scope.evidenceSourceMap, newEvidenceMap); 
        console.log($scope.evidenceSourceMap);

      }, function(errorResponse) {
        console.log('error occurred while searching for evidence');
        console.log(errorResponse)        
      });
    }

    /* ========== Service requests functions End ========== */    

  }]);
