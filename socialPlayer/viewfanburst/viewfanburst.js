'use strict';

angular.module('socialPlayer.fanburst', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fanburst', {
    templateUrl: 'viewfanburst/viewfanburst.html',
    controller: 'viewfanburstCtrl'
  });
}])

.controller('viewfanburstCtrl', function($scope, $http) {

  $http.get("https://api.fanburst.com/users/2gg1gk/tracks?client_id=88a8ac29-a685-43d8-8dd5-a46cc3f07ac7")
     .then( function(resp) {
       $scope.album = resp.data;
     }
     , function(x, status, error) {
        console.log(error);
     });
});
