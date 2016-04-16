angular.module('authmock', [])
    .service('authentication', [
        function() {
            return {
                isLoggedIn: function() {
                    return true;
                },
                currentUser: function() {
                    return {
                        email: '1548@dkd.com',
                        name: 'david'
                    };
                },
                logout: function() {
                    return {};
                }
            };
        }
    ]);