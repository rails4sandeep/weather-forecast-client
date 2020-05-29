'use strict';

let path = require('path');
let config = require(path.join(__dirname, './configuration/open-weather'));
const OpenWeather = require('./core/open-weather');
const openWeather = new OpenWeather();

let getSunnyWeatherSummary = async () => {
    try {
        const forecasts = await openWeather.getFiveDayForecast(config.key, config.sydneyCode);
        const sunnyDays = openWeather.getSunnyDays(forecasts);
        const summary = openWeather.summarizeWeatherForecast(sunnyDays);
        console.log(summary);
    } catch (e) {
        console.log(e.message);
    }
};

getSunnyWeatherSummary();


