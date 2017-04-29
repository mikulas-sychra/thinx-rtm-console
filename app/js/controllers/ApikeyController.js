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
	        .then(data => updateKeys(data))
	        .catch(error => console.log('Error:', error));
    });

    $scope.newApikey = '';

    function updateKeys(data) {
        var keys = JSON.parse(data);
		$rootScope.apiKeys = keys.api_keys;
		$scope.$apply()

        console.log('keys:');
        console.log($rootScope.apiKeys);
    }

	$scope.createApikey = function() {
		console.log('-- asking for new apikey --'); 

		var jqxhr = Thinx.createApikey()
	        .done(function(response) {
	        	
	            if (typeof(response) !== 'undefined') {
	                if (response.success) {
	                    console.log(response.api_key);
	                    $scope.createButtonVisible = false;
	                    $scope.newApikey = response.api_key;
	                    $('#pageModal .msg-warning').show();
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
	        	throw(error);
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
	        		console.log('Success:', response);
	        		toastr.success('Revoked.', 'THiNX RTM Console', {timeOut: 5000})
	        	} else {
	        		toastr.success('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
	        	}

	        	$rootScope.apiKeys.splice(index, 1);
	        })
	        .catch(error => function () {
	        	// TODO throw error message
	        	console.log('Error:', error)
	        });
	};

	$scope.resetModal = function() {
		$scope.newApikey = null;
		$scope.createButtonVisible = true;
		$scope.apikeyModal.$setPristine();
	}
    
}]);
