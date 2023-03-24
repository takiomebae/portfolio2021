'use strict'

const { src, dest, parallel,watch } = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cleanCSS = require("gulp-clean-css"),
    rename   = require("gulp-rename"),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    mozjpeg = require('imagemin-mozjpeg'),
    pngquant = require('imagemin-pngquant'),
    uglify = require("gulp-uglify")
    ;
    // watch = require("gulp-watch");

//setting : paths
const pathSrc = {
  'css': [
    './src/scss/**/*.scss'
  ],
  'js': [
    './src/js/**/*.js',
  ],
  'images': [
    './src/img/*',
  ],
}

const pathDist = {
  'css': './wp/wp-content/themes/portfolio2021/css/',
  'js' : './wp/wp-content/themes/portfolio2021/js/',
  'images' : './wp/wp-content/themes/portfolio2021/img/'
}

function cssMinTask() {
  return src(pathDist.css)
      .pipe(cleanCSS())
      .pipe(rename({
        extname: '.min.css'
      }))
      .pipe(dest(pathDist.css))
}
function jsMinTask() {
  return src(pathSrc.js)
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(dest(pathDist.js))
}

function taskImagemin () {
  return src(pathSrc.images)
      .pipe(plumber())
      .pipe(imagemin([
        pngquant({
          quality: [.7, .85],
          speed: 1
        }),
        mozjpeg({
          quality: 80
        }),
        imagemin.gifsicle({
          interlaced: false
        }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        }),
      ]))
      // .pipe(rename(
      //     { suffix: '_min' }
      // ))
      .pipe(dest(pathDist.images))
}

function watchStyle() {
  // watch(pathSrc.css, sassTask)
  watch(pathDist.css, cssMinTask)
  watch(pathSrc.js, jsMinTask)
  watch(pathSrc.images, taskImagemin)
  watch(pathSrc.images, parallel(taskImagemin))
}

exports.watch = watchStyle
exports.default = parallel(cssMinTask,taskImagemin,jsMinTask)
