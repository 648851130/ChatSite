(function () {
    'use strict';

    angular
        .module ('blocks.dialog')
        .factory ('dialog', dialog);

    dialog.$inject = ['$state'];

    //ngDialog

    /* @ngInject */
    function dialog ($state) {
        var modal = {
            customSuccess: customSuccess,
            customFail: customFail,
            customConfirm: customConfirm,
            customCompare: customCompare,
            showUser:showUser
        };


        return modal;


        /**
         *
         * @param text     string 提示内容 (必须)
         * @param state    string 跳转的state (可选)
         * @param params   Object 携带的参数 (可选)
         */

        function customSuccess (text, state, params) {
            var icon = 'glyphicon glyphicon-ok';
            var color = 'am-text-success'
            realize (color,icon, text, state, params);
        }

        function customFail (text, state, params) {
            var icon = "glyphicon glyphicon-exclamation-sign";
            var color = 'am-text-danger'
            realize (color,icon, text, state, params);
        }

        function customCompare (x, y) {
            return x > y ? true : false;
        }

        function customConfirm (text, onConfirm, onCancel) {
            var icon = " am-danger am-icon-question ";
            realizeConfirm (icon, text, onConfirm, onCancel);
        }

        function realize (color,icon, text, state, params) {
            var params = params || {};
            _initTemplate (color,icon, text);
            $ ('#my-v-alert').modal('show');
        }

        function realizeConfirm (icon, text, onConfirm, onCancel) {
            _initTemplateConfirm (icon, text);
            $ ('#my-v-confirm').modal ({
                closeViaDimmer: false,
                onConfirm: function () {
                    onConfirm ();
                    $ ('#my-v-confirm').modal ('close').remove ();
                },
                onCancel: onCancel
            });
        }

        function _initTemplate (color,icon, text) {
            if ($ ('#my-v-alert')) {
                $ ('#my-v-alert').remove ();
            }
            //var template = '<div class="am-modal am-modal-alert iyz-alert"  tabindex="-1" id="my-v-alert"><div class="am-modal-dialog"><div class="am-modal-hd">爱逸站</div><div class="am-modal-bd"><span class="am-icon-btn' + icon + ' am-margin-right"></span>' + text + '</div> <div class="am-modal-footer"> <span class="am-modal-btn" data-am-modal-confirm>确定</span> </div> </div> </div>';
            var template = '<div class="modal fade" id="my-v-alert">\
                                <div class="modal-dialog">\
                                <div class="modal-content">\
                                <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                            <h4 class="modal-title '+color+'"><span class="am-margin-right-sm ' + icon + '"></span>提示</h4>\
                            </div>\
                            <div class="modal-body">\
                                <p>'+text+'</p>\
                            </div>\
                            <div class="modal-footer">\
                                <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>\
                            </div>\
                            </div><!-- /.modal-content -->\
                            </div><!-- /.modal-dialog -->\
                            </div><!-- /.modal -->'
            $ ("body").append (template);
        }

        function _initTemplateConfirm (icon, text) {
            if ($ ('#my-v-confirm')) {
                $ ('#my-v-confirm').remove ();
            }
            var template = '<div class="am-modal am-modal-confirm iyz-alert"  tabindex="-1" id="my-v-confirm"><div class="am-modal-dialog"><div class="am-modal-hd">爱逸站</div><div class="am-modal-bd"><span class="am-icon-btn' + icon + ' am-margin-right"></span>' + text + '</div> <div class="am-modal-footer"> <span class="am-modal-btn" data-am-modal-cancel>取消</span><span class="am-modal-btn" data-am-modal-confirm>确定</span> </div> </div> </div>';
            $ ("body").append (template);
        }


        function showUser(x,y,user){
            if ($ ('#user-panel')) {
                $ ('#user-panel').remove ();
            }


            var html = '<div id="user-panel" class="panel panel-default" style="width:200px;position: absolute;z-index: 9999;left:'+x+';top:'+y+'">\
                <div class="panel-heading">'+user.nick_name+'</div>\
                    <div class="panel-body">\
                        <img class="am-round am-center" width="60" height="60" src="'+user.head+'"/>\
                        <p class="am-center">年龄：'+(user.age || "未填写")+'</p>\
                        <p class="am-center">介绍：'+(user.desc || "未填写")+'</p>\
                    </div>\
                </div>';

            $ ("body").append (html);
        }
    }
}) ();
