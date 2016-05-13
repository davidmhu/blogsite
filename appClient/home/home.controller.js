(function() {

  angular
    .module('blogsiteApp')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$scope', '$location', '$routeParams', 'blogsiteData'];

  function homeCtrl($scope, $location, $routeParams, blogsiteData) {
    
    var vm = this,queryStr='';
    vm.bloglist={};
    
    if ($routeParams.hasOwnProperty('email')) {
      queryStr='?userEmail='+$routeParams.email;
    }
    blogsiteData.getBlogList(queryStr)
        .success(function(data) {
          vm.message = data ? "" : "No user found";
          vm.bloglist=data;
          console.log(vm.bloglist.length);
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong, please try again later";
        });
    
  }

})();