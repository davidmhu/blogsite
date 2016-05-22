(function() {

  angular
    .module('blogsiteApp')
    .controller('articleEditCtrl', articleEditCtrl);

  articleEditCtrl.$inject = ['$scope', 'authentication', 'blogsiteData'];

  function articleEditCtrl($scope, authentication, blogsiteData) {
    var vm = this,queryStr='';
    vm.article={};
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    
    vm.saveBlog=function(){
      alert('new blog save');
    };   

    

  }

})();