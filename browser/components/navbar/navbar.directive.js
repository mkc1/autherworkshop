'use strict';

app.directive('navbar', function ($state, $location, $http, $log) {
	return {
		restrict: 'E',
		templateUrl: '/browser/components/navbar/navbar.html',
		link: function (scope) {
			scope.pathStartsWithStatePath = function (state) {
				var partial = $state.href(state);
				var path = $location.path();
				return path.startsWith(partial);
			};
          
            scope.logoutUser = function (){
              $http.post('/logout')
              .then(function(res){
                $state.go('home')
              })
            .catch($log.error)
            }
		}
	}
});