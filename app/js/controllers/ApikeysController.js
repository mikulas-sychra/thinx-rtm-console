'use strict';

RTM.controller('ApikeysController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();

    });

	$scope.newApikey = "Press button to create a new key...";

	$http.defaults.headers.post = { 'Content-Type': 'application/json' }

	$scope.createApikey = function() {
		getKey();
	};

	$scope.revokeApikey = function(keyToRevoke, index) {
		console.log('--revoking key--')
		revokeKey(keyToRevoke);
		$rootScope.profile.api_keys.splice(index, 1);
	};

	// Contignous database update notifications
	var counter = 30;

	$(function() {
		fetchKeys();
		update();
		console.log("Refreshing keys in " + counter + " seconds...");
	});

	function update() {
		counter--;

		if (counter == 0) {
			counter = 30;
			console.log("Refreshing keys in " + counter + " seconds...");
			fetchKeys();
		}

		setTimeout(update, 1000);
	}


	function fetchKeys() {
		var keysFetch = {
			method: 'GET',
			url: 'http://thinx.cloud:7442/api/user/apikey/list'
		}

		$http(keysFetch).then(
			function(keysFetchResponse){
				console.log('--apikeys fetch success--');
				console.log(keysFetchResponse);

				$rootScope.profile.api_keys = keysFetchResponse.data.api_keys;

				console.log($rootScope.profile.api_keys);
			},
			function(keysFetchResponse){
				console.log('--apikeys fetch failure--');
				console.log('apikeys fetch request');
				console.log(keysFetch);
				console.log('apikeys fetch response');
				console.log(keysFetchResponse);
			}
		);
	}


	function getKey() {
		var newApikeyFetch = {
			method: 'GET',
			url: 'http://thinx.cloud:7442/api/user/apikey'
		};

		$http(newApikeyFetch).then(
			function(newApikeyFetchResponse){
				// console.log('--apikey fetch success--');
				console.log('apikey fetch response:');
				console.log(newApikeyFetchResponse);

				var apikey = newApikeyFetchResponse.data.api_key;
				console.log('apikey:');
				console.log(apikey);

				$scope.newApiKey = apikey;

				console.log('scope apikey:');
				console.log($scope.newApiKey);

			},
			function(newApikeyFetchResponse){
				console.log('--apikey fetch failure--');
				console.log('profile fetch request:');
				console.log(newApikeyFetch);
				console.log('profile fetch response:');
				console.log(newApikeyFetchResponse);
			}
		);
	}


	function revokeKey(keyToRevoke) {
		console.log(keyToRevoke);
		var apikeyRevocation = {
			method: 'POST',
			url: 'http://thinx.cloud:7442/api/user/apikey/revoke',
			data: { api_key: keyToRevoke}
		}

		$http(apikeyRevocation).then(
			function (apikeyRevocationResponse) {
				console.log('--apikey revocation success--');
				console.log('apikey revocation response:');
				console.log(apikeyRevocationResponse);

			},
			function (apikeyRevocationResponse) {
				console.log('--apikey revocation failure--');
				console.log('apikey revocation request:');
				console.log(apikeyRevocation);
				console.log('apikey revocation response:');
				console.log(apikeyRevocationResponse);
			}
		);
	}

});