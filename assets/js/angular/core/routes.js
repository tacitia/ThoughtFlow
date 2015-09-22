angular.module('mainModule')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: "/",
                views: {
                    "FullContentView": {
                        templateUrl: 'core/landing.html'
                    }
                }
            })
            .state('index.explore', {
                url: "explore/",
                views: {
                    "MainView@index": {
                        templateUrl: 'core/partials/explore.html',
                        controller: 'ExploreController'
                    }
                }
            })
            .state('index.investigate', {
                url: "investigate/",
                views: {
                    "MainView@index": {
                        templateUrl: 'core/partials/investigate.html'
                    }
                }
            });
        
        $stateProvider
            .state('register', {
                url: "/register",
                views: {
                    "FullContentView": {
                        templateUrl: 'authentication/register.html',
                        controller: 'RegisterController'
                    }
                }
            });

        $stateProvider
            .state('login', {
                url: "/login",
                views: {
                    "FullContentView": {
                        templateUrl: 'authentication/login.html',
                        controller: 'LoginController'
                    }
                }
            });
    }]);