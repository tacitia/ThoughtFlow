angular.module('focus.v2.controllers')
  .controller('FocusController', ['$scope', '$stateParams', '$modal', 'Core','AssociationMap', 'Argument', 'Logger', 'Bibtex',
  function($scope, $stateParams, $modal, Core, AssociationMap, Argument, Logger, Bibtex) {      
    $scope.selectedText = {
      title: ''
    };
    $scope.selectedParagraph = -1;
    $scope.selectedEvidence = null;
    $scope.selectedWords= [];
    $scope.selectedTopic= null;
    $scope.activeParagraphs = [];
    $scope.hasUnsavedChanges = false;
    $scope.recommendedEvidence = [];
    $scope.citedEvidence = [];
    $scope.paragraphInformation =[];
    $scope.paragraphCitation = [];

    $scope.loadingRecommendedEvidence = false;
    $scope.citationTabs = {
      'recommended':{active: true},
      'cited': {active: false},
      'bookmarked': {active: false}
    };

    // TODO: get the list from server
    $scope.collections = [
      { id: 10, name: 'visualization'},
      { id: 11, name: 'pfc and executive functions'},
      { id: 12, name: 'virtual reality'},
      { id: 13, name: 'TVCG'},
      { id: 15, name: 'diffusion tensor imaging'},
    ];

    var userId = parseInt($stateParams.userId);
    var collectionId = parseInt($stateParams.collectionId);

    $scope.userId = userId;
    $scope.collectionId = collectionId;
    $scope.collectionName = _.find($scope.collections, function(c) {
      return c.id === collectionId;
    }).name;    

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
        $scope.selectText($scope.texts[0], false);
      }
    }, function(response) {
      console.log('server error when retrieving textsfor user ' + userId);
      console.log(response);
    });

    Core.getAllEvidenceForUser(userId, function(response) {
      // This includes both usercreated and bookmarked evidence; they are not necessarily cited.        
      /*
      $scope.evidence = _.filter(response.data, function(e) {
        return e.abstract.length > 0;
      });
      */

      // TODO: apply default sorting.
      $scope.evidence = response.data;

      $scope.evidence.forEach(function(e){
        e.metadata = JSON.parse(e.metadata);
        evidenceIdMap[e.id]= e;
      })
        updateCitedEvidence();
      }, function(response) {
        console.log('server error when retrieving evidence for user' + userId);
        console.log(response);
      });

    var newParagraphIndex = -1;

    $scope.$watch(function() {
      return d3.selectAll('.text-paragraph')[0].length;
    }, function(newValue, oldValue) {
      var el =document.getElementById('ap-' +newParagraphIndex);
      if (el !== null){
        el.innerText = '';
        el.focus();
      }
    })

    // Check if the current text have changed every 10 secondsand save the contents.
    // if there are changes,  
    setInterval(function(){
      if ($scope.hasUnsavedChanges) {
        saveText();
      }
    }, 5000);

    $scope.selectText = function(text, userInitiated) {
      if (userInitiated) {
        Logger.logAction(userId, 'select proposal', 'v2','1', 'focus', {
          proposal: text.id,
          contentLength: text.content.split(' ').length
        }, function(response) {
          console.log('action logged: select proposal');
        });
      }

      $scope.selectedText = text;
      $scope.paragraphInformation= [];
      $scope.paragraphCitation = [];
      $scope.activeParagraphs = _.filter(text.content.split('/n'), function(text){
        return text !== '';
      }).map(function(p, i) {
        $scope.paragraphInformation.push({});
        $scope.paragraphCitation.push([]);
        updateRecommendedCitations(p, i);
        return {text: p};
      });
      updateCitedEvidence();
    };

    $scope.selectEvidence = function(evidence, sourceList) {
      Logger.logAction(userId, 'select evidence', 'v2', '1', 'focus', {
        evidence: evidence.id,
        sourceList: sourceList
      }, function(response) {
        console.log('action logged: select evidence');
      });

      $scope.selectedEvidence = evidence;
      $scope.selectedWords = evidence.abstract.split(' ');      
    };

    $scope.selectParagraph = function(index, clickTarget) {
      if (index!== $scope.selectedParagraph) {          
        Logger.logAction(userId, 'select paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,
          paragraph: index,
          clickTarget: clickTarget
        }, function(response) {            
          console.log('actionlogged: select paragraph');
        });

        $scope.selectedParagraph =index;
        updateRecommendedCitations($scope.activeParagraphs[index].text, index);
      }      
    };

    $scope.citeEvidence = function(evidence, sourceList) {
      if ($scope.selectedParagraph === -1) {
        return;
      }
      Logger.logAction(userId, 'cite evidence', 'v2', '1', 'focus', {          
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {          
        console.log('action logged: cite evidence');
      });        
      //Add association
      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;      
      AssociationMap.addAssociation(userId,'evidence', 'text', evidence.id,textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = $scope.citedEvidence.map(function(e) {
          return e.id;
        }).indexOf(evidence.id);          

        if (index === -1) {
          $scope.citedEvidence.push(evidence);
          index =$scope.citedEvidence.length - 1;          
        }

        $scope.paragraphCitation[$scope.selectedParagraph].push({            
          index: index,
          evidence: evidence
        });
      });      
    };

    $scope.showCitation = function(citation) {        
      Logger.logAction(userId, 'show citation', 'v2', '1', 'focus', {
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,          
        citation: citation.evidence.id
      }, function(response) {
        console.log('action logged: show citation');       
      });        

      $scope.selectEvidence(citation.evidence);        
      $scope.citationTabs['cited'].active= true;      
    }

    $scope.openUploadBibtexWindow = function() {

      var modalInstance = $modal.open({
        templateUrl: 'modal/uploadBibtexModal.html',          
        controller: 'UploadBibtexModalController',          
        resolve: {
          userId: function() {
            return userId;
          },
          existingEvidence: function() {
            return $scope.evidence;
          }
        }
      });

      modalInstance.result.then(function (uploadedEvidence) {
        $scope.evidence = $scope.evidence.concat(uploadedEvidence);
      });  
    }

    $scope.processBibtexFile = function() {
      var selectedFile = document.getElementById('bibtex-input').files[0];
      var reader = new FileReader();
      reader.onload = function(file) {
        var fileContent = file.currentTarget.result;
        console.log(Bibtex)
        console.log(Bibtex.parseBibtexFile)
        var evidenceList = Bibtex.parseBibtexFile(fileContent);      
        var storedEvidence = [];

        var evidenceIndex = 0;
        var totalAbstractFound = 0;
        var uploadFunction = setInterval(function() {
          console.log(evidenceIndex);
          if (evidenceIndex >= evidenceList.length) {
            clearInterval(uploadFunction);
            return;
          }
          var evidence = evidenceList[evidenceIndex];
          Core.postEvidenceByUserId(userId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), 
            function(response) {
              // TODO: probably more efficient to deal with this server side
              if ($scope.evidence.indexOf(response.data[0]) > -1 || storedEvidence.indexOf(response.data[0]) > -1) {
                return;
              }
              storedEvidence.push(response.data[0]);
              if (evidence.abstract === '' && response.data[0].abstract !== '') {
                totalAbstractFound += 1;
              }
              if (storedEvidence.length === evidenceList.length) {
                $scope.evidence = $scope.evidence.concat(storedEvidence); 
                console.log('total bibtex entry processed: ' + evidenceList.length);
                console.log('total abstracts found: ' + totalAbstractFound);
//                extendEvidenceMap(storedEvidence, 1);
              }
            }, function(response) {
              console.log('server error when saving new evidence');
              console.log(response);
            });

          evidenceIndex += 1;
        }, 3000);
      };
      reader.readAsText(selectedFile);
    };    

    $scope.addTextEntry = function() {
      Logger.logAction(userId, 'initiate proposal creation', 'v2','1', 'focus', {
        totalProposals: $scope.texts.length
      }, function(response) {
        console.log('action logged:initiate proposal creation');
      });

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

      modalInstance.result.then(function (newEntry){          
        Logger.logAction(userId, 'proposal created', 'v2','1', 'focus', {            
          proposal: newEntry.id,
          contentLength: newEntry.content.split(' ').length,            
          totalProposals: $scope.texts.length          
        },function(response) {
          console.log('action logged: proposal created');          
        });

        $scope.texts.push(newEntry);        
      });      
    }

    function updateCitedEvidence() {        
      if (textEvidenceAssociations === null || _.size(evidenceIdMap) === 0) return;

      $scope.citedEvidence = _.without(_.uniq(_.filter(textEvidenceAssociations, function(a) {  
        var textId = a.targetId.toString().split('-');
        return textId[0] == $scope.selectedText.id && textId.length===2;        
      }).map(function(a) {  
        if (evidenceIdMap[a.sourceId] === undefined) {
          console.log('Warning: inconsistency between citations and bookmarks detected.');
        }
        return evidenceIdMap[a.sourceId];
      })), undefined);

      // Identify citations for each paragraph
      textEvidenceAssociations.forEach(function(a) {          
        var textId = a.targetId.toString().split('-');
        if (textId[0] != $scope.selectedText.id || textId.length>2) return;
        var paragraphIndex = parseInt(textId[1]);
        if (paragraphIndex >= $scope.paragraphCitation.length) return;
        var e = evidenceIdMap[a.sourceId];
        var evidenceIndex = $scope.citedEvidence.indexOf(e);
        $scope.paragraphCitation[paragraphIndex].push({            
          index: evidenceIndex,
          evidence: e
        });
      });      
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

    $scope.checkEnter= function(i, e){        
      if (e.keyCode === 13) {         
        Logger.logAction(userId, 'create new paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,           
          totalParagraphs: $scope.activeParagraphs.length
        }, function(response) {
          console.log('actionlogged: create new paragraph');
        });

        e.preventDefault();
        $scope.activeParagraphs.splice(i+1, 0, {text: ''});
        $scope.paragraphInformation.splice(i+1, 0,{});         
        $scope.paragraphCitation.splice(i+1, 0, []);
        newParagraphIndex = i+1;
        updateRecommendedCitations($scope.activeParagraphs[i].text, i);
        $scope.selectedParagraph = i+1;          
        return;       
      }
      else {
        Logger.logAction(userId, 'edit paragraph', 'v2', '1', 'focus', {
          proposal:$scope.selectedText.id,
          paragraph: $scope.selectedParagraph
        }, function(response) {
          console.log('action logged: edit paragraph');          
        },function(response) {
          console.log('error occurred during logging: edit paragraph')
        }, true);        
      }
    };      

    $scope.hasMadeChanges = function(i,e) {        
      $scope.hasUnsavedChanges = true;
      $scope.activeParagraphs[i].text = document.getElementById('ap-' + i).innerText;      
    };

    $scope.downloadText = function() {
      Logger.logAction(userId, 'download proposal', 'v2', '1', 'focus', {
        length:$scope.selectedText.content.split(' ').length,
        totalProposals: $scope.texts.length
      }, function(response) {
        console.log('action logged: download proposal');        
      });

      var content = 'file content for example';
      var blob = new Blob([ content ], { type : 'text/plain' });
      $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );      
    };

    $scope.deleteText = function() {
      Logger.logAction(userId, 'initiate proposal deletion', 'v2', '1', 'focus', {
        length:$scope.selectedText.content.split(' ').length,
        totalProposals: $scope.texts.length
      }, function(response) {
        console.log('action logged: initiate proposal deletion');        
      });
        
      var modalInstance = $modal.open({
        templateUrl: 'modal/deleteModal.html',
        controller: 'DeleteModalController',
        resolve: {
          content: function() {
            return $scope.selectedText.title;
          },
          ids: function() {
            return[$scope.selectedText.id];
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
        Logger.logAction(userId, 'proposal deleted', 'v2','1', 'focus', {
          length: $scope.selectedText.content.split(' ').length,          
          totalProposals: $scope.texts.length   
        },function(response) {
          console.log('action logged: proposal delete');
        });
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
      for (var i = 0; i < topicTerms.length;++i) {
        var term = topicTerms[i].term;
        var term_parts = term.split(' ');
        var word_parts = w.split('-');      
        if (term_parts.indexOf(w) > -1) {           
          return true;
        }
        for (var j = 0;j < word_parts.length; ++j) {
          var wp= word_parts[j];        
          if(term_parts.indexOf(wp) > -1) {             
            return true;
          }
        }       
      }  
      return false;   
    };

    // Check every 15 secondsif there is unsaved changes; ifthere is, .
    // call this function to save the content.
    function saveText() {      
      if (isDebug) {
        console.log('saving text...');        
      }        
      var newContent = $scope.activeParagraphs.map(function(p) {         
        return p.text;
      }).join('/n');     

      Core.postTextByUserId(userId, $scope.selectedText.title, newContent, false, $scope.selectedText.id, function(response){           
        $scope.texts.forEach(function(t) {             
          if (t.id === response.data[0].id){
            t.content = newContent;
          }
        })
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
      });

      $scope.hasUnsavedChanges =false;      
    }      
      
    function updateRecommendedCitations(text,index) {
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

      Argument.getEvidenceRecommendation(text, collectionId, function(response) {
        $scope.recommendedEvidence= response.data.evidence;
        $scope.recommendedEvidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
        })
        console.log($scope.recommendedEvidence);
        $scope.paragraphInformation[index].topic = response.data.topics[0];        
        $scope.paragraphInformation[index].topicString = response.data.topics[0].terms.map(function(term) {
          return term[0];
        }).join(' ');       
        $scope.loadingRecommendedEvidence =false;
      }, function(errorResponse) {
          console.log('error occurred while recommending citations');       
          console.log(errorResponse);
      });
  }
      
}]);