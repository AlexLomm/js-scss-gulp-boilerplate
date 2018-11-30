'use strict';

const gulp = require('gulp');

const config           = require('./config');
const {cleanUpFactory} = require('./utils');

module.exports = (args = {}) => {
  gulp.task('clean-static', cleanUpFactory(config.static.distDir));

  gulp.task('static', ['clean-static'], () => {
    return gulp.src(`${config.static.srcDir}/**/*.*`)
      .pipe(gulp.dest(config.static.distDir));
  });
};
