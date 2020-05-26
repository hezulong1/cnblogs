const { src, dest, watch } = require('gulp');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rename = require('gulp-rename');


function build(cb) {
  cb();

  return src('src/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    // .pipe(cleanCss())
    .pipe(rename('style.css'))
    .pipe(dest('dist'));
}

exports.build = build;

exports.default = function() {
  watch('src/**/*', { delay: 500 }, build);
}
