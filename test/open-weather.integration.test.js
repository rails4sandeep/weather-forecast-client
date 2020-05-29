const OpenWeather = require('../core/open-weather');
const openWeather = new OpenWeather();

const conf = require('../configuration/open-weather');

describe('OpenWeather', () => {
    it('should return five day forecast when the getFiveDayForecast function is valid with valid key and city code', async () => {
        let forecasts = await openWeather.getFiveDayForecast(conf.key, conf.sydneyCode);
        let random = Math.floor(Math.random() * forecasts.length);
        expect(forecasts).toBeInstanceOf(Array);
        expect(forecasts).toBeDefined();
        expect(forecasts.length).toBeGreaterThan(0);
        expect(forecasts[random].main).toBeInstanceOf(Object);
        expect(forecasts[random].main.temp_min).not.toBe('');
        expect(forecasts[random].dt_txt).not.toBe('');
    });

   it('should return an empty array when an invalid key is passed to getFiveDayForecast function', async () => {
        let forecasts = await openWeather.getFiveDayForecast('', conf.sydneyCode);

        expect(forecasts).toBeInstanceOf(Array);
        expect(forecasts).toHaveLength(0);
    });

   it('should return an empty array when an invalid city code is passed ', async () => {
       let forecasts = await openWeather.getFiveDayForecast(conf.key, '');

       expect(forecasts).toBeInstanceOf(Array);
       expect(forecasts).toHaveLength(0);
   });

   it('should handle the exception and return an empty array when an error occurs in getFiveDayForecast function', async () => {
       let forecasts = await openWeather.getFiveDayForecast('', '');
       expect(forecasts).toBeInstanceOf(Array);
       expect(forecasts).toHaveLength(0);
   });
});
