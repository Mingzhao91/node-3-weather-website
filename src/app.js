const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

// console.log(__dirname);
// console.log(path.join(__dirname, '../public'))
// console.log(__filename);

const app = express();

const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlerbars engine and views location

/**
 * use hbs as the view engine
 * hbs: Express.js view engine for handlebars.js
 */
app.set('view engine', 'hbs');

/**
 * change the default view path
 */
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
/**
 * use is the way to customise your server
 */
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Andrew Mead'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Andrew Mead'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text',
    title: 'Help',
    name: 'Andrew Mead'
  });
});

/**
 * req: The first is an object containing information about the incoming request to the server.
 * This is commonly called req which is short for request.
 *
 * res: The other argument is the response. So this contains a bunch of methods allowing us to
 * customize what we're going to send back to the requester. This is commonly called RES which
 * is short for response.
 *
 * We're going to use response.send. This allows us to send something back to the requester so
 * if someone's making a request from code using something like the NPM request library
 * they'll get this back. If they're making the request from the browser
 * this is what's going to display in the browser window.
 *
 */
app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    });
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You mush provide a search term'
    });
  }

  console.log(req.query);
  res.send({
    products: []
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Andrew Mead',
    errorMessage: 'Help article not found.'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    errorMessage: 'Page not found.',
    name: 'Andrew Mead'
  });
});

/**
 * We have to use one more method on app which will only ever use a single time in our application
 * that is app.listen.
 * This starts up this server and it has it listen on a specific port for the moment
 * we're gonna use a common development port which is port three thousand. Now the other optional
 * argument we can pass to the listen method is a callback function which just runs when the
 * server is up and running.
 */
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
