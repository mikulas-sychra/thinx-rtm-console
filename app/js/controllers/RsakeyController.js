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

    });

    function updateKeys(data) {
        var keys = JSON.parse(data);
		$rootScope.rsaKeys = keys.rsa_keys;
		$scope.$apply()

        console.log('keys:');
        console.log($rootScope.rsaKeys);
    }

	$scope.addRsakey = function() {

		console.log('--adding rsa key ' + $('#pageModal input[name=rsakeyName]').val() +'--')

		var jqxhr = Thinx.addRsakey($('#pageModal input[name=rsakeyName]').val(), $('#pageModal textarea[name=rsakeyValue]').val())
	        .done(function(response) {
	        	
	            if (typeof(response) !== 'undefined') {
	                if (response.success) {
	                    console.log(response);
	                    toastr.success('Key saved.', 'THiNX RTM Console', {timeOut: 5000});
	                    
	                    var jqxhrUpdate = Thinx.rsakeyList()
									        .done( function(data) {
									        	updateKeys(data)
									        })
									        .fail(error => console.log('Error:', error));

	                    $('#pageModal').modal('hide');

	                } else {
	                    console.log(response);
	                    toastr.success('Error.', 'THiNX RTM Console', {timeOut: 5000});
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

    $scope.revokeRsakey = function(fingerprint, index) {
		console.log('--deleting rsa key ' + fingerprint +'--')

		var jqxhr = Thinx.revokeRsakey(fingerprint)
	        .done(function(data) {
	        	if (data.success) {
					toastr.success('Deleted.', 'THiNX RTM Console', {timeOut: 5000})
	        		console.log('Success:', data);
	        		$rootScope.rsaKeys.splice(index, 1);	
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
		$('#pageModal input[name=rsakeyName]').val(null);
		$('#pageModal textarea[name=rsakeyValue]').val(null);
		$scope.rsakeyModal.$setPristine();
	}

}]);
