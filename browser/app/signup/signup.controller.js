'use strict';

app.controller('SignupCtrl', function ($scope, SignupFactory, $log, $state) {
  $scope.submitSignup = function(newUser){

    SignupFactory.signupUser(newUser)
    .then(function(){
      $state.go('stories')
    })
    .catch($log.error);
    
  }
});