'use strict';
const url = require('url');
const app = require('./lib/createApp');
const modelFetcher = require('./lib/modelFetcher');
const getBusinessAndReviewData = require('./lib/getBusinessAndReviewData');

// ROUTES
app.get('/', function(req, res) {
  // res.cookie('form_state');
  // TODO: create flash message cookie
  res.render('index');
});

app.post('/add_new_business', function(req, res) {
  const parsedBusinessUrl = url.parse(req.body.url);
  // Remove query parameters from URL
  delete parsedBusinessUrl.query;
  delete parsedBusinessUrl.search;
  const formattedBusinessUrl = url.format(parsedBusinessUrl);

  // Validate URL & Handle Errors
  // TODO: Move form validation to index view file.
  // TODO: Add flash messages after redirecting on error.
  if (formattedBusinessUrl === '') res.redirect(303, '/');
  if (parsedBusinessUrl.protocol !== 'http:') res.redirect(303, '/');
  if (parsedBusinessUrl.hostname !== 'www.yelp.com') res.redirect(303, '/');

  return getBusinessAndReviewData(formattedBusinessUrl)
    .then(function() {
      // TODO: Success: render businesses page with flash message
      res.redirect(303, '/businesses');
    })
    .catch(function(err) {
      if (err) console.log(err);
      // TODO: Failure: redirect to homepage with flash message
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
  const businessPromise = modelFetcher.getBusiness(req.params.id);

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

// Error routes
// TODO: Better error handling
app.use(function(err, req, res) {
  console.log(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + ' ; press Ctrl-C to terminate.');
});
