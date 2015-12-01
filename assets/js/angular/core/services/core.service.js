  angular
    .module('core.services')
    .factory('Core', Core);

  Core.$inject = ['$cookies', '$http'];

  function Core($cookies, $http) {
    var Core = {
      deleteEntry: deleteEntry,
      postTextByUserId: postTextByUserId,
      postConceptByUserId: postConceptByUserId,
      postEvidenceByUserId: postEvidenceByUserId,
      postAssociationByUserId: postAssociationByUserId,
      deleteAssociationByUserId: deleteAssociationByUserId,
      deleteBookmark: deleteBookmark,
      getAllDataForUser: getAllDataForUser,
      getAssociationMap: getAssociationMap,
      getEvidenceCollection: getEvidenceCollection,
      getEvidenceTextTopicsForUser: getEvidenceTextTopicsForUser
    };

    return Core;

    ////////////////////

    function getAllDataForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-data/' + userId + '/')
       .then(successFn, errorFn);
    }

    function getAssociationMap(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-associations/' + userId + '/')
        .then(successFn, errorFn);
    }


    function postTextByUserId(userId, title, content, isNew, textId, successFn, errorFn) {
      console.log(textId);
      return $http.post('/api/v1/data/texts/', {
        created_by: userId,
        title: title,
        content: content,
        is_new: isNew,
        text_id: textId
      }).then(successFn, errorFn);
    }

    function postConceptByUserId(userId, term) {
      return $http.post('/api/v1/data/concepts/', {
        created_by: userId,
        term: term
      }).then(function(response) {
        return response.data[0];
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
      });
    }

    function getEvidenceCollection(collectionId, successFn, errorFn) {
      return $http.get('/api/v1/data/collection/' + collectionId + '/')
        .then(successFn, errorFn);
    }

    function postEvidenceByUserId(userId, title, abstract, metadata, successFn, errorFn) {
      return $http.post('/api/v1/data/evidence/', {
        created_by: userId,
        title: title,
        abstract: abstract,
        metadata: metadata
      }).then(successFn, errorFn);
    }

    function postAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn)      
    }

    function deleteAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/delete/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn)      
    }

    function deleteEntry(id, type, userId, successFn, errorFn) {
      return $http.post('/api/v1/data/' + type + '/delete/', {
        // switch to using the id of the currently active user
        user_id: userId,
        id: id
      }).then(successFn, errorFn);
    }

    function deleteBookmark(userId, evidenceId, successFn, errorFn) {
      return $http.post('/api/v1/data/bookmark/delete/', {
        // switch to using the id of the currently active user
        user_id: userId,
        evidence_id: evidenceId
      }).then(successFn, errorFn);      
    }
 
    function getEvidenceTextTopicsForUser(userId, successFn, errorFn) {
      return $http.post('/api/v1/service/retrieveEvidenceTextTopics/', {
        user_id: userId
      }).then(successFn, errorFn);
    }

  }