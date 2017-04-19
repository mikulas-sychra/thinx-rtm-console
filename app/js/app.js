/***
RTM Console App Main Script
***/

/* RTM App */
var RTM = angular.module("RTM", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",
    "ngSanitize",
	"ngCookies"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
RTM.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
RTM.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

RTM.config(['$httpProvider', function($httpProvider) {
	// to enable cookeis
	$httpProvider.defaults.withCredentials = true;
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
RTM.factory('settings', ['$rootScope', function($rootScope) {


	// supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
RTM.controller('AppController', ['$scope', '$rootScope', '$cookieStore', '$cookies', '$timeout', '$http', function($scope, $rootScope, $cookieStore, $cookies, $timeout, $http) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });

	$http.defaults.headers.post = { 'Content-Type': 'application/json' }

    // Contignous database update notifications
    var counter = 30;

    $(function() {
        fetchProfile();
        fetchDevices();
        update();
    });

    function update() {
        counter--;

        if (counter == 0) {
            counter = 30;
            console.log("Refreshing in " + counter + " seconds...");
            fetchProfile();
        }

        setTimeout(update, 1000);
    }


    function fetchDevices() {
        var devicesFetch = {
            method: 'GET',
            url: 'http://thinx.cloud:7442/api/user/devices'
        }

        $http(devicesFetch).then(
            function(devicesFetchResponse){
                console.log('--devices fetch success--');
                console.log(devicesFetchResponse);

                $rootScope.devices = devicesFetchResponse.data.devices;
            },
            function(devicesFetchResponse){
                console.log('--devices fetch failure--');
                console.log('devices fetch request');
                console.log(devicesFetch);
                console.log('devices fetch response');
                console.log(devicesFetchResponse);
            }
        );
    }


    function fetchProfile() {
        var profileFetch = {
            method: 'GET',
            url: 'http://thinx.cloud:7442/api/user/profile'
        }


        $http(profileFetch).then(
            function(profileFetchResponse){
                console.log('--profile fetch success--');
                console.log(profileFetchResponse);

                $rootScope.profile = profileFetchResponse.data.rows[0].doc;
				// $rootScope.apikeys = $rootScope.profile.api_keys;
                $rootScope.sources = $rootScope.profile.repos;

                console.log('profile:');
                console.log($rootScope.profile);
                console.log('apikeys:');
                console.log($rootScope.apikeys);
                console.log('sources:');
                console.log($rootScope.sources);
                
            },
            function(profileFetchResponse){
                console.log('--profile fetch failure--');
                console.log('profile fetch request:');
                console.log(profileFetch);
                console.log('profile fetch response:');
                console.log(profileFetchResponse);
            }
        );
    }

    
    function profile() {

        var changeQuery = {
            first_name: "john",
            last_name: "doe",
            email: "john@doe.com",
            phone: "john@doe.com",
            avatar: "data:image/png;base64,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",
            password: "tset",
            privacy: {
                globalPush: true,
                importantNotifications: true,
                forceUniqueKeys: true
            }
        }

        var profileChange = {
            method: 'POST',
            url: 'http://thinx.cloud:7442/api/user/profile',
            data: { query: changeQuery }
        }
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
RTM.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
RTM.controller('PageHeadController', ['$scope', function($scope) {
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
            templateUrl: "views/rtm_dashboard.html",            
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/morris/morris.css',
                            '../../../assets/admin/pages/css/tasks.css',
                            
                            '../../../assets/global/plugins/morris/morris.min.js',
                            '../../../assets/global/plugins/morris/raphael-min.js',
                            '../../../assets/global/plugins/jquery.sparkline.min.js',

                            '../../../assets/admin/pages/scripts/tasks.js',

							'../../../app/js/scripts/dashboard-charts.js',

                             'js/controllers/DashboardController.js'
                        ] 
                    });
                }]
            }
        })

        // API Keys
        .state('apikeys', {
            url: "/apikeys.html",
            templateUrl: "views/rtm_apikeys.html",            
            data: {pageTitle: 'API Keys', pageSubTitle: 'control & management'},
            controller: "ApikeysController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/morris/morris.css',
                            '../../../assets/admin/pages/css/tasks.css',
                            
                            '../../../assets/global/plugins/morris/morris.min.js',
                            '../../../assets/global/plugins/morris/raphael-min.js',
                            '../../../assets/global/plugins/jquery.sparkline.min.js',

                            '../../../assets/admin/pages/scripts/tasks.js',

                            '../../../app/js/scripts/dashboard-charts.js',

                            'js/controllers/ApikeysController.js'
                        ] 
                    });
                }]
            }
        })

        // API Keys
        .state('sources', {
            url: "/sources.html",
            templateUrl: "views/rtm_sources.html",            
            data: {pageTitle: 'Sources', pageSubTitle: 'control & management'},
            controller: "SourcesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/morris/morris.css',
                            '../../../assets/admin/pages/css/tasks.css',
                            
                            '../../../assets/global/plugins/morris/morris.min.js',
                            '../../../assets/global/plugins/morris/raphael-min.js',
                            '../../../assets/global/plugins/jquery.sparkline.min.js',

                            '../../../assets/admin/pages/scripts/tasks.js',

                            '../../../app/js/scripts/dashboard-charts.js',

                            'js/controllers/SourcesController.js'
                        ] 
                    });
                }]
            }
        })


        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload', pageSubTitle: 'angularjs file upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'RTM',
                        files: [
                            'js/controllers/GeneralPageController.js',
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select', pageSubTitle: 'select2 written in angularjs'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'RTM',
                        files: [
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap', pageSubTitle: 'bootstrap components written in angularjs'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'RTM',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View', pageSubTitle: 'tree view samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../../../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../../../assets/admin/pages/scripts/ui-tree.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools', pageSubTitle: 'form components & widgets sample'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '../../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../../assets/global/plugins/typeahead/typeahead.css',

                            '../../../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../../../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../../../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../../../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../../../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '../../../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../../../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../../../assets/global/plugins/typeahead/handlebars.min.js',
                            '../../../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../../../assets/admin/pages/scripts/components-form-tools.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers', pageSubTitle: 'date, time, color, daterange pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/clockface/css/clockface.css',
                            '../../../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../../../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../../../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            '../../../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../../../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../../../assets/global/plugins/clockface/js/clockface.js',
                            '../../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                            '../../../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../../../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../../../assets/admin/pages/scripts/components-pickers.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns', pageSubTitle: 'select2 & bootstrap select dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                            '../../../assets/global/plugins/select2/select2.css',
                            '../../../assets/global/plugins/jquery-multi-select/css/multi-select.css',

                            '../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                            '../../../assets/global/plugins/select2/select2.min.js',
                            '../../../assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                            '../../../assets/admin/pages/scripts/components-dropdowns.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/advanced.html",
            templateUrl: "views/datatables/advanced.html",
            data: {pageTitle: 'Advanced Datatables', pageSubTitle: 'advanced datatables samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/select2/select2.css',                             
                            '../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css', 
                            '../../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../../assets/global/plugins/select2/select2.min.js',
                            '../../../assets/global/plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables', pageSubTitle: 'ajax datatables samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/select2/select2.css',                             
                            '../../../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../../../assets/global/plugins/select2/select2.min.js',
                            '../../../assets/global/plugins/datatables/all.min.js',

                            '../../../assets/global/scripts/datatable.js',
                            'js/scripts/table-ajax.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile sample'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/admin/pages/css/profile.css',
                            '../../../assets/admin/pages/css/tasks.css',
                            
                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/admin/pages/scripts/profile.js',

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
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile dashboard sample'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account', pageSubTitle: 'user profile account sample'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help', pageSubTitle: 'user profile help sample'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo', pageSubTitle: 'user todo & tasks sample'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'RTM',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../../assets/global/plugins/select2/select2.css',
                            '../../../assets/admin/pages/css/todo.css',
                            
                            '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../../../assets/global/plugins/select2/select2.min.js',

                            '../../../assets/admin/pages/scripts/todo.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
RTM.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view

	console.log('rootscope');
	console.log($rootScope);
}]);