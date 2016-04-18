var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var karma= require('karma').Server;

gulp.task('lint', function(cb) {
  return gulp.src(['app.js','./appServer/**/*.js',
        './api/**/*.js','./public/qa/**/test*.js',
        './appClient/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

    cb(err);
});
gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['lib/**', 'test/**'], ['mocha']);
});


gulp.task('qa-test', ['lint'],function() {
  return gulp.src(['public/qa/api/test-*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
      }
    }));
});

gulp.task('mocha-zombie-user',['lint'], function() {
  return gulp.src('./public/qa/tests-zombie-user.js', { read: false })
    .pipe(mocha({
      reporter: 'spec',
      ui:'bdd'
      }
    ));
});

gulp.task('mocha-zombie-blog',['lint'], function() {
  return gulp.src('./public/qa/tests-zombie-blog.js', { read: false })
    .pipe(mocha({
      reporter: 'spec',
      ui:'bdd'
      }
    ));
});

gulp.task('karma',function(done){
  new karma({
    configFile:__dirname+'/karma.conf.js',
    singleRun:true
  },done).start();
});

gulp.task('default',['lint','mocha-zombie-user']);
