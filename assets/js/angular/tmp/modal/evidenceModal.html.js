angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/evidenceModal.html',
        "<div class=\"modal-header\">\n    <h3>Add new evidence</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"abstract\">Abstract</label>  \n  <textarea class=\"form-control\" id=\"abstract\" ng-model=\"abstract\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n</div>");
}]);