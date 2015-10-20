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

        $stateProvider
            .state('v1', {
                url: "/v1",
                views: {
                    "FullContentView": {
                        templateUrl: 'core/v1/landing.v1.html',
                        controller: 'BaselineController'
                    }
                }
            })

        $stateProvider
            .state('v2', {
                url: "/v2",
                views: {
                    "FullContentView": {
                        templateUrl: 'core/v2/landing.v2.html',
                    }
                }
            })       
            .state('v2.explore', {
                url: "/explore",
                views: {
                    'MainView@v2': {
                        templateUrl: 'core/v2/explore.v2.html',
                        controller: 'ExploreController'
                    }
                }
            })
            .state('v2.focus', {
                url: "/focus",
                views: {
                    "MainView@v2": {
                        templateUrl: 'core/v2/focus.v2.html',
                        controller: 'FocusController'
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