(function() {

    angular
        .module('blogsiteApp')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$scope', '$location',  'authentication','blogsiteData'];

    function registerCtrl($scope, $location, authentication,blogsiteData) {
        var vm = this;
        //vm.user={password:'eat-the-living',email:'davidmhu@sina.com.cn'};
        vm.user = {};
        vm.check = '';
        vm.returnPage = $location.search().page || '/';
        vm.emailChanged = function() {
            vm.check = '';
        };
        vm.checkEmail = function() { 
            vm.check='X';
            blogsiteData.checkEmail(vm.user.email)
                .success(function(data){
                    if (!data.email) {
                        vm.check='√';
                    }
                });
                
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
            doRegister(vm.user);
        };

        function doRegister(user){
            authentication.register(user)
                .error(function(e){
                    vm.message = "Sorry, something's gone wrong, please register again later";
                    return false;
                }).then(function(){
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                });
        }
    }

})();