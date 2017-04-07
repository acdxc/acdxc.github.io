'use strict';

angular.module('socialPlayer.youtube', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/youtube', {
    templateUrl: 'viewyoutube/viewyoutube.html',
    controller: 'viewyoutubeCtrl'
  });
}])

.controller('viewyoutubeCtrl', function($scope) {

});
