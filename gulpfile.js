const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

gulp.task('js', () => {
  gulp.src(['./public/app/app.js', './public/app/**/*.js'])
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./public/dist'))
})

gulp.task('css', () => {
  gulp.src('./public/styles/**/*.scss')
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest('./public/dist'))
})

gulp.task('default', ['js', 'css'])

gulp.watch(['./public/app/**/*.js'], ['js'])
gulp.watch(['./public/styles/**/*.scss'], ['css'])
