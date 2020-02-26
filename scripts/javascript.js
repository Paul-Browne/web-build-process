const fs = require("fs");
const mkdirp = require("mkdirp");
const pathJS = require("path");
const browserify = require("browserify");
const chalk = require('chalk');
const utility = require("./utility.js");

module.exports = function(source, inPath, outPath){
	mkdirp(pathJS.dirname(outPath), function(err) {
	    if (err) {
	        console.error(err);
	    } else {
	    	var file = fs.createWriteStream(outPath);
	    	browserify(inPath)
			.transform("babelify", {
				plugins: ["@babel/plugin-transform-runtime"],
				presets: ["@babel/preset-env"]
			})
			.plugin('tinyify', {})
			.bundle()
			.pipe(file);

			file.on('finish', function(){
			  utility.consoleTimestampedMessage(chalk.green("built: ") + outPath + " " + utility.messageWithFileSize(outPath));
			});
	    }
	});
};