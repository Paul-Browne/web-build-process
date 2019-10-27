const fs = require('fs-extra');
const path = require('path');

var newestTime = 0;

function walkSync(inPath) {
    if (fs.statSync(inPath).isDirectory()) {
        fs.readdirSync(inPath).map(subDirectory => walkSync(path.join(inPath, subDirectory)))
    } else {
        var check = fs.statSync(inPath);
        if(check.mtimeMs > newestTime ){
            newestTime = check.mtimeMs; 
        }
        if(check.ctimeMs > newestTime ){
            newestTime = check.ctimeMs; 
        }
    }
}

module.exports = function(rootDir){
    walkSync(rootDir);
    return newestTime;
}