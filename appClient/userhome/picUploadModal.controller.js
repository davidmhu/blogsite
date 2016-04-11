(function() {

    angular
        .module('blogsiteApp')
        .controller('picUploadModalCtrl', picUploadModalCtrl);

    picUploadModalCtrl.$inject = [ '$modalInstance', '$scope','blogsiteData', 'authentication'];

    function picUploadModalCtrl($modalInstance,$scope, blogsiteData, authentication) {
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
            var data;
            vm.formError = 'uploading...';
            //console.log($scope.element[0]);
            /*blogsiteData.imgUpload(vm.user.email,data)
                .success(function(){
                    vm.formError='changed pwd successfully';
                    data={};
                })
                .error(function(e){
                    vm.formError = "Sorry, something's gone wrong:"+e.message;
                });*/
        };



    }

})();