'use strict';

angular.module('socialPlayer.jamendo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/jamendo', {
    templateUrl: 'viewjamendo/viewjamendo.html',
    controller: 'viewjamendoCtrl'
  });
}])

.controller('viewjamendoCtrl', function($scope, $http) {

  $http.get("https://api.jamendo.com/v3.0/albums/tracks/?client_id=20e4ccc5&format=jsonpretty&id=167064")
     .then( function(resp) {
      $scope.album = resp.data.results[0];
      //album zip file => default to mp32
      $scope.album.zipMp31 = resp.data.results[0].zip.replace('mp32','mp31');
      $scope.album.zipOgg = resp.data.results[0].zip.replace('mp32','ogg1');
      $scope.album.zipFlac = resp.data.results[0].zip.replace('mp32','flac');

      $scope.alltracks = [];
      angular.forEach($scope.album.tracks, function(value, key) {
          $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id)
             .then( function(resp1) {
                $scope.alltracks[value.position-1] = resp1.data.results[0];
                $scope.alltracks[value.position-1].mp32 = resp1.data.results[0].audiodownload; //audiodownload => default to mp32

                $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id + "&audioformat=mp31")
                      .then( function(resp2) {
                        $scope.alltracks[value.position-1].mp31 = resp2.data.results[0].audiodownload;
                      }, function(x, status, error) {
                         console.log(error);
                      });
                $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id + "&audioformat=ogg")
                       .then( function(resp3) {
                         $scope.alltracks[value.position-1].ogg = resp3.data.results[0].audiodownload;
                       }, function(x, status, error) {
                          console.log(error);
                       });
                $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id + "&audioformat=flac")
                      .then( function(resp4) {
                        $scope.alltracks[value.position-1].flac = resp4.data.results[0].audiodownload;
                      }, function(x, status, error) {
                         console.log(error);
                      });
             }, function(x, status, error) {
                console.log(error);
             });
      });
   }, function(x, status, error) {
     console.log(error);
   });
});
