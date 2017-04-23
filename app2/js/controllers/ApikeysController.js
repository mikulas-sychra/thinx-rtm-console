'use strict';

RTM.controller('ApikeysController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();

        keyList()
        .then(data => updateKeys(data))
        .catch(error => console.log('Error:', error));

    });

    function updateKeys(data) {
        var keys = JSON.parse(data);
		$rootScope.apiKeys = keys.api_keys;
		$scope.$apply()

        console.log('keys:');
        console.log($rootScope.apiKeys);
    }

	$scope.createApikey = function() {
		$scope.createButtonVisible = false;

		createKey()
	        .then(data => function(data) {
	        	console.log('apikey:');
				console.log(data.api_key);
				$scope.newApikey = data.api_key;
				$scope.$apply()
	        })
	        .catch(error => console.log('Error:', error));
	};

	$scope.revokeApikey = function(keyToRevoke, index) {
		console.log('--revoking key ' + keyToRevoke +'--')

		revokeKey(keyToRevoke)
	        .then(data => function() {
	        	console.log('Success:', data);
	        	$rootScope.apiKeys.splice(index, 1);
	        })
	        .catch(error => console.log('Error:', error));
	};

	$scope.copyToClipboard = function() {
		// $scope.keyString.focus();
		var ele = angular.element(document.getElementById('keyString')).scope();
		ele.focus();
        ele.select();
        ele.hide();
        setTimeout(function() {
            document.execCommand('copy');
            console.log('copied...');
            console.log(ele.text());
        }, 20);
	};

	$scope.resetModal = function() {
		$scope.newApikey = null;
		$scope.createButtonVisible = true;
		$scope.apikeyModal.$setPristine();
	}	

});