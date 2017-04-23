'use strict';

RTM.controller('SourcesController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
    });

	$scope.addSource = function(sourceUrl) {
		addSource(sourceUrl);
	};

	$scope.removeSource = function(index) {
		removeSource(index);
	};

});