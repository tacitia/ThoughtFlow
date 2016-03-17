angular.module('focus.v2.controllers')
  .directive('paperThumbnailDirective', ['User', function(User) {

    // Construct "word" objects
    function processWordsDistance(content) {

      // TODO: substitute this with user selections in focus mode
      var focusKeywords = ['evaluate', 'interaction'];

      var words = content.split('\n')
        .map(function(paragraph) {
          var contents = paragraph.split(' ').map(function(word) {
            return {
              text: word,
              distanceToKeyword: focusKeywords.indexOf(word) > -1 ? 0 : 10,
              totalCharBefore: 0,
              length: word.length
            };
          });
          return {
            length: 0,
            prevParagraphLength: 0,
            contents: contents,
          }
        });

      // Compute distance to keywords
      words.forEach(function(paragraph) {
        var contents = paragraph.contents;
        for (var i = 0; i < contents.length; ++i) {
          var word = contents[i];
          if (word.distanceToKeyword === 0) {
            [1,2,3,4,5].forEach(function(offset) {
              if (i-offset >= 0) {
                contents[i-offset].distanceToKeyword = offset;
              }
              if (i+offset < paragraph.contents.length) {
                contents[i+offset].distanceToKeyword = offset;
              }
            })
          }
        }
      });

      // Assign length to words
      words.forEach(function(paragraph) {
        var accumulatedChar = 0;
        var contents = paragraph.contents;
        contents.forEach(function(word) {
          if (word.distanceToKeyword < 6) {
            word.length = word.length * 3;
          }
          word.totalCharBefore = accumulatedChar;
          accumulatedChar += word.length + 1;
        });
        paragraph.length = accumulatedChar;
      });

      var accumParaLength = 0;
      for (var i = 0; i < words.length; ++i) {
        words[i].prevParagraphLength = accumParaLength;
        accumParaLength += words[i].length;
      }

      return words;
    }

    function visualizeTextAge(container) {
      container.selectAll('.paragraph').remove();
      var paragraphs = User.activeParagraphs();

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

      var textColorScale = d3.scale.linear()
        .domain([minTime, maxTime])
        .range(['#e9f5ef', '#2ca25f']);
      var textLinearScale = d3.scale.linear()
        .domain([minTime, maxTime])
        .range([0, 1]);

      var paragraphGroups = container.selectAll('.paragraph')
        .data(User.activeParagraphs())
        .enter()
        .append('p')
        .attr('class', 'paragraph')
        .attr('id', function(d, i) { return 'paragraph-' + i; })
        .style('line-height', '120%');

      paragraphGroups
        .selectAll('.word-text')
        .data(function(d) { return d.text.split('').map(function(currentChar, j) {
          return {
            text: currentChar,
            timestamp: d.timestamps[j]
          }
        }); })
        .enter()
        .append('span')
        .attr('class', 'word-text')
        .text(function(d) {
          return d.text;
        })
        .style('color', function(d) { return textColorScale(d.timestamp.getTime()); })
/*        .style('background', function(d) {
          return textLinearScale(d.timestamp.getTime()) <= 0.01 ? '#d6d6d6' : '#fff';                              
        }) */
        .style('font-size', function(d) {
          return d.distanceToKeyword > 6 ? '6px' : '12px';                    
        })

      return;
    }

    function visualizeKeywordsMarkup() {
      container.selectAll('.paragraph').remove();
      var paragraphGroups = container.selectAll('.paragraph')
        .data(words)
        .enter()
        .append('p')
        .attr('class', 'paragraph')
        .style('line-height', '90%');

      paragraphGroups
        .selectAll('.word-text')
        .data(function(d) { return d.contents; })
        .enter()
        .append('span')
        .attr('class', 'word-text')
        .text(function(d) { return d.text + ' '; })
/*        .style('opacity', function(d) {
          return d.distanceToKeyword > 6 ? 0.3 : (1 - 0.1 * d.distanceToKeyword);          
        }) */
        .style('color', function(d) {
          var index = focusKeywords.indexOf(d.text);
          if (index >= 0) {
            return termColorMap(index);  
          }
          else {        
            return d.distanceToKeyword > 6 ? '#ccc' : 'black';      
          }   
        })
        .style('font-size', function(d) { return d.distanceToKeyword > 6 ? '6px' : '12px'; })
        .style('background', function(d) { return d.distanceToKeyword > 6 ? '#ccc' : '#fff'; })
        .on('mouseover', function(d) {
          if (d.distanceToKeyword > 6) return;
          d3.select(this).style('font-size', '14px');
        })
        .on('mouseout', function(d) {
          if (d.distanceToKeyword > 6) return;
          if ($scope.selectedTerms.indexOf(d.text) === -1) {
            d3.select(this).style('font-size', '12px');
          };
        })
        .on('click', function(d) {
          if ($scope.selectedTerms.indexOf(d.text) > -1) {
            $scope.selectedTerms = _.without($scope.selectedTerms, d.text);
          }
          else {
            var textTerms = $scope.terms.map(function(t) { return t.term; });
            if (textTerms.indexOf(d.text) > -1) {
              $scope.selectedTerms.push(d.text);        
            }    
          }
          d3.selectAll('.word-text')
            .filter(function(d) {
              return d.distanceToKeyword <= 6;
            })
            .style('font-size', function(d) {
              return $scope.selectedTerms.indexOf(d.text) > -1 ? '14px' : '12px';
            })
            .style('font-weight', function(d) {
              return $scope.selectedTerms.indexOf(d.text) > -1 ? 800 : 400;              
            });
          $scope.updateTermTopicOrdering();
        });
    }

    function visualize(container, width, height, scope) {
      if (scope.proposals === null) return;
//      var words = processWordsDistance(scope.proposals[0].content);
      visualizeTextAge(container);
    }
    
    return function(scope, element, attrs) {
      visualize(d3.select(element[0]), 600, 600, scope);
    };    
  
  }]);

