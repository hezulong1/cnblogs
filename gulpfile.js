const { src, dest, watch } = require('gulp');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const connect = require('gulp-connect');

const isProd = process.env.NODE_ENV === 'production';
console.log('环境：', process.env.NODE_ENV);

function build(cb) {
  cb();

  const hash = Math.random().toString(36).slice(4);
  const fileName = isProd ? `${hash}.min.css` : 'custom.css';
  console.log('文件名：', fileName);

  return src('src/index.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // 嵌套输出方式 nested, 展开输出方式 expanded, 紧凑输出方式 compact, 压缩输出方式 compressed
    .pipe(autoprefixer())
    .pipe(gulpif(isProd, cleanCss()))
    .pipe(rename(fileName))
    .pipe(dest(isProd ? 'dist' : 'skin'))
    .pipe(gulpif(!isProd, connect.reload()));
}

exports.build = build;

exports.connect = function() {
  connect.server({
    root: 'skin',
    livereload: true
  })
}

exports.default = function() {
  watch('src/**/*', { delay: 500 }, build);
}
