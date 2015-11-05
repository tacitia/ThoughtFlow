angular
  .module('associationMap.services')
  .factory('AssociationMap', AssociationMap);

AssociationMap.$inject = ['Core'];

function AssociationMap(Core) {
  var associationMap = null;

  var AssociationMap = {
    initialize: initialize,
    getAssociatedIdsBySource: getAssociatedIdsBySource,
    getAssociatedIdsByTarget: getAssociatedIdsByTarget,
    getAssociationsOfType: getAssociationsOfType,
    addAssociation: addAssociation,
    removeAssociation: removeAssociation,
    hasAssociation: hasAssociation
  };

  return AssociationMap;

  ////////////////////

  function initialize(userId) {
    Core.getAssociationMap(userId, function(response) {
      associationMap = response.data;
      console.log('>> User association map retrieved...');
    }, function(response) {
      console.log('server error when retrieving association map');
      console.log(response);
    });
  }

  function getAssociatedIdsBySource(sourceType, targetType, sourceId) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType && entry.sourceId === sourceId;
    })
    .map(function(entry) {
      return entry.targetId;
    });      
  }

  function getAssociatedIdsByTarget(sourceType, targetType, targetId) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType && entry.targetId === targetId;
    })
    .map(function(entry) {
      return entry.sourceId;
    });      
  }


  function getAssociationsOfType(sourceType, targetType) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType;
    })
  }

  function addAssociation(userId, sourceType, targetType, source, target, successFn) {
    Core.postAssociationByUserId(userId, sourceType, targetType, source, target, 
      function(response) {
        console.log(response.data[0])
        associationMap.push(response.data[0]);
        successFn();
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);
      })
  }

  function removeAssociation(userId, sourceType, targetType, source, target, successFn) {
    Core.deleteAssociationByUserId(userId, sourceType, targetType, source, target, 
      function(response) {
        _.pull(associationMap, _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: source, targetId: target}));
        console.log('association map after deleting ' + source + ' ' + target);
        console.log(associationMap);
        successFn();
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);        
      })
  }

  function hasAssociation(sourceType, targetType, sourceId, targetId) {
    return _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: sourceId, targetId: targetId}) != undefined;
  }
}