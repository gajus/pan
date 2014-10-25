var pkg = require('./package.json'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    fs = require('fs'),
    del = require('del');

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', ['lint'], function (cb) {
    del(['dist'], cb);
});

gulp.task('bundle', ['clean'], function () {
    return gulp
        .src('./src/pan.js')
        .pipe(browserify({
            //debug : true
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('version', ['bundle'], function () {
    var bower = require('./bower.json');

    gulp
        .src('./dist/pan.js')
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/pan for the canonical source repository\n* @license https://github.com/gajus/pan/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('pan.min.js'))
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/pan for the canonical source repository\n* @license https://github.com/gajus/pan/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'));

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.version = pkg.version;
    bower.keywords = pkg.keywords;
    bower.license = pkg.license;

    fs.writeFile('./bower.json', JSON.stringify(bower, null, 4));
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './package.json'], ['default']);
});

gulp.task('default', ['version']);