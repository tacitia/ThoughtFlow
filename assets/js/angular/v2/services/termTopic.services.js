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
    console.log(topics)
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

  /*
   * criteria: indicates how to sort the terms and topics
   * top: specifies top X entries to be returned
   * start [optional]: if start is specified, throw out entries that 
   * come before the start index
   */
  function getTopTerms(criteria, top, start) {
    return termFilters.weight(top, start);
  }

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

  function getNeighborTopics(topic) {
    console.log(topic);
    var connections = [];
    var terms = [];
    var neighborTopics = _.uniq(_.flatten(_.take(topic.terms, 10).map(function(entry) {
        
        var fullTerm = {
          term: entry.term,
          origIndex: -1,
          properties: termTopicMap[entry.term]
        };
        terms.push(fullTerm);

      return termTopicMap[entry.term].topics.map(function(topic) {

        connections.push({
          term: fullTerm,
          topic: topicIdMap[topic.id]
        });
        
        return topicIdMap[topic.id];
      });
    })), function(topic) {
      return topic.id;
    });
    neighborTopics.push(topic);

    console.log(neighborTopics)

/*
    neighborTopics.forEach(function(topic) {
      topic.terms.forEach(function(entry) {
        var fullTerm = {
          term: entry.term,
          origIndex: -1,
          properties: termTopicMap[entry.term]
        };
        terms.push(fullTerm);
        connections.push({
          term: fullTerm,
          topic: topics[topic.id]
        });
      })
    });
*/ 

    terms = _.uniq(terms, function(term) {
      return term.term;
    });

    console.log(terms);

    return {
      terms: terms,
      topics: neighborTopics,
      connections: connections
    }
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