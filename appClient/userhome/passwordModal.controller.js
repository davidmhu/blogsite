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
        vm.onSubmit = function() {
            if (!vm.user.oldpassword) {
                vm.formError='old password is needed.';
                return false;
            }
            if (!vm.user.password1 || !vm.user.password2 || vm.user.password1 !== vm.user.password2) {
                vm.formError='two new password are both needed and should be equal.';
                return false;
            }
            vm.formError = 'submiting...';
            var data={email:vm.user.email,oldpassword:vm.user.oldpassword,newpassword:vm.user.password1};
            blogsiteData.changePwd(data)
                .success(function(){
                    vm.formError='changed pwd successfully';
                    vm.user.oldpassword='';
                    vm.user.password1='';
                    vm.user.password2='';
                    data={};
                })
                .error(function(e){
                    vm.formError = "Sorry, something's gone wrong:"+e.message;
                });
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