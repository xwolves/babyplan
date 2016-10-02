var gulp = require('gulp');
var fs = require('fs');
var replace = require('gulp-replace');
var path = require('path');
var moment = require("moment");
var runSequence = require('run-sequence');

var DEV_DOMAIN = 'http://10.20.0.72/sMng/stuManage/www/Api/';
var RELEASE_DOMAIN = './Api/';



gulp.task('build', ['build-release'], function() {
    runSequence('default');
});
gulp.task('unbuild', ['rollback-dev'], function() {
    runSequence('default');
});


gulp.task('build-release', ['build-release-config', 'build-release-http-config']);
gulp.task('rollback-dev', ['rollback-dev-config', 'rollback-dev-http-config']);



gulp.task('build-release-http-config', function(done) {
    return gulp.src('app/components/config/config.js')
        .pipe(replace('httpDevConfig', 'httpRelConfig'))
        .pipe(gulp.dest('app/components/config/'));
});




gulp.task('rollback-dev-http-config', function(done) {
    return gulp.src('app/components/config/config.js')
        .pipe(replace('httpRelConfig', 'httpDevConfig'))
        .pipe(gulp.dest('app/components/config/'));
});



gulp.task('build-release-config', function(done) {
    var today = moment().format("YYYYMMDD");
    var log;
    var version = 1;
    try {
        log = JSON.parse(fs.readFileSync('gulp/log/buildLog.json').toString());
        if (log[today]) {
            log[today].version = parseInt(log[today].version) + 1;
            version = log[today].version;
            log[today][version] = moment().format("YYYY-MM-DD HH-mm-ss") + '发布版本' + version + '！';
        } else {
            log[today] = {};
            log[today].version = version;
            log[today][version] = moment().format("YYYY-MM-DD HH-mm-ss") + '发布版本' + version + '！';
        }
        fs.writeFileSync('gulp/log/buildLog.json', JSON.stringify(log));
    } catch (e) {
        // log = {};
        // log[today] = {};
        // log[today].version = version;
        // log[today][version] = moment().format("YYYY-MM-DD HH-mm-ss")+'发布版本'+version+'！';
        // console.log('BuildLog is not exists.');
    }

    gulp.src('app/index.html')
        .pipe(replace(/buildID=.*\"/g, 'buildID=' + today + 'v' + version + '\"'))
        .pipe(gulp.dest('app/'));

    return gulp.src('app/components/config/environmentConfig.js')
        .pipe(replace(DEV_DOMAIN, RELEASE_DOMAIN))
        .pipe(replace('dev', 'release'))
        .pipe(replace(/\'buildID\'.*\'/, '\'buildID\'\: \'' + today + 'v' + version + '\''))
        .pipe(gulp.dest('app/components/config/'));
});

gulp.task('rollback-dev-config', function(done) {
    return gulp.src('app/components/config/environmentConfig.js')
        .pipe(replace('release', 'dev'))
        .pipe(replace(RELEASE_DOMAIN, DEV_DOMAIN))
        .pipe(gulp.dest('app/components/config/'));
});