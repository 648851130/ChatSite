(function () {
    'use strict';

    angular
        .module ('app.rooms')
        .run (appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun (routerHelper) {
        routerHelper.configureStates (getStates ());
    }

    function getStates () {
        return [{
            state: 'rooms',
            config: {
                url: '/rooms',
                template: '<div ui-view=""></div>',
                abstract : true
            }
        }, {
            state : 'rooms.index',
            config : {
                url : '/index',
                templateUrl : 'app/rooms/index.html',
                controller : 'app.rooms.IndexController',
                controllerAs : 'vm'
            }
        }, {
            state : 'rooms.room',
            config : {
                url : '/room/:id',
                templateUrl : 'app/rooms/room.html',
                controller : 'app.rooms.RoomController',
                controllerAs : 'vm'
            }
        }];
    }


}) ();
