'use strict';

const gulp          = require('gulp');
const uglify        = require('gulp-uglify');
const babel         = require('gulp-babel');
const webpackStream = require('webpack-stream');
const webpack       = require('webpack');
const concat        = require('gulp-concat');

const config           = require('./config');
const {cleanUpFactory} = require('./utils');

module.exports = (args = {}) => {
  gulp.task(
    'clean-js-vendor',
    cleanUpFactory(
      `${config.js.distDir}/${config.js.vendor.outFile}`
    )
  );

  gulp.task(
    'js-vendor',
    ['clean-js-vendor'],
    processJsFactory(
      config.js.vendor.entryFile,
      config.js.vendor.outFile
    )
  );

  gulp.task(
    'clean-js-app',
    cleanUpFactory(
      `${config.js.distDir}/${config.js.app.outFile}`
    )
  );

  gulp.task(
    'js-app',
    ['clean-js-app'],
    processJsFactory(
      config.js.app.entryFile,
      config.js.app.outFile
    )
  );

  function processJsFactory(entryFileName, outName) {
    return () => {
      const stream = gulp.src(entryFileName)
        .pipe(webpackStream({
          mode: args.isDev ? 'development' : 'production'
        }, webpack))
        .pipe(babel({
          presets: ['env'],
          plugins: ['transform-object-rest-spread']
        }));

      if (!args.isDev) {
        stream.pipe(uglify());
      }

      stream.pipe(concat(outName))
        .pipe(gulp.dest(config.js.distDir));

      return stream;
    };
  }
};
