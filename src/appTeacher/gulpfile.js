var gulp = require('gulp');
var runSequence = require('run-sequence');
var paths = require('./gulp/path.js');

gulp.task('serve:before', [
    'default',
    'watch'
]);

gulp.task('default', ['sass', 'scripts', 'environmentConfig', 'images', 'eshop', 'templateCache', 'indexHtml', 'bowerMerge']);

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
    gulp.watch(paths.eshop, function() {
        runSequence('eshop');
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
});



require('./gulp/gulptask.js');
require('./gulp/install.js');
require('./gulp/build.js');
