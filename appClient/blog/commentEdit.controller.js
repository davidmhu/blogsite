(function() {

  angular
    .module('blogsiteApp')
    .controller('commentEditCtrl', commentEditCtrl);

  commentEditCtrl.$inject = ['$scope','authentication', 'blogsiteData'];

  function commentEditCtrl($scope,authentication, blogsiteData) {
    var cmteditVm=this;
    var blogid=cmteditVm.blogid=$scope.blogid;

    cmteditVm.comment='';cmteditVm.reply='';
    cmteditVm.isLoggedIn = authentication.isLoggedIn();
    cmteditVm.currentUser = authentication.currentUser();
    console.log(cmteditVm);

    var assemble = function(comments, map) {
      var list = [],child_comments = [];
      comments.forEach(function(comment) {
        list.push(comment);
        child_comments = map[comment._id];
        if (child_comments) {
          list = list.concat(assemble(child_comments, map));
        }
      });
      return list;
    };


    cmteditVm.deleteCommentOrReply=function(commentId){
     var yesNo=confirm('Are you sure to erase this comment and its replies?');
     if (!yesNo) {
      return;
     }
     blogsiteData.deleteComment(commentId)
        .success(function(data){
          cmteditVm.message='comment saved successfully';//need to add 
          getComments(cmteditVm.blogid);
        })
        .error(function(e) {
          cmteditVm.message = "Sorry, something's gone wrong,save comment failed, please try again later";
        });
    };

    var getComments = function(blogid) {
      var list = [],
        child_map = [],
        matches = [],
        parent_id;
      cmteditVm.commentList=[];
      blogsiteData.getCommentList(blogid)
        .success(function(data) {
          //cmteditVm.commentList=data;
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

          cmteditVm.commentList = assemble(list, child_map);
        })
        .error(function(e) {
          cmteditVm.message = "Sorry, something's gone wrong,get comment failed, please try again later";
        });
    };

    getComments(blogid);
  }
})();