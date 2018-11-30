'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const minifyCSS    = require('gulp-minify-css');
const autoPrefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');

const config           = require('./config');
const {cleanUpFactory} = require('./utils');

module.exports = (args = {}, browserSync) => {
  gulp.task(
    'clean-styles-vendor',
    cleanUpFactory(
      `${config.styles.distDir}/${config.styles.vendor.outFile}`
    )
  );

  gulp.task(
    'styles-vendor',
    ['clean-styles-vendor'],
    processStylesFactory(
      config.styles.vendor.entryFile,
      config.styles.vendor.outFile
    )
  );

  gulp.task(
    'clean-styles-app',
    cleanUpFactory(
      `${config.styles.distDir}/${config.styles.app.outFile}`
    )
  );

  gulp.task(
    'styles-app',
    ['clean-styles-app'],
    processStylesFactory(
      config.styles.app.entryFile,
      config.styles.app.outFile
    )
  );

  function processStylesFactory(entryFileName, outName) {
    return () => {
      const stream = gulp.src(entryFileName)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer('last 2 versions'));

      if (!args.isDev) {
        stream.pipe(minifyCSS());
      }

      stream.pipe(concat(outName))
        .pipe(gulp.dest(config.styles.distDir));

      if (args.isDev) {
        stream.pipe(browserSync.stream());
      }

      return stream;
    };
  }
};
