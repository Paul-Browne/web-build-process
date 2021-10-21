// refactor this!

const fs = require("fs");
const utility = require("./utility.js");
const minify = require("html-minifier").minify;

const sourceDirectoryName = process.env.SOURCE_DIR_NAME || "src";
const selfClosingIncludeTagRegex = /<include[^<]*\/>/g;
const includeSource = /\s(\S*?)=(?:"|')?(.*?)(?:"|'|\s)/g;

function fetchResource(path) {
  var fileContents;
  try {
    fileContents = fs.readFileSync(sourceDirectoryName + path, "utf8");
  } catch (err) {
    fileContents = undefined;
  }
  return fileContents;
}

function returnRegexMatch(string, regex) {
  if (string.match(regex)) {
    return string.match(regex)[0];
  } else {
    return false;
  }
}

module.exports = function (source, outPath) {
  var includeTags = source.match(selfClosingIncludeTagRegex);
  if (includeTags) {
    includeTags.forEach(function (tag) {
      while ((z = includeSource.exec(tag))) {
        if (z[1] == "src") {
          source = source.replace(tag, fetchResource(z[2]));
        }
      }
    });
  }
  source = minify(source, {
    removeAttributeQuotes: false,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    decodeEntities: true,
  });
  utility.writeOut(source, outPath);
};
