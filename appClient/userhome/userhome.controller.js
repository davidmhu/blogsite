(function() {

    angular
        .module('blogsiteApp')
        .controller('userhomeCtrl', userhomeCtrl);

    userhomeCtrl.$inject = ['$scope', 'blogsiteData'];

    function userhomeCtrl($scope, blogsiteData) {
        var vm = this;

        vm.message = "Searching for the user";
        blogsiteData.getUserinfo('fanWenxuan16-03-30202917@blogsite.com')
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