(function() {

    angular
        .module('blogsiteApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function loginCtrl($scope, $location, blogsiteData, authentication) {
        var vm = this;
        //vm.user={password:'eat-the-living',email:'davidmhu@sina.com.cn'};
        vm.user = {};
        vm.check = '';
        vm.emailChanged = function() {
            vm.check = '';
            console.log('changed');
        };
        vm.checkEmail = function() {//need to complete
            vm.check = '√';
        };
        vm.submit = function() {
            vm.message = '';
            if ($scope.loginForm.$pristine) {
                vm.message = 'Please fill the form first before you submit';
                return;
            }
            if ($scope.loginForm.$invalid) {
                vm.message = 'There are errors in the form ,please correct them';
                return;
            }
            if (!vm.user.password1 || vm.user.password1 !== vm.user.password2) {
                vm.message = 'not valid password or two passwords not equal';
                return;
            }
            vm.user.password = vm.user.password1;
            //vm.message = 'logining';
            authentication.login(vm.user); //need to modify
            blogsiteData.getUserinfo()
                .success(function(data) {
                    vm.message = " user is logined";
                    vm.user = data;
                })
                .error(function(e) {
                    vm.message = "Sorry, something's gone wrong, please try again later";
                    return;
                });
            authentication.login(vm.user);
            $location.path('/');

        };



        //vm.showError = function (error) {
        //$scope.$apply(function() {
        //  vm.message = error.message;
        //});
        //};

    }

})();