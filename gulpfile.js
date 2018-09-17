var gulp = require('gulp')
var plumber = require('gulp-plumber')
var rename = require('gulp-rename')
var sass = require('gulp-sass')
var autoPrefixer = require('gulp-autoprefixer')
// if node version is lower than v.0.1.2
require('es6-promise').polyfill()
var cssComb = require('gulp-csscomb')
var cmq = require('gulp-merge-media-queries')
var cleanCss = require('gulp-clean-css')
var terser = require('gulp-terser')
var concat = require('gulp-concat')
var pug = require('gulp-pug')
var del = require('del')

// livereload
var connect = require('gulp-connect')

var options = {
    pluginName: 'isiaLightbox',
    liveServerPort: 3000,
    usePug: false,
    useThemes: true
}


var dir = {
  srcDir: 'src',
  distDir: 'dist',
  themesLabel: 'themes',
  themesDir: 'src/sass/themes',
  demoDir: 'demo'
}

/*
 * clean up 
 */
gulp.task('clean', function () {
  return del([
    dir.srcDir + '/css/' + options.pluginName + '.css',
    dir.srcDir + '/css/themes',
    dir.distDir + '/**/*.*',
    dir.distDir + '/themes',
    dir.demoDir + '/public/css/**/*.*',
    dir.demoDir + '/public/css/themes',
    dir.demoDir + '/src/css/' + options.pluginName + '.demo' + '.css',
    dir.demoDir + '/src/css/' + options.pluginName + '.demo.min' + '.css',
    dir.demoDir + '/public/js/**/*.*'
  ]);
});

/*
 * server
 */
gulp.task('connectDev', function () {
    connect.server({
      name: 'Dev Server',
      root: [dir.demoDir + '/public'],
      port: options.liveServerPort,
      livereload: true
    })
})

/*
 * source
 */
gulp.task(dir.srcDir + '_sass', function () {
  console.log(dir.srcDir)
  gulp.src([dir.srcDir + '/sass/**/*.scss', '!' + dir.srcDir + '/sass/themes/**/*'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(sass())
    .pipe(autoPrefixer())
    .pipe(cssComb())
    .pipe(cmq({log: true}))
    .pipe(concat(options.pluginName + '.css'))
    .pipe(gulp.dest(dir.srcDir + '/css'))
})
gulp.task(dir.srcDir + '_js', function () {
  gulp.src([dir.srcDir + '/js/**/*.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(concat(options.pluginName + '.js'))
    .pipe(gulp.dest(dir.distDir))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(terser())
    .pipe(gulp.dest(dir.distDir))
})
gulp.task(dir.srcDir + '_move_css', [dir.srcDir + '_sass'], function() {
    gulp.src([dir.srcDir + '/css/**/*.css', '!' + dir.srcDir + '/css/themes/**/*'])
      .pipe(concat(options.pluginName + '.css'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(cleanCss())
      .pipe(gulp.dest(dir.distDir))
})
gulp.task(dir.srcDir + '_move_uncompressed_css', [dir.srcDir + '_move_css'], function() {
  gulp.src([dir.srcDir + '/css/**/*.css', '!' + dir.srcDir + '/css/themes/**/*'])
    .pipe(concat(options.pluginName + '.css'))
    .pipe(gulp.dest(dir.distDir))
})

/*
 * themes
 */
gulp.task(dir.themesLabel + '_sass', [dir.srcDir + '_move_uncompressed_css'], function () {
  if (options.useThemes) {
    gulp.src([dir.themesDir + '/**/*.scss'])
      .pipe(plumber({
        handleError: function (err) {
          console.log(err)
          this.emit('end')
        }
      }))
      .pipe(sass())
      .pipe(autoPrefixer())
      .pipe(cssComb())
      .pipe(cmq({log: true}))
      .pipe(gulp.dest(dir.srcDir + '/css/themes'))
      .pipe(rename({
        prefix: options.pluginName + '.',
        suffix: '-theme.min'
      }))
      .pipe(cleanCss())
      .pipe(gulp.dest(dir.distDir + '/themes'))    
  }
})

/*
 * demo
 */
gulp.task(dir.demoDir + '_sass', function () {
  gulp.src([dir.demoDir + '/src/sass/**/*.scss'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(sass())
    .pipe(autoPrefixer())
    .pipe(cssComb())
    .pipe(cmq({log: true}))
    .pipe(concat(options.pluginName + '.' + dir.demoDir + '.css'))
    .pipe(gulp.dest(dir.demoDir + '/src/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest(dir.demoDir + '/src/css'))
    .pipe(connect.reload());
})
gulp.task(dir.demoDir + '_js', function () {
  gulp.src([dir.demoDir + '/src/js/**/*.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(concat(options.pluginName + '.' + dir.demoDir + '.js'))
    .pipe(gulp.dest(dir.demoDir + '/public/js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(terser())
    .pipe(gulp.dest(dir.demoDir + '/public/js'))
    .pipe(connect.reload());
})
gulp.task(dir.demoDir + '_move_css', function () {
  gulp.src([dir.demoDir + '/src/css/**/*.*.css'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(gulp.dest(dir.demoDir + '/public/css'))
    .pipe(connect.reload());
})
gulp.task(dir.demoDir + '_pug', function () {
  if (options.usePug) {
    gulp.src([dir.demoDir + '/src/html/*.pug'])
      .pipe(plumber({
        handleError: function (err) {
          console.log(err)
          this.emit('end')
        }
      }))
      .pipe(pug())
      .pipe(gulp.dest(dir.demoDir + '/public'))
      .pipe(connect.reload());
  }
})  



/*
 * Demo Set up
 */

// Move Base JS to demo
gulp.task('move_js', [dir.srcDir + '_js'],  function () {
  gulp.src([dir.distDir + '/**/*.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(gulp.dest(dir.demoDir + '/public/js'))
    .pipe(connect.reload());
})

// Move Jquery
gulp.task('move_jquery', function () {
  gulp.src(['node_modules/jquery/dist/jquery.min.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(gulp.dest(dir.demoDir + '/public/js'))
    .pipe(connect.reload());
})

// Move Base CSS to demo
gulp.task('move_css', [dir.themesLabel + '_sass'], function () {
  gulp.src([dir.distDir + '/**/*.css'],{'base' : './' + dir.distDir})
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(gulp.dest(dir.demoDir + '/public/css'))
    .pipe(connect.reload());
})

gulp.task('default',
  [ dir.srcDir + '_js',
    //dir.srcDir + '_sass',
    //dir.srcDir + '_move_css',
    //dir.srcDir + '_move_uncompressed_css',
    //dir.themesLabel + '_sass',
    dir.demoDir + '_js',
    dir.demoDir + '_sass',
    dir.demoDir + '_pug',
    dir.demoDir + '_move_css',
    //'move_js',
    'move_jquery',
    'move_css',
    'connectDev'],
    function () {
    /*
     * source
     */

    gulp.watch(dir.srcDir + '/js/**/*.js', [dir.srcDir + '_js'])
    gulp.watch(dir.srcDir + '/sass/**/*.scss', [dir.srcDir + '_sass'])
    gulp.watch(dir.srcDir + '/css/**/*.css', [dir.srcDir + '_move_css'])
    gulp.watch(dir.srcDir + '/css/**/*.css', [dir.srcDir + '_move_uncompressed_css'])

    /*
     * themes
     */
    gulp.watch(dir.themesDir + '/**/*.scss', [dir.themesLabel + '_sass'])

    /*
     * demo
     */
    gulp.watch(dir.demoDir + '/src/js/**/*.js', [dir.demoDir + '_js'])
    gulp.watch(dir.demoDir + '/src/sass/**/*.scss', [dir.demoDir + '_sass'])
    gulp.watch(dir.demoDir + '/src/html/**/*.pug', [dir.demoDir + '_pug'])
    gulp.watch(dir.demoDir + '/src/css/**/*.css', [dir.demoDir + '_move_css'])

    /*
     * Demo Set up
     */
    gulp.watch(dir.distDir + '/**/*.js', ['move_js'])
    gulp.watch(dir.distDir + '/**/*.css', ['move_css'])
    gulp.watch('node_modules/jquery/dist/jquery.min.js', ['move_jquery'])
  })
