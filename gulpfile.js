const { src, dest, watch } = require('gulp');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rename = require('gulp-rename');


function build(cb) {
  cb();

  return src('src/scss/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(rename('style.css'))
    .pipe(dest('src'));
}

exports.build = build;

exports.default = function() {
  watch('src/scss/**/*', { delay: 500 }, build);
}
