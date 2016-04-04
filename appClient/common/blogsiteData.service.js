(function() {

    angular
        .module('blogsiteApp')
        .service('blogsiteData', blogsiteData);

    blogsiteData.$inject = ['$http', 'authentication'];

    function blogsiteData($http, authentication) {

        var getUserinfo = function(email) {
            var user = {
                email: email,
                password: 'eat-the-living'
            }; //need to modify
            authentication.login(user);
            return $http.get('/api/user/' + user.email,{
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        return {
            getUserinfo: getUserinfo
        };
    }

})();