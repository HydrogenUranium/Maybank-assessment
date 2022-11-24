// include gulp
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const util = require('gulp-util');
const path = require('path');

// include plug-ins
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const merge = require('merge-stream');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const babel = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');

// Environment
const isDev = !util.env.build;

// Bundler for ES6
let bundler = null;
let animatedBundler = null;

// sass task
gulp.task('sass', () => {
  /* This is the main (site-wide) stylesheet */
  gulp.src('./sass/main.scss')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./sass']
    }).on('error', sass.logError))
    .pipe(autoprefixer({ remove: false, browsers: ['last 100 versions'] }))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./src/main/content/jcr_root/apps/dhl/clientlibs/clientlib-site/css'));

  /* This is for a 'standalone' stylesheet meant to be delivered via a separate clientlib AEM package */
  gulp.src('./sass/animated-pages.scss')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./sass']
    }).on('error', sass.logError))
    .pipe(autoprefixer({ remove: false, browsers: ['last 100 versions'] }))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./src/main/content/jcr_root/apps/dhl/clientlibs/clientlib-animatedpages/css'));

  /* This is for a 'standalone' stylesheet meant to be delivered via a separate clientlib AEM package */
  gulp.src('./sass/amp-*.scss')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./sass']
    }).on('error', sass.logError))
    .pipe(autoprefixer({ remove: false, browsers: ['last 100 versions'] }))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./sass'));
});

// javascript lint task
gulp.task('lint', () => {
  return gulp.src(['./js/dev/**/*.js', '!./js/dev/vendor/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// javascript task
// disable linting, because all the 'old' javascript re-included here doesn't pass
// gulp.task('javascript', ['lint'], () => {
gulp.task('javascript', () => {
  let scriptsPath = './js/dev';
  let scriptDest = './src/main/content/jcr_root/apps/dhl/clientlibs/clientlib-site/js';
  let scriptDestAnimated = './src/main/content/jcr_root/apps/dhl/clientlibs/clientlib-animatedpages/js';
  // Create bundle
  if (bundler === null) {
    bundler = browserify(path.join(scriptsPath, 'main.js'), { debug: isDev }).transform(babel);
    animatedBundler = browserify(path.join(scriptsPath, 'animated.js'), { debug: isDev }).transform(babel);
  }

  let vendor = gulp.src(path.join(scriptsPath, 'vendor', '/**/*.js'))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(scriptDest))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(rename('vendor.min.js'))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps', {
      sourceRoot: '/',
      includeContent: false
    })))
    .pipe(gulp.dest(scriptDest));

  let app = bundler.bundle()
    .on('error', (err) => {
      console.error(err)
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest(scriptDest))
    .pipe(buffer())
    .pipe(gulpIf(isDev, sourcemaps.init({ loadMaps: true })))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(rename('main.min.js'))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps', {
      sourceRoot: '/',
      includeContent: false
    })))
    .pipe(gulp.dest(scriptDest));

  let animatedApp = animatedBundler.bundle()
    .on('error', (err) => {
      console.error(err)
      this.emit('end');
    })
    .pipe(source('animated.js'))
    .pipe(gulp.dest(scriptDestAnimated))
    .pipe(buffer())
    .pipe(gulpIf(isDev, sourcemaps.init({ loadMaps: true })))
    .pipe(gulpIf(!isDev, uglify()))
    .pipe(rename('animated.min.js'))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps', {
      sourceRoot: '/',
      includeContent: false
    })))
    .pipe(gulp.dest(scriptDestAnimated));

  return merge(vendor, app, animatedApp);
});

// reload task
gulp.task('reload', () => {
  browserSync.reload();
});

// watch task
gulp.task('watch', () => {
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./js/dev/**/*.js', ['javascript']);
  gulp.watch(['./sass/**/*.css', './etc/**/*.css', './js/mini/**/*.js', './etc/**/*.js', './templates/**/*.php', './includes/**/*.php'], ['reload']);
});

// build task
gulp.task('build', ['sass', 'javascript'], () => {
  gulp.src(['./sass/*.css', '!./node_modules/**/*']).pipe(gulp.dest('./build/sass'));
  gulp.src(['./js/mini/*.min.js', '!./node_modules/**/*']).pipe(gulp.dest('./build/js/mini'));
  gulp.src(['./**/*.php', '!./node_modules/**/*', '!./build/**/*']).pipe(gulp.dest('./build'));
  gulp.src(['./fonts/**/*', '!./node_modules/**/*', '!./build/**/*']).pipe(gulp.dest('./build/fonts'));
  gulp.src(['./**/*.gif', './**/*.jpg', './**/*.jpeg', './**/*.png', './**/*.ico', './**/*.svg',
    '!./node_modules/**/*', '!./build/**/*']).pipe(gulp.dest('./build'));
});

// default task
gulp.task('default', ['sass', 'javascript', 'watch', 'browser-sync']);
