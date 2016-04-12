(function() {
    angular.module('blogsiteApp', ['ngRoute', 'ui.bootstrap','angularFileUpload']);

    function config ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'userhome/userhome.view.html',
                controller: 'userhomeCtrl',
                controllerAs: 'vm'
            })
            .when('/blog', {
                templateUrl: 'blog/bloglist.view.html',
                controller: 'bloglistCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'userhome/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: 'userhome/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/user/edit',{
                templateUrl: 'userhome/userEdit.view.html',
                controller: 'userEditCtrl',
                controllerAs: 'vm'
            })
        .otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(true);
    }

    var indexCtrl = function() {
        var self = this;
        self.linkname = 'angular test';
    };

    var navibarCtrl = function($modal) {
        var self = this;
        self.popupLoginForm = function() {
            alert('Let\' log on');
        };
    };

    var bloglistCtrl = function() {
        var self = this;
        self.modifiedOn = new Date();
    };

    angular.module('blogsiteApp')
        .config(['$routeProvider', '$locationProvider', config])
        .controller('navibarCtrl', navibarCtrl)
        .controller('bloglistCtrl', bloglistCtrl)
        ;

})();