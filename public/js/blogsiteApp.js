angular.module('blogsiteApp', []);

var indexCtrl = function () {
  this.linkname='angular test';
};

angular.module('blogsiteApp')
.controller('indexCtrl', indexCtrl);
