angular.module('RTM').controller('UserProfileController', function($rootScope, $scope, $http, $timeout, $state) {
  $scope.$on('$viewContentLoaded', function() {
    App.initAjax(); // initialize core components
    Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu

    $scope.newAvatar = null;
    $scope.searchText = "";

    $scope.deleteForm = {
      username: null,
      owner: null
    };

    $scope.messageForm = {
      text: null
    };

  });

  Thinx.init($rootScope, $scope);

  // set sidebar closed and body solid layout mode
  $rootScope.settings.layout.pageBodySolid = true;
  // $rootScope.settings.layout.pageSidebarClosed = true;

  $scope.submitProfileForm = function() {
    console.log('-- changing user profile --');

    console.log('current profile');
    console.log($rootScope.profile);

    console.log('-- sending data --');
    Thinx.submitProfile($rootScope.profile)
    .done(function(response) {

      if (typeof(response) !== "undefined") {
        if (typeof(response.success) !== "undefined" && response.success) {

          console.log(' == Profile update success ==');
          console.log(response);

          Thinx.getProfile().done(function(data) {
            $scope.$emit("updateProfile", data);
          })
          .fail(error => console.log('Error:', error));

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

    var avatarMaxSize = 500000;
    console.log('-- processing user avatar --');
    console.log  ( $('#newAvatarInput').prop('files') );

    if ($('#newAvatarInput').prop('files').length > 0) {

      var reader = new FileReader();
      reader.onloadend = function(e) {
        console.log('-- file read --');
        console.log(e.total);

        if (e.total < avatarMaxSize) {
          $scope.newAvatar = e.target.result;
        } else {
          toastr.error('Avatar size over limit 500kB (' + e.total/1000 + ' kB).', 'THiNX RTM Console', {timeOut: 5000});
        }
        $scope.$apply();
      }
      reader.readAsDataURL($('#newAvatarInput').prop('files')[0]);

    } else {
      // no file selected
      $scope.newAvatar = null;
    }
    $scope.$apply();
  };


  $scope.submitAvatarForm = function() {
    console.log('-- changing user avatar --');
    console.log($scope.newAvatar);

    if ($scope.newAvatar == null) {
      console.log('no file selected');
      return;
    }

    Thinx.submitProfileAvatar($scope.newAvatar)
    .done(function(response) {

      if (typeof(response) !== "undefined") {
        if (typeof(response.success) !== "undefined" && response.success) {
          console.log(response);

          console.log('-- avatar success, refreshing profile --');

          Thinx.getProfile().done(function(data) {
            $scope.$emit("updateProfile", data);
          })
          .fail(error => console.log('Error:', error));

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

  $scope.removeGoal = function(goalId) {
    console.log('-- current goals: ' + $rootScope.profile.info.goals);
    console.log('-- removing goal: ' + goalId);

    var index = $rootScope.profile.info.goals.indexOf(goalId);
    if (index > -1) {
      $rootScope.profile.info.goals.splice(index, 1);
    };
  };



  $scope.removeTag = function(tagId) {
    console.log('-- current tags: ' + $rootScope.profile.info.tags);
    console.log('-- removing tag: ' + tagId);

    var index = $rootScope.profile.info.tags.indexOf(tagId);
    if (index > -1) {
      $rootScope.profile.info.tags.splice(index, 1);
    };
  };

  $scope.submitUserDelete = function() {
    Thinx.userDelete($scope.deleteForm)
    .done(function(response) {

      if (typeof(response) !== "undefined") {
        if (typeof(response.success) !== "undefined" && response.success) {
          console.log(response);
          window.location = "//rtm.thinx.cloud:7443/api/logout";
        } else {
          console.log(response);
          toastr.error('User Delete Failed.', 'THiNX RTM Console', {timeOut: 5000})
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
  };

  $scope.checkDeleteForm = function() {
    if (
        $scope.deleteForm.username == $rootScope.profile.username
        && $scope.deleteForm.owner == $rootScope.profile.owner) {
      return false;
    }
    return true;
  };

  $scope.submitSystemMessageForm = function() {

    Thinx.submitSystemMessage($scope.messageForm)
    .done(function(response) {

      if (typeof(response) !== "undefined") {
        if (typeof(response.success) !== "undefined" && response.success) {
          console.log(response);
          toastr.success('Message sent.', 'THiNX RTM Console', {timeOut: 5000})
          $scope.messageForm.text = null;
        } else {
          console.log(response);
          toastr.error('Message Submit Failed.', 'THiNX RTM Console', {timeOut: 5000})
        }
      } else {
        console.log('error');
        console.log(response);
      }
    })
    .fail(function(error) {
      console.error('Error:', error);
      toastr.error('Message Submit Failed Badly.', 'THiNX RTM Console', {timeOut: 5000})
    });
  };

});
