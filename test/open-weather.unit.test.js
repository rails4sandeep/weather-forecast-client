const OpenWeather = require('../core/open-weather');
const openWeather = new OpenWeather();
const forecastsSample = require('./samples/forecasts');
const conf = require('../configuration/open-weather');
let daysSample = require('./samples/days');

describe('OpenWeather class', () => {

    it('should return an array of sunny days when getSunnyDays is called', async () => {
        const getFiveDayForecast = jest.fn();
        getFiveDayForecast.mockReturnValue(forecastsSample);

        let forecasts = await openWeather.getFiveDayForecast(conf.sydneyCode);
        let sunnyDays = openWeather.getSunnyDays(forecasts);
        expect(sunnyDays).toBeDefined();
        expect(sunnyDays).toBeInstanceOf(Array);
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
        for(day of days) {
            expect(new Date(day)).toBeInstanceOf(Date);
        }
        expect(new Date(days[0])).toBeInstanceOf(Date);
    });

    it('should return an object having a message and an array of dates when summarizeWeatherForecast is called', async () => {
        let sunnyDays = ['29-05-2020', '30-05-2020', '31-05-2020', '01-06-2020', '02-06-2020'];
        let summary = openWeather.summarizeWeatherForecast(sunnyDays);
        console.log("summary is: " + JSON.stringify(summary));
        expect(summary).toBeInstanceOf(Object);
        expect(summary).toBeDefined();
        expect(summary.message).not.toBeNaN();
        expect(summary.sunnyDays).toBeInstanceOf(Array);
    });
});
