const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");

const API_KEY = "6e58f3ef52e3c5f548421bf0d28e20ef"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return ``; 
    } else {
return `<li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn${weatherItem.weather[0].icon}d@2x.png" alt="weather-icon">
    <h4>Tempe: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
    <h4>Wind: ${weatherItem.wind.speed} KM/H</h4>
    <h4>Humidity: ${weatherItem.main.humidity} %</h4> 
    </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
    // Filter the forecast to get only one forecast per day
    const uniqueForecastDays = [];   
    const fiveDaysForecast = data.list.filter(forecast => {
           const forecastDate = new Date(forecast.dt.txt).getDate();
           if(!uniqueForecastDays.includes(forecastDate))  {
               return uniqueForecastDays.push(forecastDate);
           }
        });

  // Clearing previous weather data      
        cityInput.value = "";
        weatherCardDiv.innerHTML = "";


        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
       
        });
    }).catch( () => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user enter city name and remove extra spaces
    if(!cityName) return; // Return if cityName is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;


// Get entered city coordinates (latitude, longitude, and name) from the API reponse
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon );
    }).catch( () => {
        alert("An error occurred while fetching the coordinates!");
    });
}

searchButton.addEventListener("click", getCityCoordinates);