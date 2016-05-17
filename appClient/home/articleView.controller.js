(function() {

  angular
    .module('blogsiteApp')
    .controller('articleViewCtrl', articleViewCtrl);

  articleViewCtrl.$inject = ['$scope', 'authentication', '$routeParams', 'blogsiteData'];

  function articleViewCtrl($scope, authentication, $routeParams, blogsiteData) {
    
    var vm = this,queryStr='';
    vm.article={};vm.comment='';
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();

    if (!$routeParams.hasOwnProperty('blogid') || $routeParams.blogid==='new') {
      return;
    }
    vm.blogid=$routeParams.blogid;

    vm.saveComment=function(){
      if (!vm.comment.trim() ){
        alert('empty comment');//need to modify
        return;
      }
      if ( vm.comment.length>255){
        alert('comment max length is 255');
        return;
      }
      var postdata={comment:vm.comment};
      blogsiteData.saveComment($routeParams.blogid,postdata)
        .success(function(data){
          vm.message='comment saved successfully';//need to add 
          vm.comment="";
          getComments(vm.blogid);
        })
        .error(function(e) {
          vm.message = "Sorry, something's gone wrong,save comment failed, please try again later";
        });
    };

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

    var getComments=function(blogid){
      blogsiteData.getCommentList(blogid)
      .success(function(data){
        vm.commentList=data;//console.log(data);
      })
      .error(function(e){
        vm.message="Sorry, something's gone wrong,get comment failed, please try again later";
      }); 
    };


    getBlogDetail(vm.blogid);
    getComments(vm.blogid);

  }

})();