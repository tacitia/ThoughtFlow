angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('modal/deleteModal.html',
        "<div class=\"modal-header\">\n    <h3>Are you sure you want to delete this?</h3>\n</div>\n<div class=\"modal-body\">\n  <p>{{content}}</p>\n</div>\n<div class=\"modal-footer\">\n  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n  <button class=\"btn btn-danger\" ng-click=\"delete()\">Delete</button>\n</div>");
}]);