const fs = require('fs-extra');
const env = require('dotenv');
env.config();

const publicDirectoryName = process.env.PUBLIC_DIR_NAME || 'public';

fs.removeSync(publicDirectoryName);