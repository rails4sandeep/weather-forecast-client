'use strict';

let path = require('path');
let config = require(path.join(__dirname, './configuration/open-weather'));
const OpenWeather = require('./core/open-weather');
const openWeather = new OpenWeather();

let getSunnyWeatherSummary = async () => {
        const forecastsData = await openWeather.getFiveDayForecast(config.key, config.sydneyCode);
        const sunnyData = openWeather.getSunnyDays(forecastsData);
        const summary = openWeather.summarizeWeatherForecast(sunnyData);
        console.log(summary.message);
        if(summary.sunnyDays !== undefined) {

            for(let day of summary.sunnyDays) {
                console.log(day);
            }
        }
};

getSunnyWeatherSummary();


