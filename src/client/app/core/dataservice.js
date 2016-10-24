(function () {
    'use strict';

    angular
        .module ('app.core')
        .factory ('DataService', DataService);

    DataService.$inject = ['exception'];
    /* @ngInject */
    function DataService (exception) {
        var service = {
            success: success,
            fail: fail
        };

        return service;

        function success (res) {
            return res.data;
        }

        function fail (e) {
            if (e.status === 400) {
                return exception.catcher () ("由于包含语法错误，当前请求无法被服务器理解");
            } else if (e.status === 401) {
                return exception.catcher () ("当前请求需要用户验证");
            } else if (e.status === 403) {
                return exception.catcher () ("服务器已经理解请求，但是拒绝执行它");
            } else if (e.status === 404) {
                return exception.catcher () ("请求失败，请求所希望得到的资源未被在服务器上发现");
            } else if (e.status === 405) {
                return exception.catcher () ("请求行中指定的请求方法不能被用于请求相应的资源");
            } else if (e.status === 406) {
                return exception.catcher () ("请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。");
            } else if (e.status === 408) {
                return exception.catcher () ("请求超时");
            } else if (e.status === 422) {
                return exception.catcher () ("填写格式错误");
            } else if (e.status === 423) {
                return exception.catcher () ("当前资源被锁定");
            } else if (e.status === 500) {
                return exception.catcher () ("服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理");
            } else if (e.status === 501) {
                return exception.catcher () ("服务器不支持当前请求所需要的某个功能");
            } else {
                return exception.catcher ('http request error') (e)
            }
        }
    }
}) ();
