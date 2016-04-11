(function() {

    angular
        .module('blogsiteApp')
        .service('blogsiteData', blogsiteData);

    blogsiteData.$inject = ['$http', 'authentication'];

    function blogsiteData($http, authentication) {
        var getUserinfo = function() {
            var user=authentication.currentUser();
            return $http.get('/api/user/' + user.email,{
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };
        var updateUserinfo=function(user){
            return $http.put('/api/user/' + user.email,user,{
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });           
        };
        var changePwd=function(user){
            return $http.post('/api/user/changepwd/' + user.email,user,{
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                }).success(function(data){//console.log(data);
                    authentication.saveToken(data);
                    });           
        };
        var imgUpload=function(email,data){
            return $http.post('/api/user/uploads/' + email,data,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
                
        }
        return {
            getUserinfo: getUserinfo,
            updateUserinfo:updateUserinfo,
            changePwd:changePwd,
            imgUpload:imgUpload
        };


    }



})();