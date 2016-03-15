/*
 * This service handles information related to the active collection, including its name, as well as 
 * the list of evidence
 */
angular
  .module('collection.services')
  .factory('Collection', Collection);

Collection.$inject = ['$cookies', '$http', 'Core'];

  function Collection($cookies, $http, Core) {
    var topics = null;
    var _id = 13;
    var Collection = {
      id: id,
      allTopics: allTopics,
    };

    return Collection;

    ////////////////////

    function id(id) {
      if (arguments.length === 0) {
        return _id;
      }
      else {
        _id = id;
        return this;
      }    
    }  

    function allTopics(callback) {
      if (topics === null) {
        Core.getEvidenceCollection(_id, function(response) {
          topics = response.data.map(function(topic) {
            return {
              id: topic.index,
              terms: JSON.parse(topic.terms).map(function(termTuple) {
                return {
                  term: termTuple[0],
                  prob: termTuple[1]
                }
              }),
              evidenceCount: topic.document_count
            }
          });
          callback(topics);
        }, function() {
          console.log('server error when retrieving data for collection ' + _id);
          console.log(errorResponse);
        })
      }
      else {
        callback(topics);
      }
    }
  }