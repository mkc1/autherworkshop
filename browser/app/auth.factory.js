// 'use strict';

app.factory('AuthFactory', function ($http, User) {
  return {
    logInType: function(userId) {
      User.findOne({_id : userId})
      .then(function(user) {
        return user.isAdmin;
      })
    },
    checkLoggedIn: function() {
      $http.get('/check')
      .then( function(response) {
        console.log('heres the response data', response.data)
        return response.data;
      })
    }
  }
})