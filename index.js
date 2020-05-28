'use strict';

let path = require('path');
let config = require(path.join(__dirname, './configuration/open-weather'));
const OpenWeather = require('./core/open-weather');
const openWeather = new OpenWeather();

let getSunnyWeatherSummary = async () => {
    const forecasts = await openWeather.getFiveDayForecast(config.sydneyCode);
    const sunnyDays = openWeather.getSunnyDays(forecasts);
    const summary = openWeather.summarizeWeatherForecast(sunnyDays);
    console.log(summary);
};

getSunnyWeatherSummary();


