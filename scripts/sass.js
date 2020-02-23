const utility = require("./utility.js");
const cssFunc = require("./css.js");
const sass = require('dart-sass');

module.exports = function(inPath, outPath){
	if(!~inPath.indexOf("/_")){
		sass.render({
		    file: inPath,
		}, function(err, result) {
		    if (err) {
		        console.error(err);
		    } else {
		        cssFunc(result.css, inPath, outPath.replace(/\/s(a|c)ss/, "/css").replace(/\.s(a|c)ss/, ".css"));
		    }
		    // if(result.stats.includedFiles.length > 1){
		    // 	result.stats.includedFiles.forEach(function(name){
		    // 		console.log(name);
		    // 	})
		    // }
		});
	// }else{
	// 	console.log(inPath);
	}
};

// "_include":[
// 	"output1.scss",
// 	"output2.scss",
// 	"output3.scss",
// 	"output4.scss"
// ]