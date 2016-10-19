(function (console) {
  "use strict";

  var bower = require("gulp-bower");
  var bump = require("gulp-bump");
  var colors = require("colors");
  var del = require("del");
  var gulp = require("gulp");
  var jshint = require("gulp-jshint");
  var htmlreplace = require("gulp-html-replace");
  var runSequence = require("run-sequence");
  var uglify = require('gulp-uglify');
  var wct = require("web-component-tester").gulp.init(gulp);

  gulp.task("clean-bower", function(cb){
    del(["./bower_components/**"], cb);
  });

  gulp.task("lint", function() {
    return gulp.src("./*.html")
      .pipe(jshint.extract("always"))
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"));
  });

  gulp.task("version", function() {
    var pkg = require("./package.json");

    gulp.src("./rise-data.html")
      .pipe(htmlreplace({
        "version": {
          src: pkg.version,
          tpl: "<script>var dataVersion = \"%s\";</script>"
        }
      }, {keepBlockTags: true}))
      .pipe(gulp.dest("./"));
  });

  // ***** Primary Tasks ***** //
  gulp.task("bower-clean-install", ["clean-bower"], function(cb){
    return bower().on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
      .pipe(bump({type:"patch"}))
      .pipe(gulp.dest("./"));
  });

  gulp.task("test", function(cb) {
    runSequence("test:local", cb);
  });

  gulp.task("build", ["version"], function (cb) {
    runSequence("lint", cb);
  });

  gulp.task("default", [], function() {
    console.log("********************************************************************".yellow);
    console.log("  gulp bower-clean-install: delete and re-install bower components".yellow);
    console.log("  gulp bump: increment the version".yellow);
    console.log("  gulp test: run unit and integration tests".yellow);
    console.log("  gulp build: build component".yellow);
    console.log("********************************************************************".yellow);
    return true;
  });

})(console);
