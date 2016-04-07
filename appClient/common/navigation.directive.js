(function () {

  angular
    .module('blogsiteApp')
    .directive('navigation', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/common/navigation.template.html',
      controller: 'navigationCtrl as navvm'
    };
  }

})();