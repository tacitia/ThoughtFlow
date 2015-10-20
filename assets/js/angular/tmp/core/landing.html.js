angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('core/landing.html',
        "<page-meta-data status-code=\"200\">\n\t<title>{{ 'meta_title_core' }}</title>\n\t<meta name=\"description\" content=\"{{ 'meta_description_core'}}\"/>\n\t<meta name=\"keywords\" content=\"{{ 'meta_keywords_core' }}\"/>\n</page-meta-data>\n\n<div data-ng-controller=\"CoreCtrl\">\n    <ng-include src=\"'core/partials/version-picker.html'\"></ng-include>\n</div>\n");
}]);