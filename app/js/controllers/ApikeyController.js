/* Setup blank page controller */
angular.module('RTM').controller('ApikeyController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();

    // set default layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    Thinx.init($rootScope, $scope);

    Thinx.apikeyList()
    .done( function(data) {
      $scope.$emit("updateApikeys", data);
    })
    .fail(error => console.log('Error:', error));

    $scope.resetModal();
    $scope.searchText = '';

  });

  $scope.searchText = '';

  $scope.createApikey = function(newApikeyAlias) {

    console.log('-- testing for duplicates --');
    for (var apikeyId in $rootScope.apikeys) {
      console.log("Looping apikeys: alias ", $rootScope.apikeys[apikeyId].alias);

      if ($rootScope.apikeys[apikeyId].alias == newApikeyAlias) {
        toastr.error('Alias must be unique.', 'THiNX RTM Console', {timeOut: 5000})
        return;
      }
    }

    console.log('-- asking for new apikey with alias: ' + newApikeyAlias + ' --');

    Thinx.createApikey(newApikeyAlias)
    .done(function(response) {
      if (typeof(response) !== "undefined") {
        if (response.success) {
          console.log(response.api_key);
          $scope.createButtonVisible = false;
          $scope.newApikey = response.api_key;
          $('#pageModal .msg-warning').show();

          Thinx.apikeyList()
          .done( function(data) {
            $scope.$emit("updateApikeys", data);;

            // save user-spcific goal achievement
            if ($rootScope.apikeys.length > 0 && !$rootScope.profile.info.goals.includes('apikey')) {
              $rootScope.profile.info.goals.push('apikey');
              $scope.$emit("saveProfile");
            };
          })
          .fail(error => console.log('Error:', error));

          $scope.$apply();
        } else {
          console.log(response);
          $('.msg-warning').text(response.status);
          $('.msg-warning').show();
        }
      } else {
        console.log('error');
        console.log(response);
        toastr.error('Apikey creation failed.', 'THiNX RTM Console', {timeOut: 5000})
      }
    })
    .fail(function(error) {
      console.log('Error:', error);
    });

  };

  function revokeApikeys(fingerprints) {
    console.log('--deleting selected api keys ' + fingerprints.length +'--')

    Thinx.revokeApikeys(fingerprints)
    .done(function(data) {
      if (data.success) {
        console.log('Success:', data);

        $scope.selectedItems = [];
        Thinx.apikeyList()
        .done( function(data) {

          toastr.success('Deleted.', 'THiNX RTM Console', {timeOut: 5000})
          $scope.$emit("updateApikeys", data);;
        })
        .fail(error => console.log('Error:', error));

      } else {
        toastr.error('Revocation failed.', 'THiNX RTM Console', {timeOut: 5000})
      }

    })
    .fail(function (error) {
      // TODO throw error message
      console.log('Error:', error)
    });
  }

  $scope.revokeApikeys = function() {
    console.log('-- processing selected items --');
    console.log($scope.selectedItems);

    var selectedToRevoke = $scope.selectedItems.slice();
    if (selectedToRevoke.length > 0) {
      revokeApikeys(selectedToRevoke);
    } else {
      toastr.info('Nothing selected.', 'THiNX RTM Console', {timeOut: 1000})
    }
  };

  $scope.checkItem = function(hash) {
    console.log('### toggle item in selectedItems');
    var index = $scope.selectedItems.indexOf(hash);
    if (index > -1) {
      console.log('splicing on ', index, ' value ', $scope.selectedItems[index]);
      $scope.selectedItems.splice(index, 1);
    } else {
      $scope.selectedItems.push(hash);
    }
  }

  $scope.resetModal = function() {
    $scope.newApikey = null;
    $scope.newApikeyAlias = null;
    $scope.createButtonVisible = true;
    $scope.selectedItems = [];
  }

}]);
