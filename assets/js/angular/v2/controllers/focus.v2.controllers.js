angular.module('focus.v2.controllers')
  .controller('FocusController', ['$scope', '$modal', 'Core', 'AssociationMap', 'Argument',
    function($scope, $modal, Core, AssociationMap, Argument) {

      $scope.selectedText = {
        title: ''
      };
      $scope.selectedParagraph = -1;
      $scope.selectedEvidence = null;
      $scope.selectedWords = [];
      $scope.selectedTopic = null;
      $scope.activeParagraphs = [];
      $scope.hasUnsavedChanges = false;
      $scope.recommendedEvidence = [];
      $scope.citedEvidence = [];
      $scope.paragraphInformation = [];
      $scope.paragraphCitation = [];

      $scope.loadingRecommendedEvidence = false;
      $scope.citationTabs = {
        'recommended': {active: true},
        'cited': {active: false},
        'bookmarked': {active: false}
      };


      var userId = 111;
      $scope.evidence = null;
      var textEvidenceAssociations = null;
      var evidenceIdMap = {};

      var isDebug = false;

      AssociationMap.initialize(userId, function() {
        textEvidenceAssociations = AssociationMap.getAssociationsOfType('evidence', 'text');
        updateCitedEvidence();
      });
       
      Core.getAllTextsForUser(userId, function(response) {
        $scope.texts = response.data;
        if ($scope.texts.length > 0) {
          $scope.selectText($scope.texts[0]);
        }
      }, function(response) {
        console.log('server error when retrieving texts for user ' + userId);
        console.log(response);
      });

      Core.getAllEvidenceForUser(userId, function(response) {
        // This includes both user created and bookmarked evidence; they are not necessarily cited
        $scope.evidence = _.filter(response.data, function(e) {
          return e.abstract.length > 0;
        });
        console.log(response.data);
        $scope.evidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
          evidenceIdMap[e.id] = e;
        })
        updateCitedEvidence();
      }, function(response) {
        console.log('server error when retrieving evidence for user ' + userId);
        console.log(response);
      });

      var newParagraphIndex = -1;

      $scope.$watch(function() {
        return d3.selectAll('.text-paragraph')[0].length;
      }, function(newValue, oldValue) {
          console.log('move to new paragraph');
          var el = document.getElementById('ap-' + newParagraphIndex);
          if (el !== null) {
            el.innerText = '';
            el.focus();
          }
      })

      // Check if the current text have changed every 10 seconds and save the contents
      // if there are changes
      setInterval(function() {
        if ($scope.hasUnsavedChanges) {
          saveText();
        }
      }, 5000); 

      $scope.selectText = function(text) {
        $scope.selectedText = text;
        $scope.paragraphInformation = [];
        $scope.paragraphCitation = [];
        $scope.activeParagraphs = _.filter(text.content.split('/n'), function(text) {
          return text !== '';
        }).map(function(p, i) {
          $scope.paragraphInformation.push({});
          $scope.paragraphCitation.push([]);
          updateRecommendedCitations(p, i);
          return {text: p};
        });
        updateCitedEvidence();
      };

      $scope.selectEvidence = function(evidence) {
        $scope.selectedEvidence = evidence;
        $scope.selectedWords = evidence.abstract.split(' ');
      };

      $scope.selectParagraph = function(index) {
        if (index !== $scope.selectedParagraph) {
          $scope.selectedParagraph = index;
          updateRecommendedCitations($scope.activeParagraphs[index].text, index);
        }
      };

      $scope.citeEvidence = function(evidence) {
        // Add association
        var textParaId = $scope.selectedText.id + '-' + $scope.selectedParagraph;
        console.log(textParaId)
        AssociationMap.addAssociation(userId, 'evidence', 'text', evidence.id, textParaId, function(association) {
          // Add evidence to the list of cited evidence
          
          var index = $scope.citedEvidence.map(function(e) {
            return e.id;
          }).indexOf(evidence.id);
          if (index === -1) {
            $scope.citedEvidence.push(evidence);            
            index = $scope.citedEvidence.length - 1;
          }

          $scope.paragraphCitation[$scope.selectedParagraph].push({
            index: index,
            evidence: evidence
          });

        });
      };

      $scope.showCitation = function(citation) {
        $scope.selectEvidence(citation.evidence);
        $scope.citationTabs['cited'].active = true;
      }

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
              return null;
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


      function updateCitedEvidence() {
        if (textEvidenceAssociations === null || _.size(evidenceIdMap) === 0) return;
        $scope.citedEvidence = _.uniq(_.filter(textEvidenceAssociations, function(a) {
          return a.targetId.toString().split('-')[0] == $scope.selectedText.id;
        }).map(function(a) {  
          return evidenceIdMap[a.sourceId];
        }));

        // Identify citations for each paragraph
        textEvidenceAssociations.forEach(function(a) {
          var textId = a.targetId.toString().split('-');
          if (textId[0] != $scope.selectedText.id) return;
          var paragraphIndex = parseInt(textId[1]);   
          var e = evidenceIdMap[a.sourceId];
          var evidenceIndex = $scope.citedEvidence.indexOf(e);
          $scope.paragraphCitation[paragraphIndex].push({
            index: evidenceIndex,
            evidence: e
          });
        });

        console.log('updating cited evidence')
        console.log($scope.citedEvidence)
        console.log($scope.paragraphCitation);
      }

      function insertTextAtCursor(text) { 
          var sel, range, html; 
          sel = window.getSelection();
          range = sel.getRangeAt(0); 
          range.deleteContents(); 
          var textNode = document.createTextNode(text);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          sel.removeAllRanges();
          sel.addRange(range);        
      }

      $scope.cites = function(t, i, e) {
        if (e ===null || t === null) {
          return false;
        }
        return AssociationMap.hasAssociation('evidence', 'text', e.id, t.id + '-' + i);
      };

      $scope.checkEnter = function(i, e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          $scope.activeParagraphs.splice(i+1, 0, {text: ''});
          $scope.paragraphInformation.splice(i+1, 0, {});
          $scope.paragraphCitation.splice(i+1, 0, []);
          newParagraphIndex = i+1;
          updateRecommendedCitations($scope.activeParagraphs[i].text, i);

          return;
        }
      };

      $scope.hasMadeChanges = function(i, e) {
        $scope.hasUnsavedChanges = true;
        $scope.activeParagraphs[i].text = document.getElementById('ap-' + i).innerText;
      };

      $scope.deleteText = function() {
        var modalInstance = $modal.open({
          templateUrl: 'modal/deleteModal.html',
          controller: 'DeleteModalController',
          resolve: {
            content: function() {
              return $scope.selectedText.title;
            },
            ids: function() {
              return [$scope.selectedText.id];
            },
            type: function() {
              return 'text';
            },
            userId: function() {
              return userId;
            }
          }
        });      

        var target = $scope.texts;

        modalInstance.result.then(function (deletedEntryId) {
          for (var i = 0; i < deletedEntryId.length; ++i) {
            var entryId = deletedEntryId[i];
            _.remove(target, function(elem) {
              return elem.id == entryId;
            })
          };
        });
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

      // Check every 15 seconds if there is unsaved changes; if there is, 
      // call this function to save the content
      function saveText() {
        if (isDebug) {
          console.log('saving text...');
        }

        var newContent = $scope.activeParagraphs.map(function(p) {
          return p.text;
        }).join('/n');

        Core.postTextByUserId(userId, $scope.selectedText.title, newContent, false, $scope.selectedText.id, 
          function(response) {
            $scope.texts.forEach(function(t) {
              if (t.id === response.data[0].id) {
                t.content = newContent;
              }
            })
          }, function(response) {
            console.log('server error when saving new concept');
            console.log(response);
          });
        $scope.hasUnsavedChanges = false;
      }

      function updateRecommendedCitations(text, index) {
        if (text.split(' ').length < 5) {
          console.log('not enough information to update evidence recommendation');
          return;
        }
        if ($scope.loadingRecommendedEvidence) {
          console.log('updating already in progress');
          return;
        }
        console.log('updating evidence recommendations..');
        $scope.loadingRecommendedEvidence = true;
        Argument.getEvidenceRecommendation(text, function(response) {
          $scope.recommendedEvidence = response.data.evidence;
          $scope.recommendedEvidence.forEach(function(e) {
            e.metadata = JSON.parse(e.metadata);
          })
          $scope.paragraphInformation[index].topic = response.data.topics[0];
          $scope.paragraphInformation[index].topicString = response.data.topics[0].terms.map(function(term) {
            return term[0];
          }).join(' ');
          $scope.loadingRecommendedEvidence = false;
        }, function(errorResponse) {
          console.log('error occurred while recommending citations');
          console.log(errorResponse);
        });
      }

  }]);
