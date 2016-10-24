'use strict';


var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
var inject = require("gulp-inject");
var wiredep = require('wiredep').stream;
var browsersync = require('browser-sync');
var $ = require('gulp-load-plugins')({lazy: true});

var client = './src/client/';
var clientApp = client + 'app/';

// 一些文件的路径  
var paths = {
    client: './src/client/',
    app:'./src/client/app/*.js',
    js: [
        clientApp + '**/*.module.js',
        clientApp + '**/*.js',
        '!' + clientApp + '**/*.spec.js'
    ],
    styles:client + 'styles/',
    less:client + 'styles/*.less',
    css:[
        client + 'styles/**/*.css',
        '!' + client + 'styles/font/demo.css'
    ],
    jsOrder: [
        '**/app.module.js',
        '**/*.module.js',
        '**/*.js'
    ],
    server: {
        index: './src/server/app.js'
    },
    bower:[
        './bower_components/**/*.min.css',
        './bower_components/**/*.min.js',
    ],
    html:{
        index:'./src/client/index.html'
    },
    getWiredepDefaultOptions:{
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    },
    browsersync:'./src/**/*.*'


};



// nodemon 的配置  
var nodemonConfig = {
    script : paths.server.index,
    ignore : [
        "tmp/**",
        "public/**",
        "views/**"
    ],
    env    : {
        "NODE_ENV": "development"
    }
};


gulp.task('inject',['bower','less'], function () {

    var target = gulp.src(paths.html.index);

    var js = gulp.src(paths.js, {read: false});
    var css = gulp.src(paths.css, {read: false});


    return target
        .pipe(inject(js,'', paths.jsOrder))
        .pipe(inject(css))
        .pipe(gulp.dest('./src/client/'));
});

gulp.task('bower', function () {
    gulp.src(paths.html.index)
        .pipe(wiredep(paths.getWiredepDefaultOptions))
        .pipe(gulp.dest('./src/client/'));
});

gulp.task('browser-sync', function() {

});

function startBrowserSync(){
    browsersync.init(null, {
        files:paths.browsersync,
        port:3000,
        proxy: 'localhost:' + 3000,
        open: true,
        reloadDelay:6500
    });
}

gulp.task('sync', ['serve'], startBrowserSync);

//less-->css
gulp.task('less', function () {
    return gulp.src(paths.less)
        .pipe($.less())
        .pipe(gulp.dest(paths.styles));
});

gulp.task('lessWatch', function () {
    gulp.watch(paths.less, ['less']); //当所有less文件发生改变时，调用testLess任务
});

// 使用 nodemone 跑起服务器  
gulp.task('serve',['inject','lessWatch'], function() {
    return nodemon(nodemonConfig)
        //.on('restart', function (ev) {
        //    log('*** nodemon restarted');
        //    log('files changed:\n' + ev);
        //    setTimeout(function () {
        //        browsersync.notify('reloading now ...');
        //        browsersync.reload({stream: false});
        //    }, 500);
        //})
        //.on('start', function () {
        //    log('*** nodemon started');
        //    startBrowserSync();
        //});
});

//gulp.task('default', ['serve']);