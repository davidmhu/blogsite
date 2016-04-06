(function() {

    angular
        .module('blogsiteApp')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function registerCtrl($scope, $location, blogsiteData, authentication) {
        var vm = this;
        //vm.user={password:'eat-the-living',email:'davidmhu@sina.com.cn'};
        vm.user = {};
        vm.check = '';
        vm.emailChanged = function() {
            vm.check = '';
            console.log('changed');
        };
        vm.checkEmail = function() { //need to complete
            //vm.check = '√';
            //var str8 = '5ZGo56eL5LqR';
            //var arr8 = str8.split
            vm.check = base64.decode('5ZGo56eL5LqR');
            console.log(vm.check);
        };
        vm.submit = function() {
            vm.message = '';
            if ($scope.registerForm.$pristine) {
                vm.message = 'Please fill the form first before you submit';
                return;
            }
            if ($scope.registerForm.$invalid) {
                vm.message = 'There are errors in the form ,please correct them';
                return;
            }
            if (!vm.user.password1 || vm.user.password1 !== vm.user.password2) {
                vm.message = 'not valid password or two passwords not equal';
                return;
            }
            vm.user.password = vm.user.password1;
            //vm.message = 'Registering';
            authentication.register(vm.user)
                .success(function(data) {
                    vm.message = "user is registered";
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