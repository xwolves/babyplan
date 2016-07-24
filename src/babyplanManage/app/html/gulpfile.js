var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
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
var replace = require('gulp-replace');
var minimist = require('minimist');
var gulpif = require('gulp-if');
var Log = require('log') , log = new Log('info');

//输出请使用release 测试请使用test,默认:test
//gulp --env release
var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'test' }
};
var options = minimist(process.argv.slice(2), knownOptions);
var path = "../src/main/webapp/www/";
var appUrl;
if(options.env === 'release'){
  log.info('开始编译　可供发布的应用');
  appUrl = "http://doc.xh.sustc.edu.cn:8080";
}else{
  log.info('开始编译　测试应用');
  appUrl = "http://10.20.68.73:8080";
}

var d=new Date();
var M=d.getMonth()>=9 ? (d.getMonth()+1) : ("0"+(d.getMonth()+1));
var D=d.getDate()>=10 ? (d.getDate()) : ("0"+d.getDate());
var h=d.getHours()>=10 ? (d.getHours()) : ("0"+d.getHours());
var m=d.getMinutes()>=10 ? (d.getMinutes()) : ("0"+d.getMinutes());
var appVer = "1.0."+M+D+h+m;

var paths = {
  sass: ['./scss/**/*.scss'],
  less: ['./bower_components/**/*.*'],
  css: [path+'lib/**/*.css',path+'css/app.css'],
  fonts: [path+'lib/**/fonts/*.*'],
  bowerModule: ['./bower_components/**/*.*'],
  templateCache: ['./app/**/*.html'],
  images: ['app/img/**/*.*'],
  indexHtml: ['app/index.html'],
  javascript: ['app/components/**/*.js'],
  environmentConfig: './app/config/environmentConfig.json',
  webxml: '../src/main/webapp/WEB-INF/',
  apipomxml: '../../api/',
  pomxml: '../'
};

gulp.task('default', ['sass', 'scripts', 'environmentConfig', 'images', 'templateCache', 'indexHtml', 'bowerMerge', 'css' ,'webxml','pomxml','apipomxml' ]);
gulp.task('watch', function() {
  gulp.watch(paths.sass, function() {
    runSequence('sass');
  });
  gulp.watch(paths.templateCache, function() {
    runSequence('templateCache');
  });
  gulp.watch(paths.environmentConfig, function() {
    runSequence('scripts', 'environmentConfig');
  });
  gulp.watch(paths.images, function() {
    runSequence('images');
  });
  gulp.watch(paths.javascript, function() {
    runSequence('scripts');
  });
  gulp.watch(paths.indexHtml, function() {
    runSequence('indexHtml');
  });
  gulp.watch(paths.bowerModule, function() {
    runSequence('bowerMerge');
  });
  gulp.watch(paths.css, function() {
    runSequence('css');
  });
  gulp.watch(paths.webxml, function() {
    runSequence('webxml');
  });
  gulp.watch(paths.apipomxml, function() {
    runSequence('apipomxml');
  });
  gulp.watch(paths.pomxml, function() {
    runSequence('pomxml');
  });
});



gulp.task('bowerMerge', function(done){
  var filterJS = gulpFilter('**/*.js', { restore: true });
  var lessFilter = gulpFilter('**/*.less', {restore: true});
     gulp.src('bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest(path+'lib'))
        .on('end', done);

        // .pipe(lessFilter)
        // .pipe(less())
        // .pipe(minifyCss({
        //   keepSpecialComments: 0
        // }))
        // .pipe(rename({
        //   extname: '.min.css'
        // }))
        // .pipe(lessFilter.restore)
});

gulp.task('sass', function(done) {
  gulp.src('./scss/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest(path+'css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(path+'css/'))
    .on('end', done);
});

gulp.task('css', ['sass','bowerMerge'], function() {
   gulp.src(paths.css)
    .pipe(concat('app.css'))
    .pipe(gulp.dest(path+'css/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest(path+'css/'));

    gulp.src('bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulp.dest(path+'lib'));

   <!-- bootstrap fonts-->
   //gulp.src('./bower_components/bootstrap/fonts/*',{base:'./bower_components/bootstrap/'})
    //   .pipe(gulp.dest(path))
   gulp.src('./bower_components/bootstrap-css-only/fonts/*',{base:'./bower_components/bootstrap-css-only/'})
     .pipe(gulp.dest(path));
   gulp.src('./bower_components/components-font-awesome/fonts/*',{base:'./bower_components/components-font-awesome/'})
     .pipe(gulp.dest(path));
   gulp.src('./app/js-ie/*')
      .pipe(gulp.dest(path+"js-ie/"));
});

//    .pipe(gulpif(options.env === 'release', uglify())) // 仅在生产环境时候进行压缩
gulp.task('scripts', function(done) {
  return gulp.src(paths.javascript)
    .pipe(sourcemaps.init())
    .pipe(cached('scripts'))
    .pipe(remember('scripts'))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path));
});

gulp.task('indexHtml', function() {
  return gulp.src(paths.indexHtml)
    .pipe(gulp.dest(path));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(path+'img'));
});

gulp.task('environmentConfig', function() {
  return gulp.src(paths.environmentConfig)
    .pipe(replace('http://doc.xh.sustc.edu.cn:8080', appUrl))
    .pipe(replace('MyAppVersion1.0.0', appVer))
    .pipe(gulpNgConfig('environmentConfig'))
    .pipe(gulp.dest('./app/components/config'))
});

gulp.task('templateCache', function(done) {
  return gulp.src(paths.templateCache)
    .pipe(templateCache({
      standalone: true,
      transformUrl: function(url) {
        var newUrl = url.replace(/.*templates[\/\\]/, '');
        return newUrl.replace(/.*components[\/\\]modules[\/\\]/, '');
      }
    }))
    .pipe(gulp.dest(path));
});

gulp.task('webxml', function() {
  return gulp.src("web.xml")
    .pipe(replace('http://doc.xh.sustc.edu.cn', appUrl))
    .pipe(gulp.dest(paths.webxml))
});

gulp.task('pomxml', function() {
  return gulp.src("pom.xml")
    .pipe(replace('MyAppVersion1.0.0', appVer))
    .pipe(gulp.dest(paths.pomxml))
});

gulp.task('apipomxml', function() {
  return gulp.src("apipom.xml")
      .pipe(replace('MyAppVersion1.0.0', appVer))
      .pipe(rename('pom.xml'))
      .pipe(gulp.dest(paths.apipomxml))
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
