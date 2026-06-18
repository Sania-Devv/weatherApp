Weather Dashboard Application
Project Description:
Weather Dashboard is a responsive web application that allows users to view real-time weather information for different cities. Users can search for any city, check current weather conditions, view air quality information, monitor sunrise and sunset timings, and manage their favorite cities. The application also supports dark mode and displays hourly and forecast weather data using charts.

Features:
1. City Search
⦁	 Search weather information by city name.
⦁	Real-time weather updates using Weather API.
⦁	Debounced search for better performance.
2. Current Weather Information
⦁	City Name
⦁	Country Name
⦁	Temperature (°C)
⦁	Weather Condition
⦁	Wind Speed
⦁	Humidity
 3. Forecast Weather
⦁	Multi-day weather forecast.
⦁	Minimum and maximum temperature display.
⦁	Weather condition updates for upcoming days.
4. Air Quality Index (AQI)
⦁	Shows air quality by displaying key pollutants like PM2.5, PM10, SO₂, NO₂, O₃, and CO in an easy-to-understand way.
⦁	Shows the UV Index to indicate how strong the sun’s UV radiation is for safety awareness.
5. Sunrise & Sunset Information
⦁	 Sunrise time
⦁	 Sunset time
⦁	Location-based weather details
6. Favorites Management
⦁	Add cities to favorites.
⦁	Remove cities from favorites.
⦁	Store favorite cities using Local Storage.
⦁	Quick access to saved cities.
 7. Geolocation Support
⦁	 Get weather information using the user's current location.
 8. Dark Mode
⦁	 Toggle between Light Mode and Dark Mode.
⦁	 User preference is saved in Local Storage.
 9. Error Handling
⦁	 Invalid city detection.
⦁	 API error handling.
⦁	Retry option for failed requests.
10. Toast Notifications
⦁	 Success messages
⦁	 Error messages
⦁	 Warning messages
⦁	Informational messages
11. Loading Skeletons
⦁	Skeleton loading UI while data is being fetched.
12. Hourly Temperature Chart
⦁	Displays hourly temperature trends.
⦁	 Dynamic chart updates based on selected city.

API Key Guide
⦁	To fetch real-time weather data, this project uses WeatherAPI.
 Steps to Get and Use the API Key
⦁	 Visit the WeatherAPI website:
⦁	   https://www.weatherapi.com/
⦁	Create a free account on WeatherAPI.
⦁	Generate an API key from the dashboard.
⦁	Copy the generated API key.
⦁	Open the JavaScript file (`script.js`).
⦁	Paste the API key in the `API_KEY` variable.
⦁	Save the file and run the project.

 Note:
⦁	 A valid API key is required to fetch weather data.
⦁	Keep your API key private and do not share it publicly.

 Setup Instructions
⦁	First, the project requirements were understood.
⦁	 A project folder was created and the required files ( index.htm, script.js) were added.
⦁	A WeatherAPI account was created.
⦁	 An API key was generated from the WeatherAPI dashboard.
⦁	The generated API key was added to the JavaScript file.
⦁	The user interface was developed using HTML, Tailwind CSS, and JavaScript.
⦁	Weather API integration was implemented to fetch real-time weather data.
⦁	Additional features such as dark mode, favorites, forecast, air quality, geolocation, and charts were added.
⦁	 The project was tested and errors were fixed.
⦁	 The final application was run in the browser using Live Server.
 
 Technologies Used
⦁	HTML5
⦁	Tailwind CSS
⦁	 JavaScript 
⦁	 Local Storage
⦁	Chart.js
⦁	WeatherAPI
