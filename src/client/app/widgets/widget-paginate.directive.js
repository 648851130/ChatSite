/**
 * 本指令适用于laravel5.1分页默认参数、amzeui默认样式
 *
 * 用法：
 * <ul widget-paginate="vm.activities" widget-paginate-go="vm.goPage" class="am-pagination am-pagination-right"></ul>
 * widget-paginate 传入laravel5.1风格的分页对象
 * widget-paginate-go 传入一个函数，该函数用于跳转到指定页面
 */

angular
    .module('app.widgets')
    .directive('widgetPaginate', paginate);

function paginate() {
    var directive = {
        scope: {
            paginate: '=widgetPaginate',
            paginateGo: '=widgetPaginateGo',
            item: '='
        },
        link: link,
        templateUrl: 'app/widgets/widget-paginate.html',
        restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
        //计算分页
        scope.$watch('paginate',function() {
            var data = scope.paginate;
            if(!data) return;
            var pages_total = Math.ceil(data.total / data.per_page);
            var pages = [];
            for (var i = 1; i <= pages_total; i++) {
                pages.push(i);
            }
            scope.pages = pages;
        });

    }

}
