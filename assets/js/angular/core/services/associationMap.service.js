angular
  .module('associationMap.services')
  .factory('AssociationMap', AssociationMap);

AssociationMap.$inject = ['Core'];

function AssociationMap(Core) {
  var associationMap = null;
  Core.getAssociationMap(1, function(response) {
    associationMap = response.data;
  }, function(response) {
    console.log('server error when retrieving association map');
    console.log(response);
  });

  var AssociationMap = {
    getAssociatedIds: getAssociatedIds,
    addAssociation: addAssociation,
  };

  return AssociationMap;

  ////////////////////

  function getAssociatedIds(sourceType, targetType, sourceId) {
    return _.filter(associationMap, function(entry) {
      return entry.sourceType === sourceType && entry.targetType === targetType && entry.sourceId === sourceId;
    })
    .map(function(entry) {
      return entry.targetId;
    });      
  }

  function addAssociation(sourceType, targetType, source, target) {
    Core.postAssociationByUserId(1, sourceType, targetType, source, target, 
      function(response) {
        associationMap.push(response.data[0]);
      }, function(response) {
        console.log('server error when saving new concept');
        console.log(response);        
      })
  }
}