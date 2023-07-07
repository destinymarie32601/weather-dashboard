// Function to fetch weather data from OpenWeatherMap API by city parameter
async function getWeatherData(city) {
  const apiKey = '8ea1fc06c39e5e98c60eec7521aaffd6'; 
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

// Function to update the current weather information on the page
function updateWeatherInfo(weatherData) {
  if (!weatherData) { //ensure valid weather data
    return;
  }
  // Update current weather information
  const currentWeather = weatherData.list[0];
  const temperature = currentWeather.main.temp;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;
  const city = weatherData.city.name;
  document.getElementById('city-name').textContent = city; //sets the city name to the corresponding city

  const currentDate = new Date(); //gets the date and day and formats it
  const daysOfWeek = { weekday: 'long', day: 'numeric', month: 'long' };
  const formattedDate = currentDate.toLocaleDateString(undefined, daysOfWeek);

  document.getElementById('date').textContent = formattedDate;
//updates the current weather items in html based on the data
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

  updateForecastInfo(weatherData); //updates the forecast data with it
}
function updateForecastInfo(weatherData) { //function to update the five day forecast
  if (!weatherData) {  //ensure weather data is valid 
    return;
  }
  // Update forecast information
  const forecastItems = weatherData.list.slice(0, 5); // Get the next 5 forecast items
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; //clear previous forecast

  forecastItems.forEach((item, index) => { //foreach loop to iterate over each item
    const dateTime = new Date();  //gets the date 
    dateTime.setDate(dateTime.getDate() + index + 1); //increments the date
    const day = dateTime.toLocaleDateString(undefined, { weekday: 'long' });
    const date = dateTime.toLocaleDateString(undefined, { day: 'numeric' });
    const month = dateTime.toLocaleDateString(undefined, { month: 'long' });
    const temperature = item.main.temp; //gets the corresponding temp, humidity, wind for 5 day forecast
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

let searchHistory = []; //set search history to empty array

function updateSearchHistory() { //updates the search history on the page
  const searchHistoryElement = document.getElementById('search-history');
  searchHistoryElement.style.display = 'none'; 

  searchHistory.forEach((city) => {
    const searchItem = document.createElement('div');
    searchItem.textContent = city;
    searchItem.className = 'search-item';
    searchItem.addEventListener('click', () => handleSearchHistoryItemClick(city));
    searchHistoryElement.appendChild(searchItem);

  });

} 

function handleSearchHistoryItemClick(city) { //updates the weather based on the item clicked in the search history
  getWeatherData(city)                      
    .then((data) => updateWeatherInfo(data))
    .catch((error) => console.log('error:', error));

}

//function for handling the search 
function handleSearch() {

  const searchInput = document.getElementById('search-input');
  const city = searchInput.value.trim();

  if (city !== '') {  //if city search input is not empty
    const index = searchHistory.indexOf(city); 
    if (index === -1) {
      searchHistory.splice(index, 1);      //make sure search history elements are not repeated
    }
    searchHistory.push(city);
  }

  getWeatherData(city)   //retrieving weather data from open weather map by city
  .then((data) => {
    updateWeatherInfo(data); //update weather info
    updateSearchHistory(); //updated weather info / search history
  })
  .catch((error) => console.log('Error:', error)); 

  searchInput.value = ''; // Clear the search input
}

// Add event listener to the search button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', handleSearch);
const historyButton = document.getElementById('history-button');
//event listener for the history button
historyButton.addEventListener('click', () => { 
  const searchHistoryElement = document.getElementById('search-history');
  searchHistoryElement.style.display = searchHistoryElement.style.display === 'block' ? 'none' : 'block';
}); //shows the search history element if the history button is clicked

//sets the default weather when you run the application to Charlotte
const defaultCity = 'Charlotte';
getWeatherData(defaultCity)
  .then((data) => updateWeatherInfo(data))
  .catch((error) => console.log('Error:', error));