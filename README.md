# web-build-process

1. Build from source sass, scss, less, css, html, javascript and optimize images
2. Watch for changes to source files
3. Prettify source on save
4. Serve to localhost

### usage

`npm i -D web-build-process`

```js
import wbp from "web-build-process";

wbp({
  source: "src",                // source directory default:"src"
  dist: "public",               // build directory default:"public"
  buildOnly: false,             // builds once only, doesn't serve, watch or prettify default:false
  prettify: true,               // prettify source files, default:true
  forceBuild: false,            // force build of all files, regardless if they have changed default:false
  ignore: ["foo", "bar"],       // string, or array of directories to ignore default: undefined
  port: 8888,                   // port, localhost:8888 default:8888
  key: ".ssl/localhost.key.pem",    // path to your local ssl key for https default shown
  cert: ".ssl/localhost.crt.pem",   // path to your local ssl cert for https default shown
  cache: 3600000,               // time in ms for the server to cache assets default 1 hour
  verbose: false,               // prints time-stamped messages to console when files are processed or prettified
  optimizeImages: true,         // optimize pngs and jpgs default true
  sourceMaps: true,             // outputs source maps for js anc css (sass/less) files default true
  forceJS: false                // force processing of js when other files (css, html, json) change
});
```


## Updates

### 3.1.1

Adds cache time option
Adds force js compiling

### 3.1.0

Adds option to ignore images
Moves image processing to after file processing (if optimized == true)
Adds proper async/await :)

### 3.0.4

Adds css/sass/scss import to javascript files capability

### 3.0.3

Adds html import to javascript files capability

### 3.0.0

uses imports, all async/await internals

### 2.0.9

1. Adds build only option
2. updates readme
3. adds force build option

### 2.0.8

1. Don't copy styles or scripts onFile

### 2.0.7

1. Switches to prettify-source instead of prettify-this

### 2.0.6

1. Adds ignore directory method

### 2.0.1 - 2.0.5

1. bug fixes and rollup + babel config testing

### 2.0.0

1. Complete rewrite

#### 1.4.4

1. moves all other file types back to only building when file changes...(really really needs a better fix)

#### 1.4.3

1. moves js back to only building when file changes...(really needs a better fix)

#### 1.4.2

1. Disable only building css/js when files change in order to build when dependance changes (needs a better fix)

#### 1.4.1

1. Bug fix for no include tag

#### 1.4.0

1. Adds `<include src="/path/to/component.html">` method of including components of html

#### 1.3.4

1. decreases save timeout from 5 seconds to 1.5 for building

#### 1.3.3

1. mininfied javascript source files (.min.js) are not minified, uglified or transpiled

#### 1.3.2

1. fixes the copy command to not use UTF-8

#### 1.3.1

1. fixes IMAGE_PLACEHOLDERS env

#### 1.2.8

1. Removes empty .js files
2. updated mkdirp
3. fixes errors when building for the first time

#### 1.2.7

1. color codes file sizes
2. adds js file info output to terminal

#### 1.2.6

1. improves svg image optimization

#### 1.2.5

1. adds IMAGE_SIZES and IMAGE_PLACEHOLDERS to .env
2. improves image optimization

#### 1.2.0

1. image optimization: now using imagemin + plugins instead of jimp
2. moves making of public directory to main.js

### TODO

will be tackled in no particular order :)

- use .wbp file for settings
- auto reload of browser when files change
- template engines
- option: clean  - delete the build directory on change, rebuild all.
- option: cleanFiles  - delete only files, not images on changes, rebuild all.
- option: forceBuildFiles  - force build only files, not images.
- generate ssl for user
- callback when finished
- option: array of sizes to resize images
- optimize gifs
- optimize svgs
- optimize webp images
- option to generate webp images from pngs and jpgs
- show files processed in terminal
- show file sizes in terminal
- option silent to supress terminal output
- improve readme :)
- allow for user to pass babel/rollup options
- allow user to pass less/sass/css options
- option ignore dot files
- option ignore dot directories
- sort css properties
- auto restart after crash/ignore errors
- option to regenerate js after css or html files change (incase importing css/html into js)