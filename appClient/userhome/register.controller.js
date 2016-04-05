(function() {

    angular
        .module('blogsiteApp')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$scope', '$location','blogsiteData', 'authentication'];

    function registerCtrl($scope, $location,blogsiteData, authentication) {
        var vm = this;
        //vm.user={password:'eat-the-living',email:'davidmhu@sina.com.cn'};
        vm.user = {};
        vm.submit = function() {
            vm.message = 'Registering';
            if (!vm.user.password1 || vm.user.password1 !== vm.user.password2) {
                vm.message = 'not valid password or two passwords not equal';
                return;
            }
            vm.user.password=vm.user.password1;
            /*authentication.register(user);//need to modify
	        blogsiteData.getUserinfo()
            .success(function(data) {
                vm.message = " user is registered";
                vm.user = data;
            })
            .error(function(e) {
                vm.message = "Sorry, something's gone wrong, please try again later";
            });*/
            console.log('submit');
            $location.path('/');

        };
        


        //vm.showError = function (error) {
        //$scope.$apply(function() {
        //  vm.message = error.message;
        //});
        //};

    }

})();