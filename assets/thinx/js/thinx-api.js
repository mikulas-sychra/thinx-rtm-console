// Thninx API Ajax Class
var urlBase = 'http://thinx.cloud:7442/api';
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
    createApikey: function (newApikayAlias) {
        return createApikey(newApikayAlias);
    },
    revokeApikey: function (fingerprint) {
        return revokeApikey(fingerprint);
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
    revokeSource: function (sourceId) {
        return revokeSource(sourceId);
    },
    revokeSources: function (sourceIds) {
        return revokeSources(sourceIds);
    },
    // DEVICE
    deviceList: function () {
        return deviceList();
    },
    changeDevice: function (deviceUdid, deviceAlias) {
        return changeDevice(deviceUdid, deviceAlias);
    },
    revokeDevice: function (deviceUdid) {
        return revokeDevice(deviceUdid);
    },
    attachRepository: function (sourceId, deviceUdid) {
        return attachRepository(sourceId, deviceUdid);
    },
    detachRepository: function (deviceUdid) {
        return detachRepository(deviceUdid);
    },
    build: function (deviceUdid, sourceId, dryrun) {
        return build(deviceUdid, sourceId, dryrun);
    },
    // PROFILE
    getProfile: function () {
        return getProfile();
    },
    changeProfile: function (profile) {
        return changeProfile(profile);
    },
    changeProfileAvatar: function (avatar) {
        return changeProfileAvatar(avatar);
    },
    changeProfileSecurity: function (security) {
        return changeProfileSecurity(security);
    },
    getAuditLog: function () {
        return getAuditLog();
    },
    getBuildLog: function (buildId) {
        return getBuildLog(buildId);
    },
    tailBuildLog: function (buildId) {
        return tailBuildLog(buildId);
    },
    buildLogList: function () {
        return buildLogList();
    },
    getStats: function () {
        return getStats();
    },
    getLogout: function () {
        return getLogout();
    }
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

function changeDevice(deviceId, deviceAlias) {

    var data = JSON.stringify({ changes: { udid: deviceId, alias: deviceAlias } });

    console.log(data);

    return $.ajax({
        url: urlBase + '/device/edit',
        type: 'POST',
        data: data, 
        dataType: 'json'
    });
}

function revokeDevice(deviceUdid) {
    return $.ajax({
        url: urlBase + '/device/revoke',
        type: 'POST',
        data: JSON.stringify({ udid: deviceUdid }), 
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

function build(deviceUdid, sourceId, dryrun) {
    return $.ajax({
        url: urlBase + '/build',
        type: 'POST',
        data: JSON.stringify({build: {
            udid: deviceUdid,
            source_id: sourceId,
            dryrun: dryrun,
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

function createApikey(newApikayAlias) {
    return $.ajax({
        url: urlBase + '/user/apikey',
        type: 'POST',
        data: JSON.stringify({
            alias: newApikayAlias
        }), 
        dataType: 'json'
    });
}

function revokeApikey(fingerprint) {
	return $.ajax({
		url: urlBase + '/user/apikey/revoke',
		type: 'POST',
        data: JSON.stringify({ fingerprint: fingerprint }), 
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
        url: urlBase + '/user/rsakey',
        type: 'POST',
        data: JSON.stringify({ 
            alias: rsakeyAlias,
            key: rsakeyValue
        }), 
        dataType: 'json'
    });
}

function revokeRsakey(fingerprint) {
    console.log(fingerprint);

    return $.ajax({
        url: urlBase + '/user/rsakey/revoke',
        type: 'POST',
        data: JSON.stringify({ 
            fingerprint: fingerprint 
        }), 
        dataType: 'json'
    });
}

function revokeRsakeys(fingerprints) {
    console.log(fingerprints);

    return $.ajax({
        url: urlBase + '/user/rsakey/revoke',
        type: 'POST',
        data: JSON.stringify({ 
            fingerprints: fingerprints
        }), 
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

function revokeSource(sourceId) {
	return $.ajax({
		url: urlBase + '/user/source/revoke',
		type: 'POST',
		data: JSON.stringify({ source_id: sourceId }), 
        dataType: 'json'
	});
}

function revokeSources(sourceIds) {
    return $.ajax({
        url: urlBase + '/user/source/revoke',
        type: 'POST',
        data: JSON.stringify({ sourceIds: sourceIds }), 
        dataType: 'json'
    });
}

function revokeRsakeys(fingerprints) {
    console.log(fingerprints);

    return $.ajax({
        url: urlBase + '/user/rsakey/revoke',
        type: 'POST',
        data: JSON.stringify({ 
            fingerprints: fingerprints
        }), 
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

function changeProfile(profile) {

    var info = {
        first_name: profile.info.first_name,
        last_name: profile.info.last_name,
        mobile_phone: profile.info.mobile_phone,

        notifications: {
                "all" : profile.info.notifications.all, 
                "important" : profile.info.notifications.important, 
                "info" : profile.info.notifications.info 
        },

        security: profile.info.security,

        goals: profile.info.goals,
        username: profile.info.username,
        owner: profile.info.owner
    }

    console.log('sending profile change request...');
    console.log({ 
            info: info
        });

    return $.ajax({
        url: urlBase + '/user/profile',
        type: 'POST',
        data: JSON.stringify({ 
            info: info
        }), 
        dataType: 'json'
    });
}

function changeProfileAvatar(avatar) {
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

function getAuditLog() {
  return $.ajax({
        url: urlBase + '/user/logs/audit',
        type: 'GET'
    });
}

// Build log

function buildLogList() {
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
