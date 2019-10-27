const utility = require("./utility.js");
const jsonminify = require("jsonminify");

module.exports = function(source, outPath){
	utility.writeOut(jsonminify(source), outPath);
};

