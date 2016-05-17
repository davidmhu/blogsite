(function() {

    angular
        .module('blogsiteApp')
        .service('blogsiteData', blogsiteData);

    blogsiteData.$inject = ['$http', 'authentication'];

    function blogsiteData($http, authentication) {
        var getUserinfo = function(email) {
            //var user = authentication.currentUser();
            return $http.get('/api/user/' + email, {
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
        var getListpage = function (page,pagesize,queryCond,sortCond) {
            var postdata={
                page : page,
                pagesize : pagesize,
                queryCond: queryCond,
                sortCond:sortCond
            };
            return $http.post('/api/user/list/',postdata, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
                });
        };
        var getBlogList=function(queryStr){
            return $http.get('/api/blog/'+queryStr);
        };
        var getBlogDetail=function(id){
            return $http.get('/api/blog/'+id);
        };
        var saveComment=function(blogid,postdata){
            return $http.post('/api/comment/'+blogid,postdata, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
                });
        };
        var getCommentList=function(blogid){
            return $http.get('/api/comment/blog/'+blogid);
        }
        return {
            getUserinfo: getUserinfo,
            updateUserinfo: updateUserinfo,
            changePwd: changePwd,
            changePortrait: changePortrait,
            checkEmail: checkEmail,
            getListpage:getListpage,
            getBlogList:getBlogList,
            getBlogDetail:getBlogDetail,
            saveComment:saveComment,
            getCommentList:getCommentList
        };


    }



})();