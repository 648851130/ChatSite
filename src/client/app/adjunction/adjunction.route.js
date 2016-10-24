(function () {
    'use strict';

    angular
        .module ('app.adjunction')
        .run (appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun (routerHelper) {
        routerHelper.configureStates (getStates ());
    }

    function getStates () {
        return [{
            state: 'adjunction',
            config: {
                url: '/adjunction',
                template: '<div ui-view=""></div>',
                abstract : true
            }
        }, {
            state : 'adjunction.index',
            config : {
                url : '/index',
                templateUrl : 'app/adjunction/index.html',
                controller : 'app.adjunction.IndexController',
                controllerAs : 'vm'
            }
        }];
    }


}) ();
