const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/d6b00926aa1741348478218126a69745/${latitude},${longitude}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback('Unable to find location', undefined);
    } else {
      const currently = body.currently;
      callback(
        undefined,
        `${body.daily.data[0].summary} It is currently ${currently.temperature} degrees out. There is ${currently.precipProbability}% of rain.`
      );
    }
  });
};

module.exports = forecast;