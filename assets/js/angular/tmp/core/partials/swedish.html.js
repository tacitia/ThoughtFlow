angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/swedish.html',
        "<p class=\"padding-lg\">\n    <em>\"Det är egentligen bara dåliga böcker som äro i behov av förord.\"</em>\n</p>");
}]);