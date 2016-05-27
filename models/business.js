'use strict';
const mongoose = require('mongoose');

const businessSchema = mongoose.Schema({
  name: String,
  yelpUrl: String,
  overallRating: Number
});

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
