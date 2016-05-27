'use strict';
const rp = require('request-promise');
const cheerio = require('cheerio');

function getAndLoadHtml(url) {
  return rp(url)
  .then(function(html) {
    return cheerio.load(html);
  })
  .catch(function(err) {
    // TODO: Bubble up and handle this error
    console.log('error', err);
  });
}

module.exports = getAndLoadHtml;
