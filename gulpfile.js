const { src, dest, parallel, series, watch } = require('gulp');
const browsersync = require('browser-sync').create();
const del = require('del');
const concat= require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function browserSync() {
    browsersync.init({
       server: { baseDir: 'src/'},
       notify: false,
       online: true,
    })
}

function scripts() {
    return src('src/js/script.js')
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js/'))
    .pipe(browsersync.stream())
}

function styles() {
    return src('src/scss/main.scss')
    .pipe(sass())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }) )
    .pipe(cleancss( {level: {1: {specialComments: 0 }}} ) )
    .pipe(dest('src/css/'))
}

function images() {
    return src('src/img/sourse/**/*')
    .pipe(newer('src/img/'))
    .pipe(imagemin())
    .pipe(dest('src/img/'))
}

function fileWatch() {
    watch(['src/js/**/*.js', '!src/js/**/*.min.js'], scripts).on('change', browsersync.reload);
    watch('src/scss/**/*.scss', styles).on('change', browsersync.reload);
    watch('src/**/*.html').on('change', browsersync.reload)
}

function cleanDist() {
    return del('dist/**/*')
}

function buildDist() {
    return src([
        'src/js/**/*min.js',
        'src/css/**/*min.css',
        'src/img/*.*',
        'src/index.html',
    ], {base: 'src'})
    .pipe(dest('dist'))
}


exports.browsersync = browserSync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;

exports.build = parallel(cleanDist, styles, scripts, images, buildDist)
exports.default = parallel(styles, scripts, images, browserSync, fileWatch)