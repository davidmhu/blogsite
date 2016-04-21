(function() {

    angular
        .module('blogsiteApp')
        .controller('userlistCtrl', userlistCtrl);

    userlistCtrl.$inject = ['$scope', '$location', 'blogsiteData', 'authentication'];

    function userlistCtrl($scope, $location,blogsiteData, authentication) {
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
                    $scope.navvm.currentUser.name=data.name;
                    
                })
                .error(function(e) {
                    vm.message = "Sorry, something's gone wrong, please try again later";
                });
        }
        
    }

})();