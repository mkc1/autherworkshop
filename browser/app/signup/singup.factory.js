'use strict';

app.factory('SignupFactory', function ($http, LoginFactory) {
  return {
    signupUser: function (user) {
      return $http.post('/signup', user)
              .then(function(response){
                LoginFactory.currentUser = response.data;
                return response.data
              })
      }
  }
});