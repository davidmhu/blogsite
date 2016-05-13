(function() {

  angular
    .module('blogsiteApp')
    .controller('articleViewCtrl', articleViewCtrl);

  articleViewCtrl.$inject = ['$scope', '$location', '$routeParams', 'blogsiteData'];

  function articleViewCtrl($scope, $location, $routeParams, blogsiteData) {
    
    var vm = this,queryStr='';
    vm.article={};
    
    if (!$routeParams.hasOwnProperty('blogid')) {
      console.log('no id');return;
    }
    console.log($routeParams.blogid);
    blogsiteData.getBlogDetail($routeParams.blogid)
        .success(function(data) {
          vm.message = data ? "" : "No user found";
          vm.article=data;
          console.log(vm.bloglist.length);
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong, please try again later";
        });
    
  }

})();