const API_KEY = "780f33a2f0d443a1b7765444261506";

const BASE_URL = "https://api.weatherapi.com/v1";

// Current Weather
const getCurrentWeather = (city) =>
  `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`;

// Forecast (5 days)
const getForecast = (city) =>
  `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`;