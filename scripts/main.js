const net = require('net');
const fs = require('fs-extra');
const os = require('os');
const http = require('http');
const http2 = require('spdy');
const serveStatic = require('serve-static');
const compression = require('compression');
const express = require('express');
const chokidar = require('chokidar');
const chalk = require('chalk');
const env = require('dotenv');
env.config();

const mkdirp = require('mkdirp');
const utility = require('./utility.js');
const build = require('./build.js');

const sourceDirectoryName = process.env.SOURCE_DIR_NAME || 'src';
const publicDirectoryName = process.env.PUBLIC_DIR_NAME || 'public';

const sslKeyPath = process.env.SSL_KEY_PATH || '/.ssl/localhost.key';
const sslCrtPath = process.env.SSL_CRT_PATH || '/.ssl/localhost.crt';

var port = process.env.PORT || 8888;

const isPortTaken = (p) => new Promise((resolve, reject) => {
    const tester = net.createServer()
        .once('error', err => (err.code == 'EADDRINUSE' ? resolve(true) : reject(err)))
        .once('listening', () => tester.once('close', () => resolve(false)).close())
        .listen(p)
})

function serverSetup(protocal, port) {
    var app = express();
    app.use(compression())
    app.use(serveStatic(publicDirectoryName, {
        'extensions': ['html'],
        'maxAge': 3600000   // 1 hour
    }))
    if (protocal === "https") {
        http2.createServer({
            key: fs.readFileSync(os.homedir() + sslKeyPath, 'utf8'),
            cert: fs.readFileSync(os.homedir() + sslCrtPath, 'utf8')
        }, app).listen(port);
    } else {
        http.createServer(app).listen(port);
    }
    utility.consoleTimestampedMessage(chalk.magenta("serving: ") + publicDirectoryName + "/ at " + protocal + "://localhost:" + port);
}

function startServer(port){
    fs.open(os.homedir() + sslKeyPath, 'r', (err) => {
        if(err){
            serverSetup("http", port);
        }else{
            fs.open(os.homedir() + sslCrtPath, 'r', (err) => {
                if(err){
                    serverSetup("http", port);
                }else{
                    serverSetup("https", port);
                }
            })
        }
        watching();
    })
}

function watching() {
    var time = Date.now();
    var watcher = chokidar.watch(sourceDirectoryName, {
        ignoreInitial: true,
        persistent: true
    });
    watcher.on('all', (event, path) => {
        if(Date.now() > (time + 1500) ){
            time = Date.now();
            build(sourceDirectoryName, publicDirectoryName);
        }
    })
    utility.consoleTimestampedMessage("watching " + sourceDirectoryName + " directory");
}

function tryPorts(port){
    isPortTaken(port).then(res => {
        if(res){
            port++;
            tryPorts(port);
        }else{
            startServer(port);
        }
    })
}

module.exports = {
    run: function(){
        mkdirp(publicDirectoryName);
        tryPorts(port);
        build(sourceDirectoryName, publicDirectoryName);
    },
    build: function(){
        mkdirp(publicDirectoryName);
        build(sourceDirectoryName, publicDirectoryName);
    }
};

