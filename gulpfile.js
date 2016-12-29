const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

gulp.task('build', () => {
 gulp.src('src/ringo.js')
  .pipe(babel({presets: ['env']}))
  .pipe(gulp.dest('./dist/'));
 gulp.src('src/ringo.js')
  .pipe(babel({presets: ['env']}))
  .pipe(concat('ringo.min.js'))
  .pipe(uglify({ ascii_only: true }))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build']);
