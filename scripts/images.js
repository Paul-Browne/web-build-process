const env = require("dotenv");
env.config();

const utility = require("./utility.js");
const fs = require("fs-extra");

const imagemin = require("imagemin");

const imageminJpegtran = require("imagemin-jpegtran");
const imageminMozjpeg = require("imagemin-mozjpeg");

const imageminPngquant = require("imagemin-pngquant");
const imageminOptipng = require("imagemin-optipng");

const imageminGifsicle = require("imagemin-gifsicle");

const imageminSvgo = require("imagemin-svgo");

const imageminWebp = require("imagemin-webp");

const sizeOf = require("image-size");
const sharp = require("sharp");

let imageSizesArray = process.env.IMAGE_SIZES
  ? JSON.parse(process.env.IMAGE_SIZES)
  : [400, 800, 1200, 1600, 2000];
const usePlaceholderImages =
  process.env.IMAGE_PLACEHOLDERS && process.env.IMAGE_PLACEHOLDERS == "false"
    ? false
    : true;

if (usePlaceholderImages) {
  imageSizesArray.push(40);
}

const createWebpImages = process.env.WEBP_IMAGES
  ? process.env.WEBP_IMAGES
  : true;

function reformatOutputDirectory(dirOut, width) {
  return dirOut.replace("images", "images/" + width);
}

async function optimizeImage(obj) {
  if (obj.mime === "image/jpeg") {
    var Mozjpeg = await imagemin.buffer(obj.source, {
      plugins: [
        imageminMozjpeg({
          quality: obj.quality.Mozjpeg,
        }),
      ],
    });
    var Jpegtran = await imagemin.buffer(obj.source, {
      plugins: [imageminJpegtran()],
    });
    if (
      Mozjpeg.length <= Jpegtran.length &&
      Mozjpeg.length < obj.source.length
    ) {
      utility.writeOut(Mozjpeg, obj.outputPath);
    } else if (
      Jpegtran.length < Mozjpeg.length &&
      Jpegtran.length < obj.source.length
    ) {
      utility.writeOut(Jpegtran, obj.outputPath);
    } else {
      utility.writeOut(obj.source, obj.outputPath);
    }
  } else if (obj.mime === "image/png") {
    var Pngquant = await imagemin.buffer(obj.source, {
      plugins: [
        imageminPngquant({
          quality: obj.quality.Pngquant,
          strip: true,
        }),
      ],
    });
    var Optipng = await imagemin.buffer(obj.source, {
      plugins: [
        imageminOptipng({
          optimizationLevel: obj.quality.Optipng,
        }),
      ],
    });
    if (
      Pngquant.length <= Optipng.length &&
      Pngquant.length < obj.source.length
    ) {
      utility.writeOut(Pngquant, obj.outputPath);
    } else if (
      Optipng.length < Pngquant.length &&
      Optipng.length < obj.source.length
    ) {
      utility.writeOut(Optipng, obj.outputPath);
    } else {
      utility.writeOut(obj.source, obj.outputPath);
    }
  } else if (obj.mime === "image/gif") {
    var Gifsicle = await imagemin.buffer(obj.source, {
      plugins: [imageminGifsicle()],
    });
    if (Gifsicle.length < obj.source.length) {
      utility.writeOut(Gifsicle, obj.outputPath);
    } else {
      utility.writeOut(obj.source, obj.outputPath);
    }
  } else if (obj.mime === "image/svg+xml") {
    var SvgoMoveGroupAttributes = await imagemin.buffer(obj.source, {
      plugins: [imageminSvgo()],
    });
    var SvgoDontMoveGroupAttributes = await imagemin.buffer(obj.source, {
      plugins: [
        imageminSvgo({
          plugins: [{ moveGroupAttrsToElems: false }],
        }),
      ],
    });
    if (
      SvgoMoveGroupAttributes.length <= SvgoDontMoveGroupAttributes.length &&
      SvgoMoveGroupAttributes.length < obj.source.length
    ) {
      utility.writeOut(SvgoMoveGroupAttributes, obj.outputPath);
    } else if (
      SvgoDontMoveGroupAttributes.length < SvgoMoveGroupAttributes.length &&
      SvgoDontMoveGroupAttributes.length < obj.source.length
    ) {
      utility.writeOut(SvgoDontMoveGroupAttributes, obj.outputPath);
    } else {
      utility.writeOut(obj.source, obj.outputPath);
    }
  } else if (obj.mime === "image/webp") {
    var WebP = await imagemin.buffer(obj.source, {
      plugins: [
        imageminWebp({
          quality: obj.quality.WebP,
        }),
      ],
    });
    if (WebP.length < obj.source.length) {
      utility.writeOut(WebP, obj.outputPath);
    } else {
      utility.writeOut(obj.source, obj.outputPath);
    }
  }
}

module.exports = function (source, inDirectory, outDirectory, mime) {
  optimizeImage({
    source: source,
    quality: {
      WebP: 75,
      Mozjpeg: 75,
      Pngquant: [0.5, 0.8],
      Optipng: 3,
    },
    outputPath: outDirectory,
    mime: mime,
  });

  // if(createWebpImages && mime != "image/webp" && mime != "image/svg+xml"){
  // 	imagemin.buffer(source, {
  // 		use: [
  // 		    imageminWebp({quality: 1})
  // 		]
  // 	}).then(data => {
  // 		utility.writeOut(data, outDirectory.replace(/\.(png|jpg|jpeg)/, ".webp"));
  // 	})
  // }

  if (mime != "image/svg+xml") {
    imageSizesArray.forEach(function (width) {
      if (
        sizeOf(inDirectory).width > width &&
        ~inDirectory.indexOf("/images/")
      ) {
        sharp(source)
          .resize(width)
          .toBuffer()
          .then((resized) => {
            optimizeImage({
              source: resized,
              quality: {
                WebP: width === 40 ? 20 : 75,
                Mozjpeg: width === 40 ? 20 : 75,
                Pngquant: width === 40 ? [0.1, 0.3] : [0.5, 0.8],
                Optipng: 3,
              },
              outputPath: reformatOutputDirectory(
                outDirectory,
                width === 40 ? "placeholders" : width
              ),
              mime: mime,
            });

            // if(createWebpImages && mime != "image/webp"){
            // 	imagemin.buffer(source, {
            // 	    plugins: [
            // 	    	imageminWebp({
            // 	    		quality: width === 40 ? 20 : 75,
            // 	    	})
            // 	    ]
            // 	}).then( data => {
            // 		utility.writeOut(data, outDirectory);
            // 	})
            // }
          });
      }
    });
  }
};

// TODO
// test gifs
// add options to svg
// create webp optimized images from pngs and jpgs
