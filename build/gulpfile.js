'use strict';

const gulp        = require('gulp');
const yargs       = require('yargs');
const browserSync = require('browser-sync').create();

// determine whether it's a dev or production mode
const isDev = !!(() => yargs.argv._.find(a => a === 'serve'))();

const args = {
  isDev
};

require('./static')(args);
require('./scripts')(args);
require('./styles')(args, browserSync);

const config = require('./config');

const jobNames = [
  'static',
  'styles-vendor',
  'styles-app',
  'js-vendor',
  'js-app'
];

// prod
gulp.task('build', jobNames);

// dev
gulp.task('serve', jobNames, () => {
  // watch html files
  gulp.watch(`${config.rootDir}/**/*.html`)
    .on('change', browserSync.reload);

  // watch static files
  gulp.watch(`${config.static.srcDir}/**/*.*`, ['static'])
    .on('change', browserSync.reload);

  // watch vendor styles
  gulp.watch([
    `${config.styles.vendor.srcDir}/**/*.scss`,
    `${config.styles.vendor.srcDir}/**/*.css`,
  ], ['styles-vendor']);

  // watch app-specific styles
  gulp.watch([
    `${config.styles.app.srcDir}/**/*.scss`,
    `${config.styles.app.srcDir}/**/*.css`,
  ], ['styles-app']);

  // watch vendor scripts
  gulp.watch(`${config.js.vendor.srcDir}/**/*.js`, ['js-vendor'])
    .on('change', browserSync.reload);

  // watch app-specific js
  gulp.watch(`${config.js.app.srcDir}/**/*.js`, ['js-app'])
    .on('change', browserSync.reload);

  browserSync.init({
    server: yargs.argv.server || config.server,
    open: yargs.argv.open || config.open,
    ghostMode: yargs.argv.ghostMode || config.ghostMode,
    port: yargs.argv.port || config.port,
  });
});
