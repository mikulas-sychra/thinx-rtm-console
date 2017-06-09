/* Setup blank page controller */
angular.module('RTM').controller('RsakeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        Thinx.rsakeyList()
	        .done( function(data) {
	        	updateKeys(data)
	        })
	        .fail(error => console.log('Error:', error));

	     $scope.resetModal();
    });

    function updateKeys(data) {
        var keys = JSON.parse(data);

        // $rootScope.rsaKeys = [];
        // for (var itemId in keys.rsa_keys) {
        	// $rootScope.rsaKeys[itemId] = keys.rsa_keys[itemId];	
        // }
		$rootScope.rsaKeys = keys.rsa_keys;
		$scope.$apply()

        console.log('rsakeys:');
        console.log($rootScope.rsaKeys);
    }

	$scope.addRsakey = function() {

		console.log('-- testing for duplicates --');
        for (var rsaKeyId in $rootScope.rsaKeys) {
            console.log("Looping rsaKeys: alias/name", $rootScope.rsaKeys[rsaKeyId].name, "fingerprint", $rootScope.rsaKeys[rsaKeyId].fingerprint);

            if ($rootScope.rsaKeys[rsaKeyId].name == $scope.rsakeyAlias) {
                toastr.error('Alias must be unique.', 'THiNX RTM Console', {timeOut: 5000})
                return;
            }
        }

		console.log('--adding rsa key ' + $scope.rsakeyAlias +'--')

		Thinx.addRsakey($scope.rsakeyAlias, $scope.rsakeyValue)
	        .done(function(response) {
	        	
	            if (typeof(response) !== 'undefined') {
	                if (response.success) {
	                    console.log(response);
	                    toastr.success('Key saved.', 'THiNX RTM Console', {timeOut: 5000});
	                    
	                    Thinx.rsakeyList()
					        .done( function(data) {
					        	updateKeys(data)
					        })
					        .fail(error => console.log('Error:', error));

	                    $('#pageModal').modal('hide');

	                } else {
	                    console.log(response.status);
	                    if (response.status == "already_exists") {
	                    	toastr.error('Key already exists.', 'THiNX RTM Console', {timeOut: 5000});
	                    } else {
	                    	toastr.error('Error.', 'THiNX RTM Console', {timeOut: 5000});
	                    }
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
	        	toastr.error('Error.', 'THiNX RTM Console', {timeOut: 5000});
	        });

	};

	function clearFromRsaKeys(fingerprints) {

		for (var i in fingerprints) {
			$scope.checkItem(fingerprints[i]);

			// loop through rsaKeys and selectedItems, delete on match, then refresh
			for (var index in $rootScope.rsaKeys) {
	        	if ($rootScope.rsaKeys[index].fingerprint == fingerprint) {
	        		delete $rootScope.rsaKeys[index];
	        	}
	    	}
		}
		
	    // remove deleted keys from array
	    $rootScope.rsaKeys.filter(n => n);
	    $scope.$apply();
	}

	function revokeRsakeys(fingerprints) {
		console.log('--deleting rsa keys ' + fingerprints.length +'--')

		Thinx.revokeRsakeys(fingerprints)
	        .done(function(data) {
	        	if (data.success) {
					toastr.success('Deleted.', 'THiNX RTM Console', {timeOut: 5000})
	        		console.log('Success:', data);

	        		// remove key from ui
	        		// clearFromRsaKeys(data.status);

	        		Thinx.rsakeyList()
					        .done( function(data) {
					        	updateKeys(data)
					        })
					        .fail(error => console.log('Error:', error));

	        	} else {
	        		toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
	        	}

	        })
	        .fail(function (error) {
	        	// TODO throw error message
	        	console.log('Error:', error)
	        });
	}

	$scope.revokeRsakeys = function() {
		console.log('-- processing selected items --');
		console.log($scope.selectedItems);

        var selectedToRemove = $scope.selectedItems.slice();
        if (selectedToRemove.length > 0) {
            revokeRsakeys(selectedToRemove);
        } else {
            toastr.info('Nothing selected.', 'THiNX RTM Console', {timeOut: 1000})
        }
	};	

	$scope.checkItem = function(fingerprint) {
		console.log('### toggle item in selectedItems');
		var index = $scope.selectedItems.indexOf(fingerprint);
		if (index > -1) {
			console.log('splicing on ', index, ' value ', $scope.selectedItems[index]);
    		$scope.selectedItems.splice(index, 1);
		} else {
			$scope.selectedItems.push(fingerprint);
		}
	}

	$scope.resetModal = function() {
		$scope.rsakeyAlias = null;
		$scope.rsakeyValue = null;
		$scope.selectedItems = [];
	}

}]);
