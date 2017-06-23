/* Setup blank page controller */
angular.module('RTM').controller('EnviroController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();

    // set default layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    Thinx.init($rootScope, $scope);

    Thinx.enviroList()
    .done( function(data) {
      updateKeys(data)
    })
    .fail(error => console.log('Error:', error));

    $scope.resetModal();
  });

  function updateKeys(data) {
    var keys = JSON.parse(data);

    $rootScope.enviros = keys.env_vars;
    $scope.$apply()

    console.log('enviros:');
    console.log($rootScope.enviros);

  }

  $scope.addEnviro = function() {

    console.log('-- testing for duplicates --');
    for (var enviroId in $rootScope.enviros) {
      console.log("Looping enviros: alias/name", $rootScope.enviros[enviroId]);

      if ($rootScope.enviros[enviroId] == $scope.enviroName) {
        toastr.error('Name must be unique.', 'THiNX RTM Console', {timeOut: 5000})
        return;
      }
    }

    console.log('--adding enviro variable ' + $scope.enviroName +'--')

    Thinx.addEnviro($scope.enviroName, $scope.enviroValue)
    .done(function(response) {

      if (typeof(response) !== 'undefined') {
        if (response.success) {
          console.log(response);
          toastr.success('Variable saved.', 'THiNX RTM Console', {timeOut: 5000});

          Thinx.enviroList()
          .done( function(data) {
            updateKeys(data)
          })
          .fail(error => console.log('Error:', error));

          $('#pageModal').modal('hide');

        } else {
          console.log(response.status);
          if (response.status == "already_exists") {
            toastr.error('Variable already exists.', 'THiNX RTM Console', {timeOut: 5000});
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
      console.log('Error:', error);
      toastr.error('Error.', 'THiNX RTM Console', {timeOut: 5000});
    });

  };

  function revokeEnviros(fingerprints) {
    console.log('--deleting enviro variables ' + fingerprints.length +'--')

    Thinx.revokeEnviros(fingerprints)
    .done(function(data) {
      if (data.success) {
        console.log('Success:', data);

        $scope.selectedItems = [];
        Thinx.enviroList()
        .done( function(data) {

          toastr.success('Deleted.', 'THiNX RTM Console', {timeOut: 5000})
          updateKeys(data);
        })
        .fail(error => console.log('Error:', error));

      } else {
        toastr.error('Delete failed.', 'THiNX RTM Console', {timeOut: 5000})
      }
    })
    .fail(function (error) {
      // TODO throw error message
      console.log('Error:', error)
    });
  }

  $scope.revokeEnviros = function() {
    console.log('-- processing selected items --');
    console.log($scope.selectedItems);

    var selectedToRemove = $scope.selectedItems.slice();
    if (selectedToRemove.length > 0) {
      revokeEnviros(selectedToRemove);
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
    $scope.enviroName = null;
    $scope.enviroValue = null;
    $scope.selectedItems = [];
  }

}]);
