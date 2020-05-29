'use strict';

const OpenWeather = require('../core/open-weather');
const openWeather = new OpenWeather();

const conf = require('../configuration/open-weather');

const openWeatherSample = require('./samples/open-weather-sample');
const daysSample = require('./samples/days');
const exceptionSample = require('./samples/invalid-api-key');
const forecastsSample = require('./samples/forecasts');



describe('OpenWeather class', () => {

    it('should return an Object containing an status and array of sunny days when getSunnyDays is called', async () => {
        openWeather.getFiveDayForecast = jest.fn();
        openWeather.getFiveDayForecast.mockResolvedValueOnce(forecastsSample);

        let forecastsData = await openWeather.getFiveDayForecast(conf.key, conf.sydneyCode);
        let sunnyDays = openWeather.getSunnyDays(forecastsData);
        expect(sunnyDays).toBeDefined();
        expect(sunnyDays).toBeInstanceOf(Object);
        expect(sunnyDays.status).toBe('success');
        expect(sunnyDays.days).toBeInstanceOf(Array);
        expect(sunnyDays.days.length).toBeGreaterThanOrEqual(0);
    });

    it('should return an array cleaning up the duplicates when removeDuplicates is called', async () => {
        let days = openWeather.removeDuplicates(daysSample);
        expect(days).toBeDefined();
        expect(days).toBeInstanceOf(Array);
    });

    it('should return an array cleaning up removing today date if present when setToFiveDayForecast is called', async () => {
        let days = openWeather.setToFiveDayForecast(daysSample);
        expect(days).toBeDefined();
        expect(days).toBeInstanceOf(Array);
    });

    it('should return an array changing the date formats to AU when changeToAUFormat is called', async () => {
        let days = openWeather.changeToAUFormat(daysSample);
        expect(days).toBeDefined();
        expect(days).toBeInstanceOf(Array);
        for(let day of days) {
            expect(new Date(day)).toBeInstanceOf(Date);
        }
        expect(new Date(days[0])).toBeInstanceOf(Date);
    });

    it('should return an object having a message and an array of dates when summarizeWeatherForecast is called', async () => {
        let sunnyDays = {
            status: "success",
            days: ['29-05-2020', '30-05-2020', '31-05-2020', '01-06-2020', '02-06-2020']
        };
        let summary = openWeather.summarizeWeatherForecast(sunnyDays);

        expect(summary).toBeInstanceOf(Object);
        expect(summary).toBeDefined();
        expect(summary.message).toBe('Number of sunny days in the next five days forecast in Sydney: 5');
        expect(summary.sunnyDays).toBeInstanceOf(Array);
        expect(summary.sunnyDays.length).toBe(5);
    });

    it('should return an object containing a message and empty array if getSunnyDays is called with empty forecasts', async () => {
        let forecastsData = {
            status: "error",
            forecasts: []
        };
        let sunnyDays = openWeather.getSunnyDays(forecastsData);
        expect(sunnyDays).toBeInstanceOf(Object);
        expect(sunnyDays.status).toBe('error');
        expect(sunnyDays.days).toBeInstanceOf(Array);
        expect(sunnyDays.days).toHaveLength(0);
    });

    it('should return empty array if removeDuplicates is called with empty days', async () => {
        let days = [];
        let uniqueDaysArray = openWeather.removeDuplicates(days);

        expect(uniqueDaysArray).toBeInstanceOf(Array);
        expect(uniqueDaysArray).toHaveLength(0);
    });

    it('should return an empty array if setToFiveDayForecast is called with empty days', async () => {
        let days = [];
        let fiveDayForecast = openWeather.setToFiveDayForecast(days);
        expect(fiveDayForecast).toBeInstanceOf(Array);
        expect(fiveDayForecast).toHaveLength(0);
    });

    it('should return an empty array if changetoAUFormat function is called with empty days', async () => {
        let days = [];
        let auFormatForecasts = openWeather.changeToAUFormat(days);

        expect(auFormatForecasts).toBeInstanceOf(Array);
        expect(auFormatForecasts).toHaveLength(0);
    });

    it('should return an object with just the message when summarizeWeatherForecast with status as error', async () => {
        let sunnyData = {
            status: 'error',
            days: []
        };
        let summary = openWeather.summarizeWeatherForecast(sunnyData);

        expect(summary).toBeInstanceOf(Object);
        expect(summary.message).toBe('An error occured communicating with open weather api');
        expect(summary.sunnyDays).not.toBeDefined();
    });

});
