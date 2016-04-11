(function() {

    angular
        .module('blogsiteApp')
        .controller('picUploadModalCtrl', picUploadModalCtrl);

    picUploadModalCtrl.$inject = [ '$modalInstance', 'blogsiteData', 'authentication'];

    function picUploadModalCtrl($modalInstance, blogsiteData, authentication) {
        var vm = this;
        vm.formError = '';
        vm.message = '';
        vm.imgfile='';
        vm.modal = {
            cancel: function() {
                $modalInstance.dismiss('cancel');
            }
        };
        vm.onSubmit = function() {
            
            vm.formError = 'uploading...';

            blogsiteData.imgUpload(vm.user)
                .success(function(){
                    vm.formError='changed pwd successfully';
                    vm.user.oldpassword='';
                    vm.user.password1='';
                    vm.user.password2='';
                    data={};
                })
                .error(function(e){
                    vm.formError = "Sorry, something's gone wrong:"+e.message;
                });*/
        };



    }

})();