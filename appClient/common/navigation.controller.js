(function () {

  angular
    .module('blogsiteApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$scope','$location', 'authentication'];
  function navigationCtrl($scope,$location, authentication) {
    var vm = this;

    vm.currentPath = $location.path();

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();

    vm.logout = function() {
      authentication.logout();
      //$scope.$apply(function(){
        $location.path('/');
      //});
    };

  }
})();