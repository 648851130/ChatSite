(function () {
    'use strict';

    angular.module ('app.adjunction')
        .controller ('app.adjunction.IndexController', IndexController);

    IndexController.$inject = ['$q'];

    function IndexController ($q) {
        var vm = this;

        vm.styles = {};
        vm.index = 0;



        activate ();

        function activate () {
            var promises = [

            ];

            $q.all (promises).then (function () {
                vm.page_loaded = true;
                vm.styles.height = $(window).height();

            });
        }





    }

} ());
