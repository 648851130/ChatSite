(function () {
    'use strict';

    angular
        .module ('app.user.manage')
        .run (appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun (routerHelper) {
        routerHelper.configureStates (getStates ());
    }

    function getStates () {
        return [{
            state: 'user',
            config: {
                url: '/user',
                template: '<div ui-view=""></div>',
                abstract : true
            }
        }, {
            state : 'user.index',
            config : {
                url : '/index',
                templateUrl : 'app/user-manage/index.html',
                controller : 'app.user.manage.IndexController',
                controllerAs : 'vm'
            }
        }];
    }


}) ();
