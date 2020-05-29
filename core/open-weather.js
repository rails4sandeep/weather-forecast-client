'use strict';

const path = require('path');
const superAgent = require('superagent');
let conf = require('../configuration/open-weather');
const date = require('date-and-time');
const pattern = date.compile('YYYY-MM-DD');
const auPattern = date.compile('DD-MM-YYYY');
const today = date.format(new Date(), pattern);
let sunnyDays = [];

class OpenWeather {

    getFiveDayForecast = async (key, cityCode) => {
        try {
            let res = await superAgent
                .get(conf.host + 'data/2.5/forecast?id=' + cityCode + '&appid=' + key);
            return res.body.list;
        } catch (e) {
            console.log(e.message);
            return [];
        }
    };

    getSunnyDays = (forecasts) => {
        try {
            for(let forecast of forecasts){
                if (forecast.main.temp_min >= (conf.sunny +conf.kelvinToCelsius))
                    sunnyDays.push(forecast.dt_txt.substring(0,10));
            }
            const sunnyDaysWithoutDuplicates = this.removeDuplicates(sunnyDays);
            const fiveDayForecast = this.setToFiveDayForecast(sunnyDaysWithoutDuplicates);
            const forecastInAUFormat = this.changeToAUFormat(fiveDayForecast);
            return forecastInAUFormat;
        } catch (e) {
            console.log(e.message);
        }
    };

    removeDuplicates = (days) => {
        try {
            return Array.from(new Set(days));
        } catch (e) {
            console.log(e.message);
        }

    };

    setToFiveDayForecast = (days) => {
        try {
            const index = days.indexOf(today);
            if(index > -1) {
                days.splice(index, 1);
            }
            return days;
        } catch (e) {
            console.log(e.message);
        }

    };

    changeToAUFormat = (days) => {
        try {
            return days.map(day => date.format(new Date(day), auPattern));
        } catch (e) {
            console.log(e.message);
        }


    };

    summarizeWeatherForecast = (sunnyDays) => {
        try {
            let summary = {};
            if (sunnyDays.length > 0) {
                summary.message = `There are ${sunnyDays.length} sunny days in the next five day forecast`;
                summary.sunnyDays = sunnyDays;
            } else {
                summary.message = 'There are no sunny days in the next five day forecast';
            }
            return summary;
        } catch (e) {
            console.log(e);
        }
    };
}

module.exports = OpenWeather;
