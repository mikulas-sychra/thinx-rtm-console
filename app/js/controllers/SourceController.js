/* Setup blank page controller */
angular.module('MetronicApp').controller('SourceController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.addSource = function() {
	
        console.log('-- adding new source --'); 

        var jqxhr = Thinx.addSource($('#pageModal input[name=sourceUrl]').val(), $('#pageModal index[name=sourceName]').val())
            .done(function(response) {
                
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);
                    } else {
                        console.log(response);
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
            });

	};

	$scope.removeSource = function(index) {

		console.log('-- removing source ' + index + '--'); 

        var jqxhr = Thinx.removeSource(index)
            .done(function(response) {
                if (typeof(response) !== 'undefined') {
                    if (response.success) {
                        console.log(response);
                    } else {
                        console.log(response);
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
            });
	};

}]);
