  angular
    .module('core.services')
    .factory('Core', Core);

  Core.$inject = ['$cookies', '$http'];

  function Core($cookies, $http) {
    var csrf_token = '{% csrf_token %}';
    var Core = {
      addBookmark: addBookmark,
      deleteEntry: deleteEntry,
      postTextByUserId: postTextByUserId,
      postConceptByUserId: postConceptByUserId,
      postEvidenceByUserId: postEvidenceByUserId,
      postAssociationByUserId: postAssociationByUserId,
      updateAssociation: updateAssociation,
      deleteAssociationByUserId: deleteAssociationByUserId,
      deleteAssociationById: deleteAssociationById,
      deleteBookmark: deleteBookmark,
      getAllTextsForUser: getAllTextsForUser,
      getAllEvidenceForUser: getAllEvidenceForUser,
      getAllDataForUser: getAllDataForUser,
      getAssociationMap: getAssociationMap,
      getEvidenceByTopic: getEvidenceByTopic,
      getEvidenceByTitle: getEvidenceByTitle,
      getEvidenceCollection: getEvidenceCollection,
      getEvidenceTextTopicsForUser: getEvidenceTextTopicsForUser,
      getNewUserId: getNewUserId,
      initializeNewCollection: initializeNewCollection,
      getCollectionList: getCollectionList
    };

    return Core;

    ////////////////////

    function getNewUserId(successFn, errorFn) {
      return $http.get('api/v1/service/getNewUserId/')
        .then(successFn, errorFn);
    }

    function initializeNewCollection(name, successFn, errorFn) {
      return $http.post('api/v1/service/initializeNewCollection/', {
          name: name
        })
        .then(successFn, errorFn);
    }

    function getCollectionList(successFn, errorFn) {
      return $http.get('api/v1/service/getCollectionList/')
        .then(successFn, errorFn);
    }

    function getAllTextsForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/texts/' + userId + '/')
        .then(successFn, errorFn);
    } 

    function getAllEvidenceForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/evidence/' + userId + '/')
       .then(successFn, errorFn);
    }       

    function getAllDataForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-data/' + userId + '/')
       .then(successFn, errorFn);
    }

    function getAssociationMap(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-associations/' + userId + '/')
        .then(successFn, errorFn);
    }


    function postTextByUserId(userId, title, content, isNew, textId, successFn, errorFn) {
      return $http.post('/api/v1/data/texts/' + userId + '/', {
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
      console.log('>> Retrieving evidence collection...');
      $http.get('/api/v1/data/collection/' + collectionId + '/')
        .then(successFn, errorFn);
    }

    function postEvidenceByUserId(userId, title, abstract, metadata, successFn, errorFn) {
      return $http.post('/api/v1/data/evidence/' + userId + '/', {
        created_by: userId,
        title: title,
        abstract: abstract,
        metadata: metadata,
        find_neighbors: true
      }).then(successFn, errorFn);
    }

    function getEvidenceByTopic(collectionId, topicId, userId, successFn, errorFn) {
      $http.post('/api/v1/service/getEvidenceByTopic/', {
        collection_id: collectionId,
        topic_id: topicId,
        user_id: userId
      }).then(successFn, errorFn);
    }

    function getEvidenceByTitle(collectionId, userId, title, includePersonal, resultLimit, successFn, errorFn) {
      var limit = resultLimit > 0 ? resultLimit : 20;
      $http.post('/api/v1/service/searchEvidenceByTitle/', {
        collection_id: collectionId,
        user_id: userId,
        title: title,
        result_limit: limit,
        include_personal: includePersonal
      }).then(successFn, errorFn);
    }

    function postAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn);
    }

    function updateAssociation(id, sourceId, targetId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/update/', {
        id: id,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn);      
    }

    function addBookmark(userId, evidenceId, successFn, errorFn) {
      console.log('add bookmark called');
      return $http.post('/api/v1/data/bookmark/', {
        // switch to using the id of the currently active user
        user_id: userId,
        evidence_id: evidenceId
      }).then(successFn, errorFn);      
    }

    function deleteAssociationByUserId(userId, sourceType, targetType, sourceId, targetId, successFn, errorFn) {
      console.log('deleting')
      console.log(userId)
      return $http.post('/api/v1/data/association/delete/', {
        created_by: userId,
        sourceType: sourceType,
        targetType: targetType,
        sourceId: sourceId,
        targetId: targetId
      }).then(successFn, errorFn)      
    }

    function deleteAssociationById(associationId, successFn, errorFn) {
      return $http.post('/api/v1/data/association/deleteById/', {
        id: associationId
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