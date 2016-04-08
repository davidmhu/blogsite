(function() {

    angular
        .module('blogsiteApp')
        .service('blogsiteData', blogsiteData);

    blogsiteData.$inject = ['$http', 'authentication'];

    function blogsiteData($http, authentication) {
        var getUserinfo = function() {
            var user=authentication.currentUser();//console.log(user);
            return $http.get('/api/user/' + user.email,{
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
        };
        var updateUserinfo=function(user){console.log(user);
            return $http.put('/api/user/' + user.email,user,{
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });           
        };
        return {
            getUserinfo: getUserinfo,
            updateUserinfo:updateUserinfo
        };


    }



})();