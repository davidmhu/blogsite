(function () {

  angular
    .module('blogsiteApp')
    .directive('comment', comment);

  function comment () {
    return {
      restrict: 'EA',
      templateUrl: '/common/comment.template.html',
      controller: 'commentCtrl as cmtVm',
      scope: { blogid:'=blogId' }
    };
  }

})();