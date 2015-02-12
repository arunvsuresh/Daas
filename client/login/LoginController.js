angular.module('Daas.login', [])

.controller('LoginController', function($scope, $state){
  $scope.next = function(){
    $state.go('home');
  }
});