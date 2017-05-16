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

        console.log('-- fetching stats ---')
        var jqxhrStats = Thinx.getStats()
            .done(function(data) {
                updateStats(data);
            })
            .fail(error => console.log('Error:', error));

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

    function updateStats(data) {
        var response = JSON.parse(data);

        console.log(response);

        $rootScope.stats = {
            ID: [],
            APIKEY_INVALID: [],
            PASSWORD_INVALID: [],
            APIKEY_MISUSE: [],
            DEVICE_NEW: [0,1],
            DEVICE_CHECKIN: [1,0],
            DEVICE_UPDATE_OK: [],
            DEVICE_UPDATE_FAIL: [],
            BUILD_STARTED: [],
            BUILD_SUCCESS: [],
            BUILD_FAIL: []
        };

        $rootScope.stats = response.stats;

        $("#sparkline_bar").sparkline($rootScope.stats.DEVICE_NEW, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#f36a5b',
            negBarColor: '#e02222'
        });

        $("#sparkline_bar2").sparkline($rootScope.stats.DEVICE_CHECKIN, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#e20074',
            negBarColor: '#e02222'
        });

        $rootScope.stats = response;
        $scope.$apply()

        console.log('stats:');
        console.log($rootScope.stats);
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

        if ($scope.deviceAlias == $rootScope.devices[$scope.deviceIndex].alias) {
            console.log('-- no changes, closing dialog --');
            $('#deviceModal').modal('hide');
            return;
        }

        console.log('-- changing device alias to ' + $scope.deviceAlias + '  for ' + $scope.deviceUdid + ' --'); 

        var jqxhrAlias = Thinx.changeDevice($scope.deviceUdid, $scope.deviceAlias)
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
            $scope.deviceIndex = null;
            $scope.deviceUdid = null;
            $scope.deviceAlias = null;
        } else {
            $scope.deviceIndex = index;
            $scope.deviceUdid = $rootScope.devices[index].udid;
            $scope.deviceAlias = $rootScope.devices[index].alias;
        };

        // reset log modal
        $scope.modalLogBody == null;
        
        console.log($scope.deviceIndex);
        console.log($scope.deviceUdid);
        console.log($scope.modalLogBody);
        console.log($scope.deviceAlias);
    }

});