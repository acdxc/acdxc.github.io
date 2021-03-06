'use strict';

angular.module('socialPlayer.jamendo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/jamendo', {
    templateUrl: 'viewjamendo/viewjamendo.html',
    controller: 'viewjamendoCtrl'
  });
}])

.controller('viewjamendoCtrl', function($scope, $http) {

  $http.get("https://api.jamendo.com/v3.0/albums?client_id=20e4ccc5&format=jsonpretty&artist_id=498614")
    .then( function(resp0) {
      $scope.albums = resp0.data.results;
      $scope.alltracks = [];
      $scope.position = 0;

      angular.forEach($scope.albums, function(value0, key0) {
        $http.get("https://api.jamendo.com/v3.0/albums/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value0.id)
           .then( function(resp) {
            $scope.album = resp.data.results[0];

            //album zip file => default to mp32
            // $scope.album.zipMp31 = resp.data.results[0].zip.replace('mp32','mp31');
            // $scope.album.zipOgg = resp.data.results[0].zip.replace('mp32','ogg1');
            // $scope.album.zipFlac = resp.data.results[0].zip.replace('mp32','flac');


            angular.forEach($scope.album.tracks, function(value, key) {
                $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id)
                   .then( function(resp1) {

                     $scope.position = $scope.alltracks.length;

                      // $scope.alltracks[value.position-1] = resp1.data.results[0];
                      // $scope.alltracks[value.position-1].mp32 = resp1.data.results[0].audiodownload; //audiodownload => default to mp32

                      $scope.alltracks[$scope.position] = resp1.data.results[0];
                      $scope.alltracks[$scope.position].mp32 = resp1.data.results[0].audiodownload; //audiodownload => default to mp32

                      var pos = $scope.position;
                      $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id + "&audioformat=mp31")
                            .then( function(resp2) {
                              // $scope.alltracks[value.position-1].mp31 = resp2.data.results[0].audiodownload;
                              $scope.alltracks[pos].mp31 = resp2.data.results[0].audiodownload;
                            }, function(x, status, error) {
                               console.log(error);
                            });
                      $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id + "&audioformat=ogg")
                             .then( function(resp3) {
                              //  $scope.alltracks[value.position-1].ogg = resp3.data.results[0].audiodownload;
                               $scope.alltracks[pos].ogg = resp3.data.results[0].audiodownload;
                             }, function(x, status, error) {
                                console.log(error);
                             });
                      $http.get("https://api.jamendo.com/v3.0/tracks/?client_id=20e4ccc5&format=jsonpretty&id=" + value.id + "&audioformat=flac")
                            .then( function(resp4) {
                              // $scope.alltracks[value.position-1].flac = resp4.data.results[0].audiodownload;
                              $scope.alltracks[pos].flac = resp4.data.results[0].audiodownload;
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
 }, function(x, status, error) {
   console.log(error);
 });
});
