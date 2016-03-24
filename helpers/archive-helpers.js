var fs = require('fs');
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
  exports.readListOfUrls(function(list){
    if(list.indexOf(url) !== -1) {      
      callback(true);
    } else {
      callback(false);
    }

  });  
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(isFound) {
    if(!isFound) {      
      url += '\n';
      fs.appendFile(exports.paths.list, url, 'utf8', function(err) {
        if (err) {
          console.log(err);
        } else {        
          console.log('url: '+ url);
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

exports.downloadUrls = function() {
};
