  angular
    .module('pubmed.services')
    .factory('Pubmed', Pubmed);

  Pubmed.$inject = ['$cookies', '$http'];

  function Pubmed($cookies, $http) {
    var Pubmed = {
      findNeighborConcepts: findNeighborConcepts,
      searchEvidenceForTerms: searchEvidenceForTerms,
      extractTerms: extractTerms
    };

    return Pubmed;

    ////////////////////

    function findNeighborConcepts(concepts, userId, successFn, errorFn) {
      var plainConcepts = concepts.map(function(d) {
        return d.term;
      });
      return $http.post('api/v1/service/growConcept/', {
        concepts: plainConcepts,
        requested_by: 1
      }).then(successFn, errorFn);
    }

    function searchEvidenceForTerms(terms, userId, successFn, errorFn) {
      $http.post('api/v1/service/searchEvidenceForTerms/', {
        terms: terms,
        user_id: userId
      }).then(successFn, errorFn)
    }

    function extractTerms(text, userId, successFn, errorFn) {
      $http.post('api/v1/service/extractTerms/', {
        text: text
      }).then(successFn, errorFn);
    }

  }