(function() {

    angular
        .module('blogsiteApp')
        .controller('userlistCtrl', userlistCtrl);

    userlistCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function userlistCtrl($scope, $location,blogsiteData, authentication) {
        var vm = this;
        vm={page:1,pagesize:5,queryCond:{},rowcnt:0};
        blogsiteData.getListpage(vm.page,vm.pagesize,vm.queryCond)
            .success(function(data) {
                vm.userlist = data.userlist;
                $scope.vm.userlist=vm.userlist;
                vm.rowcnt=data.rowcnt;
                console.log(vm.rowcnt);console.log(vm.userlist);
                $scope.vm.rowcnt=vm.rowcnt;
                
            })
            .error(function(e) {
                vm.message = "Sorry, something's gone wrong: "+e.message;
            });
        
        
    }

})();