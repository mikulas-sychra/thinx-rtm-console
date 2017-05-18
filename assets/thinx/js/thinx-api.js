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
    revokeRsakey: function (fingerprint) {
        return revokeRsakey(fingerprint);
    },
    // SOURCE
    sourceList: function () {
        return sourceList();
    },
    addSource: function (sourceUrl, sourceAlias) {
        return addSource(sourceUrl, sourceAlias);
    },
    revokeSource: function (sourceId) {
        return revokeSource(sourceId);
    },
    // DEVICE
    deviceList: function () {
        return deviceList();
    },
    changeDevice: function (deviceUdid, deviceAlias) {
        return changeDevice(deviceUdid, deviceAlias);
    },
    revokeDevice: function (udid) {
        return revokeDevice(udid);
    },
    attachRepository: function (sourceAlias, deviceMac) {
        return attachRepository(sourceAlias, deviceMac);
    },
    detachRepository: function (deviceAlias, deviceMac) {
        return detachRepository(deviceAlias, deviceMac);
    },
    build: function (deviceUdid, sourceAlias, dryrun) {
        return build(deviceUdid, sourceAlias, dryrun);
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
    buildLogList: function () {
        return buildLogList();
    },
    getStats: function () {
        return getStats();
    },
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

function changeDevice(hash, alias) {

    var data = JSON.stringify({ changes: { device_id: hash, alias: alias } });

    console.log(data);

    return $.ajax({
        url: urlBase + '/device/edit',
        type: 'POST',
        data: data, 
        dataType: 'json'
    });
}

function revokeDevice(udid) {
    return $.ajax({
        url: urlBase + '/device/revoke',
        type: 'POST',
        data: JSON.stringify({ udid: udid }), 
        dataType: 'json'
    });
}

function attachRepository(alias, mac) {
    return $.ajax({
        url: urlBase + '/device/attach',
        type: 'POST',
        data: JSON.stringify({
            alias: alias,
            mac: mac
        }), 
        dataType: 'json'
    });
}

function detachRepository(alias, mac) {
    return $.ajax({
        url: urlBase + '/device/detach',
        type: 'POST',
        data: JSON.stringify({
            alias: alias,
            mac: mac
        }), 
        dataType: 'json'
    });
}

function build(deviceUdid, sourceAlias, dryrun) {
    return $.ajax({
        url: urlBase + '/build',
        type: 'POST',
        data: JSON.stringify({build: {
            udid: deviceUdid,
            source: sourceAlias,
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

function addRsakey(rsakeyName, rsakeyValue) {
    return $.ajax({
        url: urlBase + '/user/rsakey',
        type: 'POST',
        data: JSON.stringify({ 
            alias: rsakeyName,
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

function addSource(url, alias) {
	return $.ajax({
		url: urlBase + '/user/source',
		type: 'POST',
        data: JSON.stringify({ 
            url: url,
            alias: alias
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

        security: { "unique_api_keys" : true },

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

function getStats() {
    return $.ajax({
        url: urlBase + '/user/stats',
        type: 'GET'
    });
}
