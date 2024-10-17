import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const API_KEY = process.env.API_KEY;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("home");
});

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const country = 'in';  // Assuming you're working with Indian cities

    try {
        
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`);
        const weatherData = await weatherResponse.json();

       
        console.log(weatherData);

        if (weatherData.cod === 200) {
            const temperature = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const cityName = weatherData.name;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const maxTemp = weatherData.main.temp_max;
            const description = weatherData.weather[0].description;
            const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
            const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
            const precipitation = weatherData.weather[0].main;

            res.render('index', {
                temperature,
                feelsLike,
                cityName,
                humidity,
                windSpeed,
                maxTemp,
                description,
                sunriseTime,
                sunsetTime,
                precipitation
            });
        } else {
            res.render('index', { error: "Could not fetch weather data for the city.", city });
        }
    } catch (error) {
        console.error(error);
        res.render('index', { error: "An error occurred while fetching data.", city });
    }
});

app.listen(3000, () => {
    console.log("Server's up and running.");
});
