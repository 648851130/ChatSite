(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate','ngSanitize',
            'blocks.exception', 'blocks.logger', 'blocks.router',
            'ui.router', 'blocks.dialog','blocks.load','common.socket'
        ]);
})();
