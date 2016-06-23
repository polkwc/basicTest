var gulp = require('gulp'),
connect = require('gulp-connect'),
jshint = require('gulp-jshint'),
stylus = require('gulp-stylus'),
nib = require('nib'),
stylish = require('jshint-stylish'),
historyApiFallback = require('connect-history-api-fallback');

var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
  var sources = gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.css'], {read: false});
  //return gulp.src('index.html', {cwd: './app'})
  return gulp.src('.app/index.html')
  .pipe(inject(sources))
  //, {
  //
  // //  ignorePath: '/app'
  // }))
  .pipe(gulp.dest('./app'));
});
// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
  .pipe(wiredep({
    directory: './app/lib'
  }))
  .pipe(gulp.dest('./app'));
});

// Servidor web de desarrollo
gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8080,
    livereload: true
    // middleware: function(connect, opt) {
    //   return [ historyApiFallback ];
    // }
  });
});


// Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
  gulp.src('./app/stylesheets/main.styl')
  .pipe(stylus({ use: nib() }))
  .pipe(gulp.dest('./app/stylesheets'))
  .pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
  .pipe(connect.reload());
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() { return gulp.src('./app/scripts/**/*.js')
.pipe(jshint('.jshintrc'))
.pipe(jshint.reporter('jshint-stylish'))
.pipe(jshint.reporter('fail')); });

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
  gulp.watch(['./app/scripts/**/*.js', './gulpfile.js'], ['jshint','inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});


gulp.task('default', ['server','inject','wiredep', 'watch']);
e
