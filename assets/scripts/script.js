const apiKey = '8c213d9c79a5050e6aa5c5b76d28bce0';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

// DOM elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather-container');
const forecastContainer = document.getElementById('forecast-container');
const historyList = document.getElementById('history-list');

// SUBMISSION FORM EVENT LISTENER
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); 

  const cityName = cityInput.value.trim(); // GET CITY NAME AFTER INPUTTING IT

  if (cityName !== '') {
    // CALL FUNCTION TO FETCH WEATHER DATA
    getWeatherData(cityName);
    cityInput.value = '';
  }
});

// GET DATA FROM WEATHER API
function getWeatherData(cityName) {
  fetch(`${apiUrl}/weather?q=${cityName}&units=metric&appid=${apiKey}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('City not found!');
      }
    })
    .then((data) => {
      // DATA FROM API RESPONSE
      const city = data.name;
      const date = new Date(data.dt * 1000).toLocaleDateString();
      const icon = data.weather[0].icon;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      // UPDATE CURRENT WEATHER INFO
      currentWeatherContainer.innerHTML = `
       <span> <h3>${city}</h3> <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon"> </span>
        <p>Date: ${date}</p>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;

      // STORING SEARCHED CITY
      addToSearchHistory(city);

      // GET 5 DAYS DATA
      getForecastData(city);
    })
    .catch((error) => {
      console.error(error);
    });
}

// THIS IS THE FUNCTION TO GET THE 5 DAYS DATA FROM THE API
function getForecastData(cityName) {
  // MAKING THE REQUEST
  fetch(`${apiUrl}/forecast?q=${cityName}&units=metric&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const forecastList = data.list;
      forecastContainer.innerHTML = '';

      // GETTING THE DATA FOR THE 2 DAYS LIST
      for (let i = 0; i < forecastList.length; i += 8) {
        const forecastData = forecastList[i];
        const date = new Date(forecastData.dt * 1000).toLocaleDateString();
        const icon = forecastData.weather[0].icon;
        const temperature = forecastData.main.temp;
        const humidity = forecastData.main.humidity;
        const windSpeed = forecastData.wind.speed;

        // THIS CREATES THE FORECAST CARDS
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
          <p>Date: ${date}</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
          <p>Temperature: ${temperature} °C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        // PUTTING FORECAST DATA IN CONTAINER
        forecastContainer.appendChild(forecastCard);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// ADD CITY TO SEARCH
function addToSearchHistory(city) {
  // GET HISTORY FROM LOCAL STORAGE
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // ADD NEW SEARCH CITY TO HISTORY
  searchHistory.unshift(city);

  // STORE THE HISTORY
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // RENDER THE HISTORY DATA
  renderSearchHistory(searchHistory);
}

function renderSearchHistory(searchHistory) {
  historyList.innerHTML = '';

  // CREATE LIST ITEMS FOR HSITORY
  for (let i = 0; i < searchHistory.length; i++) {
    const city = searchHistory[i];

    const listItem = document.createElement('li');
    listItem.textContent = city;

    listItem.addEventListener('click', () => {
      getWeatherData(city);
    });

    historyList.appendChild(listItem);
  }
}

// RENDERING SEARCH HISTORY FROM LOCAL STORAGE
renderSearchHistory(JSON.parse(localStorage.getItem('searchHistory')) || []);