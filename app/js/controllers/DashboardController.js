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

        var jqxhr = Thinx.buildLogList()
            .done(function(data) {
                updateBuildLogList(data);
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

    function updateBuildLogList(data) {
        var response = JSON.parse(data);

        console.log('buildlog list response:') ;
        console.log(response)

        if (typeof($rootScope.buildlog) == 'undefined') {
            $rootScope.buildlog = {
                rows: response.builds.rows
            };
        }
        $rootScope.buildlog.rows = response.builds.rows;
        $scope.$apply()

        console.log('buildlog list:') ;
        console.log($rootScope.buildlog.rows);
    }

    function updateBuildLog(data) {
        var response = JSON.parse(data);

        $rootScope.buildlog = response.logs;
        $scope.$apply()

        console.log('buildlog:');
        console.log($rootScope.buildlog);
    }

    
    $scope.attachRepository = function(sourceAlias, deviceMac) {
    
        console.log('-- attaching ' + sourceAlias + ' to  ' + deviceMac + '--'); 

        var jqxhr = Thinx.attachRepository(sourceAlias, deviceMac)
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

    $scope.build = function(deviceHash, sourceAlias) {
        console.log('-- building firmware for ' + deviceHash + '/' + sourceAlias + ' --'); 

        var jqxhrBuild = Thinx.build(deviceHash, sourceAlias)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.build) !== 'undefined' && response.build.success) {
                        console.log(response.build);
                        toastr.success('Starting Build.', 'THiNX RTM Console', {timeOut: 5000})
                    } else {
                        console.log(responseObj);
                        toastr.error('Build Failed.', 'THiNX RTM Console', {timeOut: 5000})
                    }
                } else {
                    console.log('error');
                    console.log(response);
                }
                
            })
            .fail(function(error) {
                console.error('Error:', error);
                toastr.error('Build Failed Badly.', 'THiNX RTM Console', {timeOut: 5000})
            });
    };


    $scope.hasSource = function(index) {
        if (typeof($rootScope.devices[index].value.source) !== 'undefined' && $rootScope.devices[index].value.source.length > 0) {
            return true;
        }
        return false;
    }


    $scope.changeDeviceAlias = function() {

        var deviceHash = $root.devices[index].value.hash;
        var deviceAlias = $root.devices[index].value.alias;

        console.log('-- changing device alias to ' + deviceAlias + '  for ' + deviceHash + ' --'); 

        var jqxhrAlias = Thinx.changeDevice(deviceHash, deviceAlias)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.success) !== 'undefined' && response.success) {
                        console.log(response);
                        toastr.success('Alias updated.', 'THiNX RTM Console', {timeOut: 5000})
                    } else {
                        console.log(responseObj);
                        toastr.error('Alias Update Failed.', 'THiNX RTM Console', {timeOut: 5000})
                    }
                } else {
                    console.log('error');
                    console.log(response);
                }
                
            })
            .fail(function(error) {
                console.error('Error:', error);
                toastr.error('Alias Update Failed Badly.', 'THiNX RTM Console', {timeOut: 5000})
            });
    };

    $scope.resetModal = function(index) {
        $scope.deviceHash = $root.devices[index].value.hash;
        $scope.deviceAlias = $root.devices[index].value.alias;
        console.log($scope.deviceHash);
        console.log($scope.deviceAlias);
        console.log('Modal form reset.');
    }

});