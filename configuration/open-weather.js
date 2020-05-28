'use strict';

let openWeatherConfig = {
  key: process.env.OPEN_WEATHER_KEY || '',
  host: 'https://api.openweathermap.org/',
  apiTimeout: '20000',
  sydneyCode: "2147714"
};
module.exports = openWeatherConfig;
