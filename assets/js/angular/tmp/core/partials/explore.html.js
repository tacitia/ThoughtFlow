angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/explore.html',
        "<svg id=\"graph\">\n</svg>\n<div id=\"control\">\n  <button class=\"btn\" ng-click=\"getNeighborConcepts()\">Expand</button>\n</div>");
}]);