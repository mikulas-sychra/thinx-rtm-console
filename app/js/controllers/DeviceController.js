angular.module('RTM').controller('DeviceController', function($rootScope, $scope, $stateParams) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();

    Thinx.deviceList()
    .done(function(data) {
      $scope.$emit("updateDevices", data);
      $scope.initDeviceForm();
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

  });

  // end of onload function

  // set sidebar closed and body solid layout mode
  $rootScope.settings.layout.pageContentWhite = true;
  $rootScope.settings.layout.pageBodySolid = false;
  $rootScope.settings.layout.pageSidebarClosed = false;

  $scope.deviceForm = {};
  $scope.deviceForm.udid = null;
  $scope.deviceForm.alias = null;
  $scope.deviceForm.platform = 'unknown';
  $scope.deviceForm.keyhash = null;
  $scope.deviceForm.source = null;
  $scope.deviceForm.auto_update = null;
  $scope.deviceForm.description = null;
  $scope.deviceForm.category = null;
  $scope.deviceForm.tags = [];

  var formBeforeEdit = JSON.parse(JSON.stringify($scope.deviceForm));

  Thinx.init($rootScope, $scope);


  $scope.attachSource = function(sourceId, deviceUdid) {
    console.log('-- attaching ' + sourceId + ' to  ' + deviceUdid + '--');

    Thinx.attachSource(sourceId, deviceUdid)
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

  $scope.detachSource = function(deviceUdid) {
    console.log('-- detaching source from ' + deviceUdid + '--');
    Thinx.detachSource(deviceUdid)
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
          $scope.deviceForm.source = null;
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


  $scope.submitDeviceFormChange = function(prop) {

    console.log('-- changing device: ' + $scope.deviceForm.udid + ' (' + $scope.deviceForm.alias + ') --');

    var updatedProps = {udid: $scope.deviceForm.udid};
    updatedProps[prop] = $scope.deviceForm[prop];

    Thinx.submitDevice(updatedProps)
    .done(function(response) {

      if (typeof(response) !== "undefined") {
        if (typeof(response.success) !== "undefined" && response.success) {
          console.log(response);
          toastr.success('Device settings updated.', 'THiNX RTM Console', {timeOut: 5000})

          console.log('-- refreshing devices --');
          Thinx.deviceList()
          .done(function(data) {
            $scope.$emit("updateDevices", data);
            $scope.initDeviceForm();
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


  $scope.initDeviceForm = function() {

    var device = {};
    if (!$stateParams.udid) {
      // TODO udid not set, return to dashboard
    } else {
      for (var index in $rootScope.devices) {
        if ($rootScope.devices[index].udid == $stateParams.udid) {
          device = $rootScope.devices[index];
          console.log("edited device", device);
        }
      }
    }

    console.log('Initializing form values...');
    // $scope.deviceForm.index = index;
    $scope.deviceForm.udid = device.udid;
    $scope.deviceForm.alias = device.alias;
    $scope.deviceForm.description = device.description;

    if (typeof(device.platform) !== "undefined") {
      $scope.deviceForm.platform = device.platform;
    } else {
      $scope.deviceForm.platform = 'unknown';
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

    if (typeof(device.category) !== "undefined") {
      $scope.deviceForm.category = device.category;
    } else {
      $scope.deviceForm.category = null;
    }

    if (typeof(device.tags) !== "undefined") {
      $scope.deviceForm.tags = device.tags;
    } else {
      $scope.deviceForm.tags = [];
    }

    /* save start values to compare with changes */
    formBeforeEdit = JSON.parse(JSON.stringify($scope.deviceForm));
    console.log("form vars", $scope.deviceForm);

  }
});
