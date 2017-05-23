/* Setup blank page controller */
angular.module('MetronicApp').controller('RsakeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var jqxhr = Thinx.rsakeyList()
	        .done( function(data) {
	        	updateKeys(data)
	        })
	        .fail(error => console.log('Error:', error));

	     $scope.resetModal();
    });

    function updateKeys(data) {
        var keys = JSON.parse(data);
		$rootScope.rsaKeys = keys.rsa_keys;
		$scope.$apply()

        console.log('keys:');
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

        // return;

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
	                    toastr.error('Error.', 'THiNX RTM Console', {timeOut: 5000});
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

	$scope.revokeRsakeys = function() {
		console.log('-- processing selected items --');
		console.log($scope.selectedItems);
	};

    $scope.revokeRsakey = function(fingerprint, index) {
		console.log('--deleting rsa key ' + fingerprint +'--')

		Thinx.revokeRsakey(fingerprint)
	        .done(function(data) {
	        	if (data.success) {
					toastr.success('Deleted.', 'THiNX RTM Console', {timeOut: 5000})
	        		console.log('Success:', data);
	        		console.log($rootScope.rsaKeys);
	        		$rootScope.rsaKeys.splice(index, 1);	
	        		console.log($rootScope.rsaKeys);
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

	$scope.checkItem = function(rsakey) {
		
		console.log('### check');
		console.log(rsakey);

		if ($scope.selectedItems.includes(rsakey)) {
			console.log('found, removing');

		} else {
			console.log('NOT found, adding');
			$scope.selectedItems.push(rsakey);
		}
	}

	$scope.resetModal = function() {
		$scope.rsakeyAlias = null;
		$scope.rsakeyValue = null;
		$scope.selectedItems = [];
	}

}]);
