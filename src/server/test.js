//导入sms_send模块

var zy = require('./sms_send.js');



//配置

zy.setConfig = {



    //appKey 登录后可以在 管理中心→账号信息 中进行查看
    appKey: '79e6e4b55d0c4e83aa164b547bd0c4c3',



    //taken 登录后可以在 管理中心→应用管理 中进行查看
    token: 'QJ1a24TL7T06',



    //templateId  这个就是你的短信签名了， 登录后可以在 管理中心→短信签名 中进行查看

    templateId: 'RSETSESEKESE'

};



/**

 /*发送短信

 /*phone 接受短信的用户手机号码

 /*code 发送的验证码数据（怎么生成就自己来了）

 /*callback 回调函数

 */

zy.sendSms(

    '15757176786',

    "558765",

    /**

     　　/*回调函数

     　　/*err 错误信息（如网络连接问题……）

     　　/*data 所有数据（验证码发送结果存在与body中）

     　　/*mess 验证码发送结果

     　　/*（data中存放着所有返回参数，而mess中只存放着验证码发送结果的json字符串。json字符串又通过JSON.parse()来转换成json取值）

     　　*/

    function(err,data,mess){

        if(err){

            console.log(err);

        }else{

            //console.log(data);

            //console.log(mess);

            console.log(JSON.parse(data.body).reason);
            console.log(JSON.parse(mess).reason);

        }
    }

);

