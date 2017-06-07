/* Setup blank page controller */
angular.module('RTM').controller('ApikeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
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
        var response = JSON.parse(data);
		$rootScope.apiKeys = response.api_keys;
		$scope.$apply()

        console.log('keys:');
        console.log($rootScope.apiKeys);
    }

	$scope.createApikey = function(newApikeyAlias) {

		console.log('-- testing for duplicates --');
        for (var apiKeyId in $rootScope.apiKeys) {
            console.log("Looping apiKeys: alias ", $rootScope.apiKeys[apiKeyId].alias);

            if ($rootScope.apiKeys[apiKeyId].alias == newApikeyAlias) {
                toastr.error('Alias must be unique.', 'THiNX RTM Console', {timeOut: 5000})
                return;
            }
        }

		console.log('-- asking for new apikey with alias: ' + newApikeyAlias + ' --'); 

		Thinx.createApikey(newApikeyAlias)
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
	                    $('.msg-warning').text(response.status);
	        			$('.msg-warning').show();
	                }
	            } else {
	            	console.log('error');
	            	console.log(response);
	            	toastr.error('Apikey creation failed.', 'THiNX RTM Console', {timeOut: 5000})
	            }
	        })
	        .fail(function(error) {
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

	function revokeApikeys(fingerprints) {
		console.log('--deleting rsa keys ' + hashes.length +'--')

		Thinx.revokeApikeys(fingerprints)
	        .done(function(data) {
	        	if (data.success) {
					toastr.success('Deleted.', 'THiNX RTM Console', {timeOut: 5000})
	        		console.log('Success:', data);

	        		// remove key from ui
	        		// clearFromRsaKeys(data.revoked);

	        	} else {
	        		toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
	        	}

	        })
	        .fail(function (error) {
	        	// TODO throw error message
	        	console.log('Error:', error)
	        });
	}

	$scope.revokeApikeys = function() {
		console.log('-- processing selected items --');
		console.log($scope.selectedItems);

        var selectedToRemove = $scope.selectedItems.slice();
        if (selectedToRemove.length > 0) {
            revokeApikeys(selectedToRemove);
        } else {
            toastr.info('Nothing selected.', 'THiNX RTM Console', {timeOut: 1000})
        }
	};

	$scope.checkItem = function(hash) {
		console.log('### toggle item in selectedItems');
		var index = $scope.selectedItems.indexOf(hash);
		if (index > -1) {
			console.log('splicing on ', index, ' value ', $scope.selectedItems[index]);
    		$scope.selectedItems.splice(index, 1);
		} else {
			$scope.selectedItems.push(hash);
		}
	}

	$scope.resetModal = function() {
		$scope.newApikey = null;
		$scope.newApikeyAlias = null;
		$scope.createButtonVisible = true;
		$scope.selectedItems = [];
	}
    
}]);
