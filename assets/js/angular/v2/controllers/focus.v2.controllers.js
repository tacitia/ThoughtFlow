angular.module('focus.v2.controllers')
  .controller('FocusController', ['$scope', '$stateParams', '$modal', 'Core','AssociationMap', 'Argument', 'Logger', 'Bibtex', 'Paper', 'User',
  function($scope, $stateParams, $modal, Core, AssociationMap, Argument, Logger, Bibtex, Paper, User) {      
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

    $scope.editHistory = [];

    $scope.loadingTexts = true;
    $scope.loadingStatement = 'Retrieving proposals and bookmarked evidence...';

    $scope.loadingRecommendedEvidence = false;
    $scope.selectedEvidenceCiteStatus = 'uncited';
    $scope.savingStatus = 'saved';
    $scope.citationTabs = {
      'recommended':{active: true},
      'cited': {active: false},
      'bookmarked': {active: false}
    };

    var currentText = '';
    var previousText = '';

    $scope.logStateTransition = function() {
      Logger.logAction($scope.userId, 'explore recommended citation', 'v2','1', 'focus', {
      }, function(response) {
        if (isDebug)
          console.log('action logged: explore recommended citation');
      });      
    }

    $scope.selectText = function(text, userInitiated) {
      if (userInitiated) {
        Logger.logAction($scope.userId, 'select proposal', 'v2','1', 'focus', {
          proposal: text.id,
          contentLength: text.content.split(' ').length
        }, function(response) {
          if (isDebug)
            console.log('action logged: select proposal');
        });
      }

      $scope.selectedText = text;
      User.activeProposal($scope.selectedText);
      $scope.paragraphInformation= [];
      $scope.paragraphCitation = [];
      $scope.activeParagraphs = _.filter(text.content.split('\n'), function(text){
        return text !== '';
      }).map(function(p, i) {
        $scope.paragraphInformation.push({});
        $scope.paragraphCitation.push([]);
        $scope.editHistory.push([]);
        updateRecommendedCitations(p, i);
        var timestamps = [];
        p.split('').forEach(function() {
          timestamps.push(new Date());
        });
        return {
          text: p,
          timestamps: timestamps
        };
      });
      User.activeParagraphs($scope.activeParagraphs);
      User.paragraphCitation($scope.paragraphCitation);
      updateCitedEvidence();
    };

    var blob = null;
    var textEvidenceAssociations = null;
    var evidenceIdMap = null;
    var isDebug = true;
    $scope.evidence = null;

    User.updateSessionInfo($stateParams.userId, $stateParams.collectionId, function(userId, collection) {
      $scope.userId = userId;
      $scope.collection = collection;

      Paper.initializeCitationMap($scope.collection.id, $scope.userId);

      AssociationMap.initialize($scope.userId, function() {
        textEvidenceAssociations = AssociationMap.getAssociationsOfType('evidence', 'text');
        updateCitedEvidence();
      });

      loadEvidence();
    });

    // Check if the current text have changed every 10 secondsand save the contents.
    // if there are changes,  
    setInterval(function(){
      if ($scope.hasUnsavedChanges) {
        $scope.saveText();
      }
    }, 5000);

    function loadEvidence() {
      User.evidence(function(evidence, idMap) {
        $scope.evidence = evidence;
        evidenceIdMap = idMap;
        updateCitedEvidence();
        loadTexts();
      });

      var newParagraphIndex = -1;

      $scope.$watch(function() {
        return d3.selectAll('.text-paragraph')[0].length;
      }, function(newValue, oldValue) {
        if (isDebug)
          console.log('watch on # of .text-paragraph executing...')
        var el =document.getElementById('ap-' +newParagraphIndex);
        if (el !== null && newValue > oldValue){
          el.innerText = '';
          el.focus();
        }
      });
    }

    function loadTexts() {
      User.proposals(function(proposals) {
        $scope.texts = proposals;
        if ($scope.texts.length > 0) {
          $scope.selectText(User.activeProposal(), false);
        }
        $scope.loadingTexts = false;
        Logger.logAction($scope.userId, 'load focus view', 'v2','1', 'focus', {
          numProposals: $scope.texts.length
        }, function(response) {
          if (isDebug)
            console.log('action logged: load view');
        });
      });
    }

    // TODO: known bug: if 1) add a new paragraph at the end of the proposal (it's fine if the paragraph is added in the middle), 
    // 2) download the proposal, then the new paragraph will beome invisible in the text area 
    // (the sorrounding spans are removed somehow), but it will appear if refresh the page (i.e. the paragraph itself is stored)
    function prepareProposalDownload() {
      var content = '';
      for (var i = 0; i < $scope.activeParagraphs.length; ++i) {
        var paragraph = $scope.activeParagraphs[i];
        var citations = $scope.paragraphCitation[i].map(function(c) {
          return c.index;
        }).sort();
        content += paragraph.text;
        for (var j = 0; j < citations.length; ++j) {
          content += '[' + (citations[j] + 1) + ']';
        }
        content += '\n';
      }
      for (var i = 0; i < $scope.activeParagraphs.length; ++i) {
        console.assert($scope.paragraphCitation[i] !== undefined);
      }
      content += '\nReferences\n'
      for (var i = 0; i < $scope.citedEvidence.length; ++i) {
        var evidence = $scope.citedEvidence[i];
        content += (i+1) + '. ';
        content += evidence.metadata.AUTHOR + ' ';
        content += evidence.title + '. ';
        if (evidence.metadata.JOURNAL !== undefined) {
          content += evidence.metadata.JOURNAL + ' ';
        }
        if (evidence.metadata.DATE !== undefined) {
          content += evidence.metadata.DATE + ' ';
        }
        content += '\n';
      }

      blob = new Blob([ content ], { type : 'text/plain' });
      $scope.proposalUrl = (window.URL || window.webkitURL).createObjectURL( blob );
    };

    // TODO
    $scope.loadPlainTextProposalFile = function() {
    };

    // TODO
    $scope.loadLatexProposalFile = function() {
      // Need to find and remove latex commands...       
    }

    $scope.selectEvidence = function(evidence, sourceList, userInitiated) {
      if (userInitiated) {
        Logger.logAction($scope.userId, 'select evidence', 'v2', '1', 'focus', {
          evidence: evidence.id,
          sourceList: sourceList
        }, function(response) {
          if (isDebug)
            console.log('action logged: select evidence');
        });
      }

      $scope.selectedEvidence = evidence;
      User.selectedEvidence($scope.selectedEvidence);
      $scope.selectedWords = evidence.abstract.split(' ');

      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;
      if (AssociationMap.hasAssociation('evidence', 'text', $scope.selectedEvidence.id, textParaId)) {
        $scope.selectedEvidenceCiteStatus = 'cited';
      }
      else {
        $scope.selectedEvidenceCiteStatus = 'uncited';        
      }

    };

    $scope.selectParagraph = function(index, clickTarget) {
      if (index!== $scope.selectedParagraph) {          
        Logger.logAction($scope.userId, 'select paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,
          paragraph: index,
          clickTarget: clickTarget
        }, function(response) {        
          if (isDebug)    
            console.log('action logged: select paragraph');
        });

        $scope.selectedParagraph =index;
//        currentParagraph = $scope.activeParagraphs[$scope.selectedParagraph];
        updateRecommendedCitations($scope.activeParagraphs[index].text, index);
      }      
    };

    $scope.bookmarkEvidence = function(e, source) {
      Logger.logAction($scope.userId, 'bookmark evidence', 'v2', '1', 'focus', {
        evidence: e.id,
        numDocuments: $scope.evidence.length,
        source: source
      }, function(response) {
        console.log('action logged: bookmark evidence');
      });
      Core.addBookmark($scope.userId, e.id, function(response) {
        $scope.evidence.push(e);
        e.bookmarked = true;
        console.log('bookmark evidence success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });  
    }

    $scope.unbookmarkEvidence = function(e, source) {
      Logger.logAction($scope.userId, 'remove evidence bookmark', 'v2', '1', 'focus', {
        evidence: e.id,
        numDocuments: $scope.evidence.length,
        source: source
      }, function(response) {
        console.log('action logged: remove evidence bookmark');
      });
      Core.deleteBookmark($scope.userId, e.id, function(response) {
        $scope.evidence = _.without($scope.evidence, e);
        e.bookmarked = false;
        console.log('remove evidence bookmark success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });  
    }

    $scope.citeEvidence = function(evidence, sourceList) {
      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;
      if (AssociationMap.hasAssociation('evidence', 'text', evidence.id, textParaId)) {
        return;
      }
      Logger.logAction($scope.userId, 'cite evidence', 'v2', '1', 'focus', {          
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {
        if (isDebug)
          console.log('action logged: cite evidence');
      });        
      //Add association
      AssociationMap.addAssociation($scope.userId,'evidence', 'text', evidence.id, textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = $scope.citedEvidence.map(function(e) {
          return e.id;
        }).indexOf(evidence.id);          
        if (index === -1) {
          $scope.citedEvidence.push(evidence);
          index =$scope.citedEvidence.length - 1;     
          evidenceIdMap[evidence.id] = evidence;
        }
        // Add the association to text evidence association for book-keeping (since we need to update the association entry
        // when new paragraphs are added)
        textEvidenceAssociations.push(association);
        $scope.paragraphCitation[$scope.selectedParagraph].push({            
          index: index,
          evidence: evidence
        });
        prepareProposalDownload();
      });      
    };

    $scope.unciteEvidence = function(evidence, sourceList) {
      console.log('unciting')
      var textParaId = $scope.selectedText.id+ '-' + $scope.selectedParagraph;
      Logger.logAction($scope.userId, 'uncite evidence', 'v2', '1', 'focus', {
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,
        evidence: evidence.id,
        sourceList: sourceList        
      }, function(response) {
        if (isDebug)
          console.log('action logged: uncite evidence');
      });        
      //Add association
      AssociationMap.removeAssociation($scope.userId,'evidence', 'text', evidence.id, textParaId, function(association) {
        // Add evidence to the list of cited evidence
        var index = $scope.citedEvidence.map(function(e) {
          return e.id;
        }).indexOf(evidence.id);        
        var lengthBefore = textEvidenceAssociations.length;  
        _.pull(textEvidenceAssociations, _.findWhere(textEvidenceAssociations, {sourceId: evidence.id.toString(), targetId: textParaId}))
        console.assert(textEvidenceAssociations.length === lengthBefore - 1);
        var lengthBefore = $scope.paragraphCitation[$scope.selectedParagraph].length;
        _.pull($scope.paragraphCitation[$scope.selectedParagraph], _.findWhere($scope.paragraphCitation[$scope.selectedParagraph], {index: index, evidence: evidence}));
        console.assert($scope.paragraphCitation[$scope.selectedParagraph].length === lengthBefore - 1);
        prepareProposalDownload();
      });      
    }

    $scope.showCitation = function(citation) {        
      Logger.logAction($scope.userId, 'show citation', 'v2', '1', 'focus', {
        proposal: $scope.selectedText.id,
        paragraph: $scope.selectedParagraph,          
        citation: citation.evidence.id
      }, function(response) {
        if (isDebug)
          console.log('action logged: show citation');       
      });        

      $scope.selectEvidence(citation.evidence, null, false);        
      $scope.citationTabs['cited'].active= true;      
    }

    $scope.openUploadBibtexWindow = function() {
      Logger.logAction($scope.userId, 'open upload bibtex window', 'v2', '1', 'focus', {
      }, function(response) {
        if (isDebug)
          console.log('action logged: open upload bibtex window');       
      });        

      var modalInstance = $modal.open({
        templateUrl: 'modal/uploadBibtexModal.html',          
        controller: 'UploadBibtexModalController',          
        resolve: {
          userId: function() {
            return $scope.userId;
          },
          collectionId: function() {
            return $scope.collection.id;
          },
          existingEvidence: function() {
            return $scope.evidence.map(function(e) {
              return e.title;
            });
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
          Core.postEvidenceByUserId($scope.userId, evidence.title, evidence.abstract, JSON.stringify(evidence.metadata), 
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
      Logger.logAction($scope.userId, 'initiate proposal creation', 'v2','1', 'focus', {
        totalProposals: $scope.texts.length
      }, function(response) {
        if (isDebug)
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
            return $scope.userId;
          }          
        }
      });

      modalInstance.result.then(function (newEntry){          
        Logger.logAction($scope.userId, 'proposal created', 'v2','1', 'focus', {            
          proposal: newEntry.id,
          contentLength: newEntry.content.split(' ').length,            
          totalProposals: $scope.texts.length          
        },function(response) {
          if (isDebug)
            console.log('action logged: proposal created');          
        });

        $scope.texts.push(newEntry);
        $scope.selectText(newEntry, false);
      });      
    }

    // WIP: this function needs to do the following:
    // 1. for every user keystroke, figure out which words is being updated 
    // 2. update the timestamp for the corresponding word
    // We could use a diff here. Every time the user makes a change (not necessarily changing one character), 
    // we compute the diff, and figure out indexes for the words that have been changed; then we update the timestamp
    // in the corresponding container
    function updateTextAge(paraIndex) {
      var currentText = document.getElementById('ap-' + paraIndex).innerText;
      var startDiffPos = 0;
      var prevChars = previousText.split('');
      var currentChars = currentText.split('');
      var maxTextLength = Math.max(prevChars.length, currentChars.length);
      var minTextLength = Math.min(prevChars.length, currentChars.length);
      for (var i = 0; i < maxTextLength; ++i) {
        if (prevChars[i] !== currentChars[i]) {
          startDiffPos = i;
          break;
        }
      }
      var endDiffPosPrev = prevChars.length;
      var endDiffPosNow = currentChars.length;
      for (var delta = 0; delta < minTextLength; ++delta) {
        if (prevChars[endDiffPosPrev-delta] !== currentChars[endDiffPosNow-delta]) {
          endDiffPosPrev -= delta;
          endDiffPosNow -= delta;
          break;
        }
      }
      // everything was changed in place
      if (endDiffPosPrev === endDiffPosNow) {
        for (var counter = endDiffPosPrev; counter < endDiffPosNow; ++counter) {
          $scope.activeParagraphs[paraIndex].timestamps[counter] = new Date();
        }
      }
      else if (endDiffPosPrev > endDiffPosNow) {// some characters are deleted
        $scope.activeParagraphs[paraIndex].timestamps.splice(endDiffPosNow, endDiffPosPrev - endDiffPosNow);
        if (startDiffPos <= endDiffPosNow) {
          for (var counter = startDiffPos; counter < endDiffPosPrev; ++counter) {
            $scope.activeParagraphs[paraIndex].timestamps[counter] = new Date();
          }
        }
      }
      else { // some characters were added
        for (var counter = endDiffPosPrev; counter < endDiffPosNow; ++counter) {
          $scope.activeParagraphs[paraIndex].timestamps.splice(counter, 0, new Date());
        }
        if (startDiffPos <= endDiffPosPrev) {
          for (var counter = startDiffPos; counter < endDiffPosPrev; ++counter) {
            $scope.activeParagraphs[paraIndex].timestamps[counter] = new Date();
          }
        }
      }
//      User.activeParagraphs($scope.activeParagraphs);
      console.log(previousText);
      console.log(currentText);
      console.log(startDiffPos);
      console.log(endDiffPosPrev);
      console.log(endDiffPosNow);
      console.log($scope.activeParagraphs[paraIndex].timestamps.length);
    } 

    function updateCitedEvidence() {        
      if ($scope.selectedText === undefined) return;
      if (textEvidenceAssociations === null || _.size(evidenceIdMap) === 0) return;

      $scope.citedEvidence = _.without(_.uniq(_.filter(textEvidenceAssociations, function(a) {  
        var textId = a.targetId.toString().split('-');
        return textId[0] == $scope.selectedText.id && textId.length===2;        
      }).map(function(a) {  
        if (evidenceIdMap[a.sourceId] === undefined) {
          console.log(a.sourceId)
          console.log(evidenceIdMap)
          console.log('Warning: inconsistency between citations and bookmarks detected.');
        }
        return evidenceIdMap[a.sourceId];
      })), undefined);

      User.citedEvidence($scope.citedEvidence);

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
      prepareProposalDownload();
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
        Logger.logAction($scope.userId, 'create new paragraph', 'v2', '1', 'focus', {
          proposal: $scope.selectedText.id,           
          totalParagraphs: $scope.activeParagraphs.length
        }, function(response) {
          if (isDebug)
            console.log('action logged: create new paragraph');
        });
        e.preventDefault();
        var enterPosition = getCaretCharacterOffsetWithin(document.getElementById('ap-' + i));
        if (enterPosition === 0) {
          newParagraphIndex = i;
        }
        else {
          newParagraphIndex = i+1;
          // TODO: handle enter in the middle of paragraph
        }
        updateParagraphs(newParagraphIndex, i, true);
        updateTextEvidenceAssociations(newParagraphIndex, true);
        return;
      }
      // Delete a paragraph if user presses backspace when it's already empty
      // Known issue: Does not move the cursor anywhere if the first paragraph is deleted
      else if (e.keyCode === 8 && $scope.activeParagraphs[i].text.trim().length === 0) {
        e.preventDefault();
        newParagraphIndex = Math.max(0, i-1);
        updateParagraphs(newParagraphIndex, i, false);
        updateTextEvidenceAssociations(i, false);
        // We are forcing a focus here instead of waiting for the watch on d3.selectAll('.text-paragraph') to trigger, 
        // because it does not trigger sometimes or has a delay. Can't tell when it is triggered immediately when it is not
        var el =document.getElementById('ap-' +newParagraphIndex);
        if (el !== null){
          el.focus();
          setEndOfContenteditable(el);
        }
        return;
        // TODO: update citedEvidence, textEvidenceAssociations
      }
      else {
        previousText = document.getElementById('ap-' + i).innerText;
        Logger.logAction($scope.userId, 'edit paragraph', 'v2', '1', 'focus', {
          proposal:$scope.selectedText.id,
          paragraph: $scope.selectedParagraph
        }, function(response) {
          if (isDebug)
            console.log('action logged: edit paragraph');          
        },function(response) {
          if (isDebug)
            console.log('error occurred during logging: edit paragraph')
        }, true);
        return;
      }
    };

    function compareString( s1, s2, splitChar ){
        if ( typeof splitChar == "undefined" ){
            splitChar = " ";
        }
        var string1 = new Array();
        var string2 = new Array();

        string1 = s1.split( splitChar );
        string2 = s2.split( splitChar );
        var diff = new Array();

        if(s1.length>s2.length){
            var long = string1;
        }
        else {
            var long = string2;
        }
        for(x=0;x<long.length;x++){
            if(string1[x]!=string2[x]){
                diff.push(string2[x]);
            }
        }

        return diff;    
    }

    function updateParagraphs(newParagraphIndex, i, add) {
      if (add) {
        $scope.activeParagraphs.splice(newParagraphIndex, 0, {text: '', timestamps: []});
        $scope.paragraphInformation.splice(newParagraphIndex, 0,{});         
        $scope.paragraphCitation.splice(newParagraphIndex, 0, []);
        $scope.editHistory.splice(newParagraphIndex, 0, []);
        updateRecommendedCitations($scope.activeParagraphs[i].text, i);
      }
      else {
        $scope.activeParagraphs.splice(i, 1);
        $scope.paragraphInformation.splice(i, 1);
        $scope.paragraphCitation.splice(i, 1);
        $scope.editHistory.splice(i, 1);
        updateRecommendedCitations($scope.activeParagraphs[newParagraphIndex].text, newParagraphIndex);
      }
      $scope.selectedParagraph = newParagraphIndex; 
//      currentParagraph = $scope.activeParagraphs[$scope.selectedParagraph];
    }

    function updateTextEvidenceAssociations(startIndex, shiftRight) {
      if (!shiftRight) {
        var deletedAssociations = [];
        textEvidenceAssociations.forEach(function(association) {
          var ids = association.targetId.split('-');
          var textId = parseInt(ids[0]);
          var paragraphId = parseInt(ids[1]);
          if (paragraphId === startIndex) {
            console.log('ready to delete citation')
            console.log(association)
            AssociationMap.removeAssociationById(association.id, function(response) {
              console.log('association with evidence ' + association.sourceId + ' deleted')
              deletedAssociations.push(association.id);
            });
          }
        });
        textEvidenceAssociations = _.reject(textEvidenceAssociations, function(association) {
          return deletedAssociations.indexOf(association.id) > -1;
        })
      }
      console.log(textEvidenceAssociations)
      // Update evidence association for all shifted paragraphs
      textEvidenceAssociations.forEach(function(association) {
        var ids = association.targetId.split('-');
        var textId = parseInt(ids[0]);
        var paragraphId = parseInt(ids[1]);

        if (textId === $scope.selectedText.id && paragraphId > startIndex) {
          var offset = shiftRight ? 1 : -1;
          var newTargetId = $scope.selectedText.id + '-' + (paragraphId + offset);
          AssociationMap.updateAssociation(association.id, association.sourceId, newTargetId);
        }
      });      
    }

    function setEndOfContenteditable(contentEditableElement) {
        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        { 
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

    function getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ( (sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    $scope.hasMadeChanges = function(i,e) {       
      $scope.savingStatus = 'unsaved';
      $scope.hasUnsavedChanges = true;
      $scope.activeParagraphs[i].text = document.getElementById('ap-' + i).innerText;

//      previousText = currentParagraph.text;
//      currentParagraph = $scope.activeParagraphs[i];
      updateTextAge(i)
    };

    $scope.downloadText = function() {
      Logger.logAction($scope.userId, 'download proposal', 'v2', '1', 'focus', {
        length:$scope.selectedText.content.split(' ').length,
        totalProposals: $scope.texts.length
      }, function(response) {
        if (isDebug)
          console.log('action logged: download proposal');        
      });
    };

    $scope.deleteText = function() {
      Logger.logAction($scope.userId, 'initiate proposal deletion', 'v2', '1', 'focus', {
        length:$scope.selectedText.content.split(' ').length,
        totalProposals: $scope.texts.length
      }, function(response) {
        if (isDebug)
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
            return $scope.userId;            
          }          
        }
      });
  
      var target = $scope.texts;       
      modalInstance.result.then(function (deletedEntryId) {          
        Logger.logAction($scope.userId, 'proposal deleted', 'v2','1', 'focus', {
          length: $scope.selectedText.content.split(' ').length,          
          totalProposals: $scope.texts.length   
        },function(response) {
          if (isDebug)
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

    // Check every 15 seconds if there is unsaved changes; ifthere is, .
    // call this function to save the content.
    $scope.saveText = function(userInitiated) {
      $scope.savingStatus = 'saving';
      if (isDebug) {
        console.log('saving text...');
        console.log($scope.savingStatus)        
      }        

      var newContent = $scope.activeParagraphs.map(function(p) {         
        return p.text;
      }).join('\n');

      if (userInitiated) {
        Logger.logAction($scope.userId, 'save proposal', 'v2','1', 'focus', {
          proposal: $scope.selectedText.id,
          contentLength: newContent.split(' ').length
        }, function(response) {
          if (isDebug)
            console.log('action logged: save proposal');
        });
      }

      Core.postTextByUserId($scope.userId, $scope.selectedText.title, newContent, false, $scope.selectedText.id, function(response){           
        $scope.texts.forEach(function(t) {             
          if (t.id === response.data[0].id){
            t.content = newContent;
          }
        })
        $scope.hasUnsavedChanges = false;
        $scope.savingStatus = 'saved';   
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
        $scope.savingStatus = 'failed';
      });
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
      if (isDebug)
        console.log('updating evidence recommendations..');        
      $scope.loadingRecommendedEvidence = true;        

      Argument.getEvidenceRecommendation(text, $scope.collection.id, function(response) {
        $scope.recommendedEvidence = response.data.evidence;
        var bookmarkedEvidenceIds = $scope.evidence === null ? [] : $scope.evidence.map(function(e) { return e.id; })
        $scope.recommendedEvidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
          if ($scope.evidence !== null) {
            e.bookmarked = bookmarkedEvidenceIds.indexOf(e.id) > -1;
          }
          else {
            e.bookmarked = false;
          }
        })
        $scope.paragraphInformation[index].topic = response.data.topics[0];
        if (response.data.topics[0].terms !== '') {
          $scope.paragraphInformation[index].topicString = response.data.topics[0].terms.map(function(term) {
            return term[0];
          }).join(' ');
        }
        else {
          $scope.paragraphInformation[index].topicString = '';          
        }
        $scope.loadingRecommendedEvidence = false;
      }, function(errorResponse) {
          console.log('error occurred while recommending citations');       
          console.log(errorResponse);
      });
  }
      
}]);


