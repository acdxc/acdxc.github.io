'use strict';

angular.module('socialPlayer.soundcloud', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/soundcloud', {
    templateUrl: 'viewsoundcloud/viewsoundcloud.html',
    controller: 'viewsoundcloudCtrl'
  });
}])

.controller('viewsoundcloudCtrl', function($scope) {



});
