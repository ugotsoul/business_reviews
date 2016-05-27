'use strict';
const cheerio = require('cheerio');

function getBusinessData($) {
  let name = $('.biz-page-title').text().trim();
  let overallRating = $('div[itemprop=aggregateRating] meta[itemprop=ratingValue]').prop('content');

  return {name: name, overallRating: overallRating};
};

function getReviewData($, el) {
  let author = $(el).find('meta[itemprop=author]').prop('content');
  let reviewRating = $(el).find('div[itemprop=reviewRating] meta[itemprop=ratingValue]').prop('content');
  let reviewBody = $(el).find('p[itemprop=description]').text();
  let datePublished = $(el).find('meta[itemprop=datePublished]').prop('content');

  return {
    author: author,
    reviewRating: reviewRating,
    reviewBody: reviewBody,
    datePublished: datePublished
  };
};

module.exports = {
  getBusinessData: getBusinessData,
  getReviewData: getReviewData
};
