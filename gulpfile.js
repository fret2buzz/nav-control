// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------
var path = './';

var input = path + 'scss/**/*.scss';
var output = path + 'css/';
var host = path + '';

var libraries = [
    'node_modules'
];

var autoprefixerOptions = {
    browsers: [
        "last 2 versions",
        "> 3%",
        "ie 11"
    ]
};

// -----------------------------------------------------------------------------
// Sass build
// -----------------------------------------------------------------------------
function buildCss() {
    return gulp.src(input)
    // .pipe(sourcemaps.init())
    .pipe(sass(
            {"includePaths": libraries}
        ).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    // .pipe(sourcemaps.write())
    // .pipe(sourcemaps.write("../maps/"))
    .pipe(gulp.dest(output))
}

// -----------------------------------------------------------------------------
// Watcher
// -----------------------------------------------------------------------------
function stylesWatch() {
    return gulp
    // Watch the input folder for change,
    // and run reloadFunc when something happens
    .watch(input, gulp.series(buildCss, reloadFunc))
    .on('change', function(event) { // When there is a change log a message in the console
        console.log('File ' + event + ' was changed, running tasks...');
    });
}

// -----------------------------------------------------------------------------
// Live reload
// -----------------------------------------------------------------------------
const cors = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
};

function connectFunc() {
    return connect.server({
        root: host,
        https: true,
        port: 8081,
        host: '127.0.0.1',
        livereload: {
            start: true,
            port: 9000
        },
        middleware: function() {
            return [cors];
        }
    });
}

function reloadFunc() {
    return gulp
    .src(host + 'css/*.css')
    .pipe(connect.reload());
}

// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------
gulp.task('default', gulp.parallel(buildCss, connectFunc, stylesWatch));

// -----------------------------------------------------------------------------
// CSS task
// -----------------------------------------------------------------------------
gulp.task('css', buildCss);
