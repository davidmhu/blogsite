(function () {

  angular
    .module('blogsiteApp')
    .directive('commentedit', commentEdit);

  function commentEdit () {
    return {
      restrict: 'EA',
      templateUrl: '/blog/commentEdit.template.html',
      controller: 'commentEditCtrl as cmteditVm',
      scope: { blogid:'=blogId' }
    };
  }

})();