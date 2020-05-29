'use strict';
const OpenWeather = require('../core/open-weather');
const openWeather = new OpenWeather();

const conf = require('../configuration/open-weather');

describe('OpenWeather', () => {
    it('should return an Object containing status and five day forecast when the getFiveDayForecast function is valid with valid key and city code', async () => {
        let forecastsData = await openWeather.getFiveDayForecast(conf.key, conf.sydneyCode);
        let random = Math.floor(Math.random() * forecastsData.forecasts.length);
        expect(forecastsData.forecasts).toBeInstanceOf(Array);
        expect(forecastsData.forecasts).toBeDefined();
        expect(forecastsData.forecasts.length).toBeGreaterThan(0);
        expect(forecastsData.forecasts[random].main).toBeInstanceOf(Object);
        expect(forecastsData.forecasts[random].main.temp_min).not.toBe('');
        expect(forecastsData.forecasts[random].dt_txt).not.toBe('');
        expect(forecastsData.status).toBe('success');
    });

   it('should return an Object with error status and empty array when an invalid key is passed to getFiveDayForecast function', async () => {
        let forecastsData = await openWeather.getFiveDayForecast('', conf.sydneyCode);
        expect(forecastsData.status).toBe('error');
        expect(forecastsData.forecasts).toBeInstanceOf(Array);
        expect(forecastsData.forecasts).toHaveLength(0);
    });

   it('should return an Object with error status and empty array when an invalid city code is passed ', async () => {
       let forecastsData = await openWeather.getFiveDayForecast(conf.key, '');

       expect(forecastsData.forecasts).toBeInstanceOf(Array);
       expect(forecastsData.forecasts).toHaveLength(0);
       expect(forecastsData.status).toBe('error');
   });

   it('should return an Object with error status and empty array when exception occurs in getFiveDayForecast', async () => {
       let forecastsData = await openWeather.getFiveDayForecast('', '');
       expect(forecastsData.forecasts).toBeInstanceOf(Array);
       expect(forecastsData.forecasts).toHaveLength(0);
       expect(forecastsData.status).toBe('error');
   });
});
