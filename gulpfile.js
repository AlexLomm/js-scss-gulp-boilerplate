'use strict';

const gulp          = require('gulp');
const clean         = require('gulp-clean');
const sass          = require('gulp-sass');
const minifyCSS     = require('gulp-minify-css');
const autoPrefixer  = require('gulp-autoprefixer');
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify');
const babel         = require('gulp-babel');
const webpackStream = require('webpack-stream');
const webpack       = require('webpack');
const yargs         = require('yargs');
const browserSync   = require('browser-sync').create();

// determine whether it's a dev or production mode
const isDev = !!(() => yargs.argv._.find(a => a === 'serve'))();

const config = {
  server: './',
  rootDir: './',
  js: {
    app: {
      entryFile: './src/js/app/index.js',
      outFile: 'app.js',
      srcDir: './src/js/app',
    },
    vendor: {
      entryFile: './src/js/vendor/index.js',
      outFile: 'vendor.js',
      srcDir: './src/js/vendor',
    },
    distDir: './dist/js',
  },
  styles: {
    app: {
      entryFile: './src/styles/app/index.scss',
      outFile: 'app.css',
      srcDir: './src/styles/app'
    },
    vendor: {
      entryFile: './src/styles/vendor/index.scss',
      outFile: 'vendor.css',
      srcDir: './src/styles/vendor'
    },
    distDir: './dist/css',
  },
  static: {
    srcDir: './static',
    distDir: './dist/static',
  }
};

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
    server: config.server,
    open: yargs.argv.open
  });
});

/**
 * Static files
 */
gulp.task('clean-static', cleanUpFactory(config.static.distDir));

gulp.task('static', ['clean-static'], () => {
  return gulp.src(`${config.static.srcDir}/**/*.*`)
    .pipe(gulp.dest(config.static.distDir));
});

/**
 * CSS / SCSS
 */
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

    if (!isDev) {
      stream.pipe(minifyCSS());
    }

    stream.pipe(concat(outName))
      .pipe(gulp.dest(config.styles.distDir));

    if (isDev) {
      stream.pipe(browserSync.stream());
    }

    return stream;
  };
}

/**
 * Javascript
 */
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

function cleanUpFactory(path) {
  console.log(path);

  return () => {
    // Option `read: false` prevents gulp from reading the
    // contents of the file and makes this task a lot faster
    return gulp.src(path, {read: false})
    // `force: true` enables deleting files
    // outside of the working directory.
      .pipe(clean({force: true}));
  };
}

function processJsFactory(entryFileName, outName) {
  return () => {
    const stream = gulp.src(entryFileName)
      .pipe(webpackStream({
        mode: isDev ? 'development' : 'production'
      }, webpack))
      .pipe(babel({
        presets: ['env'],
        plugins: ['transform-object-rest-spread']
      }));

    if (!isDev) {
      stream.pipe(uglify());
    }

    stream.pipe(concat(outName))
      .pipe(gulp.dest(config.js.distDir));

    return stream;
  };
}
