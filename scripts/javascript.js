const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const pathJS = require("path");
const browserify = require("browserify");
const chalk = require('chalk');
const utility = require("./utility.js");
module.exports = function(source, inPath, outPath){
	// if already minified
	if(/\.min\.js$/.test(inPath)){
		utility.writeOut(source, outPath);
	}else{
		mkdirp(pathJS.dirname(outPath)).then(x => {
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
			  if(fs.readFileSync(outPath, 'utf8') == '!function(){"use strict"}();' ){
			  	fs.removeSync(outPath);
			  }else{
			  	utility.consoleTimestampedMessage(chalk.green("built: ") + outPath + " " + utility.messageWithFileSize(outPath));
			  }
			});
		})
	}
};