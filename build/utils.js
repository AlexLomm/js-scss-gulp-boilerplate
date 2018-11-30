'use strict';

const gulp  = require('gulp');
const clean = require('gulp-clean');

module.exports = {
  cleanUpFactory(path) {
    return () => {
      // Option `read: false` prevents gulp from reading the
      // contents of the file and makes this task a lot faster
      return gulp.src(path, {read: false})
        // `force: true` enables deleting files
        // outside of the working directory.
        .pipe(clean({force: true}));
    };
  }
};
