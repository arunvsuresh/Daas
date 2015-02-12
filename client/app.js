var app = angular.module('Daas', [
  'ui.router',
  'Daas.home',
  'Daas.login',
  'Daas.signup'
  ])

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'HomeController'
    })
    .state('login', {
      url:'/login',
    	templateUrl: 'login/login.html',
      controller: 'LoginController'
    })
    .state('signup', {
      url:'/signup',
      templateUrl: 'signup/signup.html',
      controller: 'SignupController'
    });
  $urlRouterProvider.otherwise('/');
});
