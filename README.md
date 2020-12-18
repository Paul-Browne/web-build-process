### Updates

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

1. use .wbp file for settings?
2. auto reload of browser when files change?
3. dev/prod server
4. migrate scripts to seperate node packages??
5. template engine?