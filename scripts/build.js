const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const mime = require('mime-types');
const env = require('dotenv');
env.config();

const utility = require('./utility.js');
const jsFunc = require('./javascript.js');
const jsonFunc = require('./json.js');
const htmlFunc = require('./html.js');
const cssFunc = require('./css.js');
const sassFunc = require('./sass.js');
const lessFunc = require('./less.js');
const imgFunc = require('./images.js');
const copyFunc = require('./copy.js');

const lastBuild = require('./lastBuild.js');
const prettify = require('./prettify.js');

module.exports = function(source, public){

    var buildStamp = lastBuild(public);
    
    function fileHasBeenChangedSinceLastBuild(path, buildStamp){
        var check = fs.statSync(path);
        if ( check.mtimeMs > new Date(buildStamp) || check.ctimeMs > new Date(buildStamp) ) {
            return true;
        }else{
            return false;
        }
    }

    function walkSync(inDirectory, outDirectory) {
        if (fs.statSync(inDirectory).isDirectory()) {
            fs.readdirSync(inDirectory).map(subDirectory => walkSync(path.join(inDirectory, subDirectory), path.join(outDirectory, subDirectory)))
        } else if( fileHasBeenChangedSinceLastBuild(inDirectory, buildStamp) ){

            prettify(inDirectory);

            if (mime.lookup(inDirectory) === 'text/html' ) {
                htmlFunc(fs.readFileSync(inDirectory, 'utf8'), outDirectory);
            }else if ( mime.lookup(inDirectory) === 'application/javascript' ) {
                jsFunc(fs.readFileSync(inDirectory, 'utf8'), outDirectory);
            }else if (mime.lookup(inDirectory) === 'application/json') {
                jsonFunc(fs.readFileSync(inDirectory, 'utf8'), outDirectory);
            }else if ( mime.lookup(inDirectory) === 'text/css' ) {
                cssFunc(fs.readFileSync(inDirectory, 'utf8'), inDirectory, outDirectory);
            }else if (mime.lookup(inDirectory) === 'text/x-scss' || mime.lookup(inDirectory) === 'text/x-sass') {
                sassFunc(inDirectory, outDirectory);
            }else if (mime.lookup(inDirectory) === 'text/less' ) {
                lessFunc(fs.readFileSync(inDirectory, 'utf8'), inDirectory, outDirectory);
            }else if (mime.lookup(inDirectory) === 'image/jpeg' || mime.lookup(inDirectory) === 'image/png' || mime.lookup(inDirectory) === 'image/gif' || mime.lookup(inDirectory) === 'image/svg+xml') { // todo check gif
                imgFunc(fs.readFileSync(inDirectory), inDirectory, outDirectory);
            }else{
                copyFunc(fs.readFileSync(inDirectory, 'utf8'), outDirectory);
            }
        }
    }

    walkSync(source, public);
        
}