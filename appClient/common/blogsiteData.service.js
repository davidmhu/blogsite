(function() {

    angular
        .module('blogsiteApp')
        .service('blogsiteData', blogsiteData);

    blogsiteData.$inject = ['$http', 'authentication'];

    function blogsiteData($http, authentication) {
        var getUserinfo = function() {
            if (authentication.isLoggedIn()){
                var user=authentication.currentUser();//console.log(user);
                return $http.get('/api/user/' + user.email,{
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    }
                });
            }           
        };
        return {
            getUserinfo: getUserinfo
        };
    }

})();