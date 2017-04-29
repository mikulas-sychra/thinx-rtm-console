angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        Thinx.deviceList()
	        .then(data => updateDevices(data))
	        .catch(error => console.log('Error:', error));

            toastr.options = {
                positionClass: "toast-bottom-right"
            }
            toastr.success('We do have the Toastr plugin available and working.', 'THiNX RTM Console', {timeOut: 5000})

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

	function updateDevices(data) {
        var devices = JSON.parse(data);
        $rootScope.devices = devices.devices;
        $scope.$apply()

        console.log('devices:');
        console.log($rootScope.devices);
    }
});