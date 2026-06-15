async function getWeather(city) {
  try {
    const url = getCurrentWeather(city);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    updateUI(data);

  } catch (error) {
    alert(error.message);
  }
}
function updateUI(data) {
  document.getElementById("cityName").textContent =
    data.location.name;

  document.getElementById("temperature").textContent =
    data.current.temp_c + "°C";

  document.getElementById("condition").textContent =
    data.current.condition.text;

  document.getElementById("wind").textContent =
    data.current.wind_kph + " km/h";

  document.getElementById("humidity").textContent =
    data.current.humidity + " %";
}
function debounce(func, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
function searchCity(city) {
  if (!city.trim()) return;

  getWeather(city);
}
const debouncedSearch = debounce(searchCity, 600);
document.getElementById("searchInput").addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});

