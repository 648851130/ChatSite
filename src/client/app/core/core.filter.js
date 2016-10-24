(function () {
    'use strict';

    angular.module ('app.core')
        .filter('sideBarGetState', sideBarGetState)
        .filter ('auditStatus', auditStatus) //操作人
        .filter ('businessRechargeFilter', businessRechargeFilter)//商户充值状态
        .filter('recordStatus', recordStatus)
        .filter('rechargeType', rechargeType)
        .filter('userAndBusinessStatus', userAndBusinessStatus)
        .filter('auditRecordStatus',auditRecordStatus)
        .filter('businessStatus',businessStatus)
        .filter('allBusinessStatus',allBusinessStatus)
        .filter('allCustomerStatus',allCustomerStatus)
        .filter('allCouponStatus',allCouponStatus)
        .filter('couponApplyStatus',couponApplyStatus)
        .filter('shopNameDefault',shopNameDefault)
        .filter('sexStatus',sexStatus)
        .filter('getRoleName', getRoleName);

    function sideBarGetState() {
        var filter = function(input, params) {
            for(var o in input) {
                if (params == o) {
                    return input[o];
                }
            }
        };
        return filter;
    }

    function auditStatus () {
        var filter = function (input) {
            if (input == 0 || input == 3) {
                return "申请开通"
            } else if (input == 1) {
                return "审核通过"
            } else {
                return "审核中"
            }
        };
        return filter;
    }

    function businessRechargeFilter () {
        var filter = function (input) {
            if (input == 2) {
                return "审核中";
            } else if (input == 1) {
                return "成功";
            } else {
                return "失败";
            }
        };
        return filter;
    }

    function recordStatus() {
        var filter = function(input,params) {
            /*params == 0人工  input == 0 申请中*/
            if(params ==0  && input == 2) {
                return "申请中";
            }
            if(input == 1) {
                return "成功";
            }else {
                return "失败"
            }
        };

        return filter;
    }

    function auditRecordStatus() {
        var filter = function(input,params) {
            /*params == 0人工  input == 0 申请中*/
            if(input == 2) {
                return "申请中";
            }
            if(input == 1) {
                return "成功";
            }else {
                return "失败"
            }
        };

        return filter;
    }

    function rechargeType() {
        var filter = function(input) {
            if(input == 1) {
                return "在线充值";
            } else {
                return "人工充值";
            }
        };
        return filter;
    }

    function userAndBusinessStatus() {
        var filter = function(input) {
            if(input == 1) {
                return "已开通";
            } else if(input == 2) {
                return "申请中";
            } else if(input == 3) {
                return "试用中";
            } else{
                return "未开通";
            }
        };
        return filter;
    }

    function businessStatus() {
        var filter = function(input) {
            if(input == 1) {
                return "已入驻";
            } else {
                return "已过期";
            }
        };
        return filter;
    }

    function getRoleName() {
        var filter = function(role, role_list) {
            for(var i=0; i<= role_list.length; i++){
                if(role_list[i].slug === role) {
                    return role_list[i].name;
                }
            }
        };

        return filter;

    }

    function allBusinessStatus () {
        var filter = function (input) {
            if (input == 0) {
                return "已过期";
            } else if (input == 1) {
                return "已入驻";
            } else if (input == 2) {
                return "待入驻";
            } else if (input == 3) {
                return "待跟进";
            } else if (input == 4) {
                return "跟进中";
            }
        };
        return filter;
    }

    function allCustomerStatus () {
        var filter = function (input) {
            if (input == 0) {
                return "待跟进";
            } else if (input == 1) {
                return "已完结";
            } else if (input == 2) {
                return "跟进中";
            }
        };
        return filter;
    }

    function allCouponStatus(){
        var filter = function (input) {
            if (input == 0) {
                return "申请开通";
            } else if (input == 1) {
                return "审核中";
            } else if (input == 2) {
                return "审核通过";
            } else if (input == 3) {
                return "审核失败";
            }
        };
        return filter;
    }

    function couponApplyStatus(){
        var filter = function (input) {
            if (input == 2) {
                return "成功";
            } else if (input == 3) {
                return "失败";
            }
        };
        return filter;
    }

    function shopNameDefault(){
        var filter = function (input) {
            if (input) {
                return input;
            } else{
                return "(未完善)";
            }
        };
        return filter;
    }

    function sexStatus(){
        var filter = function (input) {
            if (input == 1) {
                return '男';
            } else if(input == 2){
                return "女";
            } else{
                return " ";
            }
        };
        return filter;
    }

} ());
