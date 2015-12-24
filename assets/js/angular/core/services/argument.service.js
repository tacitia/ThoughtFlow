angular
  .module('argument.services')
  .factory('Argument', Argument);

Argument.$inject = ['$cookies', '$http'];

function Argument($cookies, $http) {

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
  function getEvidenceRecommendation(text, successFn, errorFn) {
      console.log('Argument: getEvidenceRecommendation');
      $http.post('/api/v1/service/getEvidenceRecommendation/', {
        text: text
      }).then(successFn, errorFn);
      return;
  }

  function getRelatedArguments() {

  }

}