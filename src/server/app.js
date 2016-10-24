var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multiparty = require('connect-multiparty');
var logger = require('morgan');
var session    = require('express-session')
var mongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose');
var _ = require('underscore');



var app = express();
var port = process.env.PORT || 3000;

var four0four = require('./utils/404')();
var util = require('./utils/json');

var dbUrl = 'mongodb://localhost/quick_chat';
mongoose.connect(dbUrl);

app.use(multiparty());    //文件处理
app.use(cookieParser());  //session
app.use(session({
    secret: 'quick_chat',
    store: new mongoStore({
        url :dbUrl,
        collection: 'sessions'
    }),
    resave:false,
    saveUninitialized:true
}))
app.use(bodyParser.urlencoded({extended: true}));  //使用body
app.use(bodyParser.json());  //使用body

app.use(express.static('./src/client/'));
app.use(express.static('./'));


app.use('/user', require('./module/user/routes'));
app.use('/friends', require('./module/friend/routes'));
app.use('/talk-record', require('./module/talk-record/routes'));
app.use('/common', require('./module/common/routes'));
app.use('/rooms', require('./module/room/routes'));



app.get('/',function(req,res){
    res.sendfile(__dirname + '/../client/index.html');
});



var io = require('socket.io').listen(app.listen(port));
console.log("启动")
require('./chat_socket')(io);
//io.use('/friends', require('./module/friend/routes'));

global.clients = [];

