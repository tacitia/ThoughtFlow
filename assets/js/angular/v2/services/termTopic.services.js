angular
  .module('termTopic.services')
  .factory('TermTopic', TermTopic);

function TermTopic(Core) {
  var terms = null;
  var topics = null;
  var termTopicMap = null;
  var termIndexMap = null;
  var topicIdMap = null;
  var termOrders = {
    weight: null
  }
  var termFilters = {
    weight: null
  }
  var TermTopic = {
    initialize: initialize,
    getTopTerms: getTopTerms,
    getTopTopics: getTopTopics,
    getAllTerms: getAllTerms,
    getNeighborTopics: getNeighborTopics,
    numOfTerms: numOfTerms,
    numOfTopics: numOfTopics,
    getTermPropertyMax: getTermPropertyMax
  };
  var minTermTopicProb = 1;

  return TermTopic;

  ////////////////////
  function initialize(sourceTopics) {
    topics = sourceTopics;
    terms = getUniqueTerms(topics);
    termTopicMap = getTermTopicCount(terms, topics);
    termIndexMap = _.object(terms.map(function(term, i) {
      return [term, i];
    }));
    topicIdMap = _.object(topics.map(function(topic, i) {
      return [topic.id, topic];
    }));

    termOrders.weight = d3.range(terms.length).sort(function(i, j) { 
        return termTopicMap[terms[j]].weight - termTopicMap[terms[i]].weight;
      });

    termFilters.weight = function(topNum, start) {
      var sortedTermIndice = _.take(_.drop(termOrders.weight, start), topNum);
      return sortedTermIndice.map(function(i) {
        return {
          term: terms[i],
          origIndex: i,
          properties: termTopicMap[terms[i]]
        };
      });
    }
  }

  function getTermPropertyMax(criteria) {
    return _.max(terms.map(function(term) { return termTopicMap[term].weight; }))    
  }

  function numOfTerms() {
    return terms.length;
  }

  function numOfTopics() {
    return topics.length;
  }


  function getAllTerms() {
    return termFilters.weight(terms.length, 0);
  }
  /*
   * criteria: indicates how to sort the terms and topics
   * top: specifies top X entries to be returned
   * start [optional]: if start is specified, throw out entries that 
   * come before the start index;
   * selectedTerms [optional]: 
   */
  function getTopTerms(criteria, top, start, selectedTerms) {
    if (selectedTerms !== undefined && selectedTerms.length > 0) {
      // Get all topics containing the selected terms
      var keyTopics = _.flatten(selectedTerms.map(function(term) {
        console.log(termTopicMap[term])
        return termTopicMap[term].topics.map(function(topic) {
          return topicIdMap[topic.id];
        })
      }));

      var rankedTerms = termFilters.weight(terms.length, 0);

      // Assign weights to every term, based on its related topics
      var termSelectionScoreMap = {};
      rankedTerms.forEach(function(term) {
        termSelectionScoreMap[term.term] = 1;
      });
      keyTopics.forEach(function(topic) {
        topic.terms.forEach(function(t) {
          termSelectionScoreMap[t.term] += 100;
        })
      });
      selectedTerms.forEach(function(term) {
        termSelectionScoreMap[term] += 10000;
      })

      var selectionWeightedTerms = _.sortBy(rankedTerms, function(term) {
        return -termSelectionScoreMap[term.term] * term.properties.weight;
      });

      return _.take(_.drop(selectionWeightedTerms, start), top);
    }
    else {
      return termFilters.weight(top, start);
    }
  }

  /*
   * Given the selected terms, find all terms that share the same topics with 
   * those terms; rank them based on the number of shared topics, then 
   */
  function getTermsGivenSelectedTerms(selectedTerms, num) {

  };

  function getTopTopics(terms, top, selectedTerms) {
    // Compute the total weight for each topic, i.e. the weight of all the topic's terms that are 
    // among the top terms
    var topicMap = {};

    var termTopicConnections = [];

    terms.forEach(function(term) {
      term.properties.topics.forEach(function(topic) {
        if (topicMap[topic.id] === undefined) { 
          topicMap[topic.id] = 0;
        }
        var weight = 1;
        if (selectedTerms !== undefined && selectedTerms.length > 0) {
          if (selectedTerms.indexOf(term.term) >= 0) {
            weight = Math.ceil(1 / minTermTopicProb);
          }
        }
        topicMap[topic.id] += topic.prob * weight;

        termTopicConnections.push({
          term: term,
          topic: topicIdMap[topic.id]
        });
      });
    });

    var sortedTopics = _.keys(topicMap).map(function(topicId) {
      var topic = topicIdMap[topicId];
      topic.variable = {};
      topic.variable.weight = topicMap[topicId];
      return topic;
    }).sort(function(topic1, topic2) {
      return topic2.variable.weight - topic1.variable.weight;
    });

    var topTopics = _.take(sortedTopics, top);
    var topTopicIds = topTopics.map(function(t) {
      return t.id;
    })

    return {
      topics: topTopics,
      termTopicConnections: _.filter(termTopicConnections, function(c) {
        return topTopicIds.indexOf(c.topic.id) >= 0;
      })
    }
  }

  function getNeighborTopics(topic, minSharedTerm) {
    var connections = [];
    var terms = [];
    var neighborTopicIds = _.flatten(_.take(topic.terms, 10).map(function(entry) {
      return termTopicMap[entry.term].topics.map(function(topic) {        
        return topic.id;
      });
    }));

    neighborTopicIds = _.without(neighborTopicIds, topic.id);

    var topicCounts = _.countBy(neighborTopicIds, function(topicId) {
      return topicId;
    });

    var neighborTopics = _.filter(_.pairs(topicCounts), function(topicIdCountPair) {
      return minSharedTerm === undefined ? true : topicIdCountPair[1] >= minSharedTerm;
    }).map(function(topicIdCountPair) {
      var topic = topicIdMap[topicIdCountPair[0]];
      topic.numSharedTerms = topicIdCountPair[1];
      return topic;
    });

    return neighborTopics;
  }

  function getUniqueTerms(topics) {
    return _.uniq(_.flatten(topics.map(function(t) {
      var termTuples = t.terms;
      return termTuples.map(function(tuple) {
        return tuple.term;
      })
    })));
  }

  function getTermTopicCount(terms, topics) {
    var termTopicMap = _.object(terms.map(function(t) {
      return [t, {topics: [], topicCount: 0, weight: 0}];
    }));
    for (var i in topics) {
      var topic = topics[i];
      var termTuples = topic.terms;
      for (var j in termTuples) {
        var term = termTuples[j].term;
        var prob = termTuples[j].prob;
        if (prob < minTermTopicProb) {
          minTermTopicProb = prob;
        }
        var entry = termTopicMap[term];
        entry.topics.push({
          id: topic.id,
          prob: prob
        });
        entry.topicCount += 1;
        entry.weight += prob;
      }
    }
    return termTopicMap;
  }

}