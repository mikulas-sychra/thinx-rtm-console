angular.module('RTM').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        Thinx.init($rootScope, $scope);

        Thinx.getStats()
            .done(function(data) {
                updateStats(data);
            })
            .fail(error => console.log('getStats Error:', error));

        Thinx.sourceList()
            .done(function(data) {
                console.log('+++ updateSources ');
                $rootScope.$emit("updateSources", data);
            })
            .fail(error => console.log('sourceList Error:', error));

        Thinx.deviceList()
            .done(function(data) {
                updateDevices(data);
            })
            .fail(error => console.log('deviceList Error:', error));

        $scope.deviceIndex = null;
        $scope.deviceUdid = null;
        $scope.deviceAlias = null;
        $scope.modalLogBody = "";
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

        // sparkline stats defaults
        $rootScope.stats = {
            daily: {
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
            },
            total: {
                CHANNELS: 0,
                DEVICES: 0,
                UPDATES: 0
            }
        };

        var response = JSON.parse(data);

        console.log("stats data");
        console.log(response);

        if (response.success) {
            $rootScope.stats.daily = response.stats;
            
            console.log('-- iterating over stats --');
            console.log(response.stats);

            for (var prop in $rootScope.stats.daily) {
                var propTotal = 0;
                for (var i = 0; i < $rootScope.stats.daily[prop].length; i++) {
                    console.log("Looping: prop ", prop, "item", $rootScope.stats.daily[prop][i]);
                    propTotal = propTotal + parseInt($rootScope.stats.daily[prop][i]);
                    console.log('adding', $rootScope.stats.daily[prop][i], 'to', prop)
                }
                $rootScope.stats.total[prop] = propTotal;
            }
        }

        if(typeof($rootScope.devices) !== "undefined") {
            $rootScope.stats.total.DEVICES = $rootScope.devices.length;
        }

        var debugData = []; // $rootScope.stats.daily.DEVICE_CHECKIN
        for(i = 0; i < 10; i++) {
            debugData.push( 
                
                (parseInt($rootScope.stats.daily.DEVICE_CHECKIN) * Math.floor((Math.random() * 100) + 1))

                 );
        };

        $("#sparkline_bar").sparkline(debugData, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#29b4b6',
            negBarColor: '#29b4b6'
        });

        var debugData = []; // $rootScope.stats.daily.DEVICE_NEW
        for(i = 0; i < 10; i++) {
            debugData.push( 
                
                (parseInt($rootScope.stats.daily.DEVICE_NEW) * Math.floor((Math.random() * 100) + 1))

                 );
        };

        $("#sparkline_bar2").sparkline(debugData, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#1ba39c',
            negBarColor: '#1ba39c'
        });

        $scope.$apply();

        console.log('stats:');
        console.log($rootScope.stats);
    }
    
    $scope.attachRepository = function(sourceId, deviceUdid) {
    
        console.log('-- attaching ' + sourceId + ' to  ' + deviceUdid + '--'); 

        Thinx.attachRepository(sourceId, deviceUdid)
            .done(function(response) {
                if (typeof(response) !== "undefined") {
                    if (response.success) {
                        console.log("-- attach success --");
                        console.log(response);

                        for (var index in $rootScope.devices) {
                            if ($rootScope.devices[index].udid == deviceUdid) {
                                console.log('updating device source and selector...');    
                                $rootScope.devices[index].source = response.attached;
                            }
                        }

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
                
                if (typeof(response) !== "undefined") {
                    if (response.success) {
                        console.log(response);

                        for (var index in $rootScope.devices) {
                            if ($rootScope.devices[index].udid == deviceUdid) {
                                $rootScope.devices[index].source = undefined;
                            }
                        }

                        toastr.success('Repository Detached.', 'THiNX RTM Console', {timeOut: 5000})
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

        if (typeof($rootScope.meta.builds[deviceUdid]) == "undefined") {
            $rootScope.meta.builds[deviceUdid] = [];
        }

        Thinx.build(deviceUdid, sourceId, dryrun)
            .done(function(response) {

                console.log(' --- response ---');
                console.log(response);

                if (typeof(response) !== "undefined") {
                    if (typeof(response.build) !== "undefined" && response.build.success) {
                        console.log(response.build);

                        console.log(' --- save last build id: ' + response.build.id + ' ---');

                        // prepare user metadata for particular device
                        $rootScope.meta.builds[deviceUdid].push(response.build.id);
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

    $scope.showDeviceLastBuild = function(deviceUdid, event) {

        event.stopPropagation();

        console.log('--- trying to show last build log for ' + deviceUdid);

        $scope.modalLogId = $rootScope.meta.builds[deviceUdid][$rootScope.meta.builds[deviceUdid].length - 1];
        $scope.modalLogBody = "";
        OpenWebSocket($scope.modalLogId);
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
                    $scope.modalLogBody = $scope.modalLogBody + "\n## Websocket connection estabilished ##\n";
                    $scope.$apply();
                    startDebugInterval();
                };
                $scope.ws.onmessage = function (message) {
                    console.log('Received message...');

                    var msg = JSON.parse(message.data);
                    console.log(msg);

                    if (typeof(msg.notification) !== "undefined") {
                        console.log('Notification:');
                        console.log(msg.notification);
                        toastr.info(msg.notification.title, msg.notification.body, {timeOut: 5000})    
                        // $scope.modalLogBody.unshift(msg.notification.title + ": " + msg.notification.body);
                    }

                    if (typeof(msg.log) !== "undefined") {
                        console.log('Log:');
                        console.log(msg.log);
                        $scope.modalLogBody = $scope.modalLogBody + "\n" + (msg.log.message);
                    }

                    $scope.$apply();
                    $('#logModal').modal('show');
               };
               $scope.ws.onclose = function()
               {
                  console.log("Websocket connection is closed...");
               };
            } else {
                // websocket already open
                console.log("-- websocket status --");
                console.log($scope.ws.readyState);

                 $scope.refreshLog();
                 $('#logModal').modal('show');
            }

        } else {
           // The browser doesn't support WebSocket
           toastr.error("Error", "WebSocket NOT supported by your Browser!", {timeOut: 5000})    
        }
    }

    $scope.refreshLog = function() {
        console.log('-- refreshing log: ', $scope.modalLogId)

         var message = {
            logtail: {
                owner_id: $rootScope.profile.owner,
                build_id: $scope.modalLogId
            }
        }

        $scope.ws.send(JSON.stringify(message));
    }


    $scope.hasBuildId = function(deviceUdid) {
        if (typeof($rootScope.meta.builds[deviceUdid]) !== "undefined") {
            if ($rootScope.meta.builds[deviceUdid].length == 0) {
                return null;
            } else {
                return true;
            }
        }
        return false;
    }

    $scope.hasSource = function(index) {
        if (typeof($rootScope.devices[index].source) !== "undefined" && 
            $rootScope.devices[index].source !== null) {
            return true;
        }
        return false;
    }

    $scope.changeDeviceAlias = function() {

        for (var index in $rootScope.devices) {
            if ($rootScope.devices[index].udid == $scope.deviceUdid) {
                var device = $rootScope.devices[index];
            }
        }

        if (typeof(device) !== "undefined" && device.alias == $scope.deviceAlias) {
            console.log('-- no changes, closing dialog --');
            $('#deviceModal').modal('hide');
            return;
        }

        console.log('-- changing device alias to ' + $scope.deviceAlias + '  for ' + $scope.deviceUdid + ' --'); 

        Thinx.changeDevice($scope.deviceUdid, $scope.deviceAlias)
            .done(function(response) {

                if (typeof(response) !== "undefined") {
                    if (typeof(response.success) !== "undefined" && response.success) {
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
        $scope.deviceUdid = $rootScope.devices[index].udid;
        $scope.deviceAlias = $rootScope.devices[index].alias;
        $scope.deviceIndex = index;

        console.log("scope vars");
        console.log("deviceUdid", $scope.deviceUdid);
        console.log("deviceAlias", $scope.deviceAlias);
    }

    function startDebugInterval() {
        var i = 0;
        setInterval(function(){ 
            $scope.modalLogBody = $scope.modalLogBody + "\n* " + i + " *\n";
            $scope.$apply();
            i++;
        }, 3000);
    }

    $rootScope.logoutMe = function () {
        Thinx.getLogout()
            .done(function(data) {
                console.log("logout response:");
                console.log(data);
            })
            .fail(error => console.log('Error:', error));
    }

});