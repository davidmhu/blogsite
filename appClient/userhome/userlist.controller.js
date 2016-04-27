(function() {

    angular
        .module('blogsiteApp')
        .controller('userlistCtrl', userlistCtrl);

    userlistCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function userlistCtrl($scope, $location, blogsiteData, authentication) {
        var vm = this;
        //$scope.showFilter = false;

        vm = {
            curpage: 1,showFilter : false,
            pagesize: 8,
            queryCond: {},
            sortCond: {name:-1},
            rowcnt: 0,
            pagecnt: 1,
            pageArr: [],
            querytxt: '',
            message: '',
            topage: function(curpage) {
                vm.message = '';
                getListpage(curpage);
            },
            queryFilter: function() {

                if (vm.querytxt) {
                    vm.queryCond.fuzzyname = true;
                    vm.queryCond.name = vm.querytxt;
                }else {
                    vm.queryCond.fuzzyname = false;
                    vm.queryCond.name=undefined;
                }
                console.log(vm.queryCond);
                getListpage(1);
            }
        };

        var getListpage = function(curpage) {
            blogsiteData.getListpage(curpage, vm.pagesize, vm.queryCond,vm.sortCond)
                .success(function(data) {
                    if (data.rowcnt) {
                        vm.userlist = data.userlist;
                        vm.rowcnt = data.rowcnt;
                        vm.pagecnt = Math.ceil(vm.rowcnt / vm.pagesize);
                        vm.curpage = curpage;
                        vm.pageArr = getPageArr(vm.pagecnt, vm.curpage);
                        vm.message = '';
                    } else {
                        vm.message = "Sorry,no corespondent users found";
                        vm.userlist = {};
                        vm.rowcnt = vm.pagecnt = 0;
                        vm.curpage = 1;
                        vm.pageArr = [];
                    }
                    $scope.vm = vm; //this is important
                    //console.log(vm.pagecnt);console.log(vm.pageArr);
                })
                .error(function(e) {
                    vm.message = "Sorry, something's gone wrong: " + e.message;
                    vm.userlist = {};
                    vm.rowcnt = vm.pagecnt = 0;
                    vm.curpage = 1;
                    vm.pageArr = [];
                    $scope.vm = vm; //this is important
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
            //console.log(startno + ' ' + endno + ' ' + pagecnt + ' ' + curpage);
            for (var i = startno; i <= endno; i++) {
                pages.push(i);
            }
            return pages;

        };

    }

})();