(function() {

  angular
    .module('blogsiteApp')
    .controller('articleEditCtrl', articleEditCtrl);

  articleEditCtrl.$inject = ['$scope', '$location', 'authentication', '$routeParams','blogsiteData'];

  function articleEditCtrl($scope, $location, authentication, $routeParams,blogsiteData) {
    var vm = this,ueditor,
      queryStr = '';
    vm.article = {};
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
    vm.config = {
      toolbars: [
        [
          'fullscreen', 'source', '|', 'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
          'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
          'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
          'directionalityltr', 'directionalityrtl', 'indent', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
          'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
          'simpleupload', 'insertimage', 'emotion', 'scrawl', 'pagebreak', 'template', 'background', '|',
          'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
          'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
          'searchreplace', 'help', 'drafts'
        ]
      ],
      autoHeightEnabled: true

    };

    vm.ready=function(editor){
      ueditor=editor; 
    };

    vm.saveBlog = function() {
      var plaintxt=ueditor.getContentTxt();alert(plaintxt);
      if (!vm.article.title || !vm.article.content){
        alert('title and content should not be empty');
        return;//need to modify
      }
      //alert(vm.article.content);return;
      var postdata = {
        userEmail: vm.currentUser.email,
        userName: vm.currentUser.name,
        title: vm.article.title,
        content: vm.article.content,
        category: 'Movie|Tech' //need to modify
      };

      postdata.brief=plaintxt?plaintxt.substr(0,50):vm.article.content.substr(0,50);
      blogsiteData.saveBlog(postdata)
        .success(function(data) {
          $location.path('/#/blog/'+data._id);

        })
        .error(function(e) {
          alert('save blog failed'); //need to modify
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

    vm.blogid=$routeParams.hasOwnProperty('blogid')?$routeParams.blogid:'';

    if (vm.blogid) {
      getBlogDetail(vm.blogid);
    }
  }

})();