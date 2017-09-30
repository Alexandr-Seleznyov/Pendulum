var     gulp = require("gulp"),           // Подключаем gulp
     connect = require("gulp-connect"),   // Для поднятие сервера и для livereload
     htmlmin = require("gulp-htmlmin"),   // Минимизация HTML
      cssmin = require("gulp-cssmin"),    // Минимизация CSS
      uglify = require("gulp-uglify"),     // Минимизация JS
         rjs = require("gulp-requirejs"), // Для сборки JS в один файл
        jade = require("gulp-jade"),      // Компиляция JADE
        sass = require('gulp-sass'),      // Компиляция SASS
      rename = require("gulp-rename");    // Переименование имени файла
  // ngAnnotate = require('gulp-ng-annotate'); // Внедряет зависимости в объявлении переменных в Angular,
                                            // требуется для сжатия файлов.

// Для того, чтобы сразу отображать изменения в браузере,
// используем модуль gulp-connect который подымет сервер и
// будет рефрешить браузер при помощи livereload
gulp.task("connect", function(){
  connect.server({
    port: 1340,
    livereload: true,
    root: "./dist"
  });
});


// Сжимаем html файлы из директории app/html
// и копируем их в директорию dist
gulp.task("htmlmin", function(){
  gulp.src("app/html/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});


// Сжимаем css файлы из директории app/css,
// добавляем к имени файла суффикс .min
// и переносим их в каталог dist/css
gulp.task("cssmin", function(){
    gulp.src("app/css/*.css")
    .pipe(cssmin())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
});


// Строим 1 сжатый js файл из нескольких (из каталога app/js), назовём его all.min.js
// сожмём его
// и перенесём в dist/js
gulp.task("buildjs", function(){
  rjs({
    // Корень, относительно которого будет работать requirejs
    baseUrl: "app/js",

    // Almond можно поставить через bower: >bower install almond
    // Установка bower: >npm i -g bower
    name: "../../bower_components/almond/almond",

    //main.js - Точка входа (расширение не указывается)
    include: ["main"],
    insertRequire: ["main"],
    out: "main.min.js",
    //Включим обёртку, чтобы ничего не оставалось в глобальной области видимости.
    wrap: true
  })
  // Внедрим зависимости в объявлении переменных в Angular, перед сжатием.
  // .pipe(ngAnnotate())

  // Сожмём полученый all.js
  .pipe(uglify())
  .pipe(gulp.dest("dist/js"))
  .pipe(connect.reload());
});



// gulp.task("jsAngular", function(){
//     gulp.src("app/js/ng/*.js")
//     // Внедрим зависимости в объявлении переменных в Angular, перед сжатием.
//     .pipe(ngAnnotate())
//     .pipe(uglify())
//     .pipe(gulp.dest("dist/js"))
//     .pipe(connect.reload());
// });


gulp.task("jsOther", function(){
    gulp.src("app/js/other/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());
});


// Компилируем jade-файлы из каталога app/jade в html-файлы 
// и копируем их в каталог app/html
gulp.task("jade", function(){
  gulp.src("app/jade/*.jade")
    .pipe(jade())
    .pipe(gulp.dest("app/html"));
    //.pipe(connect.reload());
});


// Компилируем sass-файлы из каталога app/sass в css-файлы 
// и копируем их в каталог app/css
gulp.task("sass", function () {
  gulp.src("app/sass/*.sass")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("app/css"));
    //.pipe(connect.reload());
});


// Копируем картинки из app/img в dist/img
gulp.task("imgmove", function(){
  gulp.src("app/img/*")
  .pipe(gulp.dest("dist/img"))
  .pipe(connect.reload());
});


// Копируем шрифты из app/fonts в dist/fonts
gulp.task("fontsmove", function(){
  gulp.src("app/fonts/*")
  .pipe(gulp.dest("dist/fonts"))
  .pipe(connect.reload());
});


// Копируем все файлы из app/other в dist/other
gulp.task("othermove", function(){
  gulp.src("app/other/**/*.*")
  .pipe(gulp.dest("dist/other"))
  .pipe(connect.reload());
});


gulp.task("watch", function(){
  gulp.watch("app/html/*.html", ["htmlmin"]);
  gulp.watch("app/css/*.css", ["cssmin"]);
  gulp.watch("app/js/**/*.js", ["buildjs"]);
  // gulp.watch("app/js/ng/*.js", ["jsAngular"]);
  gulp.watch("app/js/other/*.js", ["jsOther"]);
  gulp.watch("app/jade/*.jade", ["jade"]);
  gulp.watch("app/sass/*.sass", ["sass"]);
  gulp.watch("app/img/*", ["imgmove"]);
  gulp.watch("app/fonts/*", ["fontsmove"]);
  gulp.watch("app/other/**/*.*", ["othermove"]);
})


gulp.task("default",
  ["connect",
   "htmlmin",
   "cssmin",
   "buildjs",
   // "jsAngular",
   "jsOther",
   "jade",
   "sass",
   "imgmove",
   "fontsmove",
   "othermove",
   "watch"], function(){
});