// Thninx API Ajax Class
var urlBase = 'https://rtm.thinx.cloud:7443/api';

var counter = 30;
$.ajaxSetup({
  contentType: "application/json; charset=utf-8",
  xhrFields: {
    withCredentials: true
  }
});

var Thinx = {
  // SSH
  apikeyList: function () {
    return apikeyList();
  },
  createApikey: function (newApikeyAlias) {
    return createApikey(newApikeyAlias);
  },
  revokeApikeys: function (fingerprints) {
    return revokeApikeys(fingerprints);
  },
  // RSA
  rsakeyList: function () {
    return rsakeyList();
  },
  addRsakey: function (rsakeyName, rsakeyValue) {
    return addRsakey(rsakeyName, rsakeyValue);
  },
  revokeRsakeys: function (fingerprints) {
    return revokeRsakeys(fingerprints);
  },
  // SOURCE
  sourceList: function () {
    return sourceList();
  },
  addSource: function (sourceUrl, sourceAlias, sourceBranch) {
    return addSource(sourceUrl, sourceAlias, sourceBranch);
  },
  revokeSources: function (sourceIds) {
    return revokeSources(sourceIds);
  },
  // RSA
  enviroList: function () {
    return enviroList();
  },
  addEnviro: function (enviroName, enviroValue) {
    return addEnviro(enviroName, enviroValue);
  },
  revokeEnviros: function (names) {
    return revokeEnviros(names);
  },
  // DEVICE
  deviceList: function () {
    return deviceList();
  },
  submitDevice: function (deviceUdid, deviceAlias, devicePlatform, deviceKeyhash) {
    return submitDevice(deviceUdid, deviceAlias, devicePlatform, deviceKeyhash);
  },
  revokeDevice: function (deviceUdid) {
    return revokeDevice(deviceUdid);
  },
  revokeDevices: function (deviceUdids) {
    return revokeDevices(deviceUdids);
  },
  transferDevices: function (email, deviceUdids) {
    return transferDevices(email, deviceUdids);
  },
  attachRepository: function (sourceId, deviceUdid) {
    return attachRepository(sourceId, deviceUdid);
  },
  detachRepository: function (deviceUdid) {
    return detachRepository(deviceUdid);
  },
  build: function (deviceUdid, sourceId) {
    return build(deviceUdid, sourceId);
  },
  // PROFILE
  getProfile: function () {
    return getProfile();
  },
  submitProfile: function (profile) {
    return submitProfile(profile);
  },
  submitProfileAvatar: function (avatar) {
    return submitProfileAvatar(avatar);
  },
  submitProfileSecurity: function (security) {
    return submitProfileSecurity(security);
  },
  getAuditHistory: function () {
    return getAuditHistory();
  },
  getBuildLog: function (buildId) {
    return getBuildLog(buildId);
  },
  tailBuildLog: function (buildId) {
    return tailBuildLog(buildId);
  },
  getBuildHistory: function () {
    return getBuildHistory();
  },
  getStats: function () {
    return getStats();
  },
  getLogout: function () {
    return getLogout();
  },
  init: function ($rootScope, $scope) {
    return init($rootScope, $scope);
  }
}

function init($rootScope, $scope) {

  console.log('THiNX API INIT');
  console.log('$rootScope', $rootScope);
  console.log('$scope', $scope);

  if (typeof($rootScope.xhrFailedListener) == "undefined") {
        $rootScope.xhrFailedListener = $rootScope.$on('xhrFailed', function(event, error){
        event.stopPropagation();
        xhrFailed(error);
    });
  }

  function xhrFailed(error) {
    console.log('## xhr failed: ', error);
    //window.location = "/";
    if (error.status == 401) {
        console.log('error 401');
        window.location = '/';
    }
  }

  if (typeof($rootScope.updateSourcesListener) == "undefined") {
        $rootScope.updateSourcesListener = $rootScope.$on('updateSources', function(event, data){
        event.stopPropagation();
        updateSources(data);
    });
  }

  function updateSources(data) {
    var response = JSON.parse(data);
    console.log('sources response:', response);

    if (typeof(response.success !== "undefined") && response.success) {

      $rootScope.sources = [];

      $.each(response.sources, function(sourceId, value) {
        value.sourceId = sourceId;
        $rootScope.sources.push(value);
      });
      // $rootScope.sources = response.sources;

      console.log('sources:');
      console.log($rootScope.sources);
      console.log('refreshing view...');
      $rootScope.$apply()

    } else {
      console.log('auditHistory fetch error.') ;
    }
  }

  if (typeof($rootScope.updateApikeysListener) == "undefined") {
        $rootScope.updateApikeysListener = $rootScope.$on('updateApikeys', function(event, data){
        event.stopPropagation();
        updateApikeys(data);
    });
  }

  function updateApikeys(data) {
    var response = JSON.parse(data);
    $rootScope.apikeys = response.api_keys;

    console.log('apikeys:');
    console.log($rootScope.apikeys);
    console.log('refreshing view...');
    $rootScope.$apply()
  }

  // =================================================
  // api related functions

  $scope.$on("saveProfile", function(event) {
    // event.stopPropagation();
    console.log('SAVING PROFILE');
    submitProfile($rootScope.profile);
  });

  $scope.$on("updateProfile", function(event, data){
    updateProfile(data);
  });

  function updateProfile(data) {
    if (typeof(data) !== "undefined") {
      var response = JSON.parse(data);

      console.log('profile response:', response);

      // validate response and refresh view
      if (typeof(response) !== "undefined" && typeof(response.success) !== "undefined" && response.success) {

        var profile = response.profile;

        // set default avatar if one's missing
        if (typeof(profile.avatar) == "undefined" || profile.avatar.length == 0) {
          console.log('- avatar not defined, falling back to default -');
          profile.avatar = '/assets/thinx/img/default_avatar_sm.png';
        }
        if (typeof(profile.info.goals) == "undefined") {
          console.log('- goals not defined, retaining current -');
          profile.info['goals'] = $rootScope.profile.info.goals;
        }

        $rootScope.profile = profile;
      }
      $scope.$apply();
    } else {
      console.log('// updateProfile with no argument is deprecated');
    }
  }

  function updateAuditHistory(data) {
    var response = JSON.parse(data);
    console.log('auditHistory response:', response);

    if (typeof(response.success !== "undefined") && response.success) {
      $rootScope.auditlog = response.logs;
      console.log('refreshing view...');
      $scope.$apply()
    } else {
      console.log('auditHistory fetch error.') ;
    }
  }

  function updateBuildHistory(data) {
    var response = JSON.parse(data);
    console.log('buildHistory list response:', response);

    if (typeof(response.success !== "undefined") && response.success) {
      console.log('buildHistory list length:', response.builds.length);
      $rootScope.buildHistory = response.builds;
      console.log('refreshing view...');
      $scope.$apply()
    } else {
      console.log('buildHistory fetch error.') ;
    }
  }

  function registerNotification() {
    $webNotification.showNotification('Wohoo!', {
      body: 'Browser Notification Test Success.',
      icon: '/assets/thinx/img/favicon-32x32.png',
      onClick: function onNotificationClicked() {
        console.log('Notification clicked.');
      },
      autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
    }, function onShow(error, hide) {
      if (error) {
        window.alert('Unable to show notification: ' + error.message);
      } else {
        console.log('Notification Shown.');

        setTimeout(function hideNotification() {
          console.log('Hiding notification....');
          hide(); //manually close the notification (you can skip this if you use the autoClose option)
        }, 5000);
      }
    });
  }

  Thinx.getProfile()
  .done(function(data) {
    updateProfile(data);
  })
  .fail(error => $scope.$emit("xhrFailed", error));

  Thinx.getAuditHistory()
  .done(function(data) {
    updateAuditHistory(data);
  })
  .fail(error => $scope.$emit("xhrFailed", error));

  Thinx.getBuildHistory()
  .done(function(data) {
    updateBuildHistory(data);
  })
  .fail(error => $scope.$emit("xhrFailed", error));

}

function updateTimer() {
  counter--;
  if (counter == 0) {
    counter = 30;
    console.log("Refreshing data in " + counter + " seconds...");
    // update some data
  }
  setTimeout(autoUpdater, 2000);
}

// Devices /user/devices
//
// deviceList GET /

function deviceList() {
  return $.ajax({
    url: urlBase + '/user/devices',
    type: 'GET'
  });
}

function submitDevice(deviceId, deviceAlias, devicePlatform, deviceKeyhash) {
  var data = JSON.stringify({
    changes: {
      udid: deviceId,
      alias: deviceAlias,
      platform: devicePlatform,
      keyhash: deviceKeyhash
    }
  });
  return $.ajax({
    url: urlBase + '/device/edit',
    type: 'POST',
    data: data,
    dataType: 'json'
  });
}

function revokeDevices(deviceUdids) {
  return $.ajax({
    url: urlBase + '/device/revoke',
    type: 'POST',
    data: JSON.stringify({ udids: deviceUdids }),
    dataType: 'json'
  });
}

function transferDevices(email, deviceUdids) {
  return $.ajax({
    url: urlBase + '/transfer/request',
    type: 'POST',
    data: JSON.stringify({ udids: deviceUdids, to: email }),
    dataType: 'json'
  });
}

function attachRepository(sourceId, deviceUdid) {
  return $.ajax({
    url: urlBase + '/device/attach',
    type: 'POST',
    data: JSON.stringify({
      source_id: sourceId,
      udid: deviceUdid
    }),
    dataType: 'json'
  });
}

function detachRepository(deviceUdid) {
  return $.ajax({
    url: urlBase + '/device/detach',
    type: 'POST',
    data: JSON.stringify({
      udid: deviceUdid
    }),
    dataType: 'json'
  });
}

function getLogout() {
  return $.ajax({
    url: urlBase + '/logout',
    type: 'GET',
    success: function() {
      console.log('SUCCESS');
    },
    error: function() {
      console.log('ERROR');
    }
  });
}

function build(deviceUdid, sourceId) {
  return $.ajax({
    url: urlBase + '/build',
    type: 'POST',
    data: JSON.stringify({build: {
      udid: deviceUdid,
      source_id: sourceId,
      dryrun: false
    }}),
    dataType: 'json'
  });
}

// Apikeys /user/apikey
//
// apikeyList /list
// createApikey /
// revokeApikey [keyToRevoke] /

function apikeyList() {
  return $.ajax({
    url: urlBase + '/user/apikey/list',
    type: 'GET'
  });
}

function createApikey(newApikeyAlias) {
  return $.ajax({
    url: urlBase + '/user/apikey',
    type: 'POST',
    data: JSON.stringify({
      alias: newApikeyAlias
    }),
    dataType: 'json'
  });
}

function revokeApikeys(fingerprints) {
  return $.ajax({
    url: urlBase + '/user/apikey/revoke',
    type: 'POST',
    data: JSON.stringify({ fingerprints: fingerprints }),
    dataType: 'json'
  });
}


// Rsakeys /user/rsakey
//
// createKey /
// revokeKey [keyToRevoke] /
// keyList /list

function rsakeyList() {
  return $.ajax({
    url: urlBase + '/user/rsakey/list',
    type: 'GET'
  });
}

function addRsakey(rsakeyAlias, rsakeyValue) {
  return $.ajax({
    url: urlBase + '/user/rsakey/add',
    type: 'POST',
    data: JSON.stringify({
      alias: rsakeyAlias,
      key: rsakeyValue
    }),
    dataType: 'json'
  });
}

function revokeRsakeys(fingerprints) {
  return $.ajax({
    url: urlBase + '/user/rsakey/revoke',
    type: 'POST',
    data: JSON.stringify({ fingerprints: fingerprints }),
    dataType: 'json'
  });
}

// Enviros /user/enviro
//
// createKey /
// revokeKey [keyToRevoke] /
// keyList /list

function enviroList() {
  return $.ajax({
    url: urlBase + '/user/env/list',
    type: 'GET'
  });
}

function addEnviro(enviroName, enviroValue) {
  return $.ajax({
    url: urlBase + '/user/env/add',
    type: 'POST',
    data: JSON.stringify({
      key: enviroName,
      value: enviroValue
    }),
    dataType: 'json'
  });
}

function revokeEnviros(enviroNames) {
  return $.ajax({
    url: urlBase + '/user/env/revoke',
    type: 'POST',
    data: JSON.stringify({ names: enviroNames }),
    dataType: 'json'
  });
}

// Sources /user/source
//
// sourceList GET / * list of sources is obtained by userProfile *
// addSource [sourceUrl] POST /
// removeSource [index] POST /

function sourceList() {
  return $.ajax({
    url: urlBase + '/user/sources/list',
    type: 'GET'
  });
}

function addSource(url, alias, branch) {
  return $.ajax({
    url: urlBase + '/user/source',
    type: 'POST',
    data: JSON.stringify({
      url: url,
      alias: alias,
      branch: branch
    }),
    dataType: 'json'
  });
}

function revokeSources(sourceIds) {
  return $.ajax({
    url: urlBase + '/user/source/revoke',
    type: 'POST',
    data: JSON.stringify({ source_ids: sourceIds }),
    dataType: 'json'
  });
}

// Profile /user/profile
//
// getProfile GET /
// setProfile POST /set

function getProfile() {
  return $.ajax({
    url: urlBase + '/user/profile',
    type: 'GET'
  });
}

function submitProfile(profile) {

  console.log('Submitting profile...');

  var info = {
    first_name: profile.info.first_name,
    last_name: profile.info.last_name,
    mobile_phone: profile.info.mobile_phone,

    // notifications: {
      // "all" : profile.info.notifications.all,
      // "important" : profile.info.notifications.important,
      // "info" : profile.info.notifications.info
    // },

    security: profile.info.security,

    goals: profile.info.goals,
    username: profile.info.username,
    owner: profile.info.owner
  }

  return $.ajax({
    url: urlBase + '/user/profile',
    type: 'POST',
    data: JSON.stringify({
      info: info
    }),
    dataType: 'json'
  });
}

function submitProfileAvatar(avatar) {
  // var avatar = btoa(avatar);

  return $.ajax({
    url: urlBase + '/user/profile',
    type: 'POST',
    data: JSON.stringify({
      avatar: avatar
    }),
    dataType: 'json'
  });
}


// Audit log

function getAuditHistory() {
  return $.ajax({
    url: urlBase + '/user/logs/audit',
    type: 'GET'
  });
}

// Build log

function getBuildHistory() {
  return $.ajax({
    url: urlBase + '/user/logs/build/list',
    type: 'GET'
  });
}

function getBuildLog(buildId) {
  return $.ajax({
    url: urlBase + '/user/logs/build',
    type: 'POST',
    data: JSON.stringify({
      build_id: buildId
    }),
    dataType: 'json'
  });
}

function tailBuildLog(buildId) {
  return $.ajax({
    url: urlBase + '/user/logs/tail',
    type: 'POST',
    data: JSON.stringify({
      build_id: buildId
    }),
    dataType: 'json'
  });
}

function getStats() {
  return $.ajax({
    url: urlBase + '/user/stats',
    type: 'GET'
  });
}
