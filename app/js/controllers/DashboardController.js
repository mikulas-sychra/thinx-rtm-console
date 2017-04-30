angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        var jqxhr = Thinx.deviceList()
	        .done(function(data) {
                updateDevices(data);
            })
	        .fail(function(error) {
                console.log('Error:', error);
            });
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

	function updateDevices(data) {
        var devices = JSON.parse(data);
        $rootScope.devices = devices.devices;
        $scope.$apply()

        console.log('devices:');
        console.log($rootScope.devices);
    }

    
    $scope.attachRepository = function(sourceAlias, deviceAlias, deviceMac) {
    
        console.log('-- attaching ' + sourceAlias + ' to ' + deviceAlias + '/' + deviceMac + '--'); 

        
        var jqxhr = Thinx.attachRepository(sourceAlias, deviceAlias, deviceMac)
            .done(function(response) {
                
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);

                        // var jqxhr = Thinx.sourceList()
                            // .done( function(data) {
                                // updateSources(data)
                            // })
                            // .fail(error => console.log('Error:', error));

                        // $('#pageModal').modal('hide');
                        toastr.success('Repository Attached.', 'THiNX RTM Console', {timeOut: 5000})

                    } else {
                        console.log(response);
                        toastr.error('Attach Failed.', 'THiNX RTM Console', {timeOut: 5000})
                    }
                } else {
                    console.log('error');
                    console.log(response);
                }
            })
            .fail(function(error) {
                console.error('Error:', error);
                toastr.error('Attach Failed.', 'THiNX RTM Console', {timeOut: 5000})
            });

    };

    $scope.detachRepository = function(deviceAlias, deviceMac) {
    
        console.log('-- detaching source from ' + deviceAlias + '/' + deviceMac + '--'); 

        
        var jqxhr = Thinx.detachRepository(deviceAlias, deviceMac)
            .done(function(response) {
                
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);

                        // var jqxhr = Thinx.sourceList()
                            // .done( function(data) {
                                // updateSources(data)
                            // })
                            // .fail(error => console.log('Error:', error));

                        // $('#pageModal').modal('hide');

                        toastr.success('Repository Detached.', 'THiNX RTM Console', {timeOut: 5000})

                    } else {
                        console.log(response);
                        toastr.error('Detach Failed.', 'THiNX RTM Console', {timeOut: 5000})
                    }
                } else {
                    console.log('error');
                    console.log(response);
                }
            })
            .fail(function(error) {
                console.error('Error:', error);
                toastr.error('Detach Failed.', 'THiNX RTM Console', {timeOut: 5000})
            });

    };

    $scope.build = function(deviceAlias, deviceMac) {
        console.log('-- building firmware for ' + deviceAlias + '/' + deviceMac + ' --'); 
        toastr.info('Build Started for ' + deviceAlias + '.', 'THiNX RTM Console', {timeOut: 5000})
    };

});