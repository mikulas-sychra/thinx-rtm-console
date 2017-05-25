angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        Thinx.deviceList()
            .done(function(data) {
                updateDevices(data);
            })
            .fail(function(error) {
                console.log('Error:', error);
            });

        Thinx.getStats()
            .done(function(data) {
                updateStats(data);
            })
            .fail(error => console.log('Error:', error));

        $scope.deviceIndex = null;
        $scope.deviceUdid = null;
        $scope.deviceAlias = null;
        $scope.modalLogBody = [];
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

        console.log("stats data");
        console.log(response);

        $rootScope.stats = {
            // ID: [],
            // APIKEY_INVALID: [],
            // PASSWORD_INVALID: [],
            // APIKEY_MISUSE: [],
            DEVICE_NEW: [5,4,3,2,1,1,2,3,4,5],
            DEVICE_CHECKIN: [1,2,3,4,5,5,4,3,2,1],
            // DEVICE_UPDATE_OK: [],
            // DEVICE_UPDATE_FAIL: [],
            // BUILD_STARTED: [],
            // BUILD_SUCCESS: [],
            // BUILD_FAIL: []
        };

        $rootScope.stats.total = {
            CHANNELS: 0,
            DEVICES: 0,
            UPDATES: 0
        };

        if(typeof($rootScope.devices) !== 'undefined') {
            $rootScope.stats.total.DEVICES = $rootScope.devices.length;
        }

       
        console.log('-- iterating over stats --');
        if (typeof(data.stats) == 'Object') {
            for (var prop in data.stats) {
                var propTotal = 0;
                for (var i = 0; i < $rootScope.stats[prop].length; i++) {
                    console.log("Looping: prop ", prop, "item", $rootScope.stats[prop][i]);
                    propTotal = propTotal + parseInt($rootScope.stats[prop][i]);
                    console.log('adding', $rootScope.stats[prop][i], 'to', prop)
                }
                $rootScope.stats.total[prop] = propTotal;
            }
        } else {
            console.log('Stats fetch error.');
        }
       

        console.log('test stats:');
        console.log($rootScope.stats);

        // TODO check if proper stats were returned
        if (response.stats !== 'no_data') {
            $rootScope.stats = response.stats;
        }

        $("#sparkline_bar").sparkline($rootScope.stats.DEVICE_CHECKIN, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#29b4b6',
            negBarColor: '#29b4b6'
        });

        $("#sparkline_bar2").sparkline($rootScope.stats.DEVICE_NEW, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#1ba39c',
            negBarColor: '#1ba39c'
        });

        $scope.$apply()

        console.log('stats:');
        console.log($rootScope.stats);
    }
    
    $scope.attachRepository = function(sourceId, deviceUdid) {
    
        console.log('-- attaching ' + sourceId + ' to  ' + deviceUdid + '--'); 

        Thinx.attachRepository(sourceId, deviceUdid)
            .done(function(response) {
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log("-- attach success --");
                        console.log(response);

                        $rootScope.devices[$scope.deviceIndex].source = response.attached;
                        $scope.$apply()
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

    $scope.detachRepository = function(deviceUdid) {
    
        console.log('-- detaching source from ' + deviceUdid + '--'); 

        Thinx.detachRepository(deviceUdid)
            .done(function(response) {
                
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);
                        toastr.success('Repository Detached.', 'THiNX RTM Console', {timeOut: 5000})
                        $root.devices[$scope.deviceIndex].source = null;
                        $scope.$apply()
                        
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

    $scope.build = function(deviceUdid, sourceId, index) {
        console.log('-- building firmware for ' + deviceUdid + '/' + $rootScope.sources[sourceId].alias + ' --'); 

        var dryrun = true;

        Thinx.build(deviceUdid, sourceId, dryrun)
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
        $scope.modalLogId = buildId;
        OpenWebSocket(buildId);
    }

    function OpenWebSocket(buildId) {
        if ("WebSocket" in window) {
            // Fill this from your client
            var build_id = buildId;
            var owner_id = $rootScope.profile.owner;

            console.log(build_id);
            console.log(owner_id);

            if (typeof($scope.ws) == "undefined") {
                // open websocket
                console.log('-- opening websocket with credentials --');
                $scope.ws = new WebSocket("ws://thinx.cloud:7444/"+owner_id +"/"+build_id );

                $scope.ws.onopen = function() {
                    console.log("Websocket connection estabilished.");
                    $scope.refreshLog();
                };
                $scope.ws.onmessage = function (message) {
                    var msg = JSON.parse(message.data);

                    console.log('Received log message...');

                    // console.log(msg);
                    // if (typeof(msg.notification) !== "undefined") {
                        // toastr.info(msg.notification.title, msg.notification.body, {timeOut: 5000})    
                        // $scope.modalLogBody.unshift(msg.notification.title + ": " + msg.notification.body);
                    // }

                    if (typeof(msg.log) !== "undefined") {
                        console.log('Received log message');
                        console.log(msg.log);
                        $scope.modalLogBody.push(msg.log.message);
                        $scope.$apply();
                    }

                    renderLogBody();

                    //$scope.$apply();
               };
               $scope.ws.onclose = function()
               {
                  alert("Websocket connection is closed...");
               };
            } else {
                // websocket already open
                console.log("-- websocket status --");
                console.log($scope.ws.readyState);
            }

        } else {
           // The browser doesn't support WebSocket
           alert("WebSocket NOT supported by your Browser!");
        }
    }

    $scope.refreshLog = function() {
        console.log('-- refresh log: ', $scope.modalLogId)

         var message = {
            logtail: {
                owner_id: $rootScope.profile.owner,
                build_id: $scope.modalLogId
            }
        }

        // $scope.modalLogBody = [];
        $scope.ws.send(JSON.stringify(message));
    }

    function renderLogBody() {
        console.log("-- rendering modal log body --");
        consolo.log($scope.modalLogId);
        console.log($scope.modalLogBody.length);
        console.log($scope.modalLogBody);
        $scope.$apply();
    }

    $scope.hasBuildId = function(index) {
        if (typeof($rootScope.devices[index].lastBuildId) !== 'undefined' && 
            $rootScope.devices[index].lastBuildId !== null) {
            return true;
        }
        return false;
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

        Thinx.changeDevice($scope.deviceUdid, $scope.deviceAlias)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.success) !== 'undefined' && response.success) {
                        console.log(response);
                        toastr.success('Alias updated.', 'THiNX RTM Console', {timeOut: 5000})

                        console.log('-- refreshing devices --');
                        Thinx.deviceList()
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

        Thinx.revokeDevice($scope.deviceUdid)
            .done(function(response) {
                if (response.success) {
                    console.log('Success:', response.revoked);
                    toastr.success('Device Revoked.', 'THiNX RTM Console', {timeOut: 5000})

                    Thinx.deviceList()
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
        $scope.modalLogBody = [];
        $scope.modalLogId = null;
        
        console.log("scope vars");
        console.log($scope.deviceIndex);
        console.log($scope.deviceUdid);
        console.log($scope.modalLogBody);
        console.log($scope.modalLogId);
        console.log($scope.deviceAlias);
    }

});