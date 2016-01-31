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
    updateAssociation: updateAssociation,
    removeAssociation: removeAssociation,
    removeAssociationById: removeAssociationById,
    hasAssociation: hasAssociation
  };

  return AssociationMap;

  ////////////////////

  function initialize(userId, successFn) {
    Core.getAssociationMap(userId, function(response) {
      associationMap = response.data;
      console.log('>> User association map retrieved...');
      successFn();
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
        successFn(response.data[0]);
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);
      })
  }

  function updateAssociation(associationId, source, target, successFn) {
    Core.updateAssociation(associationId, source, target, function(response) {
      for (var i = 0; i < associationMap.length; ++i) {
        var association = associationMap[i];
        if (association.id === associationId) {
          association.sourceId = source;
          association.targetId = target;      
          break;
        }
      }
    });
  }

  function removeAssociation(userId, sourceType, targetType, source, target, successFn) {
    Core.deleteAssociationByUserId(userId, sourceType, targetType, source, target, 
      function(response) {
        _.pull(associationMap, _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: source.toString(), targetId: target}));
        console.log('association map after deleting ' + source + ' ' + target);
        console.log(associationMap);
        successFn();
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);        
      })
  }

  function removeAssociationById(id, successFn) {
    Core.deleteAssociationById(id, 
      function(response) {
        _.pull(associationMap, _.findWhere(associationMap, {id: id}));
        console.log('association map after deleting ' + id);
        console.log(associationMap);
        successFn();
      }, function(response) {
        console.log('server error when saving new association');
        console.log(response);        
      })
  }

  function hasAssociation(sourceType, targetType, sourceId, targetId) {
     return _.findWhere(associationMap, {sourceType: sourceType, targetType: targetType, sourceId: sourceId.toString(), targetId: targetId}) != undefined;
  }
}