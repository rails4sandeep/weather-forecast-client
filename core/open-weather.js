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

    getFiveDayForecast = async (cityCode) => {
        try {
            let res = await superAgent
                .get(conf.host + 'data/2.5/forecast?id=' + conf.sydneyCode + '&appid=' + conf.key);
            let forecasts = res.body.list;
            return forecasts;

        } catch (e) {
            return e.message;
        }
    };

    getSunnyDays = (forecasts) => {
        try {
            for(let forecast of forecasts){
                if (forecast['main']['temp_min'] >= (20+273.15))
                    sunnyDays.push(forecast.dt_txt.substring(0,10));
            }
            sunnyDays = this.removeDuplicates(sunnyDays);
            sunnyDays = this.setToFiveDayForecast(sunnyDays);
            sunnyDays = this.changeToAUFormat(sunnyDays);
            return sunnyDays;
        } catch (e) {
            return e.message;
        }
    };

    removeDuplicates = (days) => {
        try {
            return Array.from(new Set(days));
        } catch (e) {
            return e.message;
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
            return e.message;
        }

    };

    changeToAUFormat = (days) => {
        try {
            return days.map(day => date.format(new Date(day), auPattern));
        } catch (e) {
            e.message;
        }


    };

    summarizeWeatherForecast = (sunnyDays) => {
        try {
            console.log(sunnyDays);
            let summary = {};
            if (sunnyDays.length > 0) {
                summary.message = `There are ${sunnyDays.length} sunny days in the next five day forecast`;
                summary.sunnyDays = sunnyDays;
            } else {
                summary.message = 'There are no sunny days in the next five day forecast'
            }
            return summary;
        } catch (e) {
            return e.message;
        }
    };
}

module.exports = OpenWeather;
