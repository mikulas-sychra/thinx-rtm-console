/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var RTM = angular.module("RTM", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "angular-web-notification",
    "tandibar/ng-rollbar",
    "luegg.directives"
]);

RTM.config(['RollbarProvider', function(RollbarProvider) {
  RollbarProvider.init({
    accessToken: "79f55666711744909737f6782f97ba80",
    captureUncaught: true,
    payload: {
      environment: 'production'
    }
  });
}]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
RTM.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
RTM.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
RTM.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout4',
    };

    $rootScope.settings = settings;
    $rootScope.searchText = "";

    return settings;
}]);

RTM.filter('lastSeen', function() {
    return function(date) { 
        return moment(date).fromNow();
    };
});

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
angular.module('RTM').filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

/* Setup App Main Controller */
RTM.controller('AppController', ['$scope', '$rootScope', 'webNotification', 'Rollbar', function($scope, $rootScope, $webNotification, Rollbar) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 

    });

    console.log(' === ROOT === ');
    console.log($rootScope);

    // UI temporary data, might be saved to localstorage
    if (typeof($rootScope.meta) == "undefined") {
        $rootScope.meta = {};
        $rootScope.meta.builds = []; // for build id queues
    }

    $rootScope.logoutMe = function () {
        Thinx.getLogout()
            .done(function(data) {
                console.log("logout response:");
                console.log(data);
            })
            .fail(error => console.log('Error:', error));
    }

    function updateProfile(data) {
        var response = JSON.parse(data);

        if (typeof(response) !== 'undefined' && typeof(response.success) !== 'undefined' && response.success) {

            console.log('-- processing profile ---');
            console.log(response);

            $rootScope.profile = response.profile;

            if (typeof($rootScope.profile.info.goals) == 'undefined') {
                console.log('- goals not defined yet -');
                $rootScope.profile.info.goals = [];
                // $rootScope.profile.info.goals = ['apikey','enroll','rsakey','source','update','build','profile_privacy','profile_avatar'];
            }

            if (typeof($rootScope.profile.avatar) == 'undefined' || $rootScope.profile.avatar.length == 0) {
                $rootScope.profile.avatar = '/assets/thinx/img/default_avatar_sm.png';
            }

            $scope.$apply();
        }
    }

    function updateSources(data) {

        console.log('-- processing sources --');        
        var response = JSON.parse(data);
        console.log(response);

        $rootScope.sources = {};
        $.each(response.sources, function(key, value) {
              $rootScope.sources[key] = value;
        });
        $scope.$apply();

        console.log('sources:');
        console.log($rootScope.sources);
    }

    function updateAuditLog(data) {
        var response = JSON.parse(data);

        $rootScope.auditlog = response.logs;
        $scope.$apply()

        console.log('auditlog:');
        console.log($rootScope.auditlog);
    }

    function updateBuildLogList(data) {
        if (typeof($rootScope.buildlog) == 'undefined') {
            // build log is not defined yet (can be defined by getBuildLog)
            $rootScope.buildlog = {};
        }

        var response = JSON.parse(data);
        console.log('buildlog list response:');
        console.log(response)

        if (typeof(response.success !== 'undefined') && response.success) {
            $rootScope.buildlog = response.builds;
            $scope.$apply()
            console.log('buildlog list:');
            console.log($rootScope.buildlog);
        } else {
            console.log('Buildlog list fetch error.') ;
        }
        
    }
    
    
    Thinx.getProfile()
            .done(function(data) {
                updateProfile(data);
            })
            .fail(error => console.log('getProfile Error:', error));

    Thinx.sourceList()
            .done(function(data) {
                updateSources(data);
            })
            .fail(error => console.log('sourceList Error:', error));

    Thinx.getAuditLog()
            .done(function(data) {
                updateAuditLog(data);
            })
            .fail(error => console.log('getAuditLog Error:', error));

    Thinx.buildLogList()
            .done(function(data) {
                updateBuildLogList(data);
            })
            .fail(error => console.log('buildLogList Error:', error));
            

    function registerNotification() {
        $webNotification.showNotification('Wohoo!', {
            body: 'Browser Notification Test Success.',
            icon: '/assets/thinx/img/favicon-32x32.png',
            onClick: function onNotificationClicked() {
                console.log('Notification clicked.');
            },
            autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
        }, function onShow(error, hide) {
            if (error) {
                window.alert('Unable to show notification: ' + error.message);
            } else {
                console.log('Notification Shown.');

                setTimeout(function hideNotification() {
                    console.log('Hiding notification....');
                    hide(); //manually close the notification (you can skip this if you use the autoClose option)
                }, 5000);
            }
        });
    }

}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
RTM.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
RTM.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
RTM.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Quick Sidebar */
RTM.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
RTM.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
RTM.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
RTM.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");  

    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Dashboard'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/thinx/js/plugins/ui-select/select.min.css',
                            '../assets/thinx/js/plugins/ui-select/select.js',

                            '../assets/thinx/js/dashboard.js',
                            'js/controllers/DashboardController.js',
                        ] 
                    });
                }]
            }
        })

        // Apikey Page
        .state('apikey', {
            url: "/apikey",
            templateUrl: "views/apikey.html",            
            data: {pageTitle: 'API Key Management'},
            controller: "ApikeyController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clipboardjs/clipboard.js',
                            'js/controllers/ApikeyController.js'
                        ] 
                    });
                }]
            }
        })

        // Rsakey Page
        .state('rsakey', {
            url: "/rsakey",
            templateUrl: "views/rsakey.html",            
            data: {pageTitle: 'RSA Key Management'},
            controller: "RsakeyController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/RsakeyController.js'
                        ] 
                    });
                }]
            }
        })

        // Apikey Page
        .state('source', {
            url: "/source",
            templateUrl: "views/source.html",            
            data: {pageTitle: 'Source Management'},
            controller: "SourceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/SourceController.js'
                        ] 
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',

                            '../assets/thinx/css/profile.css',
                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',

                            '../assets/thinx/js/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        // Blank Page
        .state('blank', {
            url: "/blank",
            templateUrl: "views/blank.html",            
            data: {pageTitle: 'Blank Page Template'},
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/BlankController.js'
                        ] 
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
RTM.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);