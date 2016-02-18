'use strict';

app.factory('LoginFactory', function ($http, $state, $log) {
  return {
    loginUser: function (user) {
      return $http.post('/login', user)
              .then(function(response){
                return response.data
              })
    }
  }
});