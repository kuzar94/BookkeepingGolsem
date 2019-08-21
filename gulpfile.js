const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const notifier = require("node-notifier");

sass.compiler = require("node-sass");

function showError(err) {
  console.log("XXXXXXXXXXXXXXXXXXXXXX");
  console.log(err.messageFormatted);
  console.log("XXXXXXXXXXXXXXXXXXXXXX");
  notifier.notify({
    title: "FATAL ERROR ",
    message: err.messageFormatted
  });
  this.emit("end");
}

const server = function(cb) {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  cb();
};

const css = function() {
  return gulp
    .src("./scss/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", showError))
    .pipe(autoprefixer({}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
};

const watcher = function() {
  gulp.watch("./scss/**/*.scss", gulp.series(css));
  gulp.watch("./*.html").on("change", browserSync.reload);
};

exports.css = css;
exports.watcher = watcher;
exports.default = gulp.parallel(server, css, watcher);
