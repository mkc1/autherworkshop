'use strict';

app.controller('LoginCtrl', function ($scope, $state, LoginFactory) {
  $scope.submitLogin = function (user) {
      LoginFactory.loginUser(user)
      .then(function(res){
        
        $state.go('stories')
      });
  }
});
