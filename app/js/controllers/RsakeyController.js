/* Setup blank page controller */
angular.module('MetronicApp').controller('RsakeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

	$scope.addRsakey = function() {

		console.log('--adding rsa key ' + $('#pageModal input[name=rsakeyName]').val() +'--')

		var jqxhr = Thinx.addRsakey($('#pageModal input[name=rsakeyName]').val(), $('#pageModal textarea[name=rsakeyValue]').val())
	        .done(function(response) {
	        	
	            if (typeof(response) !== 'undefined') {
	                if (response.success) {
	                    console.log(response);
	                    // $scope.createButtonVisible = false;
	                    // $scope.newApikey = response.api_key;
	                    // $('#pageModal .msg-warning').show();
	                    // $scope.$apply();
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

    $scope.deleteRsakey = function(index) {
		console.log('--deleting rsa key ' + index +'--')

		Thinx.revokeRsakey(index)
	        .then(data => function() {
	        	console.log('Success:', data);
	        	$rootScope.rsaKeys.splice(index, 1);
	        })
	        .catch(error => function () {
	        	// TODO throw error message
	        	console.log('Error:', error)
	        });
	};

}]);
