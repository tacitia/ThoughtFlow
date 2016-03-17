angular
  .module('argument.services')
  .factory('Argument', Argument);

Argument.$inject = ['$cookies', '$http'];

function Argument($cookies, $http) {

  var cachedTexts = [];

  var Argument = {
    getArgument: getArgument,
    getAssociatedEvidence: getAssociatedEvidence,
    getEvidenceRecommendation: getEvidenceRecommendation,
    getRelatedArguments: getRelatedArguments
  };

  return Argument;

  ////////////////////

  function getArgument() {

  }

  // Get evidence that are marked as associated by the user
  function getAssociatedEvidence(textId, paragraphIndex) {
  }

  // Get evidence that are judged as most relevant to the piece of argument
  function getEvidenceRecommendation(text, collectionId, successFn, errorFn) {
    var cachedEntry = _.find(cachedTexts, function(d) {
      return d.text === text;
    }); 
    if (cachedEntry !== undefined) {
      successFn({
        evidence: cachedEntry.evidence,
        topic: cachedEntry.topic
      });
      return;
    }
    else {
      $http.post('/api/v1/service/getEvidenceRecommendation/', {
        text: text,
        collectionId: collectionId
      }).then(function(response) {
        var evidence = response.data.evidence;
        evidence.forEach(function(e) {
          e.metadata = JSON.parse(e.metadata);
        })
        cachedTexts.push({
          text: text,
          evidence: evidence,
          topic: response.data.topics[0]
        });
        successFn({
          evidence: evidence,
          topic: response.data.topics[0]
        });
      }, errorFn);
      return;
    }
  }

  function getRelatedArguments() {

  }

}