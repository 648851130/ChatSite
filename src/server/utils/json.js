var _ = require('underscore');

module.exports = {
    json: json,
    indexOf:indexOf
};
///////////////////////////////////////////

/**
 *
 * 辅助返回json
 *
 * @param res
 * @param status
 * @param data
 * @param code
 * @private
 */
function json(res, status, data, code) {
    var result = {
        'status': status
    };
    if (status === 1) {
        result.data = data;
        result.success_code = code;
    } else {
        result.error_msg = data;
        result.error_code = code;
    }
    res.status(200).send(result);
}

////////////////////////////////////////

function indexOf(arr,json){
    var index = -1;

    for(var i in arr){
        if(_.isEqual(arr[i], json)){

            index = i;
            break;
        }
    }


    return index;
}