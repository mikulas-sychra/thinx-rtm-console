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
        $scope.modalLogBody = 'No data. Please select build log.';
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

    $scope.build = function(deviceUdid, sourceAlias, index) {
        console.log('-- building firmware for ' + deviceUdid + '/' + sourceAlias + ' --'); 

        var dryrun = true;

        var jqxhrBuild = Thinx.build(deviceUdid, sourceAlias, dryrun)
            .done(function(response) {

                console.log(' --- response ---');
                console.log(response);

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.build) !== 'undefined' && response.build.success) {
                        console.log(response.build);

                        console.log(' --- save last build id: ' + response.build.id + ' ---');
                        $rootScope.devices[index].lastBuildId = response.build.id;
                        $scope.$apply();

                        toastr.info(response.build.status, 'THiNX RTM Console', {timeOut: 5000});
            
                    } else {
                        console.log(response);
                        toastr.error(response.build.status, 'THiNX RTM Console', {timeOut: 5000})
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

    $scope.openBuildId = function(buildId) {

        console.log('--- trying to load build log for ' + buildId);

        var jqxhrTest = Thinx.getBuildLog(buildId)

        .done(function(data) {
            console.log(' --- build log data received ---');
            console.log(data);

             if (typeof(data) !== 'undefined') {
                if (data.success) {
                    console.log(data);
                    toastr.info(data.log[data.log.length - 1].message, 'THiNX RTM Console', {timeOut: 5000});

                    // TODO - implement contignous XHR request with regular DOM updates
                    $scope.modalLogBody = JSON.stringify(data, null, 4);

/*
var connection = new WebSocket('ws://rtm.thinx.cloud/api/user/build/log/stream', ['soap', 'xmpp']);
                    // When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send('Ping'); // Send the message 'Ping' to the server
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ' + e.data);
};
*/

                    $scope.modalLogId = buildId;
                    $scope.$apply();

                } else {
                    console.log(data);
                    toastr.error('Show Build Log Failed', 'THiNX RTM Console', {timeOut: 5000})
                }
            } else {
                console.log('error');
                console.log(data);
            }
        })
        .fail(error => console.log('Error:', error));

    }

    $scope.hasBuildId = function(index) {
        if (typeof($rootScope.devices[index].lastBuildId) !== 'undefined' && 
            $rootScope.devices[index].lastBuildId !== null) {
            return true;
        }
        return false;
    }

    $scope.refreshLog = function() {
        $scope.openBuildId($scope.modalLogId);
    }


    $scope.hasSource = function(index) {
        if (typeof($rootScope.devices[index].source) !== 'undefined' && 
            $rootScope.devices[index].source !== null) {
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

                        console.log('-- refreshing devices --');
                        var jqxhr = Thinx.deviceList()
                            .done(function(data) {
                                console.log($('#deviceModal'));
                                $('#deviceModal').modal('hide');
                                updateDevices(data);
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
                            $('#deviceModal').modal('hide');
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
        console.log('Resetting modal form values...');

        if (typeof(index) == 'undefined') {
            $scope.deviceUdid == null;
            $scope.deviceAlias == null;
        } else {
            $scope.deviceUdid = $rootScope.devices[index].udid;
            $scope.deviceAlias = $rootScope.devices[index].alias;
        };
        $scope.modalLogBody == null;
        
        console.log($scope.deviceUdid);
        console.log($scope.modalLogBody);
        console.log($scope.deviceAlias);
    }

});