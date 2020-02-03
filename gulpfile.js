var Q = require("q");
var fs = require("fs");
var del = require("del");
var gulp = require("gulp");
var path = require("path");
var basePath = { base: "src" };
var readline = require("readline");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var cleanCSS = require("gulp-clean-css");
var templateUtil = require("gulp-template-util");
var dist = "dist";


const gcPub = require("gulp-gcloud-publish");
const bucketNameForTest = "tutor-test-events";
const bucketNameForProd = "tutor-events";
const projectId = "tutor-204108";
const projectIdTest = "tutor-test-238709";
const keyFileName = "tutor.json";
const keyFileNameTest = "tutor-test.json";
const projectName = "event/ad/";


let uploadGCSProd = bucketName => {
  return gulp
    .src(["dist/*.html", "dist/img/**", "dist/css/**", "dist/js/**"], {
      base: `${__dirname}/dist/`
    })
    .pipe(
      gcPub({
        bucket: bucketName,
        keyFilename: keyFileName,
        base: projectName,
        projectId: projectId,
        public: true,
        metadata: {
          cacheControl: "no-store, no-transform"
        }
      })
    );
};

let uploadGCSTest = bucketName => {
  return gulp
    .src(["dist/*.html", "dist/img/**", "dist/css/**", "dist/js/**"], {
      base: `${__dirname}/dist/`
    })
    .pipe(
      gcPub({
        bucket: bucketName,
        keyFilename: keyFileNameTest,
        base: projectName,
        projectId: projectIdTest,
        public: true,
        metadata: {
          cacheControl: "no-store, no-transform"
        }
      })
    );
};

var determineDeployProduction = () => {
  var replaceToProduction = () => {
    fs.readdir(destinationDir, (err, files) => {
      var writeToFile = fileContent => {
        fs.writeFile(entireFilePath, fileContent, "UTF-8", err => {
          if (err) throw err;
          console.log("The html file was succesfully saved!");
        });
      };

      var changeToCurrent = () => {
        fs.readFile(entireFilePath, "UTF-8", function (err, data) {
          if (err) throw err;
          if (data.includes("current.SNAPSHOT")) {
            var fileContent = data.replace(/current\.SNAPSHOT/g, "current");
            writeToFile(fileContent);
          }
        });
      };
      var entireFilePath;
      if (err) throw err;
      files.forEach(fileName => {
        if (/(.html)$/.test(fileName)) {
          entireFilePath = path.join(destinationDir, fileName);
          changeToCurrent();
        }
      });
    });
  };

  var destinationDir = `${__dirname}/dist/`;
  var prompts = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var isDeploy;
  prompts.question("是否部署至正式機 (如果是則輸入 Y) = ", function (input) {
    if (input === "Y") {
      replaceToProduction();
    }
    prompts.close();
  });
};

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
        uglify({ mangle: false }).on("error", function (error) {
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
  Q.fcall(function () {
    return templateUtil.logPromise(clean(dist));
  })
    .then(function () {
      return templateUtil.logStream(copyStaticFile());
    })
    .then(function () {
      return Q.all([
        templateUtil.logStream(minifyImage("src/img/*.png")),
        templateUtil.logStream(minifyCSS("src/css/*.css")),
        templateUtil.logStream(minifyJS("src/js/*.js"))
      ]);
    })
    .then(function () {
      return templateUtil.logPromise(determineDeployProduction);
    });
});

gulp.task("uploadGcsTest", uploadGCSTest.bind(uploadGCSTest, bucketNameForTest));
gulp.task("uploadGcsProd", uploadGCSProd.bind(uploadGCSProd, bucketNameForProd));
