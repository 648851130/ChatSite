;$(function(){
    var RECORDER_APP_ID = "recorderApp";
    var $level = $('.level');

    var appWidth = 1;
    var appHeight = 1;
    var flashvars = {'upload_image': '../images/upload.png'};
    var params = {};
    var attributes = {'id': RECORDER_APP_ID, 'name': RECORDER_APP_ID};
    swfobject.embedSWF("recorder.swf", "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);

    window.fwr_event_handler = function fwr_event_handler() {
        var name, $controls;
        switch (arguments[0]) {
            case "ready":
                console.log("ready");
                FWRecorder.uploadFormId = "#uploadForm";
                FWRecorder.uploadFieldName = "upload_file[filename]";
                FWRecorder.connect(RECORDER_APP_ID, 0);
                FWRecorder.recorderOriginalWidth = appWidth;
                FWRecorder.recorderOriginalHeight = appHeight;
                break;

            case "microphone_user_request":
                console.log("microphone_user_request");

                FWRecorder.showPermissionWindow();
                break;

            case "permission_panel_closed":
                console.log("permission_panel_closed");

                FWRecorder.defaultSize();
                break;

            case "recording":
                console.log("recording");

                FWRecorder.hide();
                FWRecorder.observeLevel();
                break;

            case "recording_stopped":
                console.log("recording_stopped");

                FWRecorder.show();
                FWRecorder.stopObservingLevel();
                $level.css({height: 0});
                break;

            case "microphone_level":
                console.log("microphone_level");

                $level.css({height: 32 * arguments[1] + 'px'});
                break;

            case "save_pressed":
                console.log("save_pressed");
                //$('#upload_form').serializeArray();
                FWRecorder.updateForm();
                break;

            case "saving":
                name = arguments[1];
                console.info('saving started', name);
                break;

            case "saved":
                name = arguments[1];
                var response = arguments[2];
                console.info('saving success', name, response);
                break;

            case "save_failed":
                name = arguments[1];
                var errorMessage = arguments[2];
                console.info('saving failed', name, errorMessage);
                break;

            case "save_progress":
                name = arguments[1];
                var bytesLoaded = arguments[2];
                var bytesTotal = arguments[3];
                console.info('saving progress', name, bytesLoaded, '/', bytesTotal);
                break;
        }
    };


    function recorderEl() {
        return $('#' + RECORDER_APP_ID);
    }
});