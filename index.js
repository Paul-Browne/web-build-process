const devServer = require("static-server-dev");

const prettifySource = require("prettify-source");
const fileWalker = require("recursive-file-walker");
const xToCss = require("x-to-css");
const path = require("path");
const fs = require("fs");

const fileType = require("./fileType.js");
const javascripter = require("./javascript.js");
const watch = require("./watch.js");

const minifyHTML = require("html-minifier").minify;

const optimJPG = require("imagemin-most-optimized-jpg");
const optimPNG = require("imagemin-most-optimized-png");

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

const makeFileSync = (_path, contents) => {
  if (contents) {
    fs.mkdir(path.dirname(_path), { recursive: true }, (err) => {
      if (err) throw err;
      fs.writeFileSync(_path, contents);
    });
  }
};

const build = (obj) => {
  fileWalker({
    id: obj.id,
    ignoreDir: obj.ignore,
    entry: obj.sourceDir,
    readFiles: "modified",
    onFile: (response) => {
      if (response.modified) {
        if (fileType(response.path).exact === "png") {
          optimPNG(response.contents).then((image) => {
            makeFileSync(
              response.path.replace(obj.sourceDir, obj.distDir),
              image
            );
          });
        } else if (fileType(response.path).exact === "jpg") {
          optimJPG(response.contents).then((image) => {
            makeFileSync(
              response.path.replace(obj.sourceDir, obj.distDir),
              image
            );
          });
        } else if (fileType(response.path).exact === "html") {
          const minifiedHTML = compressHTML(response.contents.toString());
          makeFileSync(
            response.path.replace(obj.sourceDir, obj.distDir),
            minifiedHTML
          );
        } else if (fileType(response.path).exact !== "js" && fileType(response.path).general !== "style") {
          
          // just copy to public
          makeFileSync(
            response.path.replace(obj.sourceDir, obj.distDir),
            response.contents
          );
        }
      }
    },
    onFinish: (response) => {
      let modifiedStyleFile = false;
      let modifiedScriptFile = false;
      response.forEach((file) => {
        if (file.modified) {
          if (fileType(file.path).general === "style") {
            modifiedStyleFile = true;
          } else if (fileType(file.path).exact === "js") {
            modifiedScriptFile = true;
          }
        }
      });
      if (modifiedScriptFile) {
        fileWalker({
          id: obj.id + 1,
          ignoreDir: obj.ignore,
          entry: obj.sourceDir,
          onFile: (res) => {
            if (fileType(res.path).exact === "js") {
              fs.mkdir(
                path.dirname(res.path.replace(obj.sourceDir, obj.distDir)),
                { recursive: true },
                (err) => {
                  if (err) throw err;
                  javascripter(
                    res.path,
                    res.path.replace(obj.sourceDir, obj.distDir)
                  );
                }
              );
            }
          },
        });
      }
      if (modifiedStyleFile) {
        fileWalker({
          id: obj.id + 2,
          ignoreDir: obj.ignore,
          entry: obj.sourceDir,
          onFile: (res) => {
            if (fileType(res.path).general === "style") {
              xToCss(
                res.path,
                res.path
                  .replace(obj.sourceDir, obj.distDir)
                  .replace("/less/", "/css/")
                  .replace(/\/s(a|c)ss\//, "/css/")
                  .replace(".less", ".css")
                  .replace(/\.s(a|c)ss/, ".css"),
                {
                  maps: true,
                }
              );
            }
          },
        });
      }
    },
  });
};

const deleteGenerated = images => {
  if(images){
    // delete all built files
  }else{
    // delete all except images built files
  }
}

module.exports = (obj) => {
  const source = obj.source || "src";
  const dist = obj.dist || "public";
  const key = obj.key || ".ssl/localhost.key";
  const cert =  obj.cert || ".ssl/localhost.crt";  
  const port = obj.port || 8888;  
  const buildOnly = obj.buildOnly || false;
  const ignore = obj.ignore;
  const forceBuild = obj.forceBuild || false;
  
  // const forceBuildFiles = obj.forceBuildFiles || false;  
  // const clean = obj.clean || false; 
  // const cleanFiles = obj.cleanFiles || false;

  const id = forceBuild ? Date.now() : (obj.id || 1);

  build({
    sourceDir: source,
    distDir: dist,
    ignore: ignore,
    id: id
  });

  if(!buildOnly){
    watch(source, () => {
      build({
        sourceDir: source,
        distDir: dist,
        ignore: ignore,
        id: id
      });
      prettifySource(source);
    });

    prettifySource(source);

    devServer({
      port: port,
      directory: dist,
      key: key,
      cert: cert
    });     
  }
};
