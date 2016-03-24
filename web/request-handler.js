var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs'); 
var httpHelper = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // var statusCode = (req.method === 'GET') ? 200 : 201;
  console.log('***', req.method);
  
  if (req.method === 'GET') {
    // initial html load
    var filePath = req.url;

    // filePath !== '/' && !== '/styles.css'
    if (filePath === '/' || filePath === '/styles.css') {
      // load html and/or css
      if (filePath === '/') {
        filePath = path.join(__dirname, 'public/index.html');
      } else if (filePath === '/styles.css') {
        filePath = path.join(__dirname, 'public/' + filePath);
      }

      var extname = path.extname(filePath);
      var contentType = 'text/html';

      if (extname === '.css') {
        contentType = 'text/css';
      }

      var statusCode = 200;
      var header = httpHelper.headers;
      header['Content-Type'] = contentType;
      res.writeHead(statusCode, header);
 

      fs.readFile(filePath, 'utf8', function(err, content) {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end();
          }
        } else {
          res.end(content, 'utf-8');
        }
      });

    } else {
      // archive.isUrlInList(filePath, function() {
      // }); 
    }
  }

  if (req.method === 'POST') {
    // console.log(req);
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });

    req.on('end', function() {
      console.log(JSON.parse(body));
    });

  }
    // if (req.url !== '/') {
    // }
  // else {
  //   res.end(archive.paths.list);
  // }
};