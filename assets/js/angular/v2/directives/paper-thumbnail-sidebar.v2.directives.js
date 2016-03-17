angular.module('focus.v2.controllers')
  .directive('paperThumbnailSidebarDirective', ['User', function(User) {

    var charWidth = 1;
    var charHeight = 1;
    var citationWidth = 20;
    var previewWidth = 35;
    var citationGroups = null;
    var tip = null;

    function computeParagraphPreviewHeight(i) {
      var paragraphs = User.activeParagraphs();
      var height = Math.floor(paragraphs[i].timestamps.length * charWidth / previewWidth) * (charHeight+1);
      return Math.max(height, 50);
    }

    function drawParagraphSelector(group) {
      group.append('rect')
        .attr('id', 'bound')
        .attr('width', previewWidth)
        .attr('height', function(d, i) {
          return computeParagraphPreviewHeight(i);
        })
        .attr('fill', 'white')
        .attr('fill-opacity', 0)
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .attr('rx', 3)
        .on('mouseenter', function(d, i) {
          if (i === User.selectedParagraph()) return;
          d3.select(this).attr('stroke', '#ccc');
        })
        .on('mouseleave', function(d, i) {
          if (i === User.selectedParagraph()) return;
          d3.select(this).attr('stroke', 'white');
        })
        .on('click', function(d, i) {
          var myElement = document.getElementById('paragraph-' + i);
          var topPos = myElement.offsetTop;         
          document.getElementById('selected-thumbnail').scrollTop = topPos;
          if (i === User.selectedParagraph()) {
            User.selectedParagraph(-1);
          }
          else {
            User.selectedParagraph(i);            
          }
        });
      }

    function updateCitationMarkers(scope) {
      if (citationGroups === null) return;
      var paragraphs = User.activeParagraphs();
      var citations = User.paragraphCitation();
      var markers = citationGroups.selectAll('.citationMarker')
        .data(function(d, i) {
          return d.map(function(c) {
            return {
              citation: c,
              groupIndex: i
            }
          });
        })
      markers.exit().remove();
      markers.enter()
        .append('rect')
        .attr('class', 'citationMarker')
        .attr('width', 10)
        .attr('height', 5)
        .attr('stroke-width', 0)
        .attr('fill', '#feb24c');

      markers
        .attr('transform', function(d, i) {
          var left = 1;
          var top = computeParagraphPreviewHeight(d.groupIndex) - (i+1) * 7;
          return 'translate(' + left + ',' + top + ')';
        })
        .on('mouseover', function(d, i) {
          var top = Math.floor(paragraphs[d.groupIndex].timestamps.length * charWidth / previewWidth) * (charHeight+1) - d.citation.index * 7;
          console.log(d)
          tip.show(d);
        })
        .on('mouseout', tip.hide)
        .on('click', function(d) {
          scope.searchTitle = d.citation.evidence.title;
          scope.searchEvidenceByTitle();    
        });
    }

    function visualize(container, totalWidth, height, scope) {
      var paragraphs = User.activeParagraphs();
      var citations = User.paragraphCitation();

      if (paragraphs === null || paragraphs === undefined || paragraphs.length === 0) return;
      var minTime = paragraphs[0].timestamps[0].getTime();
      var maxTime = 0;
      paragraphs.forEach(function(p) {
        p.timestamps.forEach(function(ts) {
          var tsm = ts.getTime();
          minTime = tsm < minTime ? tsm : minTime;
          maxTime = tsm > maxTime ? tsm : maxTime;
        })
      })

      var timeColorScale = d3.scale.linear()
        .domain([minTime, maxTime])
        .range(['#e9f5ef', '#2ca25f']);

      container.selectAll('g').remove();
      var freshness = container.selectAll('.freshness')
        .data(paragraphs)
        .enter()
        .append('g')
        .attr('class', 'freshness')
        .attr('transform', function(d, i) {
          var top = 20;
          for (var j = 0; j < i; ++j) {
            top += computeParagraphPreviewHeight(j) + 5;
//            top += Math.floor(paragraphs[j].timestamps.length * charWidth / previewWidth) * (charHeight+1) + 5;
          }
          return 'translate(20, ' + top + ')';
        });

      freshness.selectAll('rect')
        .data(function(d) {
          return d.timestamps;
        })
        .enter()
        .append('rect')
        .attr('width', charWidth)
        .attr('height', charHeight)
        .attr('transform', function(d, i) {
          var left = (i * charWidth) % previewWidth;
          var top = Math.floor(i / (previewWidth / charWidth)) * (charHeight+1);
          return 'translate(' + left + ', ' + top + ')';          
        })
        .attr('fill', function(d, i) {
          return timeColorScale(d.getTime());
        });

      drawParagraphSelector(freshness);

      citationGroups = container.selectAll('.citation')
        .data(citations)
        .enter()
        .append('g')
        .attr('class', 'citation')
        .attr('transform', function(d, i) {
          var top = 20;
          for (var j = 0; j < i; ++j) {
            top += computeParagraphPreviewHeight(j) + 5;
//            top += Math.floor(paragraphs[j].timestamps.length * charWidth / previewWidth) * (charHeight+1) + 5;
          }
          return 'translate(0, ' + top + ')';
        });

      citationGroups.append('rect')
        .attr('rx', 2)
        .attr('width', 12)
        .attr('height', function(d, i) { return computeParagraphPreviewHeight(i); })
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)
        .attr('fill', 'white');

      tip = d3.tip()
        .attr('class', 'd3-tip')
        .direction('n')
        .offset([-10, 0])
        .html(function(d) {
          return d.citation.evidence.title;
        })
      citationGroups.call(tip);

      updateCitationMarkers(scope);
    }
    
    return function(scope, element, attrs) {
      visualize(d3.select(element[0]), 60, 600, scope);
      scope.$watch(function () {
          return User.paragraphCitation();
      },
      function (newVal) {
        if (typeof newVal !== 'undefined') {
          updateCitationMarkers(scope);
        }
      }, true);
    };
  
  }]);

