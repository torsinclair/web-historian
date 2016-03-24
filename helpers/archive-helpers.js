var fs = require('fs');
var request = require('request');
var http = require('http');
var path = require('path');
var _ = require('underscore');
var Promise = require('bluebird');

Promise.promisifyAll(fs);
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, content) {
    if (err) {
      console.log(err);
    } else {
      var list = content.split('\n');
      callback(list);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(list) {
    if (list.indexOf(url) !== -1) {      
      callback(true);
    } else {
      callback(false);
    }

  });  
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(isFound) {
    if (!isFound) {      
      url += '\n';
      fs.appendFile(exports.paths.list, url, 'utf8', function(err) {
        if (err) {
          callback(err);
        } else {        
          callback();
        }
      });
    }
  });  
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) {
      callback(false);
    } else {
      if (files.indexOf(url) !== -1) {
        callback(true);
      } else {
        callback(false);
      }
    }
  });
};

exports.downloadUrls = function(urlArray) {

  _.each(urlArray, function(url) {
    exports.isUrlArchived(url, function(isFound) {
      if (!isFound && url !== '') {
        var dest = exports.paths.archivedSites + '/' + url;
        var file = fs.createWriteStream(dest);
        url = 'http://' + url;

        http.request({host: url}, function(response){
          var body = '';

          response.on('data', function(data){
            body += data;
          });

          response.on('end', function(){
            fs.writeFileSync(dest, body, function(err){
              console.log(err);
            });
          }).end();
        });
      }
    });
  });
};




       // request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'));

        // console.log(url);
        // request(url).pipe(file).on('error', function(err) { console.log(err); } );
        // // // console.log(fs.readdir(exports.paths.archivedSites));
        // console.log(url);
        // http.get(url, function(response) {
        //   console.log('hi');
        //   response.pipe(file);
        //   file.on('finish', function() {
        //     file.close();
        //   });
        // }).on('error', function(err) {
        //   console.log('here');
        //   fs.unlink(dest);
        //   response.write(404);
        //   response.end();
        // });
        
    
  









