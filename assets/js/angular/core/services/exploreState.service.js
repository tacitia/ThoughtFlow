/*
 * This service handles information related to the active collection, including its name, as well as 
 * the list of evidence
 */
angular
  .module('exploreState.services')
  .factory('ExploreState', ExploreState);

User.$inject = ['$cookies', '$http', 'Core'];

function ExploreState($cookies, $http, Core) {
  var _selectedTerms = [];
  var _selectedTopic = null;
  var _candidateEvidence = null;
  var _candidateEvidenceTopics = null;
  var _selectedSearchTitle = null;
  var ExploreState = {
    selectedTerms: selectedTerms,
    selectedTopic: selectedTopic,
    candidateEvidence: candidateEvidence,
    candidateEvidenceTopics: candidateEvidenceTopics,
    selectedSearchTitle: selectedSearchTitle
  };

  return ExploreState;

  ////////////////////

  function selectedTerms() {
    return _selectedTerms;
  }

  function selectedTopic(topic) {
    if (arguments.length === 0) {
      return _selectedTopic;
    }
    else {
      _selectedTopic = topic;
    }
  }

  function candidateEvidence(evidence) {
    if (arguments.length === 0) {
      return _candidateEvidence;
    }
    else {
      _candidateEvidence = evidence;
    }
  }

  function candidateEvidenceTopics(evidenceTopics) {
    if (arguments.length === 0) {
      return _candidateEvidenceTopics;
    }
    else {
      _candidateEvidenceTopics = evidenceTopics;
    }
  }

  function selectedSearchTitle(title) {
    if (arguments.length === 0) {
      return _selectedSearchTitle;
    }
    else {
      _selectedSearchTitle = title;
    }
  }
}