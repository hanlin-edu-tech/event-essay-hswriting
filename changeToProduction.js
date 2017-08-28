const FS = require("fs");
const PATH = require("path");
const DIR = `${__dirname}/dist/`;

console.log(DIR);
FS.readdir(DIR, (err, files) => {
  var writeToFile = fileContent => {
    FS.writeFile(entireFilePath, fileContent, "UTF-8", err => {
      if (err) throw err;
      console.log("The html file was succesfully saved!");
    });
  };

  var changeToCurrent = () => {
    FS.readFile(entireFilePath, "UTF-8", function(err, data) {
      if (!err) {
        if (data.includes("current.SNAPSHOT")) {
          var fileContent = data.replace(/current\.SNAPSHOT/g, "current");
          writeToFile(fileContent);
        }
      } else {
        console.log(err);
      }
    });
  };

  files.forEach(fileName => {
    if (/(.html)$/.test(fileName)) {
      console.log("GG");
      entireFilePath = PATH.join(DIR, fileName);
      changeToCurrent();
    }
  });
});
