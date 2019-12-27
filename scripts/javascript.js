const fs = require("fs");
const mkdirp = require("mkdirp");
const pathJS = require("path");
const browserify = require("browserify");

module.exports = function(source, inPath, outPath){
	mkdirp(pathJS.dirname(outPath), function(err) {
	    if (err) {
	        console.error(err);
	    } else {
	    	browserify(inPath)
			.transform("babelify", {
				plugins: ["@babel/plugin-transform-runtime"],
				presets: ["@babel/preset-env"]
			})
			.plugin('tinyify', {})
			.bundle()
			.pipe(fs.createWriteStream(outPath));
	    }
	});
};