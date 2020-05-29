'use strict';

const superAgent = require('superagent');
let conf = require('../configuration/open-weather');
const date = require('date-and-time');
const pattern = date.compile('YYYY-MM-DD');
const auPattern = date.compile('DD-MM-YYYY');
const today = date.format(new Date(), pattern);
let forecastsData = {};
let sunnyData = {};

class OpenWeather {

    /*
        getFiveDayForecast function takes open weather api key and the city code as arguments and
        returns an Object containing an array of the 3 hour forecasts for next five days. It returns an empty array if
        an exception occurs in the open weather api. It adds a status 'success' if no exception occurs in communicating
        with the open weather api. If an error occurs, it adds a status 'error'. Returning the empty array with status
        'error' helps in stopping the cascading of the error and gives a readable output to the user.
    */

    getFiveDayForecast = async (key, cityCode) => {
        try {
            let res = await superAgent
            .get(`${conf.host}data/2.5/forecast?id=${cityCode}&appid=${key}`);
            forecastsData.status = 'success';
            forecastsData.forecasts = res.body.list;
            return forecastsData;
        } catch (e) {
            console.log(e.message);
            forecastsData.status = 'error';
            forecastsData.forecasts = [];
            return forecastsData;
        }
    };

    /*getSunnyDays will take an Object containing status and an Array of forecasts as arguments. It gathers all the sunny days
    * based on the expectation that a day with temperature more than 20 degrees celsius in a sunny day.
    * open weather api mentions temperatures in kelvin. they are converted to celsius during processing.
    * Duplicates in the array are removed. The array data is cleaned up to have data related to the next five
    * days only. Finally, the data in the arrays is changed to AU format. It returns an object containing status and sunny days*/
    getSunnyDays = (forecastsData) => {
        try {
            sunnyData.status = forecastsData.status;
            sunnyData.days = [];
            let sunnyDays = [];
            if(forecastsData.status === 'success') {
                for(let forecast of forecastsData.forecasts){
                    if (forecast.main.temp_min >= (conf.sunny +conf.kelvinToCelsius))
                        sunnyDays.push(forecast.dt_txt.substring(0,10));
                }
                const sunnyDaysWithoutDuplicates = this.removeDuplicates(sunnyDays);
                const fiveDayForecast = this.setToFiveDayForecast(sunnyDaysWithoutDuplicates);
                sunnyData.days = this.changeToAUFormat(fiveDayForecast);
            }
            return sunnyData;
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
    * for the next five days.*/
    summarizeWeatherForecast = (sunnyData) => {
        try {
            let summary = {};
            summary.message = 'An error occured communicating with open weather api';
            if (sunnyData.status === 'success') {
                summary.sunnyDays = sunnyData.days;
                summary.message = `Number of sunny days in the next five days forecast in Sydney: ${summary.sunnyDays.length}`;
            }
            return summary;
        } catch (e) {
            console.log(e);
        }
    };
}

module.exports = OpenWeather;
