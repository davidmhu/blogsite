(function() {

    angular
        .module('blogsiteApp')
        .controller('userlistCtrl', userlistCtrl);

    userlistCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function userlistCtrl($scope, $location,blogsiteData, authentication) {
        var vm = this;
        vm={curpage:1,pagesize:8,queryCond:{},rowcnt:0,pagecnt:1};
        vm.getListpage(1);
        
        vm.getListpage=function(curpage) {
            
            blogsiteData.getListpage(curpage,vm.pagesize,vm.queryCond)
            .success(function(data) {
                vm.userlist = data.userlist;
                $scope.vm.userlist=vm.userlist;
                vm.rowcnt=data.rowcnt;
                vm.pagecnt=Math.ceil(vm.pagesize/vm.rowcnt);
                //console.log(vm.rowcnt);console.log(vm.userlist);
                $scope.vm.rowcnt=vm.rowcnt;
                $scope.vm.pagecnt=vm.pagecnt;
                $scope.vm.curpage=vm.curpage=curpage;
                
            })
            .error(function(e) {
                vm.message = "Sorry, something's gone wrong: "+e.message;
            });
        };
        
    }

})();