'use strict';
const url = require('url');
const app = require('./lib/createApp');
const modelFetcher = require('./lib/modelFetcher');
const getBusinessAndReviewData = require('./lib/getBusinessAndReviewData');

// ROUTES
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/add_new_business', function(req, res) {
  const formattedBusinessUrl = url.format(req.body.url);

  return getBusinessAndReviewData(formattedBusinessUrl)
    .then(function() {
      req.session.flash = {
        type: 'success',
        intro: 'Success!',
        message: 'Saved business reviews.'
      }
      res.redirect(303, '/businesses');
    })
    .catch(function(err) {
      if (err) console.log(err);
      req.session.flash = {
        type: 'danger',
        intro: 'Oh no!',
        message: 'Unable to save business reviews.'
      }
      res.redirect(303, '/');
    });
});

app.get('/businesses', function(req, res) {
  return modelFetcher.getBusinesses()
    .then(function(businesses) {
      res.render('businesses', { businesses: businesses });
    });
});

app.get('/business/:id', function(req, res) {
  const reviewsPromise = modelFetcher.getReviewsForBusiness(req.params.id);
  const businessPromise = modelFetcher.getBusiness({
    key: '_id',
    value: req.params.id
  });

  return Promise.all([reviewsPromise, businessPromise])
    .then(function(results) {
      const reviews = results[0];
      const business = results[1];

      res.render('business', {
        reviews: reviews,
        business: business
      });
    })
    .catch(function(err) {
      // TODO: Bubble up and handle this error
      console.log('error', err);
    });
});

// Handle 404 Error
app.use(function(req, res) {
   res.status(404);
   res.render('404');
});

// Handle 500 Error
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + ' ; press Ctrl-C to terminate.');
});
