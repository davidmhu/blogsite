(function() {

    angular
        .module('blogsiteApp')
        .controller('picUploadModalCtrl', picUploadModalCtrl);

    picUploadModalCtrl.$inject = [ '$modalInstance', '$scope','FileUploader','blogsiteData', 'authentication'];

    function picUploadModalCtrl($modalInstance,$scope, FileUploader,blogsiteData, authentication) {
        var vm = this;
        vm.formError = '';
        vm.message = '';
        vm.imgfile='';
        vm.modal = {
            cancel: function() {
                $modalInstance.dismiss('cancel');
            }
        };
        

        var uploader=$scope.uploader=new FileUploader({
            url:'/api/user/uploads'
        });
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            vm.imgfile=response.path;
        };
        uploader.onErrorItem=function(item, response, status, headers){
            if (response.message){
             vm.formError='Sorry,upload failed, due to '+response.message+', please try again later';
            }else{
                vm.formError='Sorry,upload failed,  please try again later';
            }
        };
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        uploader.onAfterAddingFile = function(fileItem) {
            if (uploader.queue.length>1) {
                uploader.queue.shift();//only one image
                //uploader.reomoveFromQueue(0);
            }
            
        };
        
        vm.changePortrait = function(){
            authentication
                .changePortrait(vm.user.email,vm.imgfile)
                .success(function(data){
                    vm.imgfile=data;vm.user.portrait=data;vm.formError='well done';
                });
        };
    }

})();