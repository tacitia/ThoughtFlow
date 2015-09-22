angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/partials/language-picker.html',
        "<div class=\"text-center\">\n<!--    <h2>{{ 'label_which_language_do_you_prefer' | translate }}</h2> -->\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.explore\">Explore</button>\n    <button class=\"btn btn-lg btn-default\" ui-sref-active=\"btn-success\" ui-sref=\"index.investigate\">Investigate</button>\n</div>");
}]);