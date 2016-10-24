(function () {
    'use strict';

    angular
        .module ('blocks.load')
        .factory ('load', load);

    load.$inject = ['$state'];

    //ngDialog

    /* @ngInject */
    function load () {
        var modal = {
            loadStart:loadStart,
            loadEnd:loadEnd
        };


        return modal;

        function loadStart(text){
            var html = '<div class="iyz-loading">';
            html += '<div class="iyz-dimmer am-active" style="display: block;"></div>';
            html += '<div class="am-text-center" style="position: fixed;top: 50%;left:50%;z-index:9999"><i class="am-icon-spinner am-icon-pulse"></i><br/>'+text+'</div>'
            html += '</div>';
            $("body").append(html);
        }

        function loadEnd(){
            $('.iyz-loading').remove();
        }

    }
}) ();
