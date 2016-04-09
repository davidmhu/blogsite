(function() {

    angular
        .module('blogsiteApp')
        .controller('passwordModalCtrl', passwordModalCtrl);

    passwordModalCtrl.$inject = [ '$modalInstance', 'blogsiteData', 'authentication'];

    function passwordModalCtrl($modalInstance, blogsiteData, authentication) {
        var vm = this;
        vm.formError = '';
        if (authentication.isLoggedIn()) {
            doViewUserInfo();


        } else {
            $location.path('/');
        }
        vm.message = '';
        vm.modal = {
            cancel: function() {
                $modalInstance.dismiss('cancel');
            }
        };
        vm.submit = function() {
            vm.formError = 'submit';

        };


        function doViewUserInfo() {
            blogsiteData.getUserinfo()
                .success(function(data) {
                    vm.message = data ? "" : "No user found";
                    vm.user = data;



                })
                .error(function(e) {
                    vm.formError = "Sorry, something's gone wrong, please try again later";
                });
        }



    }

})();