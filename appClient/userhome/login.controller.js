(function() {

    angular
        .module('blogsiteApp')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$location',  'authentication'];

    function loginCtrl($scope, $location,  authentication) {
        var vm = this;
        vm.credentials = {
            email: '',
            password: ''
        };
        vm.returnPage = $location.search().page || '/#';
        vm.submit = function() {
            vm.message = '';
            if ($scope.loginForm.$pristine) {
                vm.message = 'Please fill the form first before you submit';
                return false;
            }
            if (!vm.credentials.email || !vm.credentials.password) {
                vm.message = "All fields required, please try again";
                return false;
            }
            if ($scope.loginForm.$invalid) {
                vm.message = 'There are errors in the form ,please correct them';
                return false;
            }
            vm.doLogin();


        };

        vm.doLogin = function() {
            vm.message = "";
            authentication
                .login(vm.credentials).error(function(err) {
                    vm.message = err.message;
                }).then(function() {//authentication.isLoggedIn();
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                });
        };



        //vm.showError = function (error) {
        //$scope.$apply(function() {
        //  vm.message = error.message;
        //});
        //};

    }

})();