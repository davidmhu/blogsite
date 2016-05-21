(function() {

  angular
    .module('blogsiteApp')
    .controller('articleViewCtrl', articleViewCtrl);

  articleViewCtrl.$inject = ['$scope', 'authentication', '$routeParams', 'blogsiteData'];

  function articleViewCtrl($scope, authentication, $routeParams, blogsiteData) {
    var vm = this,queryStr='';
    vm.article={};
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();

    if (!$routeParams.hasOwnProperty('blogid') || $routeParams.blogid==='new') {
      return;
    }
    vm.blogid=$routeParams.blogid;

    

    var getBlogDetail=function(blogid){
      blogsiteData.getBlogDetail(blogid)
        .success(function(data) {
          vm.message = data ? "" : "No user found";
          vm.article=data;
          //console.log(vm.article.length);
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong, get blog info failed,please try again later";
        });
    };

    getBlogDetail(vm.blogid);

  }

})();