var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');


gulp.task('lint', function() {
  return gulp.src(['app.js','./appServer/**/*.js','./api/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['lib/**', 'test/**'], ['mocha']);
});


gulp.task('qa-test', function() {
  return gulp.src(['test/test-*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('mocha-zombie', function() {
  return gulp.src('./public/qa/tests-zombie.js', { read: false })
    .pipe(mocha({
      reporter: 'spec',
      ui:'bdd'

      }
    ));
});

gulp.task('default',['lint']);