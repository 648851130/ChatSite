(function () {
    'use strict';

    angular.module ('app.rooms')
        .controller ('app.rooms.IndexController', IndexController);

    IndexController.$inject = ['$q','roomsService','config','$scope','dialog','$element','$state'];

    function IndexController ($q,roomsService,config,$scope,dialog,$element,$state) {
        var vm = this;

        vm.styles = {};
        vm.index = 0;
        //vm.rooms = [1,2,3,4,5,6,7];
        vm.room = {};
        vm.option = [
            '同事·同学',
            '粉丝',
            '生活休闲',
            '兴趣爱好',
            '游戏',
            '行业交流'
        ];
        vm.cur_user = JSON.parse(sessionStorage.getItem("user"));
        vm.submit = submit;
        vm.showCreate = showCreate;
        vm.goToRoom = goToRoom;


        activate ();

        function activate () {
            var promises = [
                getRooms()
            ];

            $q.all (promises).then (function () {
                vm.page_loaded = true;
                vm.styles.height = $(window).height();
                initUploader();
            });
        }

        function initUploader() {
            var uploader = simple.uploader({
                url: config.common.api_pre + config.common.img,
                connectionCount: 1
            });
            uploader.on('uploadsuccess', function (e, file, data) {
                if (data.status == 1) {

                    vm.room.pic = data.data;
                    vm.upload_msg = '上传成功';
                    $scope.$apply();

                } else {
                    vm.upload_msg = data.error_msg;
                    $scope.$apply();
                }
            });
            $element.find('.upload').on('change', function (e) {
                uploader.upload(this.files);
            });
        }

        function  showCreate(){
            $('#my-create-room').modal('show');
        }

        function getRooms(){
            roomsService.getRooms().then(function (res) {

                if (1 == res.status) {
                    vm.rooms = res.data;
                }
                else {
                    dialog.customFail(res.error_msg);
                }
            });
        }

        function submit(){
            vm.room.creator = vm.cur_user._id;

            if(!vm.room.pic){
                return false;
            }

            roomsService.addRoom(vm.room).then(function (res) {

                if (1 == res.status) {
                    $('#my-create-room').modal('hide');

                    dialog.customSuccess("新建成功");
                    getRooms();


                }
                else {
                    dialog.customFail(res.error_msg);
                }
            });
        }

        function goToRoom(id){
            $state.go('rooms.room',{id:id});
        }


    }

} ());
