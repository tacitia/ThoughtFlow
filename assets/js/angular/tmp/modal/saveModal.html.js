angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/saveModal.html',
        "<div class=\"modal-header\">\n    <h3>Save the changes?</h3>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n</div>");
}]);