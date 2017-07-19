angular.module('RTM').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();

    Thinx.getStats()
    .done(function(data) {
      updateStats(data);
    })
    .fail(error => console.log('getStats Error:', error));

    Thinx.sourceList()
    .done(function(data) {
      console.log('+++ updateSources ');
      $scope.$emit("updateSources", data);
    })
    .fail(error => console.log('sourceList Error:', error));

    Thinx.deviceList()
    .done(function(data) {
      updateDevices(data);
      // save user-spcific goal achievement
      if ($rootScope.devices.length > 0 && !$rootScope.profile.info.goals.includes('enroll')) {
        // $rootScope.profile.info.goals.push('enroll');
        // $rootScope.profile.info.goals.push('enroll-setup');
        $scope.$emit("saveProfile");
      };
    })
    .fail(error => console.log('deviceList Error:', error));

    // $scope.hideLogOverlay();

    $scope.deviceIndex = null;
    $scope.deviceUdid = null;
    $scope.deviceAlias = null;
    $scope.devicePlatform = null;
    $scope.searchText = '';

    $scope.selectedItems = [];
    $scope.transferEmail = null;
  });

  $scope.searchText = '';
  $scope.filterPlatform = '';

  Thinx.init($rootScope, $scope);

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
      daily: [
        // ID: [],
        // APIKEY_INVALID: [],
        // PASSWORD_INVALID: [],
        // APIKEY_MISUSE: [],
        // DEVICE_NEW: [5,4,3,2,1,1,2,3,4,5],
        // DEVICE_CHECKIN: [1,2,3,4,5,5,4,3,2,1],
        // DEVICE_UPDATE_OK: [],
        // DEVICE_UPDATE_FAIL: [],
        // BUILD_STARTED: [],
        // BUILD_SUCCESS: [],
        // BUILD_FAIL: []
      ],
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

      console.log('-- iterating over stats --');

      var days = response.stats;
      console.log(days);

        for (var prop in days) {
          // console.log(prop, days[prop]);
          var propTotal = 0;
          for (var i = 0; i < days[prop].length; i++) {
            // console.log("Looping: prop ", prop, "item", days[prop][i]);
            propTotal = propTotal + parseInt(days[prop][i]);
            // console.log('adding', days[prop][i], 'to', prop)
          }
          $rootScope.stats.total[prop] = propTotal;
          $rootScope.stats.daily[prop] = days[prop];
        }
    }

    if(typeof($rootScope.devices) !== "undefined") {
      $rootScope.stats.total.DEVICES = $rootScope.devices.length;
    }

    $("#sparkline_bar").sparkline($rootScope.stats.daily.DEVICE_CHECKIN, {
      type: 'bar',
      width: '80',
      barWidth: 8,
      height: '55',
      barColor: '#29b4b6',
      negBarColor: '#29b4b6'
    });

    console.log('dailystats', $rootScope.stats.daily.DEVICE_NEW);
    $("#sparkline_bar2").sparkline($rootScope.stats.daily.DEVICE_NEW, {
      type: 'bar',
      width: '80',
      barWidth: 8,
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

    if (typeof($rootScope.meta.builds[deviceUdid]) == "undefined") {
      $rootScope.meta.builds[deviceUdid] = [];
    }

    Thinx.build(deviceUdid, sourceId)
    .done(function(response) {

      console.log(' --- response ---');
      console.log(response);

      if (typeof(response) !== "undefined") {
        if (typeof(response) !== "undefined" && response.success) {
          console.log(' --- save last build id: ' + response.build_id + ' ---');

          // prepare user metadata for particular device
          $rootScope.meta.builds[deviceUdid].push(response.build_id);

          // save user-spcific goal achievement
          if (!$rootScope.profile.info.goals.includes('build')) {
            $rootScope.profile.info.goals.push('build');
            $scope.$emit("saveProfile");
          };

          $scope.$apply();

          toastr.info(response.status, 'THiNX RTM Console', {timeOut: 5000});

        } else {
          console.log(response);
          toastr.error(response.status, 'THiNX RTM Console', {timeOut: 5000})
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
    $rootScope.modalBuildId = $rootScope.meta.builds[deviceUdid][$rootScope.meta.builds[deviceUdid].length - 1];
    $rootScope.showLog($rootScope.modalBuildId);
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

  $scope.submitDeviceForm = function() {

    console.log('-- changing device: ' + $scope.deviceUdid + ' -> ' + $scope.deviceAlias + ', ' + $scope.devicePlatform + ' --');

    Thinx.submitDevice($scope.deviceUdid, $scope.deviceAlias, $scope.devicePlatform)
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

  $scope.revokeDevices = function() {
    console.log('-- processing selected items --');
    console.log($scope.selectedItems);

    var selectedToRevoke = $scope.selectedItems.slice();
    if (selectedToRevoke.length > 0) {
      revokeDevices(selectedToRevoke);
    } else {
      toastr.warning('Nothing selected.', 'THiNX RTM Console', {timeOut: 1000})
    }
  };

  function revokeDevices(deviceUdids) {
    console.log('--revoking ' + deviceUdids.length + ' devices --')

    Thinx.revokeDevices(deviceUdids)
    .done(function(data) {
      if (data.success) {
        console.log('Success:', data);
        toastr.success('Devices Transferred.', 'THiNX RTM Console', {timeOut: 5000})

        $scope.selectedItems = [];
        Thinx.deviceList()
        .done(function(data) {
          updateDevices(data);
        })
        .fail(error =>  $scope.$emit("xhrFailed", error));

      } else {
        toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
      }
    })
    .fail(error => $scope.$emit("xhrFailed", error));
  }

  function transferDevices(email, deviceUdids) {
    console.log('--transferring devices ' + deviceUdids.length +'--')

    Thinx.transferDevices(email, deviceUdids)
    .done(function(data) {
      if (data.success) {
        console.log('Success:', data);
        toastr.success('Devices Transferred.', 'THiNX RTM Console', {timeOut: 5000})

        $scope.selectedItems = [];
        $scope.transferEmail = null;
        Thinx.deviceList()
        .done(function(data) {
          updateDevices(data);
          //$('#deviceModal').modal('hide');
        })
        .fail(error =>  $scope.$emit("xhrFailed", error));

      } else {
        toastr.error('Transfer failed.', 'THiNX RTM Console', {timeOut: 5000})
      }
    })
    .fail(error => $scope.$emit("xhrFailed", error));
  }

  $scope.transferDevices = function() {
    console.log('-- processing selected items (transfer) --');
    console.log($scope.selectedItems);

    var selectedToTransfer = $scope.selectedItems.slice();
    if (selectedToTransfer.length > 0) {
      transferDevices($scope.transferEmail, selectedToTransfer);
    } else {
      toastr.warning('Nothing selected.', 'THiNX RTM Console', {timeOut: 1000})
    }
  };

  $scope.checkItem = function(udid) {
    console.log('### toggle item in selectedItems');
    var index = $scope.selectedItems.indexOf(udid);
    if (index > -1) {
      console.log('splicing on ', index, ' value ', $scope.selectedItems[index]);
      $scope.selectedItems.splice(index, 1);
    } else {
      $scope.selectedItems.push(udid);
    }
  }

  $scope.openDeviceModal = function(index, event) {
    event.stopPropagation();

    console.log('Resetting modal form values...');
    $scope.deviceUdid = $rootScope.devices[index].udid;
    $scope.deviceAlias = $rootScope.devices[index].alias;
    $scope.deviceIndex = index;

    if (typeof($rootScope.devices[index].platform) !== "undefined") {
      $scope.devicePlatform = $rootScope.devices[index].platform;
    } else {
      $scope.devicePlatform = null;
    }

    console.log("scope vars");
    console.log("deviceUdid", $scope.deviceUdid);
    console.log("deviceAlias", $scope.deviceAlias);
    console.log("devicePlatform", $scope.devicePlatform);

    $('#deviceModal').modal('show');
  }

  $scope.openTransferModal = function() {
    console.log('Resetting transfer modal form values...');
    $scope.transferEmail = null;
    $('#transferModal').modal('show');
  }

  $scope.journeyClass = function(goal) {
    if ($rootScope.profile.info.goals.includes(goal)) {
      return 'journey-success';
    } else if ((goal == 'apikey') && (!$rootScope.profile.info.goals.includes('rsakey')) ) {
      return 'journey-active';
    } else if ((goal == 'enroll') && ($rootScope.profile.info.goals.includes('apikey') && (!$rootScope.profile.info.goals.includes('build'))) ) {
      return 'journey-active';
    } else if ((goal == 'build') && ($rootScope.profile.info.goals.includes('enroll') && (!$rootScope.profile.info.goals.includes('update'))) ) {
      return 'journey-active';
    } else {
      return 'journey-default';
    }
  };



  $rootScope.logoutMe = function () {
    Thinx.getLogout()
    .done(function(data) {
      console.log("logout response:");
      console.log(data);
    })
    .fail(error => console.log('Error:', error));
  }

});
