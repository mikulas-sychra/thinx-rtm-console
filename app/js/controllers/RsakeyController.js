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
		console.log('--adding rsa key ' + $('.rsakeyModal input[name=rsakeyName]').val() +'--')

		addRsakey($('.rsakeyModal input[name=rsakeyName]').val(), $('.rsakeyModal input[name=rsakeyValue]').val())
	        .then(data => function() {
	        	console.log('Success:', data);
	        })
	        .catch(error => function () {
	        	// TODO throw error message
	        	console.log('Error:', error)
	        });
	};

    $scope.deleteRsakey = function(index) {
		console.log('--deleting rsa key ' + index +'--')

		revokeRsakey(index)
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
