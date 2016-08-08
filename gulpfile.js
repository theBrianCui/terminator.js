var gulp = require('gulp');
var babel = require('gulp-babel');
var uglifyjs = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

gulp.task('scripts', function() {
    return gulp.src('src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglifyjs())
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
    return gulp.src('src/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['scripts', 'styles']);