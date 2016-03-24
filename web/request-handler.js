var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs'); 
var httpHelper = require('./http-helpers');

// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // var statusCode = (req.method === 'GET') ? 200 : 201;

  if (req.method === 'GET') {
    if (req.url === '/') {
      var statusCode = 200;
      var header = httpHelper.headers;
      header['Content-Type'] = 'text/html';
      res.writeHead(statusCode, header);

      var filePath = path.join(__dirname, 'public/index.html');

      fs.readFile(filePath, 'utf8', function(err, content) {
        if (err) {
          console.log(err);
        } else {
          res.end(content);
        }
      });
    }

    if (req.url !== '/') {
      // search archive
      console.log(req.url);
        // if
    }





  //    else {
  //     res.end(archive.paths.list);
  //   }
  }
// serveAssets = function(res, asset, callback) 
};