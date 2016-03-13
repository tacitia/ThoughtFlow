/*
 * This service handles information related to the active collection, including its name, as well as 
 * the list of evidence
 */
angular
  .module('user.services')
  .factory('User', User);

User.$inject = ['$cookies', '$http', 'Core'];

function User($cookies, $http, Core) {
  var _userId = null;
  var _activeCollection = null;
  var _collections = null;
  var _proposals = null;
  var _evidence = null;
  var _evidenceIdMap = {};
  var _activeProposal = null;
  var _activeParagraphs = null;
  var _paragraphCitation = null;
  var _activeProposalTextAges = [];
  var _selectedEvidence = null;
  var _selectedParagraph = -1;
  var _citedEvidence = null;

  var User = {
    updateSessionInfo: updateSessionInfo,
    userId: userId,
    activeCollection: activeCollection,
    proposals: proposals,
    evidence: evidence,
    activeProposal: activeProposal,
    activeParagraphs: activeParagraphs,
    paragraphCitation: paragraphCitation,
    selectedEvidence: selectedEvidence,
    selectedParagraph: selectedParagraph,
    citedEvidence: citedEvidence,
    evidenceIdMap: evidenceIdMap,
  };

  return User;

  ////////////////////

  function evidenceIdMap() {
    return _evidenceIdMap;
  }

  function citedEvidence(evidence) {
    if (arguments.length === 0) {
      return _citedEvidence;
    }
    else {
      _citedEvidence = evidence;
    }    
  }  

  function selectedEvidence(evidence) {
    if (arguments.length === 0) {
      return _selectedEvidence;
    }
    else {
      _selectedEvidence = evidence;
    }    
  }

  function selectedParagraph(paragraphIndex) {
    if (arguments.length === 0) {
      return _selectedParagraph;
    }
    else {
      _selectedParagraph = paragraphIndex;
    }    
  }

  function updateSessionInfo(rawUserId, rawCollectionId, callback) {
    var userId = parseInt(rawUserId);
    var collectionId = parseInt(rawCollectionId);

    if (!isNaN(userId)) {
      _userId = userId;
    }

    if (!isNaN(collectionId)) {
      if (_collections === null) {
        Core.getCollectionList(function(response) {
          _collections = response.data.map(function(d) {
            return {
              id: parseInt(d.collection_id),
              name: d.collection_name
            };
          });
          updateActiveCollection(collectionId);
          callback(_userId, _activeCollection);
        });
      }
      else {
        updateActiveCollection(collectionId);
        callback(_userId, _activeCollection);        
      }
    }      
    else {
      callback(_userId, _activeCollection);
    }
  }

  function updateActiveCollection(collectionId) {
    _activeCollection = {
      id: collectionId,
      name: _.find(_collections, function(c) {
        return c.id === collectionId;
      }).name
    };    
  }

  function userId(newUserId) {
    return _userId;
  }

  function activeCollection(newCollectionId, callback) {
    return _activeCollection;
  }

  // TODO: check that _userId is initialized; currently relying on the caller
  // to do the right thing
  function proposals(callback) {
    if (_proposals === null) {
      Core.getAllTextsForUser(_userId, function(response) {
        _proposals = response.data;
        _activeProposal = _proposals.length > 0 ? _proposals[0] : null;
        callback(_proposals);
      }, function(response) {
        console.log('server error when retrieving textsfor user ' + _userId);
        console.log(response);
      });
    }
    else {
      callback(_proposals);
    }
  }

  function activeProposal(proposal) {
    if (arguments.length === 0) {
      return _activeProposal;
    }
    else {
      _activeProposal = proposal;
    }
  }

  function activeParagraphs(paragraphs) {
    if (arguments.length === 0) {
      return _activeParagraphs;
    }
    else {
      _activeParagraphs = paragraphs;
    }
  }

  function paragraphCitation(citations) {
    if (arguments.length === 0) {
      return _paragraphCitation;
    }
    else {
      _paragraphCitation = citations;
    }
  }

  function evidence(callback) {
    if (_evidence === null) {
      // TODO: if later we want to get topics for these evidence, be mindful that there are 
      // two types of evidence - personal and bookmarked - and they will require 
      // different handlings
      Core.getAllEvidenceForUser(_userId, function(response) {
          // This includes both user created and bookmarked evidence; they are not necessarily cited.
          // TODO: apply default sorting.
          _evidence = response.data;
          _evidence.forEach(function(e){
            e.metadata = JSON.parse(e.metadata);
            _evidenceIdMap[e.id]= e;
          })
          callback(_evidence, _evidenceIdMap);
        }, function(response) {
          console.log('server error when retrieving evidence for user' + $scope.userId);
          console.log(response);
        });    
    }
    else {
      callback(_evidence, _evidenceIdMap);
    }
  }
}