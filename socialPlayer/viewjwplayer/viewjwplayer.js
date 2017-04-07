'use strict';

angular.module('socialPlayer.jwplayer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/jwplayer', {
    // templateUrl: 'viewjwplayer/viewjwplayer.html',
    templateUrl: 'viewjwplayer/viewjwplayer.html',
    controller: 'viewjwplayerCtrl'
  });
}])

.controller('viewjwplayerCtrl', function($scope) {



});
