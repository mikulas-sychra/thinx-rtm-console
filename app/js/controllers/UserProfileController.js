angular.module('MetronicApp').controller('UserProfileController', function($rootScope, $scope, $http, $timeout, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components
        Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu 
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    // $rootScope.settings.layout.pageSidebarClosed = true;

    $scope.changeProfile = function() {
    console.log('-- changing user profile --'); 
    
    var jqxhrProfile = Thinx.changeProfile(profile)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.success) !== 'undefined' && response.success) {
                        console.log(response);
                        toastr.success('Profile updated.', 'THiNX RTM Console', {timeOut: 5000})
                    } else {
                        console.log(responseObj);
                        toastr.error('Profile Update Failed.', 'THiNX RTM Console', {timeOut: 5000})
                    }
                } else {
                    console.log('error');
                    console.log(response);
                }
                
            })
            .fail(function(error) {
                console.error('Error:', error);
                toastr.error('Profile Update Failed Badly.', 'THiNX RTM Console', {timeOut: 5000})
            });
    }

    $scope.changeProfileAvatar = function(avatar) {
        console.log('-- changing user avatar --'); 

        var jqxhrProfileAvatar = Thinx.changeProfileAvatar(avatar)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.success) !== 'undefined' && response.success) {
                        console.log(response);
                        toastr.success('Avatar updated.', 'THiNX RTM Console', {timeOut: 5000})
                    } else {
                        console.log(responseObj);
                        toastr.error('Avatar Update Failed.', 'THiNX RTM Console', {timeOut: 5000})
                    }
                } else {
                    console.log('error');
                    console.log(response);
                }
                
            })
            .fail(function(error) {
                console.error('Error:', error);
                toastr.error('Avatar Update Failed Badly.', 'THiNX RTM Console', {timeOut: 5000})
            });
    }

    $scope.changeProfileSecurity = function() {
        console.log('-- changing user security settings --'); 
    }
    
}); 