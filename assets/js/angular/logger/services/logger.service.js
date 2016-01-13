(function () {
  'use strict';

  angular
    .module('logger.services')
    .factory('Logger', Logger);

  Logger.$inject = ['$http'];

  function Logger($http) {
    var csrf_token = '{% csrf_token %}';
    /**
    * @name Logger
    * @desc The Factory to be returned
    */
    var Logger = {
      logAction: logAction
    };

    var lastActionName = null;

    return Logger;

    ////////////////////

    function logAction(userId, actionName, majorVersion, minorVersion, view, parameters, successFn, errorFn, forbidRepeat) {
      if (forbidRepeat && actionName === lastActionName) return;
      lastActionName = actionName;
      return $http.post('/api/v1/action/add/', {
        userId: userId,
        name: actionName,
        majorVersion: majorVersion,
        minorVersion, minorVersion,
        view: view,
        parameters: parameters,
        csrf_token: csrf_token
      }).then(successFn, errorFn);
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

  }
})();