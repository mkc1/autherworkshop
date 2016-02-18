'use strict';

app.factory('SignupFactory', function ($http) {
  return {
    signupUser: function (user) {
      return $http.post('/signup', user)
              .then(function(response){
                return response.data
              })
    }
  }
});