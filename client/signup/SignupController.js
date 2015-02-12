angular.module('Daas.signup', [])

.controller('SignupController', function($scope, $state){
  $scope.next = function(){
    $state.go('login');
  };
});