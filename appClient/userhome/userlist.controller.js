(function() {

    angular
        .module('blogsiteApp')
        .controller('userlistCtrl', userlistCtrl);

    userlistCtrl.$inject = ['$scope','$location', 'blogsiteData', 'authentication'];

    function userlistCtrl( $scope,$location, blogsiteData, authentication) {
        var vm = this;
        vm = {
            curpage: 1,
            pagesize: 8,
            queryCond: {},
            rowcnt: 0,
            pagecnt: 1,
            pageArr: [],
            topage: function(curpage) {
                getListpage(curpage);
            }
        };
        
        var getListpage = function(curpage) {

            blogsiteData.getListpage(curpage, vm.pagesize, vm.queryCond)
                .success(function(data) {
                    vm.userlist = data.userlist;
                    $scope.vm.userlist = vm.userlist;
                    vm.rowcnt = data.rowcnt;
                    vm.pagecnt = Math.ceil(vm.rowcnt / vm.pagesize);
                    vm.curpage = curpage;
                    vm.pageArr = getPageArr(vm.pagecnt, vm.curpage);
                    $scope.vm=vm;//this is important
                    //console.log(vm.pagecnt);console.log(vm.pageArr);
                })
                .error(function(e) {
                    vm.message = "Sorry, something's gone wrong: " + e.message;
                });
        };

        getListpage(1);
        var getPageArr = function(pagecnt, curpage) {
            var pages = [],
                startno = 1,
                endno = pagecnt;
            if (curpage < 1 || curpage > pagecnt || pagecnt < 1) return pages;
            if (pagecnt > 5) {
                if (curpage <= 3) {
                    endno = 5;
                } else {
                    startno = curpage - 2;
                    endno = Math.min(pagecnt, curpage + 2);
                }
                if (endno - startno < 4 && endno > 5) {
                    startno = endno - 4;
                }

            }
            console.log(startno + ' ' + endno + ' ' + pagecnt + ' ' + curpage);
            for (var i = startno; i <= endno; i++) {

                pages.push(i);
            }
            return pages;

        };

    }

})();