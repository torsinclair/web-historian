var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs'); 
var httpHelper = require('./http-helpers');
var htmlFetcher = require('../workers/htmlfetcher');
var Promise = require('bluebird');

Promise.promisifyAll(fs);



exports.handleRequest = function (req, res) {

  var staticFileHandler = function (filePath, contentType, statusCode) {
    var header = httpHelper.headers;
    header['Content-Type'] = contentType;
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        console.log(filePath);
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end();
        }
      } else {
        res.writeHead(statusCode, header);
        res.write(data);
        res.end();
      }   
    });
  };


  if (req.method === 'GET') {
    var filePath = req.url;

    htmlFetcher.htmlFetcher();

    if (filePath === '/') {
      filePath = path.join(__dirname, 'public/index.html');
      staticFileHandler(filePath, 'text/html', 200);
    } else if (filePath === '/styles.css') {
      filePath = path.join(__dirname, 'public/' + filePath);
      staticFileHandler(filePath, 'text/css', 200);
    } else if (filePath.match(/\/www/)) {
      archive.isUrlArchived(filePath.slice(1), function(isFound) {
        if (isFound) {
          filePath = path.join(archive.paths.archivedSites, '/' + filePath);
          staticFileHandler(filePath, 'text/html', 200);
        } else {
          res.writeHead(404);
          res.end();
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  }

  if (req.method === 'POST' && req.url === '/') {
    var header = httpHelper.headers;
    var site = '';
    req.on('data', function(url) {
      site += url;
    });

    req.on('end', function() {
      var url = site.slice(4);
      // console.log('url found ' + url);

      archive.isUrlInList(url, function(isFound) {
        if (!isFound) {              
          archive.addUrlToList(url, function(err) {
            filePath = path.join(__dirname, 'public/loading.html');
            staticFileHandler(filePath, 'text/html', 302);
          });
        } else {
          archive.isUrlArchived(url, function(isFound) {
            if (isFound) {
              filePath = path.join(archive.paths.archivedSites, '/' + url);
              staticFileHandler(filePath, 'text/html', 302);
            } 
          });
        }
      });      
    });
  }


};
  
 

  // if (req.method === 'POST') {
  //   // console.log(req);
  //   var body = '';
  //   req.on('data', function(chunk) {
  //     body += chunk;
  //   });

  //   req.on('end', function() {
  //     console.log(JSON.parse(body));
  //   }); 

  // }
  //   // if (req.url !== '/') {
  //   // }
  // // else {
  // //   res.end(archive.paths.list);
  // // }