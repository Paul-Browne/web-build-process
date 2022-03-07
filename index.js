import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

import tscl from "time-stamped-console-log";
import optimJPG from "imagemin-most-optimized-jpg";
import optimPNG from "imagemin-most-optimized-png";
import fileWalker, { reset as resetId } from "recursive-file-walker";

import devServer from "static-server-dev";
import prettifySource from "prettify-source";
import xToCss from "x-to-css";
import htmlMinifier from "html-minifier";
const minifyHTML = htmlMinifier.minify;

import watch from "./watch.js";
import fileType from "./fileType.js";
import javascripter from "./javascript.js";

const compressHTML = (source) => {
  return minifyHTML(source, {
    removeAttributeQuotes: false,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    decodeEntities: true,
  });
};

const makeFile = async (path, contents) => {
  if (contents) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, contents);
  }
};

const build = async obj => {
  const files = await fileWalker({
    id: obj.id,
    ignoreDir: obj.ignore,
    entry: obj.sourceDir,
    readFiles: "modified",
    flatten: true
  });
  let javascriptFileChanges = false;
  let styleFileChanges = false;

  const modifiedImages = [];

  const handleImages = async (files) => {
    for await (const file of files) {
      let image;
      if (file.type === "png") {
        image = await optimPNG(file.contents);
      } else if (file.type === "jpg") {
        image = await optimJPG(file.contents);
      }
      await makeFile(
        file.path.replace(obj.sourceDir, obj.distDir),
        image
      );
      if (obj.verbose) { tscl("processed: " + file.path, { message: { color: "yellow" } }) }
    }
  }

  for await (const file of files) {
    if (file.modified) {
      if (fileType(file.path).general === "style") {
        styleFileChanges = true;
        if (obj.forceJS) {
          javascriptFileChanges = true;
        }
      } else if (fileType(file.path).exact === "js") {
        javascriptFileChanges = true;
      } else if (fileType(file.path).exact === "png") {
        if (obj.optimizeImages) {
          file.type = "png"
          modifiedImages.push(file);
        } else {
          await makeFile(
            file.path.replace(obj.sourceDir, obj.distDir),
            file.contents
          );
          if (obj.verbose) { tscl("processed: " + file.path, { message: { color: "yellow" } }) }
        }
      } else if (fileType(file.path).exact === "jpg") {
        if (obj.optimizeImages) {
          file.type = "jpg"
          modifiedImages.push(file);
        } else {
          await makeFile(
            file.path.replace(obj.sourceDir, obj.distDir),
            file.contents
          );
          if (obj.verbose) { tscl("processed: " + file.path, { message: { color: "yellow" } }) }
        }
      } else if (fileType(file.path).exact === "html") {
        if (obj.forceJS) {
          javascriptFileChanges = true;
        }
        const minifiedHTML = compressHTML(file.contents.toString());
        await makeFile(
          file.path.replace(obj.sourceDir, obj.distDir),
          minifiedHTML
        );
        if (obj.verbose) { tscl("processed: " + file.path, { message: { color: "yellow" } }) }
      } else {
        // just copy to public
        // TODO - handle JSON
        if (fileType(file.path).exact === "json") {
          if (obj.forceJS) {
            javascriptFileChanges = true;
          }
        }
        // TODO - handle gif, webp
        await makeFile(
          file.path.replace(obj.sourceDir, obj.distDir),
          file.contents
        );
        if (obj.verbose) { tscl("processed: " + file.path, { message: { color: "yellow" } }) }
      }
    }
  }

  if (javascriptFileChanges || styleFileChanges) {
    for await (const file of files) {
      if (styleFileChanges && fileType(file.path).general === "style") {
        await xToCss(
          file.path,
          file.path
            .replace(obj.sourceDir, obj.distDir)
            .replace("/less/", "/css/")
            .replace(/\/s(a|c)ss\//, "/css/")
            .replace(".less", ".css")
            .replace(/\.s(a|c)ss/, ".css"),
          {
            maps: obj.sourceMaps,
          }
        );
        if (obj.verbose) { tscl("processed: " + file.path, { message: { color: "yellow" } }) }
      }
      if (javascriptFileChanges && fileType(file.path).exact === "js") {
        await mkdir(dirname(file.path.replace(obj.sourceDir, obj.distDir)), { recursive: true });
        await javascripter(
          file.path,
          file.path.replace(obj.sourceDir, obj.distDir),
          obj.sourceMaps
        );
        if (obj.verbose) { tscl("processed: " + file.path, { message: { color: "yellow" } }) }
      }
    }
  }

  await handleImages(modifiedImages);

};

const deleteGenerated = images => {
  if (images) {
    // delete all built files
  } else {
    // delete all except images built files
  }
}

export const reset = async (id = "wbp001") => {
  await resetId(id);
}

export default async ({
  id = "wbp001",
  source = "src",
  dist = "public",
  key = ".ssl/localhost.key.pem",
  cert = ".ssl/localhost.crt.pem",
  port = 8888,
  ignore = undefined,
  buildOnly = false,
  forceBuild = false,
  verbose = false,
  sourceMaps = true,
  prettify = true,
  optimizeImages = true,
  cache = 3600000,
  forceJS = false
} = {}) => {

  // const forceBuildFiles = obj.forceBuildFiles || false;  
  // const clean = obj.clean || false; 
  // const cleanFiles = obj.cleanFiles || false;

  const _id = forceBuild ? Date.now() : id;

  if (prettify) {
    await prettifySource(source);
  }

  await build({
    id: _id,
    sourceDir: source,
    distDir: dist,
    ignore: ignore,
    verbose: verbose,
    sourceMaps: sourceMaps,
    optimizeImages: optimizeImages,
    forceJS: forceJS
  });

  if (!buildOnly) {
    watch(source, async () => {
      if (prettify) {
        await prettifySource(source);
      }
      await build({
        id: _id,
        sourceDir: source,
        distDir: dist,
        ignore: ignore,
        verbose: verbose,
        sourceMaps: sourceMaps,
        optimizeImages: optimizeImages,
        forceJS: forceJS
      });
    });
    await devServer({
      port: port,
      directory: dist,
      key: key,
      cert: cert,
      cache: cache
    });

  }
};
