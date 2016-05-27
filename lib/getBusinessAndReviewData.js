'use strict';
const modelFetcher = require('../lib/modelFetcher');
const getAndLoadHtml = require('../lib/getAndLoadHtml');
const parseHtml = require('../lib/parseHtml');

async function getBusinessAndReviewData(url) {
  try {
    let $ = await getAndLoadHtml(url);
    let businessData = parseHtml.getBusinessData($);
    // merge additional data: yelp url of business
    Object.assign(businessData, {'yelpUrl': url});
    let Business = await modelFetcher.getBusiness({
      key: 'yelpUrl',
      value: businessData.yelpUrl
    });
    let reviewPromises = [];

    if (!Business) {
      Business = await modelFetcher.createBusiness(businessData);
    }

    // For the first page of reviews, get each review
    // and save as a model associated with the Business ID
    $('div[itemprop=review]').map(function(i, el) {
      let reviewData = parseHtml.getReviewData($, el);
      // merge additional data for associating a review with a business
      Object.assign(reviewData, {'business': Business._id});
      let Review = modelFetcher.createReview(reviewData);
      reviewPromises.push(Review);
    });

    return Promise.all(reviewPromises);
  } catch (err) {
    // TODO: Bubble up and Handle errors
    console.log(err)
  }
};

module.exports = getBusinessAndReviewData;
