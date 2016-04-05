(function() {

    angular
        .module('blogsiteApp')
        .controller('userhomeCtrl', userhomeCtrl);

    userhomeCtrl.$inject = ['$scope', 'blogsiteData','authentication'];

    function userhomeCtrl($scope, blogsiteData,authentication) {
        var vm = this;

        vm.message = "Searching for the user";
        var user={password:'eat-the-living',email:'davidmhu@sina.com'};//'fanWenxuan16-03-30202917@blogsite.com'
        //authentication.logout();
        authentication.login(user);//need to modify
        blogsiteData.getUserinfo()
            .success(function(data) {
                vm.message = data ? "" : "No user found";
                vm.user = data;
            })
            .error(function(e) {
                vm.message = "Sorry, something's gone wrong, please try again later";
            });


        //vm.showError = function (error) {
        //$scope.$apply(function() {
          //  vm.message = error.message;
        //});
        //};

    }

})();