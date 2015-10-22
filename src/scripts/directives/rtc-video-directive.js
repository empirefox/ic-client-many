'use strict';

/* globals videojs */
angular.module('rooms.directive.rtc-videojs', ['pascalprecht.translate']).directive('rtcVideojs', [
  '$translate',
  function($translate) {
    return {
      priority: 99, // it needs to run after the attributes are interpolated
      restrict: 'E',
      template: '',
      scope: {
        videoOptions: '=',
        room: '=',
        camera: '=',
      },
      link: function(scope, element) {
        var options = scope.videoOptions || {
          'techOrder': ['html5'],
          'controls': true,
          'controlBar': {
            'timeDivider': false,
            'durationDisplay': false,
            'remainingTimeDisplay': false,
            'progressControl': false,
          },
          'language': $translate.use(),
        };

        var video;
        var player;

        var init = function() {
          element.html('<video class="video-js vjs-default-skin vjs-big-play-centered col-md-10 col-sm-12"></video>');
          video = element.find('video')[0];
          options.aspectRatio = scope.camera.Width + ':' + scope.camera.Height;
          player = videojs(video, options, function() {
            var call_ = scope.room.calls[scope.camera.Id];
            if (call_) {
              call_.bindto(video);
            }
          });

          player.play = function() {
            var camera_ = scope.camera;
            var call_ = scope.room.calls[camera_.Id];
            if (call_) {
              call_.bindto(video);
            } else {
              scope.room.startCall(camera_.Id, video, camera_.HasVideo, camera_.HasAudio);
            }
          };

          player.pause = function() {
            video.pause();
            scope.room.removeCall(scope.camera.Id);
            player.src('');
            player.dispose();
            init();
          };
        };

        init();

        scope.$watch(function() {
          return $translate.use();
        }, function() {
          player.language($translate.use());
        });

        scope.$on('$destroy', function() {
          var call_ = scope.room.calls[scope.camera.Id];
          if (call_) {
            call_.unbindto(video);
          }
          player.dispose();
        });
      },
    };
  }
]);
