(function() {

    angular
        .module('blogsiteApp')
        .controller('userEditCtrl', userEditCtrl);

    userEditCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function userEditCtrl($scope, $location,blogsiteData, authentication) {
        var vm = this;
        vm.years=[];vm.months=[];vm.days=[];
        vm.years.push('年');vm.months.push('月');vm.days.push('日');
        for (var i=1929;i<=2050;i++) {
            vm.years.push(i);
        }
        for (i=1;i<=12;i++) {
            vm.months.push(i);
        }
        for (i=1;i<=31;i++) {
            vm.days.push(i);
        }
        if (authentication.isLoggedIn()) {
            doViewUserInfo();
        } else {
            $location.path('/');
        }
        
        function doViewUserInfo(){
            blogsiteData.getUserinfo()
                .success(function(data) {
                    vm.message = data ? "" : "No user found";
                    vm.user = data;
                })
                .error(function(e) {
                    vm.message = "Sorry, something's gone wrong, please try again later";
                });
        }
        


        //vm.showError = function (error) {
        //$scope.$apply(function() {
        //  vm.message = error.message;
        //});
        //};

    }

})();