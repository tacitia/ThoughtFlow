angular.module('mainModule').run(['$templateCache', function($templateCache) {
    $templateCache.put('authentication/register copy.html',
        "<div class=\"row\">\n  <div class=\"col-md-4 col-md-offset-4\">\n    <h1>Register</h1>\n\n    <div class=\"well\">\n      <form role=\"form\" ng-submit=\"register()\">\n        <div class=\"form-group\">\n          <label for=\"register__email\">Email</label>\n          <input type=\"email\" class=\"form-control\" id=\"register__email\" ng-model=\"email\" placeholder=\"ex. jane@notgoogle.com\" />\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"register__username\">Username</label>\n          <input type=\"text\" class=\"form-control\" id=\"register__username\" ng-model=\"username\" placeholder=\"ex. jane\" />\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"register__password\">Password</label>\n          <input type=\"password\" class=\"form-control\" id=\"register__password\" ng-model=\"password\" placeholder=\"ex. thisisnotgoogleplus\" />\n        </div>\n\n        <div class=\"form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>");
}]);