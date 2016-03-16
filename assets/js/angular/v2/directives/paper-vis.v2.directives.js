angular.module('focus.v2.controllers')
  .directive('evidenceRecommendationDirective', ['Paper', function(Paper) {
    // WIP
    // Implementation plan: 
    // 1. Server side: Add an API that returns the number of 
    // 2. Vis: need information: 1) # of bookmarked evidence that cites the current paper; 2) # of bookmarked evidence that is cited
    // by the current paper; 3) total # of cites / citations among the dataset
    // Need to be able to get the year range for all the references and citations given a list of recommendations
    function randomIntFromInterval(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    function generateRandomRefsCites(evidenceYear) {
      var numRefs = randomIntFromInterval(15, 40);
      var numCites = randomIntFromInterval(10, 200);
      var refs = [];
      var cites = [];
      for (var i = 0; i < numRefs; ++i) {
        refs.push({
          metadata: {DATE: randomIntFromInterval(1990, evidenceYear-1)},
          bookmarked: randomIntFromInterval(0, 5)
        })
      }
      for (var j = 0; j < numCites; ++j) {
        cites.push({
          metadata: {DATE: randomIntFromInterval(evidenceYear+1, 2016)},
          bookmarked: randomIntFromInterval(0, 5)
        })
      }
      return {
        refs: refs,
        cites: cites
      }
    }

    function countDates(eArray, targetMap, minYear, maxYear, evidence) {
      for (var i = minYear; i <= maxYear; ++i) {
        targetMap.total[i] = 0;
        targetMap.bookmarked[i] = 0;
      }
      eArray.forEach(function(e) {
        if (typeof e.metadata == 'string') {
          e.metadata = JSON.parse(e.metadata);
        }
        var date = getEvidenceDate(e);
        if (date === 0 || date < minYear || date > maxYear) return;
        targetMap.total[date] += 1;
        if (e.bookmarked === 0) {
          targetMap.bookmarked[date] += 1;
        }
      })
      return _.max(_.values(targetMap.total));
    }

    function getEvidenceDate(evidence) {
      var evidenceYear = 0;
      if (evidence.metadata.DATE !== undefined) {
        evidenceYear = parseInt(evidence.metadata.DATE);
      }
      else if (evidence.metadata.YEAR !== undefined) {
        evidenceYear = parseInt(evidence.metadata.YEAR);        
      }
      return evidenceYear;
    }

    function drawBar(svg, dateScale, paperCountScale, paperMap, type, color, offset) {
      var years = _.keys(paperMap).map(function(d) {
        return parseInt(d);
      })
      svg.selectAll('.' + type + '-line')
        .data(years)
        .enter()
        .append('line')
        .attr('class', type + '-line')
        .attr('x2', function(d) { return dateScale(d) + offset; })
        .attr('x1', function(d) { return dateScale(d) + offset; })
        .attr('y2', function(d) { return paperCountScale(paperMap[d]); })
        .attr('y1', function(d) { return paperCountScale(0); })
        .attr('stroke', color)
        .attr('stroke-width', 4);
      return;
    }

    function drawPointer(svg, svgHeight) {
      svg.append('line')
        .attr('id', 'pointer')
        .attr('x1', -1)
        .attr('x2', -1)
        .attr('y1', 0)
        .attr('y2', svgHeight)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    }

    function updatePointer(svg, x, dateScale, citationInfo, evidenceYear) {
      svg.select('#pointer')
        .attr('x1', x)
        .attr('x2', x);
      var infoText = '';
      if (x !== -1) {
        year = Math.floor(dateScale.invert(x));
        if (year < evidenceYear) {
          totalPaper = citationInfo.references.total[year];          
          bookmarkedPaper = citationInfo.references.bookmarked[year]; 
          infoText += 'References from ' + year + ':';
          infoText += totalPaper + ' (bookmarked ' + bookmarkedPaper + ')';
        }
        else if (year > evidenceYear) {
          totalPaper = citationInfo.citations.total[year];
          bookmarkedPaper = citationInfo.citations.bookmarked[year];
          infoText += 'Citations from ' + year + ':';
          infoText += totalPaper + ' (bookmarked ' + bookmarkedPaper + ')';
        }
        else {
          infoText += 'Paper published in ' + year
        }
      }
      svg.select('#dateInfo')
        .text(infoText);
    }

    function drawLine(svg, dateScale, paperCountScale, paperMap, type, color, fillArea) {
      var line = d3.svg.line()
        .x(function(d) { return dateScale(d); })
        .y(function(d) { return paperCountScale(paperMap[d]); })
        .interpolate("basis");
      var years = _.keys(paperMap).map(function(d) {
        return parseInt(d);
      })
      svg.selectAll('.' + type + '-circle')
        .data(years)
        .enter()
        .append('circle')
        .attr('class', type + '-circle')
        .attr('r', 1)
        .attr('fill', color)
        .attr('cx', function(d) {
          return dateScale(d);
        })
        .attr('cy', function(d) {
          return paperCountScale(paperMap[d]);
        });

      svg.append('path')      
        .datum(years)  
        .attr('d', line)
        .attr('stroke', color)
        .attr('fill', 'none')
      if (fillArea) {
        var area = d3.svg.area()
          .y0(paperCountScale(0))
          .x(function(d) { return dateScale(d); })
          .y1(function(d) { return paperCountScale(paperMap[d]); })
        svg.append('path')      
          .datum(years)  
          .attr('d', area)
          .attr('fill', color);
        }
      }

    return function(scope, element, attrs) {
      var svgWidth = 300;
      var svgHeight = 50;
      var svg = d3.select(element[0]).append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight + 20)
        .attr('transform', 'translate(10, 0)');


      var citeInfo = {
        citations: {
          total: {},
          bookmarked: {},
          // The keys should come in the same order in citations and references
          topics: {}
        },
        references: {
          total:{},
          bookmarked: {},
          topics: {}
        }
      };

      var evidenceYear = getEvidenceDate(scope.e);
      var refs = Paper.getReferencesForPaper(scope.e.id);
      var cites = Paper.getCitationsForPaper(scope.e.id);
      var maxCountCite = countDates(cites, citeInfo.citations, Math.min(2016, evidenceYear+1), 2016, evidenceYear);
      var maxCountRef = countDates(refs, citeInfo.references, 1985, Math.max(1985, evidenceYear-1), evidenceYear);
      var dateScale = d3.scale.linear()
        .domain([1985, 2016])
        .range([5, svgWidth-5]);
      var paperCountScale = d3.scale.pow().exponent(1)
        .domain([Math.max(maxCountCite, maxCountRef), 0])
        .range([10, svgHeight-10]);
      // Now we can start visualizing...
      drawPointer(svg, svgHeight);
      drawLine(svg, dateScale, paperCountScale, citeInfo.citations.total, 'cite-total', 'grey', false);
      drawBar(svg, dateScale, paperCountScale, citeInfo.references.total, 'ref-total', 'grey', -2);
      drawLine(svg, dateScale, paperCountScale, citeInfo.citations.bookmarked, 'cite-bookmarked', 'steelblue', true);
      drawBar(svg, dateScale, paperCountScale, citeInfo.references.bookmarked, 'ref-bookmarked', 'steelblue', 2);
      svg.on('mousemove', function(d) {
        updatePointer(svg, d3.mouse(this)[0], dateScale, citeInfo, evidenceYear);
      });
      svg.on('mouseout', function(d) {
        updatePointer(svg, -1);
      })
      svg.selectAll('#this-paper')
        .data([scope.e])
        .enter()
        .append('circle')
        .attr('r', 4)
        .attr('fill', 'crimson')
        .attr('cx', dateScale(evidenceYear))
        .attr('cy', paperCountScale(0))
        .attr('uib-tooltip', 'Hello')
        .attr('tooltip-append-to-body', true)
        .attr('tooltip-placement', 'right');

      svg.append('text')
        .attr('id', 'dateInfo')
        .attr('transform', 'translate(20, ' + (svgHeight + 1) + ')')
        .text(function(d) {
          return '';
        })
        .attr('font-size', 10);
    };
  }]);

