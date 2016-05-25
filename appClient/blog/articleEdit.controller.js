(function() {

  angular
    .module('blogsiteApp')
    .controller('articleEditCtrl', articleEditCtrl);

  articleEditCtrl.$inject = ['$scope', '$location', 'authentication', 'blogsiteData'];

  function articleEditCtrl($scope, $location, authentication, blogsiteData) {
    var vm = this,
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
    vm.saveBlog = function() {
      alert(vm.article.content);
      var postdata = {
        userEmail: vm.currentUser.email,
        userName: vm.currentUser.name,
        title: vm.article.title,
        content: vm.article.content,
        category: 'Movie|Tech'
      };
      blogsiteData.saveBlog(postdata)
        .success(function(data) {
          console.log('_id='+data._id);
          $location.path('/#/blog/'+data._id);

        })
        .error(function(e) {
          alert('save blog failed'); //need to modify
        });
    };



  }

})();