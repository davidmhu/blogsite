angular.module('blogsiteApp', ['ui.bootstrap']);

var indexCtrl = function () {
  self.linkname='angular test';
};

var navibarCtrl=function($modal) {
	var self=this;
	self.popupLoginForm=function(){
		alert('Let\' log on');
	}
};

var bloglistCtrl=function(){

};
angular.module('blogsiteApp')
.controller('indexCtrl', indexCtrl)
.controller('navibarCtrl',navibarCtrl)
.controller('bloglistCtrl',bloglistCtrl)
;
