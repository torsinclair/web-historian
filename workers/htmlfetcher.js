// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
var CronJob = require('cron').CronJob;

// Promise.promisifyAll(archive);

var htmlFetcher = function() {
  console.log('fetch');
  archive.readListOfUrls(function(urlArray) {
    console.log(urlArray);
    archive.downloadUrls(urlArray);
  });  
};

exports.htmlFetcher = htmlFetcher;

new CronJob('10 * * * * *', htmlFetcher, null, true);
