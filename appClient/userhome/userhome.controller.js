(function() {

  angular
    .module('blogsiteApp')
    .controller('userhomeCtrl', userhomeCtrl);

  userhomeCtrl.$inject = ['$scope', '$location', '$routeParams', 'blogsiteData', 'authentication'];

  function userhomeCtrl($scope, $location, $routeParams, blogsiteData, authentication) {
    var vm = this,
      email;

    if (authentication.isLoggedIn()) {
      if ($routeParams.hasOwnProperty('email')) {
        email = $routeParams.email;
      } else {
        email = authentication.currentUser().email;
      }
      doViewUserInfo(email);
    } else {
      $location.path('/login');
    }

    function doViewUserInfo(email) {

      blogsiteData.getUserinfo(email)
        .success(function(data) {
          vm.message = data ? "" : "No user found";
          vm.user = data;
          $scope.navvm.currentUser.name = data.name;
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong, please try again later";
        });
    }

  }

})();