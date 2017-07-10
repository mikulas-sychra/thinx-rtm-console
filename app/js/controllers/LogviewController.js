/* Setup blank page controller */
angular.module('RTM').controller('LogviewController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
  $scope.$on('$viewContentLoaded', function() {

    console.log('#### Build Log Overlauy init')

  });

  function openSocket() {
    if ("WebSocket" in window) {
      if (typeof($rootScope.wss) == "undefined") {
        // open websocket
        console.log('## Opening websocket with credentials ##');
        $rootScope.wss = new WebSocket("wss://rtm.thinx.cloud:7444/" + $rootScope.profile.owner);

        $rootScope.wss.onopen = function() {
          console.log("## Websocket connection estabilished ##");

          if (typeof($rootScope.modalBuildId) !== "undefined") {
            $rootScope.wsstailLog($rootScope.modalBuildId)
          }
        };
        $rootScope.wss.onmessage = function (message) {
          console.log("-> ", message.data);

          var msgType = message.data.substr(2, 12);
          if (msgType == "notification") {
            var msgBody = JSON.parse(message.data);
            toastr.info(msgBody.notification.title, msgBody.notification.body, {timeOut: 2000})
          } else {

            // save build data to build buffer
            if (typeof($rootScope.modalBuildId) !== "undefined") {
              $rootScope.logdata[$rootScope.modalBuildId] = $rootScope.logdata[$rootScope.modalBuildId] + "\n" + message.data;
            }

            $rootScope.logdata.buffer = $rootScope.logdata.buffer + "\n" + message.data;
          }
        };
        $rootScope.wss.onclose = function() {
          console.log("## Websocket connection is closed... ##");
        };
      } else {
        // websocket already open
        console.log("## Websocket status:", $rootScope.wss.readyState, " ##");
      }
    } else {
      // The browser doesn't support WebSocket
      toastr.error("Error", "WebSocket NOT supported by your Browser!", {timeOut: 5000})
    }
  }
  console.log('##### websocket init')
  openSocket();

  $rootScope.$on("showLogOverlay", function(event, build_id) {
    console.log('firetwice event');
    console.log(event);
    // $event.stopPropagation();
    // $scope.showLogOverlay(build_id);
    $rootScope.showLog(build_id);
  });

  $rootScope.wsstailLog = function(build_id) {
    console.log('-- refreshing log: ', build_id)
    var message = {
      logtail: {
        owner_id: $rootScope.profile.owner,
        build_id: build_id
      }
    }
    // $rootScope.logdata.buffer[$rootScope.modalBuildId] = "";
    $rootScope.logdata[build_id] = "";
    $rootScope.modalBuildId = build_id;
    $rootScope.wss.send(JSON.stringify(message));
  }

  $rootScope.hideLogOverlay = function(build_id) {
    console.log('--- hiding log overlay --- ');
    $('.log-view-overlay-conatiner').fadeOut();
    console.log($rootScope.logdata.watchers[build_id]);
    clearInterval($rootScope.logdata.watchers[build_id]);
  }


  $rootScope.showLog = function(build_id) {

    console.log('--[ logdata ]-- ');
    console.log($rootScope.logdata);
    console.log('--- opening log for build_id: ' + build_id, ' ---');
    $('.log-view-overlay-conatiner').fadeIn();

    // start auto refresh
    console.log('--- starting refresh timer --- ');
    $rootScope.logdata.watchers[build_id] = setInterval(function(){
      console.log('Refreshing log view...');
      $rootScope.$digest();
    }, 500);

    $rootScope.modalBuildId = build_id;

    if (typeof($rootScope.wss) !== "undefined") {
      console.log('Socket ready, tailing log...');
      $rootScope.wsstailLog(build_id);
    } else {
      console.log('Socket not ready, trying to open it...')
      openSocket();
    }
  }

  $rootScope.switchWrap = function() {
    console.log('--- toggle word-wrap --- ');
    $('.log-view-body').toggleClass('force-word-wrap');
    $('.icon-frame').toggleClass('overlay-highlight');
  }

}]);
