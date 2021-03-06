var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var fs = require('fs');
var gulpNgConfig = require('gulp-ng-config');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var gulpFilter = require('gulp-filter');
var paths = require('./path.js');
var argv = require('yargs').argv;



function getPath() {
    var arg = argv._[0];
    if (arg == 'build') {
        return 'www';
    } else {
        //return '/Library/WebServer/Documents/app';
        return 'www';
        //return 'dev';
    }
}

gulp.task('bowerMerge', function() {
    var filterJS = gulpFilter('**/*.js', {
        restore: true
    });
    gulp.src('bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        // .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest(getPath() + '/lib'));
});

gulp.task('sass', function(done) {
    gulp.src('./app/scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(getPath() + '/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(getPath() + '/css/'))
        .on('end', done);
});

gulp.task('scripts', function(done) {
    return gulp.src(paths.javascript)
        .pipe(sourcemaps.init())
        .pipe(cached('scripts'))
        .pipe(remember('scripts'))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(getPath() + '/'));
});

gulp.task('indexHtml', function() {
    return gulp.src(paths.indexHtml)
        .pipe(gulp.dest(getPath() + '/'));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(getPath() + '/img'));
});

gulp.task('eshop', function() {
    return gulp.src(paths.eshop)
        .pipe(gulp.dest(getPath() + '/eshop'));
});

gulp.task('environmentConfig', function() {
    gulp.src(paths.environmentConfig)
        .pipe(gulpNgConfig('environmentConfig'))
        .pipe(gulp.dest('./app/js/'))
});

gulp.task('templateCache', function(done) {
    return gulp.src(paths.templateCache)
        .pipe(templateCache({
            standalone: true,
            transformUrl: function(url) {
                var newUrl = url.replace(/.*templates[\/\\]/, '');
                newUrl = newUrl.replace(/.*components[\/\\]modules[\/\\]/, '');
                newUrl = newUrl.replace(/.*components[\/\\]directive[\/\\]/, '');
                return newUrl;
            }
        }))
        .pipe(gulp.dest(getPath() + '/'));
});
