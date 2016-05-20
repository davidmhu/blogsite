(function() {

  angular
    .module('blogsiteApp')
    .controller('articleViewCtrl', articleViewCtrl);

  articleViewCtrl.$inject = ['$scope', 'authentication', '$routeParams', 'blogsiteData'];

  function articleViewCtrl($scope, authentication, $routeParams, blogsiteData) {
    
    var vm = this,queryStr='';
    vm.article={};vm.comment='';vm.reply='';
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();

    if (!$routeParams.hasOwnProperty('blogid') || $routeParams.blogid==='new') {
      return;
    }
    vm.blogid=$routeParams.blogid;

    vm.showReply=function(commentId){
      vm.replyForm=[];vm.replyForm.push(commentId);
    };

    vm.saveReply=function(commentId){
      saveCommentOrReply(commentId,vm.reply);
    };

    vm.saveComment=function(){
      saveCommentOrReply(0,vm.comment);
    };

    var saveCommentOrReply=function(parentId,commentStr){
      if (!commentStr.trim() ){
        alert('empty comment');//need to modify
        return;
      }
      if ( commentStr.length>255){
        alert('comment max length is 255');
        return;
      }
      var postdata={parentId:parentId,comment:commentStr};
      blogsiteData.saveComment($routeParams.blogid,postdata)
        .success(function(data){
          vm.message='comment saved successfully';//need to add 
          vm.comment="";vm.reply='';vm.replyForm=[];
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

    var assemble=function(comments,map){
      var list=[],child_comments=[];
      comments.forEach(function(comment){
        list.push(comment);
        child_comments=map[comment._id];
        if (child_comments) {
          list=list.concat(assemble(child_comments,map));
        }
      });
      return list;
    };

    var getComments=function(blogid){
      var list=[],child_map=[],matches=[],parent_id;
      blogsiteData.getCommentList(blogid)
      .success(function(data){
        //vm.commentList=data;
        data.forEach( function(comment) {
          if (comment.depth===0) {
             list.push(comment);
          }else{
            matches=comment.path.match(/([\d|\w]+)$/);
            parent_id=matches[0];
            if (parent_id) {
              if (!child_map[parent_id]) {
                child_map[parent_id]=[];
              }
              child_map[parent_id].push(comment);
              //console.log(child_map[parent_id]);
            }
          }
        }); 

        vm.commentList=assemble(list,child_map);
      })
      .error(function(e){
        vm.message="Sorry, something's gone wrong,get comment failed, please try again later";
      }); 
    };

    getBlogDetail(vm.blogid);
    getComments(vm.blogid);

  }

})();