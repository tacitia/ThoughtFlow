angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/confirmModal.html',
        "<div class=\"modal-header\">\n    <h3>Add new texts</h3>\n</div>\n<div class=\"modal-body\">\n  <label for=\"title\">Title</label>\n  <input type=\"text\" class=\"form-control\" id=\"title\" ng-model=\"title\"/>\n  <label for=\"content\">Content</label>  \n  <textarea class=\"form-control\" id=\"content\" ng-model=\"content\"></textarea>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-primary\" ng-click=\"delete()\">Delete</button>\n</div>");
}]);