(function() {

    angular
        .module('blogsiteApp')
        .controller('userhomeCtrl', userhomeCtrl);

    userhomeCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function userhomeCtrl($scope, $location,blogsiteData, authentication) {
        var vm = this;
        if (authentication.isLoggedIn()) {
            doViewUserInfo();
        } else {
            $location.path('/login');
        }
        
        function doViewUserInfo(){
            blogsiteData.getUserinfo()
                .success(function(data) {
                    vm.message = data ? "" : "No user found";
                    vm.user = data;
                    if (vm.user.birthday) {
                        vm.user.year=vm.user.birthday.getFullYear();
                        vm.user.month=vm.user.birthday.getMonth();
                        vm.user.day=vm.user.birthday.getDay();
                    }
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