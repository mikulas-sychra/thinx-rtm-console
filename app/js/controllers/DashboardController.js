angular.module('RTM').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();

    Thinx.getStats()
    .done(function(data) {
      updateStats(data);
    })
    .fail(error => $scope.$emit("xhrFailed", error));

    Thinx.sourceList()
    .done(function(data) {
      console.log('+++ updateSources ');
      $scope.$emit("updateSources", data);
    })
    .fail(error => $scope.$emit("xhrFailed", error));

    Thinx.apikeyList()
    .done( function(data) {
      console.log('+++ updateApikeys ');
      $scope.$emit("updateApikeys", data);
    })
    .fail(error => $scope.$emit("xhrFailed", error));

    Thinx.deviceList()
    .done(function(data) {
      $scope.$emit("updateDevices", data);
      // save user-spcific goal achievement
      if ($rootScope.devices.length > 0 && !$rootScope.profile.info.goals.includes('enroll')) {
        // TODO enable
        // $rootScope.profile.info.goals.push('enroll');
        // $rootScope.profile.info.goals.push('enroll-setup');
        $scope.$emit("saveProfile");
      };
    })
    .fail(error => $scope.$emit("xhrFailed", error));

    // $scope.hideLogOverlay();

    $scope.deviceForm = {};
    // $scope.deviceForm.index = null;
    $scope.deviceForm.udid = null;
    $scope.deviceForm.alias = null;
    $scope.deviceForm.platform = null;
    $scope.deviceForm.keyhash = null;
    $scope.deviceForm.source = null;
    $scope.deviceForm.auto_update = null;
    $scope.deviceForm.description = null;

    $scope.transferForm = {};
    $scope.transferForm.email = null;
    $scope.transferForm.mig_sources = false;
    $scope.transferForm.mig_apikeys = true;

    $scope.searchText = '';
    $scope.selectedItems = [];
  });

  $scope.list = {};
  $scope.list.searchText = '';
  $scope.list.filterPlatform = '';
  $scope.list.orderOptions = [
    {prop: 'lastupdate', alias: 'Last Update'},
    {prop: 'platform', alias: 'Platform'},
    {prop: 'alias', alias: 'Alias'}
  ];
  $scope.list.orderBy = $scope.list.orderOptions[0];
  $scope.list.reverse = true;

  Thinx.init($rootScope, $scope);

  // set sidebar closed and body solid layout mode
  $rootScope.settings.layout.pageContentWhite = true;
  $rootScope.settings.layout.pageBodySolid = false;
  $rootScope.settings.layout.pageSidebarClosed = false;


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


  $scope.build = function(deviceUdid, sourceId) {
    console.log('-- building firmware for ' + deviceUdid + '/' + $scope.getSourceById(sourceId).alias + ' --');

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

  $scope.hasSource = function(device) {
    if (typeof(device.source) !== "undefined" && device.source !== null) {
      return true;
    }
    return false;
  }

  $scope.getSourceById = function(sourceId) {
    for (var index in $rootScope.sources) {
      if ($rootScope.sources[index].sourceId == sourceId) {
        return $rootScope.sources[index];
      }
    }
  }

  $scope.submitDeviceForm = function() {

    console.log('-- changing device: ' + $scope.deviceForm.udid + ' -> ' + $scope.deviceForm.alias + ', ' + $scope.deviceForm.platform + ', ' + $scope.deviceForm.keyhash + ' --');

    Thinx.submitDevice(
      $scope.deviceForm.udid,
      $scope.deviceForm.alias,
      $scope.deviceForm.platform,
      $scope.deviceForm.keyhash,
      $scope.deviceForm.description,
      $scope.deviceForm.auto_update
    )
    .done(function(response) {

      if (typeof(response) !== "undefined") {
        if (typeof(response.success) !== "undefined" && response.success) {
          console.log(response);
          toastr.success('Device settings updated.', 'THiNX RTM Console', {timeOut: 5000})

          console.log('-- refreshing devices --');
          Thinx.deviceList()
          .done(function(data) {
            $('#deviceModal').modal('hide');
            $scope.$emit("updateDevices", data);
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

  $scope.revokeSelected = function() {
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
          $scope.$emit("updateDevices", data);
        })
        .fail(error =>  $scope.$emit("xhrFailed", error));

      } else {
        toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
      }
    })
    .fail(error => $scope.$emit("xhrFailed", error));
  }

  function transferDevices(transferForm, deviceUdids) {
    console.log('--transferring devices ' + deviceUdids.length +'--')

    Thinx.transferDevices(transferForm, deviceUdids)
    .done(function(data) {
      if (data.success) {
        console.log('Success:', data);
        toastr.success('Devices Transferred.', 'THiNX RTM Console', {timeOut: 5000})

        $scope.selectedItems = [];
        $scope.transferForm.email = null;
        $scope.transferForm.mig_sources = false;
        $scope.transferForm.mig_apikeys = true;

        Thinx.deviceList()
        .done(function(data) {
          $scope.$emit("updateDevices", data);
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
      transferDevices($scope.transferForm, selectedToTransfer);
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

  $scope.openDeviceModal = function(device, event) {
    event.stopPropagation();

    console.log('Resetting modal form values...');
    // $scope.deviceForm.index = index;
    $scope.deviceForm.udid = device.udid;
    $scope.deviceForm.alias = device.alias;
    $scope.deviceForm.description = device.description;

    if (typeof(device.platform) !== "undefined") {
      $scope.deviceForm.platform = device.platform;
    } else {
      $scope.deviceForm.platform = null;
    }

    if (typeof(device.keyhash) !== "undefined") {
      $scope.deviceForm.keyhash = device.keyhash;
    } else {
      $scope.deviceForm.keyhash = null;
    }

    if (typeof(device.source) !== "undefined") {
      $scope.deviceForm.source = device.source;
    } else {
      $scope.deviceForm.source = null;
    }

    if (typeof(device.auto_update) !== "undefined") {
      $scope.deviceForm.auto_update = device.auto_update;
    } else {
      $scope.deviceForm.auto_update = false;
    }

    console.log("form vars");
    console.log("udid", $scope.deviceForm.udid);
    console.log("platform", $scope.deviceForm.platform);
    console.log("alias", $scope.deviceForm.alias);
    console.log("keyhash", $scope.deviceForm.keyhash);
    console.log("source", $scope.deviceForm.source);

    $('#deviceModal').modal('show');
  }

  $scope.openTransferModal = function() {
    console.log('Resetting transfer modal form values...');

    $scope.transferForm.email = null;
    $scope.transferForm.mig_sources = false;
    $scope.transferForm.mig_apikeys = true;

    $('#transferModal').modal('show');
  }

  $scope.isSharedKey = function() {

    // check if some of selected devices using shared apikeys
    var deviceKeyhashes = [];
    var transferDeviceKeyhashes = [];
    for (var index in $rootScope.devices) {
      if ($scope.selectedItems.indexOf($rootScope.devices[index].udid) > -1) {
        // this is selected device
        transferDeviceKeyhashes.push($rootScope.devices[index].udid);
      } else {
        // this is non selected
      }
      deviceKeyhashes.push($rootScope.devices[index].udid);
    }
    console.log('deviceKeyhashes', deviceKeyhashes);
    console.log('transferDeviceKeyhashes', transferDeviceKeyhashes);

    // TODO: find duplicated items in deviceKeyhashes and find if some of them are in transferDeviceKeyhashes
    // if so, return true

    return true;

    // var uniqueArray = deviceKeyhashes.filter(function(item, pos) {
      // return deviceKeyhashes.indexOf(item) == pos;
    // });
    // console.log('uniqueArray', uniqueArray);

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
    } else if ((goal == 'update') && ($rootScope.profile.info.goals.includes('build') && (!$rootScope.profile.info.goals.includes('update'))) ) {
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
