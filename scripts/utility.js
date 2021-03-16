const chalk = require("chalk");
const pathJS = require("path");
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const mime = require("mime-types");

function humanReadableFilesize(size) {
  if (size > 999999) {
    return (size / 1000000).toFixed(2) + " Mb";
  } else if (size > 999) {
    return (size / 1000).toFixed(1) + " Kb";
  } else {
    return size + " bytes";
  }
}

function fileSizeColorsNotImages(size) {
  if (size > 250000) {
    return chalk.red(humanReadableFilesize(size));
  } else if (size > 150000) {
    return chalk.keyword("orange")(humanReadableFilesize(size));
  } else if (size > 50000) {
    return chalk.yellow(humanReadableFilesize(size));
  } else {
    return chalk.green(humanReadableFilesize(size));
  }
}

function fileSizeColorsImages(size) {
  if (size > 1000000) {
    return chalk.red(humanReadableFilesize(size));
  } else if (size > 600000) {
    return chalk.keyword("orange")(humanReadableFilesize(size));
  } else if (size > 200000) {
    return chalk.yellow(humanReadableFilesize(size));
  } else {
    return chalk.green(humanReadableFilesize(size));
  }
}

function messageWithFileSize(path) {
  var type = mime.lookup(path);
  var size = fs.statSync(path).size;
  if (
    type === "image/jpeg" ||
    type === "image/png" ||
    type === "image/gif" ||
    type === "image/svg+xml" ||
    type === "image/webp"
  ) {
    return fileSizeColorsImages(size);
  } else {
    return fileSizeColorsNotImages(size);
  }
}

function consoleTimestampedMessage(message) {
  var now = new Date();
  console.log(
    chalk.gray(
      ("0" + now.getHours()).slice(-2) +
        ":" +
        ("0" + now.getMinutes()).slice(-2) +
        ":" +
        ("0" + now.getSeconds()).slice(-2)
    ) +
      " " +
      message
  );
}

module.exports = {
  consoleTimestampedMessage: function (message) {
    consoleTimestampedMessage(message);
  },
  messageWithFileSize: function (path) {
    return messageWithFileSize(path);
  },
  writeOut: function (output, outPath) {
    mkdirp(pathJS.dirname(outPath)).then((x) => {
      fs.writeFile(outPath, output, function (err) {
        if (err) {
          console.error(err);
        } else {
          consoleTimestampedMessage(
            chalk.green("built: ") +
              outPath +
              " " +
              messageWithFileSize(outPath)
          );
        }
      });
    });
  },
};
