var https = require('https');
var fs = require('fs');

function getNodeVersion (callback) {
  https.get('https://nodejs.org/dist/latest/SHASUMS256.txt', function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
      var firstLine = body.split('\n')[0];
      var result = /v(\d+\.\d+\.\d+)/.exec(firstLine)[1];
      callback(null, result);
    });
  }).on('error', callback);
}

function getYarnVersion (callback) {
  https.get('https://yarnpkg.com/latest-version', function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () {
      var result = body;
      callback(null, result);
    });
  }).on('error', callback);
}


function writeVersion(txt, version) {
  fs.readFile('pom.xml', 'utf-8', function (err, data) {
    if (err) throw err;
    var newValue = '';
    if (txt === 'node') {
     newValue = data.replace(/<nodeVersion>[\w.]+<\/nodeVersion>/gim, `<nodeVersion>${version}<\/nodeVersion>`);
    } else {
     newValue = data.replace(/<yarnVersion>[\w.]+<\/yarnVersion>/gim, `<yarnVersion>${version}<\/yarnVersion>`);
    }

    fs.writeFile('pom.xml', newValue, 'utf-8', function (err) {
      if (err) throw err;
      console.log(`${txt} version is changed to ${version}`);
    });
  });
}

module.exports = function () {
  getNodeVersion(function (err, version) {
    writeVersion('node', version);
  });

  getYarnVersion(function (err, version) {
    writeVersion('yarn', version);
  })
}


