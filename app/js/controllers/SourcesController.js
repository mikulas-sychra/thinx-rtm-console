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

	function removeSource(index) {
		console.log(sourceUrl);
		var removeSource = {
			method: 'POST',
			url: 'http://thinx.cloud:7442/api/user/source/remove',
			data: { source_id: index }
		}

		$http(removeSource).then(
			function (removeSourceResponse) {
				console.log('--remove source success--');
				console.log('remove source response:');
				console.log(addSourceResponse);

			},
			function (removeSourceResponse) {
				console.log('--remove source failure--');
				console.log('remove source request:');
				console.log(removeSource);
				console.log('remove source response:');
				console.log(removeSourceResponse);
			}
		);
	}


	function addSource(sourceUrl) {
		console.log(sourceUrl);
		var addSource = {
			method: 'POST',
			url: 'http://thinx.cloud:7442/api/user/source/add',
			data: { source_url: sourceUrl }
		}

		$http(addSource).then(
			function (addSourceResponse) {
				console.log('--add source success--');
				console.log('add source response:');
				console.log(addSourceResponse);

			},
			function (addSourceResponse) {
				console.log('--add source failure--');
				console.log('add source request:');
				console.log(addSource);
				console.log('add source response:');
				console.log(addSourceResponse);
			}
		);
	}

});