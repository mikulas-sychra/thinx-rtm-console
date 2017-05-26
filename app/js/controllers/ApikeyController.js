/* Setup blank page controller */
angular.module('MetronicApp').controller('ApikeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        Thinx.apikeyList()
	        .done( function(data) {
	        	updateKeys(data)
	        })
	        .fail(error => console.log('Error:', error));

		$scope.resetModal();

    });

    function updateKeys(data) {
        var data = JSON.parse(data);
		$rootScope.apiKeys = data.api_keys;
		$scope.$apply()

        console.log('keys:');
        console.log($rootScope.apiKeys);
    }

	$scope.createApikey = function(newApikayAlias) {

		console.log('-- testing for duplicates --');
        for (var apiKeyId in $rootScope.apiKeys) {
            console.log("Looping apiKeys: alias ", $rootScope.apiKeys[apiKeyId].alias);

            if ($rootScope.apiKeys[apiKeyId].alias == newApikayAlias) {
                toastr.error('Alias must be unique.', 'THiNX RTM Console', {timeOut: 5000})
                return;
            }
        }

		console.log('-- asking for new apikey with alias: ' + newApikayAlias + ' --'); 

		Thinx.createApikey(newApikayAlias)
	        .done(function(response) {
	            if (typeof(response) !== 'undefined') {
	                if (response.success) {
	                    console.log(response.api_key);
	                    $scope.createButtonVisible = false;
	                    $scope.newApikey = response.api_key;
	                    $('#pageModal .msg-warning').show();

						Thinx.apikeyList()
							        .done( function(data) {
							        	updateKeys(data)
							        })
							        .fail(error => console.log('Error:', error));

	                    $scope.$apply();
	                } else {
	                    console.log(response);
	                }
	            } else {
	            	console.log('error');
	            	console.log(response);
	            }
	        })
	        .fail(function(error) {
	        	$('.msg-warning').text(error);
	        	$('.msg-warning').show();
	        	console.log('Error:', error);
	        });

	};

	$scope.revokeApikey = function(fingerprint, index) {
		console.log('--revoking key ' + fingerprint +'--')

		Thinx.revokeApikey(fingerprint)
	        .done(function(response) {
	        	if (response.success) {
	        		console.log('Success:', response.revoked);
	        		$rootScope.apiKeys.splice(index, 1);
	        		toastr.success('Revoked.', 'THiNX RTM Console', {timeOut: 5000})
					$scope.$apply()
	        	} else {
	        		toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
	        	}
	        })
	        .fail(function (error) {
	        	// TODO throw error message
	        	console.log('Error:', error)
	        });
	};

	$scope.resetModal = function() {
		$scope.newApikey = null;
		$scope.newApikayAlias = null;
		$scope.createButtonVisible = true;
		console.log($scope.newApikayAlias);
		console.log('Modal form reset.');
	}
    
}]);
