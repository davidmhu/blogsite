(function () {

  angular
    .module('blogsiteApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location','authentication'];
  function navigationCtrl( $location,authentication) {
    var vm = this;
    vm.test='123';
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    vm.logout = function() {
      authentication.logout();
      //$scope.$apply(function(){
        $location.path('/');
      //});
    };
    vm.currentPath = $location.path();
  }
})();