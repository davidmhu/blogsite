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
        

        var uploader=$scope.uploader=new FileUploader();

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
            }
            
        };
        
        vm.onSubmit=function(){
            var item=uploader.queue[0];
            vm.formError=item.file.name;
        }
    }

})();