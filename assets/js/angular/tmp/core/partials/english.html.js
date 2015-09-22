angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/english.html',
        "<p class=\"padding-lg\">\n    <em>\"In the end, it's not going to matter how many breaths you took, but how many moments took your breath away.\"</em>\n</p>");
}]);