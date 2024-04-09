// include gulp
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const util = require('minimist');
const replace = require('gulp-replace');
const path = require('path');

// include plug-ins
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const eslint = require('gulp-eslint-new');
const babel = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const terser = require('gulp-terser');

const isDev = util(process.argv.slice(3)).dev === true; // replacement for gulp-util 'env' (deprecated for 4 years now)
console.log('Dev mode on: ' + isDev);
let prefix = '/etc.clientlibs/dhl/clientlibs';

// Bundler for ES6
let bundler = null;
let animatedBundler = null;

// sass task
gulp.task('sass', finished => {
  /* This is the main (site-wide) stylesheet */
  gulp.src('./sass/main.scss')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./sass']
    }).on('error', sass.logError))
    .pipe(replace('__prefix__', prefix))
    .pipe(postcss([autoprefixer()]))
    // .pipe(autoprefixer({ remove: false, browsers: ['last 100 versions'] }))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./src/main/content/jcr_root/apps/dhl/clientlibs/discover/css'));

    gulp.src('node_modules/flag-icons/css/flag-icons.min.css')
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(replace('../flags', prefix + "/discover/resources/flags"))
        .pipe(postcss([autoprefixer()]))
        // .pipe(autoprefixer({ remove: false, browsers: ['last 100 versions'] }))
        .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps')))
        .pipe(gulp.dest('./src/main/content/jcr_root/apps/dhl/clientlibs/discover/css'));

  /* This is for a 'standalone' stylesheet meant to be delivered via a separate clientlib AEM package */
  gulp.src('./sass/animated-pages.scss')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./sass']
    }).on('error', sass.logError))
    .pipe(replace('__prefix__', prefix))
    .pipe(postcss([autoprefixer()]))
    // .pipe(autoprefixer({ remove: false, browsers: ['last 100 versions'] }))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps')))
    .pipe(gulp.dest('./src/main/content/jcr_root/apps/dhl/clientlibs/discover-animatedpages/css'));

  finished();
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
  let scriptDest = './src/main/content/jcr_root/apps/dhl/clientlibs/discover/js';
  let scriptDestAnimated = './src/main/content/jcr_root/apps/dhl/clientlibs/discover-animatedpages/js';
  // Create bundle
  if (bundler === null) {
    bundler = browserify(path.join(scriptsPath, 'main.js'), { debug: isDev }).transform(babel, {presets: ['@babel/preset-env']});
    animatedBundler = browserify(path.join(scriptsPath, 'animated.js'), { debug: isDev }).transform(babel, {presets: ['@babel/preset-env']});
  }

  let vendor = gulp.src(path.join(scriptsPath, 'vendor', '/**/*.js'))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(scriptDest))
    // .pipe(gulpIf(!isDev, uglify())) to be removed if 'gulp-terser' works
    .pipe(gulpIf(!isDev, terser()))
    .pipe(rename('vendor.min.js'))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps', {
      sourceRoot: '/',
      includeContent: false
    })))
    .pipe(gulp.dest(scriptDest));

  let app = bundler.bundle()
    .on('error', (err) => {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest(scriptDest))
    .pipe(buffer())
    .pipe(gulpIf(isDev, sourcemaps.init({ loadMaps: true })))
    // .pipe(gulpIf(!isDev, uglify())) to be removed if 'gulp-terser' works
    .pipe(gulpIf(!isDev, terser()))
    .pipe(rename('main.min.js'))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps', {
      sourceRoot: '/',
      includeContent: false
    })))
    .pipe(gulp.dest(scriptDest));

  let animatedApp = animatedBundler.bundle()
    .on('error', (err) => {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('animated.js'))
    .pipe(gulp.dest(scriptDestAnimated))
    .pipe(buffer())
    .pipe(gulpIf(isDev, sourcemaps.init({ loadMaps: true })))
    // .pipe(gulpIf(!isDev, uglify())) to be removed if 'gulp-terser' works
    .pipe(gulpIf(!isDev, terser()))
    .pipe(rename('animated.min.js'))
    .pipe(gulpIf(isDev, sourcemaps.write('./sourcemaps', {
      sourceRoot: '/',
      includeContent: false
    })))
    .pipe(gulp.dest(scriptDestAnimated));

  return merge(vendor, app, animatedApp);
});

gulp.task('copyFlagIcons', () => {
  return gulp.src('node_modules/flag-icons/flags/**/*')
    .pipe(gulp.dest('./src/main/content/jcr_root/apps/dhl/clientlibs/discover/resources/flags'));
});

// build task
gulp.task('build', gulp.series('sass', 'javascript', 'copyFlagIcons'), finished => {
  gulp.src(['./sass/*.css', '!./node_modules/**/*']).pipe(gulp.dest('./build/sass'));
  gulp.src(['./js/mini/*.min.js', '!./node_modules/**/*']).pipe(gulp.dest('./build/js/mini'));
  gulp.src(['./**/*.php', '!./node_modules/**/*', '!./build/**/*']).pipe(gulp.dest('./build'));
  gulp.src(['./fonts/**/*', '!./node_modules/**/*', '!./build/**/*']).pipe(gulp.dest('./build/fonts'));
  gulp.src(['./**/*.gif', './**/*.jpg', './**/*.jpeg', './**/*.png', './**/*.ico', './**/*.svg',
    '!./node_modules/**/*', '!./build/**/*']).pipe(gulp.dest('./build'));
  finished();
});

// default task
gulp.task('default', gulp.series('sass', 'javascript', 'copyFlagIcons'));
