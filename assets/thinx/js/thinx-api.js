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
    createApikey: function () {
        return createApikey();
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
    revokeSource: function (alias) {
        return revokeSource(alias);
    },
    // DEVICE
    deviceList: function () {
        return deviceList();
    },
    attachRepository: function (sourceAlias, deviceAlias, deviceMac) {
        return attachRepository(sourceAlias, deviceAlias, deviceMac);
    },
    detachRepository: function (deviceAlias, deviceMac) {
        return detachRepository(deviceAlias, deviceMac);
    },
    build: function (deviceHash, sourceAlias) {
        return build(deviceHash, sourceAlias);
    },
    // PROFILE
    getProfile: function () {
        return getProfile();
    },
    changeProfile: function () {
        return changeProfile();
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

function attachRepository(source, alias, mac) {
    return $.ajax({
        url: urlBase + '/device/attach',
        type: 'POST',
        data: JSON.stringify({
            source: source,
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

function build(deviceHash, sourceAlias) {
    return $.ajax({
        url: urlBase + '/build',
        type: 'POST',
        data: JSON.stringify({build: {
            hash: deviceHash,
            source: sourceAlias
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

function createApikey() {
    return $.ajax({
        url: urlBase + '/user/apikey',
        type: 'POST',
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

function revokeSource(alias) {
	return $.ajax({
		url: urlBase + '/user/source/revoke',
		type: 'POST',
		data: JSON.stringify({ alias: alias }), 
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

function changeProfile() {

    var changeQuery = {
        first_name: "john",
        last_name: "doe",
        email: "john@doe.com",
        phone: "john@doe.com",
        avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADBhJREFUeNrs3bFy29gVgOE44x54guANwGrjaq+qdSqg8roDq3Uq8gkEVlYqgJW3ElhlO9KV3VGV6Sew34BvYFXJpGFAaiaTKjM7E0m0zveNx6UlHYz9mzxzL58dDoc/ABDPH40AQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEA4DE9NwLO0G63+7T7/L3/FEXxp2nTeJoIAPwO47/+b6+uvvef4iIlAeCceQsIQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEADCq+sqzzNzAAEgnElZrobBHEAACPkioKoWbWsOIABEtGgvL1IyBxAAItps1kVRmAMIAOHkWfZ+s7YQBgEgoklZ9l1nDiAARDRtmvl8Zg4gAES07DoLYRAAgrIQBgEgqLuFsDmAABDR6YTwtTmAABDRtGnGX+YAAkBE44uAyaQ0BxAAIrrZbp0OAwEgojzLxgaYAwgAEU3Kctk7IQwCQEjz2cxCGASAoPq+sxAGASCi4+mwtetCQQAIqSiKsQHmAAJARCklC2EQAIKyEAYBIC4LYRAAgsqzbDUMFsIgAER0ui50MAcQACKqq2rRtuYAAkBEi/ayritzAAEgotUwWAiDABCRhTAIAHFNyrLvnA4DASCkadPM5zNzAAEgomXXXaRkDiAARLTZrIuiMAcQAMI5Xhm9cWU0CAAhWQiDABCXhTAIAHEtO9eFggAQ1c12axkAAkBEeZaNDTAHEAAiOl0ZfW0OIABENG0anx8JAkBQ44sAC2EEAIJ6v3Y6DAGAkIqiGBtgDggARJRSWvZOCCMAENJ8NrMQRgAgqL53QhgBgJCO14VaCCMAEJOFMAIAcaWUFm1rDggARLRoL+u6MgcEACJaDYOFMAIAEeVZNjbAQhgBgIhO14UO5oAAQER1VVkIIwAQ1KK9vEjJHBAAiGizWRdFYQ4IAIRzPCG8cUIYAYCQJmXZd64LRQAgpGnTzOczc0AAIKJl11kIIwAQlIUwAgBB3S2EzQEBgIhOJ4SvzQEBgIimTePzIxEACGp8EeC6UAQAgrrZbp0OQwAgojzLxgaYAwIAEU3Kctk7IYwAQEjz2cxCGAGAoPq+sxBGACCi4+mwtetCEQAIqSiKsQHmgABARCklC2EEAIKyEEYAIC4LYQQAgsqzbDUMFsIIAER0ui50MAcEACKqq2rRtuaAAEBEi/ayritzQAAgotUwWAgjABDR3UI4sxDmvD07HA6mAPdhv9/7HHkEAICz4y0gAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAEAIJznRvAE7Ha7LM8nZXkm38+329t37371XJ6wi/RjSskcBIDH92n3+d2v72622zNpQJ5l4+9vr648mierbQXgCfAW0BPx7dvtTy9ffvn69Uy+n0V7WdeV5wICQMQGrIZhMik9FxAAwjUgz7KxAXmeeS4gAIRrwKQsxwZ4KCAARGxAXVWLtvVQQACI2AALYRAA4jZgNQxFUXgoIACEa0CeZe83awthEAAiNmBSln3XeSIgAERswLRp5vOZJwICQMQGLLvuwhUCIADEbMBms7YQBgEgYgPuFsIeBwgAERtwOiF87XGAABCxAdOmGX95HCAARGzA+CLAdaEgAARtwM1263QYCAARG5Bn2dgAzwIEgIgNsBAGASBuAyyEQQCI24C+7yyEQQCI2IDj6bC160JBAAjZgKIoxgZ4ECAARGxASmnZuzIaBICQDZjPZhbCIAAEbYCFMAgAQRuQZ9lqGCyEQQCI2IDT6bDBUwABIGID6qpatK2nAAJAxAYs2su6rjwFEAAiNmA1DBbCIABEbICFMAgAcRtgIQwCwOM34NXPr7/d3j78l66raj6feQQgADya/X4/vg54lAYsu+4iJY8ABIBH8+XL18dqwGazLorCIwABIFwDjldGb1wZDQJAyAZMyrLvXBcKAkDIBkybxkIYBICgDVh2rgsFASBqA262W8sAEAAiNiDPsrEBhg8CQMQGnE4IXxs+CAARGzBtGp8fCQJA0AaMLwIshEEACNoAC2EQAII24HhCeL02eRAAIjYgpbTsnRAGASBkA+azmYUwCABBG9D3TgiDABCyAXfLAAthEAAiNqAoCgthEACCNiCltGhbYwcBIGIDFu1lXVfGDgJAxAashsFCGASAiA3Is2xsgIUw/A/PDoeDKXzvdrvdp93n7+W7Hf9jXlcP9P7Mh48fX/38+nF/3ie5kLhIP6aU/NUTADhrb6/+9vbq6hG/gX/98x+eAgIAj+PV69cfPnwUABAAwvl2e/vDn1/s93sBgP9mCczTdzwhvHFCGASAkCZl2XeuCwUBIKRp08znM3OA/7ADIJafXv7l0273kF/RDgABgLPw8AthAeBseQuIWO4WwuYAAkBEk7JcDdfmAAJARNOm8fmRYAdAXD+8ePHly9f7/ip2AHgFAL/Pfr+/73tDb7Zbp8MQADjHANz33dF5lo0NMGoEAM7OA3x+gIUwAgBxG2AhjABA3Ab0fefzIxEAiNiA4+mwtetCEQAI2YCiKMYGmDMCABEbkFJa9q6MRgAgZAPms5mFMAIAQRtgIYwAQNAG5Fm2GgYLYQQAIjbgdDpsMGQEACI2oK6qRdsaMgIAERuwaC/rujJkBAAiNmA1DBbCCABEbICFMAIA30EDfnnz5j7+ZAthBADO3YcPH39589f7+JPrqprPZyaMAMD5+vtvv91TA5Zdd5GSCSMAELEBm826KAoTRgAgXAOOV0ZvXBmNAEDIBkzKsu9cF4oAQMgGTJvGQhgBgKANWHauC0UAIGoDbrZbywAEACI2IM+ysQFmiwBAxAacTghfmy0CABEbMG0anx+JAEDQBowvAiyEEQAI2oD3a6fDEAAI2YCiKMYGGCwCABEbkFJa9k4IIwAQsgHz2cxCGAGAoA3oeyeEEQAI2YDjdaEWwggAxGyAhTACAHEbkFJatK2pIgAQsQGL9rKuK1NFACBiA1bDYCGMAEDEBuRZNjbAQhgBgIgNOF0XOhgpAgARG1BXlYUwAgBBG7BoL80TAYCgDQABAA0AAQANAAEADQABAA0AAQANAAEADQABAA0AAQANAAEADQABAA0AAQANAAEADQABAA0AAQANQACMADQAAQA0AAEANAABADQAAQA0AAEANAABADQAAQA0AAEADdAABAAiN8AQEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABABAAIwAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABACA+/bcCDhPWZ5fpGQOcH+eHQ4HUwAIyFtAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAJgBAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAPzf/VuAAQDYPYQy4QMPsAAAAABJRU5ErkJggg==",
        password: "tset",
        privacy: {
            globalPush: true,
            importantNotifications: true,
            forceUniqueKeys: true
        }
    }

    var profileChange = {
        method: 'POST',
        url: urlBase + '/user/profile',
        data: { query: changeQuery }
    }
}


