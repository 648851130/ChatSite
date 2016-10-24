(function () {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: "login",
                config: {
                    url: '/login',
                    templateUrl: 'app/layout/login.html',
                    controller: 'app.layout.LoginController',
                    controllerAs: 'vm',
                    title: '登录',
                    settings: {
                        nav: 1,
                        content: ''
                    }
                }
            },
            {
                state: "reg",
                config: {
                    url: '/reg',
                    templateUrl: 'app/layout/register.html',
                    controller: 'app.layout.RegController',
                    controllerAs: 'vm',
                    title: '注册',
                    settings: {
                        nav: 1,
                        content: ''
                    }
                }
            }

        ];
    }


})();
