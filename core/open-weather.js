'use strict';

const superAgent = require('superagent');
let conf = require('../configuration/open-weather');
const date = require('date-and-time');
const pattern = date.compile('YYYY-MM-DD');
const auPattern = date.compile('DD-MM-YYYY');
const today = date.format(new Date(), pattern);

class OpenWeather {

    /*
        getFiveDayForecast function takes open weather api key and the city code as arguments and
        returns an array of the 3 hour forecasts for next five days. It returns an empty array if
        an exception occurs in the open weather api
    */
    getFiveDayForecast = async (key, cityCode) => {
        try {
            let res = await superAgent
            .get(`${conf.host}data/2.5/forecast?id=${cityCode}&appid=${key}`);
            return res.body.list;
        } catch (e) {
            console.log(e.message);
            return [];
        }
    };

    /*getSunnyDays will take an array of forecasts as arguments. It gathers all the sunny days
    * based on the expectation that a day with temparature more than 20 degrees celsius in a sunny day.
    * open weather api mentions temparatures in kelvin. they are converted to celsius during processing.
    * Duplicates in the array are removed. The array data is cleaned up to have data related to the next five
    * days only. Finally, the data in the arrays is changed to AU format.*/
    getSunnyDays = (forecasts) => {
        try {
            let sunnyDays = [];
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

    /*removeDuplicates function removes duplicates from the array it is passed*/
    removeDuplicates = (days) => {
        try {
            return Array.from(new Set(days));
        } catch (e) {
            console.log(e.message);
        }
    };

    /*setToFiveDayForecast cleans up the sunny days array data and makes sure it has only
    * dates in the next five days*/
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

    /*open weather api returns the dates in YYYY-MM-DD format. This function parses the array of the dates
    * and changes it to the AU format*/
    changeToAUFormat = (days) => {
        try {
            return days.map(day => date.format(new Date(day), auPattern));
        } catch (e) {
            console.log(e.message);
        }
    };

    /*summarizeWeatherForecast creates an object containing a summary of the sunny weather forecast
    * for the next five days*/
    summarizeWeatherForecast = (sunnyDays) => {
        try {
            let summary = {};
            summary.message = 'There are no sunny days in the next five day forecast';
            if (sunnyDays.length > 0) {
                summary.message = `There are ${sunnyDays.length} sunny days in the next five day forecast`;
                summary.sunnyDays = sunnyDays;
            }
            return summary;
        } catch (e) {
            console.log(e);
        }
    };
}

module.exports = OpenWeather;
