const utility = require("./utility.js");

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

const sizeOf = require('image-size');
const resizeImg = require('resize-img');

function reformatOutputDirectory(dirOut, width) {
	return dirOut.replace("images", "images/" + width);
}


function optimizeImage(obj){
	imagemin.buffer(obj.source, {
	    plugins: [
	        imageminMozjpeg({
	        	quality: obj.quality.jpg
	        }),
	        imageminPngquant({
	            quality: obj.quality.png,
	            strip: true
	        }),
	        imageminGifsicle(),
	        imageminSvgo()
	    ]
	}).then(result => {
	    utility.writeOut(result, obj.outputPath);
	})
}

module.exports = function(source, inDirectory, outDirectory){

	[40, 400, 800, 1200, 1600, 2000, "orig" ].forEach(function(width){
		if(sizeOf(inDirectory).width > width && ~inDirectory.indexOf("/images/")){
			resizeImg(source, {
			    width: width
			}).then(source => {
				optimizeImage({
					source: source,
					quality: {
						jpg: width === 40 ? 20 : 75,
						png: width === 40 ? [0.1, 0.3] : [0.5, 0.8]
					},
					outputPath: reformatOutputDirectory(outDirectory, (width === 40 ? "placeholders" : width))
				})
			})	
		}
		if(width === "orig"){
			optimizeImage({
				source: source,
				quality: {
					jpg: 75,
					png: [0.5, 0.8]
				},
				outputPath: outDirectory
			})
		}
	})

}