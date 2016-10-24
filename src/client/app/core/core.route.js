(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    /* @ngInject */

    appRun.$inject = ["routerHelper", "$location",'layoutService'];

    function appRun(routerHelper, $location,layoutService) {


        if($location.path() === "") {
            $location.path("/login");
        }
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {
        return [{
                state: 'four0four',
                config: {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    title: '404'
                }
            }
        ];
    }
})();
