(function() {

    angular
        .module('blogsiteApp')
        .service('blogsiteData', blogsiteData);

    blogsiteData.$inject = ['$http', 'authentication'];

    function blogsiteData($http, authentication) {
        var getUserinfo = function() {
            var user = authentication.currentUser();
            return $http.get('/api/user/' + user.email, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        var updateUserinfo = function(user) {
            return $http.put('/api/user/' + user.email, user, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        var changePwd = function(user) {
            return $http.post('/api/user/changepwd/' + user.email, user, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            }).success(function(data) {
                authentication.saveToken(data);
            });
        };

        var changePortrait = function(email, imgfilepath) {
            return $http.post('/api/user/portrait/' + email, {
                filename: imgfilepath
            }, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };
        var checkEmail = function(email) {
            return $http.get('/api/user/emailcheck/' + email);
                
        };
        var getListpage = function (page,pagesize,queryCond) {
            var postdata={
                page : page,
                pagesize : pagesize,
                queryCond: queryCond
            };
            return $http.post('/api/user/list/',postdata);
        };
        return {
            getUserinfo: getUserinfo,
            updateUserinfo: updateUserinfo,
            changePwd: changePwd,
            changePortrait: changePortrait,
            checkEmail: checkEmail,
            getListpage:getListpage
        };


    }



})();