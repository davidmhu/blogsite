(function() {

  angular
    .module('blogsiteApp')
    .controller('commentCtrl', commentCtrl);

  commentCtrl.$inject = ['$scope','authentication', 'blogsiteData'];

  function commentCtrl($scope,authentication, blogsiteData) {
    var cmtVm=this;
    var blogid=cmtVm.blogid=$scope.blogid;

    cmtVm.comment='';cmtVm.reply='';
    cmtVm.isLoggedIn = authentication.isLoggedIn();
    cmtVm.currentUser = authentication.currentUser();
    console.log(cmtVm);

    var assemble = function(comments, map) {
      var list = [],
        child_comments = [];
      comments.forEach(function(comment) {
        list.push(comment);
        child_comments = map[comment._id];
        if (child_comments) {
          list = list.concat(assemble(child_comments, map));
        }
      });
      return list;
    };

    cmtVm.showReply=function(commentId){
      cmtVm.replyForm=[];cmtVm.replyForm.push(commentId);
    };

    cmtVm.saveReply=function(commentId){
      saveCommentOrReply(commentId,cmtVm.reply);
    };

    cmtVm.saveComment=function(){
      saveCommentOrReply(0,cmtVm.comment);
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
      blogsiteData.saveComment(blogid,postdata)
        .success(function(data){
          cmtVm.message='comment saved successfully';//need to add 
          cmtVm.comment="";cmtVm.reply='';cmtVm.replyForm=[];
          getComments(cmtVm.blogid);
        })
        .error(function(e) {
          cmtVm.message = "Sorry, something's gone wrong,save comment failed, please try again later";
        });
    };

    var getComments = function(blogid) {
      var list = [],
        child_map = [],
        matches = [],
        parent_id;
      blogsiteData.getCommentList(blogid)
        .success(function(data) {
          //cmtVm.commentList=data;
          data.forEach(function(comment) {
            if (comment.depth === 0) {
              list.push(comment);
            } else {
              matches = comment.path.match(/([\d|\w]+)$/);
              parent_id = matches[0];
              if (parent_id) {
                if (!child_map[parent_id]) {
                  child_map[parent_id] = [];
                }
                child_map[parent_id].push(comment);
                //console.log(child_map[parent_id]);
              }
            }
          });

          cmtVm.commentList = assemble(list, child_map);
        })
        .error(function(e) {
          cmtVm.message = "Sorry, something's gone wrong,get comment failed, please try again later";
        });
    };
     getComments(blogid);
  }
})();