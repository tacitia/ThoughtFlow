// This service handles information related to individual publication, e.g. its citation information, additional information about author, venue etc.
 angular
    .module('paper.services')
    .factory('Paper', Paper);

  Paper.$inject = ['$cookies', '$http', 'Core'];

  function Paper($cookies, $http, Core) {
    var evidence = null;
    var citationMap = null;
    var mapInitialized = false;
    var Paper = {
      getCitationsForPaper: getCitationsForPaper,
      getReferencesForPaper: getReferencesForPaper,
      initializeCitationMap: initializeCitationMap,
      getCitationMap: getCitationMap
    };

    return Paper;

    ////////////////////

    function getCitationMap(collectionId, successFn, errorFn) {
      $http.get('api/v1/service/paper/allCitations/' + collectionId + '/')
        .then(successFn, errorFn);
    }

    function initializeCitationMap(collectionId, userId, response) {
      Core.getAllEvidenceForUser(collectionId, function(evidenceResponse) {
        evidence = evidenceResponse.data;
        // Process the metadata and mark the bookmarked ones
        Core.getAllEvidenceForUser(userId, function(userResponse) {
          var userEvidence = userResponse.data;
          var bookmarkedEvidenceIds = userEvidence.map(function(e) { return e.id; })
          evidence.forEach(function(e) {
            if (typeof e.metadata == 'string') {
              e.metadata = JSON.parse(e.metadata);
            }
            e.bookmarked = bookmarkedEvidenceIds.indexOf(e.id) > -1;
          })
        });
        getCitationMap(collectionId, function(citationMapResponse) {
          citationMap = citationMapResponse.data;
        }, function(errorResponse) {
          console.log(errorResponse);
        })
      }, function(errorResponse) {
        console.log(errorResponse);
      })
    }

    function getCitationsForPaper(eid) {
      var citationIds = _.filter(citationMap, function(d) {
        return d.citation_id == eid;
      }).map(function(d) {
        return d.paper_id;
      });
      var citations = citationIds.map(function(citationId) {
        return _.find(evidence, function(d) {
          return d.id === citationId;
        })
      });
//      console.log(citations);
      return citations;
    }

    function getReferencesForPaper(eid) {
      var referenceIds = _.filter(citationMap, function(d) {
        return d.paper_id == eid;
      }).map(function(d) {
        return d.citation_id;
      });
      return referenceIds.map(function(referenceId) {
        return _.find(evidence, function(d) {
          return d.id === referenceId;
        })
      });
    }
  }