'use strict';
const Review = require('../models/review');
const Business = require('../models/business');

function createBusiness(opts) {
  return new Business({
    name: opts.name,
    yelpUrl: opts.yelpUrl,
    overallRating: opts.overallRating
  }).save();
};

function getBusiness(opts) {
  // Note: calling exec() on a mongoose query creates a full-promise object
  let searchParams = {}
  searchParams[opts.key] = opts.value;
  return Business.findOne(searchParams).exec();
};

function getBusinesses() {
  return Business.find().exec();
}

function createReview(opts) {
  return new Review({
    business: opts.business,
    author: opts.author,
    reviewRating: opts.reviewRating,
    reviewBody: opts.reviewBody,
    datePublished: opts.datePublished
  }).save();
}

function getReview(opts) {
  return Review.findOne({
    author: opts.author,
    datePublished: opts.datePublished,
    business: opts.business
  }).exec();
};

function getReviewsForBusiness(businessId) {
  return Review.find({business: businessId}).exec();
};

module.exports = {
  createBusiness: createBusiness,
  getBusiness: getBusiness,
  getBusinesses: getBusinesses,
  createReview: createReview,
  getReview: getReview,
  getReviewsForBusiness: getReviewsForBusiness
};
