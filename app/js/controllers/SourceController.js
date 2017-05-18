/* Setup blank page controller */
angular.module('MetronicApp').controller('SourceController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        var jqxhr = Thinx.sourceList()
            .done( function(data) {
                updateSources(data)
            })
            .fail(error => console.log('Error:', error));

        $scope.resetModal();

    });

    function updateSources(data) {
        
        var response = JSON.parse(data);
        console.log(response);

        $rootScope.sources = [];
        $.each(response.sources, function(key, value) {
              $rootScope.sources[key] = value;
        });
        $scope.$apply();

        console.log('sources:');
        console.log($rootScope.sources);
    }

    $scope.addSource = function() {
	
        console.log('-- adding new source --'); 

        console.log($scope.sourceUrl);
        console.log($scope.sourceAlias);

        var jqxhr = Thinx.addSource($scope.sourceUrl, $scope.sourceAlias)
            .done(function(response) {
                
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);

                        var jqxhr = Thinx.sourceList()
                            .done( function(data) {
                                updateSources(data)
                            })
                            .fail(error => console.log('Error:', error));

                            toastr.success('Source Added.', 'THiNX RTM Console', {timeOut: 5000})

                        $('#pageModal').modal('hide');

                    } else {
                        console.log(response);
                    }
                } else {
                    console.log('error');
                    console.log(response);
                    toastr.error('Source Failed.', 'THiNX RTM Console', {timeOut: 5000})
                }
            })
            .fail(function(error) {
                $('.msg-warning').text(error);
                $('.msg-warning').show();
                console.log('Error:', error);
                toastr.success('Source Failed.', 'THiNX RTM Console', {timeOut: 5000})
            });

	};

    $scope.getAliasFromUrl = function() {
        console.log('procesing: ' + $scope.sourceUrl);
        try {
            var urlParts = $scope.sourceUrl.replace(/\/\s*$/,'').split('/');
            console.log(urlParts[1]);
            if (typeof(urlParts[0]) !== 'undefined' && /git/.test(urlParts[0])) {
                var projectName = urlParts[1].split('.', 1);
                console.log('detected projectname:');
                console.log(projectName[0]);
            }
        } catch(e) {
            console.log(e);
        }
        if ((typeof(projectName) !== 'undefined') && (projectName.length > 0) && ($scope.sourceAlias == null || $scope.sourceAlias == '')) {
            $scope.sourceAlias = projectName[0];
        }
    }

	$scope.revokeSource = function(alias, index) {

		console.log('-- removing source ' + alias + '--'); 

        var jqxhr = Thinx.revokeSource(alias)
            .done(function(response) {
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);
                        $rootScope.sources.splice(index, 1);
                        $scope.$apply()
                        toastr.success('Source Removed.', 'THiNX RTM Console', {timeOut: 5000})
                    } else {
                        console.log(response);
                        toastr.success('Source Failed.', 'THiNX RTM Console', {timeOut: 5000})
                    }
                } else {
                    console.log('error');
                    console.log(response);
                    toastr.success('Source Failed.', 'THiNX RTM Console', {timeOut: 5000})
                }
            })
            .fail(function(error) {
                $('.msg-warning').text(error);
                $('.msg-warning').show();
                console.log('Error:', error);
                toastr.success('Source Failed.', 'THiNX RTM Console', {timeOut: 5000})
            });
	};

    $scope.resetModal = function() {
        $scope.sourceAlias = null;
        $scope.sourceUrl = null;
    }

}]);
