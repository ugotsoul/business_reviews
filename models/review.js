'use strict';
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  business: { type: String, ref: 'Business'},
  author: String,
  datePublished: String,
  reviewRating: Number,
  reviewBody: String
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
