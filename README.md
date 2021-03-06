# web-build-process

1. Build from source sass, scss, less, css, html, javascript and optimize images
2. Watch for changes to source files
3. Prettify source on save
4. Serve to localhost

### usage

`npm i -D web-build-process`

```js
const wbp = require("web-build-process");

// defaults shown
wbp({
  source: "src",                // source directory
  dist: "public",               // build directory
  buildOnly: false,             // builds once only, doesn't serve, watch or prettify
  forceBuild: false,            // force build of all files, regardless if they have changed
  ignore: undefined,            // directory, or array of directories to ignore
  port: 8888,                   // port, localhost:8888
  key: ".ssl/localhost.key",    // path to your local ssl key for https://localhost
  cert: ".ssl/localhost.crt"    // path to your local ssl cert for https://localhost
});
```


## Updates

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

1. use .wbp file for settings
2. auto reload of browser when files change
3. template engines
4. option: clean  - delete the build directory on change, rebuild all.
5. option: cleanFiles  - delete only files, not images on changes, rebuild all.
6. option: forceBuildFiles  - force build only files, not images.
7. generate ssl for user
8. callback when finished
9. option: array of sizes to resize images
10. optimize gifs
11. optimize svgs
12. optimize webp images
13. option to generate webp images from pngs and jpgs
14. show files processed in terminal
15. show file sizes in terminal
16. option silent to supress terminal output
17. improve readme :)
18. allow for user to pass babel/rollup options
19. allow user to pass less/sass/css options
20. option ignore dot files
22. option ignore dot directories
23. sort css properties

```css
.dummy{
    /* DISPLAY MODEL */
    position: relative;
    left: 0px;              /* if pos:abs */
    top: 0px;               /* if pos:abs */
    z-index: 123;           /* if pos:abs */
    
    float: left;        

    display: flex;
    align-items: center;
    justify-content: center;

    /* METRICS */
    width: 300px;
    min-width: 100px;
    max-width: 500px;
    
    height: 200px;
    min-height: 100px;
    max-height: 500px;

    margin: 10px 20px;
    padding: 2px 4px;

    /* COLOURS */
    background: #bada55;
    background-position: center;
    background-size: contain;

    border: 1px solid #00825F;
    border-radius: 5px;
    
    box-shadow:rgba(0, 0, 0, 0.05);


    /* TYPOGRAPHY */
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    font-weight: 300;

    color: #333;

    line-height: 1.4em;
    letter-spacing: 1px;

    text-align: right;
    text-transform: uppercase;
    text-decoration: underline;
    text-shadow: none;

    vertical-align: middle;


    /* MISC */
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    quotes: inherit;
    white-space: pre-wrap;
    opacity: 0.9;

    /* TRANSITIONS */
    /* ANIMATION */

}
```