angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/conceptsModal copy.html',
        "<div class=\"modal-header\">\n    <h3>Add new concept</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"term\">Term</label>\n  <input type=\"text\" class=\"form-control\" id=\"term\" ng-model=\"term\"/>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);