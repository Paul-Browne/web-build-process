import {mkdir, writeFile } from 'fs/promises';
import {dirname} from 'path';

import tscl from "time-stamped-console-log";
import optimJPG from "imagemin-most-optimized-jpg";
import optimPNG from "imagemin-most-optimized-png";
import fileWalker, {reset as resetId} from "recursive-file-walker";

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
  files.forEach(file => {
    if(file.modified){
      if(obj.verbose){
        tscl("processed: " + file.path, {
          message:{
            color: "yellow"
          }
        });
      }
      if (fileType(file.path).general === "style") {
        styleFileChanges = true;
      } else if (fileType(file.path).exact === "js") {
        javascriptFileChanges = true;
      }else if (fileType(file.path).exact === "png") {
        optimPNG(file.contents).then((image) => {
          makeFile(
            file.path.replace(obj.sourceDir, obj.distDir),
            image
          );
        });
      } else if (fileType(file.path).exact === "jpg") {
        optimJPG(file.contents).then((image) => {
          makeFile(
            file.path.replace(obj.sourceDir, obj.distDir),
            image
          );
        });
      } else if (fileType(file.path).exact === "html") {
        const minifiedHTML = compressHTML(file.contents.toString());
        makeFile(
          file.path.replace(obj.sourceDir, obj.distDir),
          minifiedHTML
        );
      } else{
        // just copy to public
        makeFile(
          file.path.replace(obj.sourceDir, obj.distDir),
          file.contents
        );
      }
    }
  })

  if (javascriptFileChanges || styleFileChanges) {
    files.forEach(async file => {
      if (styleFileChanges && fileType(file.path).general === "style") {
        xToCss(
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
      }        
      if (javascriptFileChanges && fileType(file.path).exact === "js") {
        await mkdir(dirname(file.path.replace(obj.sourceDir, obj.distDir)), { recursive: true });
        await javascripter(
          file.path,
          file.path.replace(obj.sourceDir, obj.distDir),
          obj.sourceMaps
        );
      }
    })
  }
};

const deleteGenerated = images => {
  if(images){
    // delete all built files
  }else{
    // delete all except images built files
  }
}

export const reset = async (id = "wbp001") => {
  await resetId(id);
}

export default async (obj = {
  source: "src",
  dist: "public",
  key: ".ssl/localhost.key.pem",
  cert: ".ssl/localhost.crt.pem",
  port: 8888,
  ignore: undefined,
  buildOnly: false,
  forceBuild: false,
  verbose: false,
  sourceMaps: true,
  prettify: true
}) => {  
  
  // const forceBuildFiles = obj.forceBuildFiles || false;  
  // const clean = obj.clean || false; 
  // const cleanFiles = obj.cleanFiles || false;

  const id = obj.forceBuild ? Date.now() : (obj.id || "wbp001");

  if(obj.prettify){
    await prettifySource(obj.source);
  }

  await build({
    id: id,
    sourceDir: obj.source,
    distDir: obj.dist,
    ignore: obj.ignore,
    verbose: obj.verbose,
    sourceMaps: obj.sourceMaps
  });

  if(!obj.buildOnly){
    watch(obj.source, async () => {
      if(obj.prettify){
        await prettifySource(obj.source);
      }      
      await build({
        id: id,
        sourceDir: obj.source,
        distDir: obj.dist,
        ignore: obj.ignore,
        verbose: obj.verbose,
        sourceMaps: obj.sourceMaps
      });
    });
    await devServer({
      port: obj.port,
      directory: obj.dist,
      key: obj.key,
      cert: obj.cert
    });

  }
};
