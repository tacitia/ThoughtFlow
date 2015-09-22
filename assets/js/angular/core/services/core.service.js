  angular
    .module('core.services')
    .factory('Core', Core);

  Core.$inject = ['$cookies', '$http'];

  function Core($cookies, $http) {
    var Core = {
      postTextByUserId: postTextByUserId,
      deleteEntry: deleteEntry,
      postConceptByUserId: postConceptByUserId,
      getAllDataForUser: getAllDataForUser
    };

    return Core;

    ////////////////////

    function getAllDataForUser(userId, successFn, errorFn) {
      return $http.get('/api/v1/data/user-data/' + userId + '/')
      .then(successFn, errorFn);
    }

    function postTextByUserId(userId, title, content) {
      return $http.post('/api/v1/data/texts/', {
        created_by: userId,
        title: title,
        content: content
      }).then(function(response) {
        return response.data[0];
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);
      });
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

    function deleteEntry(id, type, successFn, errorFn) {
      return $http.post('/api/v1/data/' + type + '/delete/', {
        // switch to using the id of the currently active user
        user_id: 1,
        id: id
      }).then(successFn, errorFn);
    }

  }