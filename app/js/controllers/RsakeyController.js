/* Setup blank page controller */
angular.module('RTM').controller('RsakeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();

    // set default layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    Thinx.init($rootScope, $scope);

    Thinx.rsakeyList()
    .done( function(data) {
      updateKeys(data)
    })
    .fail(error => $rootScope.$emit("xhrFailed", error));

    $scope.resetModal();
  });

  function updateKeys(data) {
    var keys = JSON.parse(data);

    $rootScope.rsakeys = keys.rsa_keys;

    // TODO save profile
    if ($rootScope.rsakeys.length > 0 && !$rootScope.profile.info.goals.includes('rsakey')) {
      $rootScope.profile.info.goals.push('rsakey');
    };

    $scope.$apply()

    console.log('rsakeys:');
    console.log($rootScope.rsakeys);
  }

  $scope.addRsakey = function() {

    console.log('-- testing for duplicates --');
    for (var rsakeyId in $rootScope.rsakeys) {
      console.log("Looping rsakeys: alias/name", $rootScope.rsakeys[rsakeyId].name, "fingerprint", $rootScope.rsakeys[rsakeyId].fingerprint);

      if ($rootScope.rsakeys[rsakeyId].name == $scope.rsakeyAlias) {
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
          .fail(error => $rootScope.$emit("xhrFailed", error));

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
      $rootScope.$emit("xhrFailed", error)
      toastr.error('Error.', 'THiNX RTM Console', {timeOut: 5000});
    });

  };

  function revokeRsakeys(fingerprints) {
    console.log('--deleting rsa keys ' + fingerprints.length +'--')

    Thinx.revokeRsakeys(fingerprints)
    .done(function(data) {
      if (data.success) {
        console.log('Success:', data);

        $scope.selectedItems = [];
        Thinx.rsakeyList()
        .done( function(data) {
          toastr.success('Deleted.', 'THiNX RTM Console', {timeOut: 5000})
          updateKeys(data);
        })
        .fail(error => $rootScope.$emit("xhrFailed", error));

      } else {
        toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
      }
    })
    .fail(error => $rootScope.$emit("xhrFailed", error));
  }

  $scope.revokeRsakeys = function() {
    console.log('-- processing selected items --');
    console.log($scope.selectedItems);

    var selectedToRemove = $scope.selectedItems.slice();
    if (selectedToRemove.length > 0) {
      revokeRsakeys(selectedToRemove);
    } else {
      toastr.warning('Nothing selected.', 'THiNX RTM Console', {timeOut: 1000})
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
