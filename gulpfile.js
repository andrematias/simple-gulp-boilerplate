"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const validator = require("gulp-html");
const del = require("del");
const useref = require("gulp-useref");
const uglify = require("gulp-uglify");
const cssnano = require("gulp-cssnano");
const gulpIf = require("gulp-if");
const brownserSync = require("browser-sync").create();

const files = {
  sass: "./src/sass/**/*.scss",
  fonts: "./src/fonts/**/*",
  html: "./src/*.html",
  js: "./src/js/**/*.js",
};

//Compiling SASS files
gulp.task("styles", () => {
  return gulp
    .src(files.sass)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./src/css"))
    .pipe(brownserSync.stream());
});

//Creating a hot serve
gulp.task("serve", () => {
  brownserSync.init({
    server: {
      baseDir: "./src",
    },
  });
  gulp.watch(files.sass, gulp.series(["styles"]));
  gulp.watch(files.html).on("change", brownserSync.reload);
  gulp.watch(files.js).on("change", brownserSync.reload);
});

//Cleaning the dist folder
gulp.task("clear", async () => {
  await del("/dist/**");
});

//Validating, minifying and coping files to dist
gulp.task("build", () => {
  gulp.src(files.fonts).pipe(gulp.dest("./dist/fonts"));
  gulp
    .src(files.html)
    .pipe(useref())
    .pipe(validator())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("./dist"));
});

gulp.task("default", gulp.series(["serve"]));
