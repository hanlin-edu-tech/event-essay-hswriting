var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var templateUtil = require("gulp-template-util");
var del = require("del");
var Q = require("q");

var basePath = { base: "src" };
var dist = "dist";

var clean = sourceDir => {
  var task_clean = () => {
    return del([sourceDir]);
  };
  return task_clean;
};

var copyStaticFile = () => {
  var task_copyStaticFile = () => {
    return gulp.src(["src/**/*.html"], basePath).pipe(gulp.dest(dist));
  };
  return task_copyStaticFile;
};

var minifyImage = sourceImage => {
  var task_minifyImage = () => {
    return gulp
      .src(sourceImage, basePath)
      .pipe(imagemin({ use: [pngquant()] }))
      .pipe(gulp.dest(dist));
  };
  return task_minifyImage;
};

var minifyCSS = sourceCss => {
  var task_minifyCSS = () => {
    return gulp
      .src(sourceCss, basePath)
      .pipe(cleanCSS({ keepBreaks: true }))
      .pipe(gulp.dest(dist));
  };
  return task_minifyCSS;
};

var minifyJS = sourceJS => {
  var task_minifyJS = () => {
    return gulp
      .src(sourceJS, basePath)
      .pipe(
        uglify({ mangle: false }).on("error", function(error) {
          console.log(error);
        })
      )
      .pipe(gulp.dest(dist));
  };
  return task_minifyJS;
};

gulp.task("clean", clean(dist));
gulp.task("copyStaticFile", copyStaticFile());
gulp.task("minifyCSS", minifyCSS("src/css/*.css"));
gulp.task("minifyImage", minifyImage("src/img/*.png"));
gulp.task("minifyJS", minifyJS("src/js/*.js"));

gulp.task("package", () => {
  var deferred = Q.defer();
  Q.fcall(function() {
    return templateUtil.logPromise(clean(dist));
  })
    .then(function() {
      return Q.all([templateUtil.logStream(copyStaticFile())]);
    })
    .then(function() {
      return Q.all([
        templateUtil.logStream(minifyImage("src/img/*.png")),
        templateUtil.logStream(minifyCSS("src/css/*.css")),
        templateUtil.logStream(minifyJS("src/js/*.js"))
      ]);
    });
});
