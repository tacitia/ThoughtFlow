angular
  .module('bibtex.services')
  .factory('Bibtex', Bibtex);

  function Bibtex($http, $q) {
    console.log(parseBibtexFile)
    var Bibtex = {
      parseBibtexFile: parseBibtexFile
    };

    return Bibtex;

    ////////////////////

    function parseBibtexFile(fileContent) {
      var evidenceList = [];
      var lines = fileContent.split('\n');

      lines.reduce(function(prev, curr, index, array) {
        var cleanLine = curr.trim(); // Wish this is really clean
        var initial = cleanLine.charAt(0);
        if (initial === '@') {
          var newEvidence = [cleanLine];
          prev.push(newEvidence);
        }
        else if (initial.length > 0 && initial !== '%') {
          var numOfEvidence = prev.length;
          prev[numOfEvidence-1].push(cleanLine);
        }
        return prev;
      }, evidenceList)

      var results = [];

      evidenceList.forEach(function(evidenceArray) {
        var evidenceString = evidenceArray.join('\n');
        var parsedEvidence = parseBibtex(evidenceString);
        for (var key in parsedEvidence) { // There should be only one key. Any better way to read that only key?
          var metadata = parsedEvidence[key];
          if (metadata.TITLE !== undefined) {
            results.push({
              title: metadata.TITLE,
              abstract: metadata.ABSTRACT !== undefined ? metadata.ABSTRACT : '',
              metadata: _.omit(_.omit(metadata, 'TITLE'), 'ABSTRACT')
            });
          }
        }
      });      

      return results;
    }
  }