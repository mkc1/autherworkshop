'use strict';

app.factory('LoginFactory', function ($http, $state, $log) {
  return {
    loginUser: function (user) {
      var self = this;
      return $http.post('/login', user)
              .then(function(response){
                self.currentUser = response.data;
                return response.data;
              })
      },
    currentUser: null
  }
});