module.exports = {
  server: '../',
  rootDir: '../',
  open: false,
  ghost: false,
  port: 3000,
  js: {
    app: {
      entryFile: '../src/js/app/index.js',
      outFile: 'app.js',
      srcDir: '../src/js/app',
    },
    vendor: {
      entryFile: '../src/js/vendor/index.js',
      outFile: 'vendor.js',
      srcDir: '../src/js/vendor',
    },
    distDir: '../dist/js',
  },
  styles: {
    app: {
      entryFile: '../src/styles/app/index.scss',
      outFile: 'app.css',
      srcDir: '../src/styles/app'
    },
    vendor: {
      entryFile: '../src/styles/vendor/index.scss',
      outFile: 'vendor.css',
      srcDir: '../src/styles/vendor'
    },
    distDir: '../dist/css',
  },
  static: {
    srcDir: '../static',
    distDir: '../dist/static',
  }
};
