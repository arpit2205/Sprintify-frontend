var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

gulp.task("build", function () {
  return gulp
    .src(["app/**/*.js"])
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

console.log("gulp");
