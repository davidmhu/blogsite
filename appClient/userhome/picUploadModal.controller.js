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
        vm.fileChange=function(){
            console.log(vm.file);
            blogsiteData.imgUpload('sieie@kdod.com',vm.file)
                .success(function(data){
                    vm.formError='changed pwd successfully';
                    vm.imgfile=data.path;
                })
                .error(function(e){
                    vm.formError = "Sorry, something's gone wrong:";
                });
        };

        var uploader=$scope.uploader=new FileUploader();
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

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