(function () {
    'use strict';

    angular
        .module ('app.friends')
        .run (appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun (routerHelper) {
        routerHelper.configureStates (getStates ());
    }

    function getStates () {
        return [{
            state: 'friends',
            config: {
                url: '/friends',
                template: '<div ui-view=""></div>',
                abstract : true
            }
        }, {
            state : 'friends.index',
            config : {
                url : '/index',
                templateUrl : 'app/friends/index.html',
                controller : 'app.friends.IndexController',
                controllerAs : 'vm'
            }
        }];
    }


}) ();
