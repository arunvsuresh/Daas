angular.module('Daas.home', [])

.controller('HomeController', function($scope, $state){
  $scope.next = function(){
    $state.go('signup');
  };
});