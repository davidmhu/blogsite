(function() {

    angular
        .module('blogsiteApp')
        .controller('userEditCtrl', userEditCtrl);

    userEditCtrl.$inject = ['$scope', '$location','$modal', 'blogsiteData', 'authentication'];

    function userEditCtrl($scope, $location, $modal,blogsiteData, authentication) {
        var vm = this;
        vm.returnPage = $location.search().page || '/';
        vm.years = [];
        vm.months = [];
        vm.days = [];
        vm.years.push('年');
        vm.months.push('月');
        vm.days.push('日');
        for (var i = 1929; i <= 2050; i++) {
            vm.years.push(i);
        }
        for (i = 1; i <= 12; i++) {
            vm.months.push(i);
        }
        for (i = 1; i <= 31; i++) {
            vm.days.push(i);
        }
        if (authentication.isLoggedIn()) {
            doViewUserInfo();
            

        } else {
            $location.path('/');
        }
        vm.message='';
        vm.submit = function() {
            if (vm.year !== '年' && vm.month !== '月' && vm.day !== '日') {
                vm.user.birthday=new Date(vm.year+(vm.month<10?'-0':'-')+vm.month+(vm.day<10?'-0':'-')+vm.day);
                console.log(vm.user.birthday);
            } 
            blogsiteData.updateUserinfo(vm.user)
                .error(function(e){
                    vm.message='modify failed';console.log(e);
                    return false;
                }).then(function(){
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                });
            
        };

        vm.year = '年';
        vm.month = '月';
        vm.day = '日';

        vm.popPwdChgForm=function(){
            //alert('change password');
            var modalInstance=$modal.open({
                templateUrl:'/userhome/passwordModal.view.html',
                controller:'passwordModalCtrl as vm'
            });
        };
        
        vm.popImgUploadForm=function(){
            var modalInstance=$modal.open({
                templateUrl:'/common/picUploadModal.view.html',
                controller:'picUploadModalCtrl as vm',
                resolve:{
                	userData:function(){
                		return {
                			email:vm.user.email,
                			name:vm.user.name,
                			protrait:vm.user.portrait 
                		};
                	}
                }
            });

            modalInstance.result.then(function (data) {
                vm.user.portrait=data;
            });
        };

        function doViewUserInfo() {
            blogsiteData.getUserinfo()
                .success(function(data) {
                    vm.message = data ? "" : "No user found";
                    vm.user = data;
                    if (vm.user.birthday) {
                        var birthDate = new Date(vm.user.birthday.toLocaleString().substr(0, 10));
                        vm.year = birthDate.getFullYear();
                        vm.month = birthDate.getMonth() + 1;
                        vm.day = birthDate.getDate();
                    }
                    $scope.navvm.currentUser.name=data.name;
                })
                .error(function(e) {
                    vm.message = "Sorry, something's gone wrong, please try again later";
                });
        }

    }

})();