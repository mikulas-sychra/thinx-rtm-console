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

        $scope.deviceUdid = null;
        $scope.deviceAlias = null;
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

	function updateDevices(data) {
        var devices = JSON.parse(data);
        $rootScope.devices = devices.devices;
        $scope.$apply();

        console.log('devices:');
        console.log($rootScope.devices);
    }
    
    $scope.attachRepository = function(sourceAlias, deviceMac) {
    
        console.log('-- attaching ' + sourceAlias + ' to  ' + deviceMac + '--'); 

        var jqxhr = Thinx.attachRepository(sourceAlias, deviceMac)
            .done(function(response) {
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);
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

    $scope.build = function(deviceUdid, sourceAlias) {
        console.log('-- building firmware for ' + deviceUdid + '/' + sourceAlias + ' --'); 

        var dryrun = true;

        var jqxhrBuild = Thinx.build(deviceUdid, sourceAlias, dryrun)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.build) !== 'undefined' && response.build.success) {
                        console.log(response.build);
                        toastr.success('Starting Build.', 'THiNX RTM Console', {timeOut: 5000})


                        console.log('--- trying to catch build log for ' + response.build.id);
                        var jqxhrTest = Thinx.getBuildLog(response.build.id)
                        .done(function(data) {
                            console.log(' --- build log data received ---');
                            console.log(data);
                        })
                        .fail(error => console.log('Error:', error));

            
                    } else {
                        console.log(response);
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
        if (typeof($rootScope.devices[index].value.source) !== 'undefined' && 
            $rootScope.devices[index].value.source !== null) {
            return true;
        }
        return false;
    }

    $scope.changeDeviceAlias = function() {

        var deviceUdid = $scope.deviceUdid;
        var deviceAlias = $scope.deviceAlias;

        console.log('-- changing device alias to ' + deviceAlias + '  for ' + deviceUdid + ' --'); 

        var jqxhrAlias = Thinx.changeDevice(deviceUdid, deviceAlias)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.success) !== 'undefined' && response.success) {
                        console.log(response);
                        toastr.success('Alias updated.', 'THiNX RTM Console', {timeOut: 5000})

                        var jqxhr = Thinx.deviceList()
                            .done(function(data) {
                                updateDevices(data);
                                $('#pageModal').modal('hide');
                            })
                            .fail(function(error) {
                                console.log('Error:', error);
                            });

                        
                    } else {
                        console.log(response);
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

    $scope.revokeDevice = function() {
        console.log('--revoking device ' + $scope.deviceUdid +'--')

        var jqxhr = Thinx.revokeDevice($scope.deviceUdid)
            .done(function(response) {
                if (response.success) {
                    console.log('Success:', response.revoked);
                    toastr.success('Device Revoked.', 'THiNX RTM Console', {timeOut: 5000})

                    var jqxhr = Thinx.deviceList()
                        .done(function(data) {
                            updateDevices(data);
                            $('#pageModal').modal('hide');
                        })
                        .fail(function(error) {
                            console.log('Error:', error);
                        });

                } else {
                    toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
                }
            })
            .fail(function (error) {
                // TODO throw error message
                console.log('Error:', error)
            });
    };

    $scope.resetModal = function(index) {
        if (typeof(index) == 'undefined') {
            $scope.deviceUdid == null;
            $scope.deviceAlias == null;
        } else {
            $scope.deviceUdid = $rootScope.devices[index].udid;
            $scope.deviceAlias = $rootScope.devices[index].alias;
        };
        
        console.log($scope.deviceUdid);
        console.log($scope.deviceAlias);
        console.log('Modal form reset.');
    }

});