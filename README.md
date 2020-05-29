# weather-forecast-client


### Introduction
Solution for the Open Weather Client exercise

### Requirements
* `Nodejs` (instructions are available here: https://nodejs.org/en/download/)

Verify that `Nodejs` is installed by going to the terminal and entering `node -v`. It should
display the version of node installed in the machine

### Usage
* Clone the repository `git clone https://github.com/rails4sandeep/weather-forecast-client.git`
* `cd weather-forecast-client`
* `npm install` in the root of the directory
* Set the environment variable OPEN_WEATHER_KEY or configure it in `configuration/open-weather.js` (get one here https://home.openweathermap.org/)
* Verify the setup and installation by running the tests `npm test` 
* `npm run sydney-forecast` to know the forecast if it is going to be sunny in the next five days

The code is organized into easily identifiable directories.

* `configuration` contains the configuration settings for the open weather api. They `KEY`
required to access the api can be either configured here or set to the environment variable
`OPEN_WEATHER_KEY`
* `core` contains the core `OpenWeather` class.
* `test` contains the unit and integration tests for the open weather client. It also has samples
that the unit tests use to mock some of the functions and objects.

### Tests

You can run the tests by doing `npm test`

### Design

As described in the exercise, the open weather client displays the number of sunny days
over the next five days in Sydney. One of the open weather free APIs that return five day weather 
forecast based on city code is utilized for the exercise. There are a few assumptions made
for the exercise

* It is considered a sunny day if the temperature is at least 20 degrees celsius.

While trying to do the exercise as quickly as anticipated, steps have been taken to keep the doors
open for further development. 

* Most of the config data is moved to configuration files. They can be duplicated per environment
if required
* Open weather api call is wrapped into a function and the rest of the processing is written in separate 
reusable functions
* The entire open weather code is wrapped in a `OpenWeather` class. This allows it to be used as 
a backend or a middleware if we intend to write a web front end or API for it. We can use it as a
middleware for a simple `expressjs` app.
* The city code and api key are passed as arguments to the function calling open weather api instead of
directly reading from the config data. This allows for easy testing and reuse it to get weather
forecast for other cities.
* Tests are written using jest framework. Functions and return value types are mocked for easier unit testing.
* If an exception occurs with the open weather api, the client prints the exception with a message`An error occured communicating with open weather api`
 The exception is handled by returning an empty Array to stop the cascading of the error. This should give the user
an idea if there is something to fix with the open weather api (api key, invalid city code, etc)

