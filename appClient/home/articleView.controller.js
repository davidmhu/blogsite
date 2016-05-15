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
    vm.comment='';
    vm.saveComment=function(){
      if (!vm.comment.trim() ){
        alert('empty comment');//need to modify
        return;
      }
      if ( vm.comment.length>255){
        alert('comment max length is 255');
        return;
      }
    };
    blogsiteData.getBlogDetail($routeParams.blogid)
        .success(function(data) {
          vm.message = data ? "" : "No user found";
          vm.article=data;
          console.log(vm.article.length);
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong, please try again later";
        });
    
  }

})();