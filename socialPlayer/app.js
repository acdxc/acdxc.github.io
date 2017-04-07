'use strict';

angular.module('socialPlayer', [
  'ngRoute',
  'socialPlayer.jamendo',
  'socialPlayer.fanburst',
  'socialPlayer.soundcloud',
  'socialPlayer.jwplayer',
  'socialPlayer.youtube'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/jamendo'});
}]).
run( function($rootScope){

  $rootScope.$on('$routeChangeSuccess', function() {
      var current = location.href;
      $('.navbar-collapse ul li').each(function(){
              if(current.indexOf($('a', this).attr('href')) !== -1){
                $(this).addClass('active');
              } else{
                $(this).removeClass('active');
              }
          });
  });

  $('.navbar-collapse ul li').click(function() {
      $(this).addClass('active').siblings().removeClass('active');
  });

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
      $(this).closest('.collapse').collapse('toggle');
  });
});
