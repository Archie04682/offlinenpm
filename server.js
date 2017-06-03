'use strict';

const express = require('express');

var ls = require('npm-remote-ls').ls;
var npm = require('npm');

var nodeZip = require('node-zip');

var fs = require('fs');

// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
    res.send('Hello world\n');
});



function findAndReplace(string, target, replacement) {

    var i = 0, length = string.length;

    for (i; i < length; i++) {

        string = string.replace(target, replacement);

    }

    return string;

}

function findAndReplace(string, target, replacement) {
    var i = 0, length = string.length;

    for (i; i < length; i++) {

        string = string.replace(target, replacement);

    }

    return string;
}

function getPackage(id, res) {

    // app.get('/api/npm*', function (req, res) {
    //     var id = req.query.id;

    console.log(id);
    var versionIndex = id.lastIndexOf('@');
    var version = 'latest';

    if (versionIndex !== -1 && versionIndex !== 0) {
        version = id.substring(versionIndex + 1);
        id = id.substring(0, versionIndex);
    }

    console.log("version:" + version);
    console.log("id:" + id);

    var zip = new nodeZip();

    ls(id, version, true, function (fetchResult) {

        var promises = [];

        fetchResult.forEach(function (packageName) {

            promises.push(new Promise(function (resolve, reject) {
                npm.load(function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }

                    npm.commands.pack([packageName],
                        function (e) {
                            console.log("downloaded" + packageName);
                            resolve(null);
                        });
                });
            }));
        }, this);

        Promise.all(promises).then(() => {

            console.log("done");

            var files = fs.readdirSync('./');

            files.forEach(function (file) {
                if (file.endsWith(".tgz")) {
                    console.log(file);
                    var content = fs.readFileSync(file);
                    zip.file(file, content, { binary: true });
                    fs.unlinkSync(file);
                }
            }, this);

            var data = zip.generate({ type: 'nodebuffer' });
            var resultFileName = findAndReplace(id, '/', '-') + ".zip";
            fs.writeFileSync(resultFileName, data);
            res.download(resultFileName);
        }, err => {
            console.log("error" + err);
        });
    });
}

app.get('/api/npm/:packageId', function (req, res) {
    var id = req.params.packageId;
    getPackage(id, res);
});

app.get('/api/npm/:scope/:packageId', function (req, res) {
    var scope = req.params.scope;
    var id = req.params.packageId;
    getPackage(scope + '/' + id, res);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);