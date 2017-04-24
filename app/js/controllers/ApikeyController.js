/* Setup blank page controller */
angular.module('MetronicApp').controller('ApikeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

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
    
}]);
