// This service handles information related to individual publication, e.g. its citation information, additional information about author, venue etc.
 angular
    .module('bookmark.services')
    .factory('Bookmark', Bookmark);

  Bookmark.$inject = ['$cookies', '$http', 'Core', 'Logger'];

  function Bookmark($cookies, $http, Core, Logger) {
    var _userId = null;
    var _evidence = null;
    var _evidenceIdMap = {};
    var Bookmark = {
      userId: userId,
      evidence: evidence,
      evidenceIdMap: evidenceIdMap,
      addBookmark: addBookmark,
      removeBookmark: removeBookmark,
      flipBookmark: flipBookmark
    };

    return Bookmark;

    ////////////////////

    function userId(uid) {
      if (arguments.length === 0) {
        return _userId;
      }
      else {
        _userId = uid;
        return this;
      }
    }

    function evidenceIdMap() {
      return _evidenceIdMap;
    }

    function evidence(callback) {
      if (_evidence === null) {
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

    function addBookmark(e, view, source) {
      logBookmarkUpdate(e, 'bookmark evidence', view, source);
      Core.addBookmark(_userId, e.id, function(response) {
        _evidence.push(e);
        _evidenceIdMap[e.id] = evidence
        e.bookmarked = true;
        console.log('bookmark evidence success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });   
    }

    function removeBookmark(e, view, source) {
      logBookmarkUpdate(e, 'remove evidence bookmark', view, source);
      Core.deleteBookmark(_userId, e.id, function(response) {
        _evidence = _.reject(_evidence, function(i) {
          return i.title === e.title;
        });
        e.bookmarked = false;
        console.log('remove bookmark evidence success');
      }, function(errorResponse) {
        console.log(errorResponse);
      });  
    }

    function flipBookmark(e, view, source) {
      if (!e.bookmarked) {
        addBookmark(e, view, source);
      } 
      else {
        removeBookmark(e, view, source);
      }
    }

    function logBookmarkUpdate(e, action, view, source) {
      Logger.logAction(_userId, 'bookmark evidence', 'v2', '1', view, {
        evidence: e.id,
        numDocuments: _evidence.length,
        source: source
      }, function(response) {
        console.log('action logged: ' + action);
      });
    }
  }