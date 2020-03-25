const utility = require("./utility.js");
const fs = require('fs-extra');

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const imageminJpegtran = require('imagemin-jpegtran');
const imageminMozjpeg = require('imagemin-mozjpeg');

imagemin(['test/images/landscape-2048x2560.jpg'], {
	plugins: [
		imageminWebp({quality: 1})
	]
}).then(data => {
	console.log(data[0].data.length);
	utility.writeOut(data[0].data, "tester.jpg.webp");
})

imagemin(['test/images/paint-626x442.png'], {
	plugins: [
		imageminWebp({quality: 1})
	]
}).then(data => {
	console.log(data[0].data.length);
	utility.writeOut(data[0].data, "tester.png.webp");
})