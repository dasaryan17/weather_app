// Get references to all the HTML elements we'll interact with
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn'); // New: Reference to the clear button
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');
const loadingMessage = document.getElementById('loading-message'); // New: Reference to the loading message

const cityNameElem = document.getElementById('city-name');
const temperatureElem = document.getElementById('temperature');
const descriptionElem = document.getElementById('description');
const humidityElem = document.getElementById('humidity');
const windSpeedElem = document.getElementById('wind-speed');
const weatherIconElem = document.getElementById('weather-icon');
const lastUpdatedElem = document.getElementById('last-updated'); // New: Reference to the last updated timestamp

// Your OpenWeatherMap API Key
const API_KEY = '669fe160a9592a664070b176c0279dae'; 

// --- Event Listeners ---

// Listen for a click on the search button
searchBtn.addEventListener('click', () => {
    getWeatherData();
});

// Listen for the 'Enter' key press in the city input field
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherData();
    }
});

// New: Listen for a click on the clear button
clearBtn.addEventListener('click', () => {
    cityInput.value = ''; // Clear the input field
    // Hide all display elements
    weatherDisplay.classList.remove('active');
    errorMessage.classList.remove('active');
    loadingMessage.classList.add('hidden');
    weatherIconElem.classList.add('hidden');
    lastUpdatedElem.classList.add('hidden');
});

// --- Core Function to Fetch Weather Data ---

async function getWeatherData() {
    const cityName = cityInput.value.trim(); // Get city name and remove extra spaces

    // If no city name is entered, show an error and stop
    if (!cityName) {
        showError('Please enter a city name.');
        return;
    }

    // Hide previous weather display and error message before fetching new data
    weatherDisplay.classList.remove('active');
    errorMessage.classList.remove('active');
    weatherIconElem.classList.add('hidden'); // Hide icon if no valid src yet
    lastUpdatedElem.classList.add('hidden'); // Hide last updated timestamp

    // Show loading message
    loadingMessage.classList.remove('hidden');

    // Construct the API URL. We're using 'units=metric' for Celsius.
    // Use backticks (``) for template literals to easily embed variables.
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

    try {
        // Use 'fetch' to make an HTTP request to the API
        const response = await fetch(apiUrl);

        // Hide loading message after response is received
        loadingMessage.classList.add('hidden');

        // Check if the response was successful (status code 200-299)
        if (!response.ok) {
            // Handle specific HTTP error codes
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        // Parse the JSON response body into a JavaScript object
        const data = await response.json();

        // Display the fetched weather data on the page
        displayWeatherData(data);

    } catch (error) {
        // Catch any errors during the fetch operation (e.g., network issues)
        console.error('Error fetching weather data:', error);
        // Hide loading message on error
        loadingMessage.classList.add('hidden');
        // Show a user-friendly error message
        showError(error.message || 'Could not fetch weather data. Please try again.');
    }
}

// --- Function to Display Weather Data on the Page ---

function displayWeatherData(data) {
    // Basic validation to ensure we have expected data
    if (!data || !data.main || !data.weather || data.weather.length === 0) {
        showError('No valid weather data received.');
        return;
    }

    // Update the text content of HTML elements with fetched data
    cityNameElem.textContent = data.name;
    // Round temperature and add Celsius symbol
    temperatureElem.textContent = `${Math.round(data.main.temp)}°C`;
    // Capitalize the first letter of the description
    descriptionElem.textContent = data.weather[0].description;
    humidityElem.textContent = `Humidity: ${data.main.humidity}%`;
    // OpenWeatherMap gives wind speed in m/s with 'metric' units
    windSpeedElem.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Construct the URL for the weather icon
    const iconCode = data.weather[0].icon;
    weatherIconElem.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElem.alt = data.weather[0].description;
    weatherIconElem.classList.remove('hidden'); // Show the icon

    // Update and show last updated timestamp
    const now = new Date();
    lastUpdatedElem.textContent = `Last updated: ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;
    lastUpdatedElem.classList.remove('hidden');

    // Add the 'active' class to the weather display container to make it visible
    weatherDisplay.classList.add('active');

    // Clear the city input field after successful search
    cityInput.value = '';
}

// --- Function to Show Error Messages ---

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active'); // Show the error message
    weatherDisplay.classList.remove('active'); // Ensure weather display is hidden
    weatherIconElem.classList.add('hidden'); // Ensure icon is hidden
    loadingMessage.classList.add('hidden'); // Ensure loading message is hidden on error
    lastUpdatedElem.classList.add('hidden'); // Ensure last updated is hidden on error
}

// --- Initial State (Optional, good practice) ---
// Hide all display elements when the page first loads
weatherDisplay.classList.remove('active');
errorMessage.classList.remove('active');
weatherIconElem.classList.add('hidden');
loadingMessage.classList.add('hidden'); // Hide loading message initially
lastUpdatedElem.classList.add('hidden'); // Hide last updated initially
