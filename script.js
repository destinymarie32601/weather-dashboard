// Function to fetch weather data from OpenWeatherMap API
async function getWeatherData(city) {
  const apiKey = '8ea1fc06c39e5e98c60eec7521aaffd6'; // Replace with your OpenWeatherMap API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Weather data not available');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error:', error.message);
    return null;
  }
}

let searchHistory = []; //NEWWWWWWWWWWWWW

function updateSearchHistory() { //NEWWWWWWWWWWWWWWWWWWWWWW
  const searchHistoryElement = document.getElementById('search-history');
  searchHistoryElement.style.display = 'none'; //NWQQQQQQQQQQ

  searchHistory.forEach((city) => {
    const searchItem = document.createElement('div');
    searchItem.textContent = city;
    searchItem.className = 'search-item';
    searchItem.addEventListener('click', () => handleSearchHistoryItemClick(city));
    searchHistoryElement.appendChild(searchItem);

  });

} //NEWWWWWWWWWWWWWWWWWWWWWWw

function handleSearchHistoryItemClick(city) { //NEWWWWWWWWWWWWWWWW
  getWeatherData(city)
    .then((data) => updateWeatherInfo(data))
    .catch((error) => console.log('error:', error));

}

// Function to update the weather information on the page
function updateWeatherInfo(weatherData) {
  if (!weatherData) {
    // Handle error condition
    return;
  }
  // Update current weather information
  const currentWeather = weatherData.list[0];
  const temperature = currentWeather.main.temp;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;
  const city = weatherData.city.name;
  document.getElementById('city-name').textContent = city;

  const currentDate = new Date();
  const daysOfWeek = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = currentDate.toLocaleDateString(undefined, daysOfWeek);

  document.getElementById('date').textContent = formattedDate;

  document.getElementById('current-weather-items').innerHTML = `
      <div class="weather-item">
        <p>Temp :</p>
        <p>${temperature}&deg;F</p>
      </div>
      <div class="weather-item">
        <p>Humidity :</p>
        <p>${humidity}%</p>
      </div>
      <div class="weather-item">
        <p>Wind :</p>
        <p>${windSpeed} m/s</p>
      </div>
    `;

  updateForecastInfo(weatherData);
}
function updateForecastInfo(weatherData) {
  if (!weatherData) {

    return;
  }
  // Update forecast information
  const forecastItems = weatherData.list.slice(0, 5); // Get the next 7 forecast items
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';

  forecastItems.forEach((item, index) => {
    const dateTime = new Date();
    dateTime.setDate(dateTime.getDate() + index + 1);
    const day = dateTime.toLocaleDateString(undefined, { weekday: 'long' });
    const date = dateTime.toLocaleDateString(undefined, { day: 'numeric' });
    const month = dateTime.toLocaleDateString(undefined, { month: 'long' });
    const temperature = item.main.temp;
    const humidity = item.main.humidity;
    const windSpeed = item.wind.speed;
    const weatherIcon = item.weather[0].icon;
    const forecastItem = document.createElement('div');

    forecastItem.className = 'weather-forecast-item';
    forecastItem.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="weather icon" class="w-icon" id="weather-icon">
        
        <div class = "day">${day}</div>
        <div class = "month">${month}</div>
        <div class="date">${date}</div>
        <div class="temp">Temp: ${temperature}&deg;F</div>
        <div class ="humidity">Humid: ${humidity}%</div>
        <div class = "wind-speed">Wind: ${windSpeed} m/s</div>
      `;

    forecastContainer.appendChild(forecastItem);
  });
}
// Function to handle the search button click
function handleSearch() {
  const searchInput = document.getElementById('search-input');
  const city = searchInput.value.trim();

  if (city !== '') {
    const index = searchHistory.indexOf(city);
    if (index === -1) {
      searchHistory.splice(index, 1);
    }
    searchHistory.push(city);

    // Fetch weather data for the entered city
    getWeatherData(city)
      .then((data) => {
        updateWeatherInfo(data); //NEWWWWWWWWWWWWWw
        updateSearchHistory();
      })
      .catch((error) => console.log('Error:', error));

    searchInput.value = ''; // Clear the search input
  }
}

// Add event listener to the search button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', handleSearch);

const historyButton = document.getElementById('history-button');
historyButton.addEventListener('click', () => {
  const searchHistoryElement = document.getElementById('search-history');
  searchHistoryElement.style.display = searchHistoryElement.style.display === 'block' ? 'none' : 'block';
});
//default weather for charlotte that pops up when you run the application
const defaultCity = 'Charlotte';
getWeatherData(defaultCity)
  .then((data) => updateWeatherInfo(data))
  .catch((error) => console.log('Error:', error));