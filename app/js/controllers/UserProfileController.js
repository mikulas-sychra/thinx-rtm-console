angular.module('MetronicApp').controller('UserProfileController', function($rootScope, $scope, $http, $timeout, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components
        Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu 

        $scope.newAvatar = null;

    });


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    // $rootScope.settings.layout.pageSidebarClosed = true;

    $scope.changeProfile = function() {
    console.log('-- changing user profile --'); 

    console.log($rootScope.profile);
    
    var jqxhrProfile = Thinx.changeProfile($rootScope.profile)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.success) !== 'undefined' && response.success) {
                        console.log(response);
                        toastr.success('Profile updated.', 'THiNX RTM Console', {timeOut: 5000})
                    } else {
                        console.log(response);
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


    $scope.processAvatar = function() {

        console.log('-- processing user avatar --'); 

        console.log  ( $('#newAvatarInput').prop('files') );
        console.log  ( $('#newAvatarInput').prop('files')[0] );

        var reader = new FileReader();
        reader.onloadend = function(e) {
            console.log('-- file read --'); 
            console.dir(e.target.result);
            $scope.newAvatar = e.target.result;
        }
        reader.readAsDataURL($('#newAvatarInput').prop('files')[0]);

    };


    $scope.changeProfileAvatar = function() {
        console.log('-- changing user avatar --'); 

        console.log('-- 2 --'); 
        console.log($scope.newAvatar);

        var jqxhrProfileAvatar = Thinx.changeProfileAvatar($scope.newAvatar)
            .done(function(response) {

                if (typeof(response) !== 'undefined') {
                    if (typeof(response.success) !== 'undefined' && response.success) {
                        console.log(response);
                        toastr.success('Avatar updated.', 'THiNX RTM Console', {timeOut: 5000})
                    } else {
                        console.log(response);
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

}); 