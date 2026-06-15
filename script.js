/* ═══════════════════════════════════════════════════════
   WeatherScope — script.js
   Search functionality + Theme + Clock + Chart + Sidebar
   ═══════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────────────────
   CONFIG — WeatherAPI.com
─────────────────────────────────────────────────────── */
const API_KEY  = '780f33a2f0d443a1b7765444261506';
const BASE_URL = 'https://api.weatherapi.com/v1';

// API URL builders
const getCurrentWeather = (city) =>
  `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;

const getForecast = (city) =>
  `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no`;


/* ──────────────────────────────────────────────────────
   DOM REFERENCES
─────────────────────────────────────────────────────── */
const searchInput  = document.getElementById('searchInput');
const searchWrap   = document.getElementById('search-wrap');
const spinner      = document.getElementById('search-spinner');
const rpError      = document.getElementById('rp-error');
const rpErrorMsg   = document.getElementById('rp-error-msg');

// Right panel city card elements (updateUI targets)
const cityNameEl   = document.getElementById('cityName');
const temperatureEl= document.getElementById('temperature');
const conditionEl  = document.getElementById('condition');
const windEl       = document.getElementById('wind');
const humidityEl   = document.getElementById('humidity');
const rpIconEl     = document.getElementById('rp-icon');
const rpDateEl     = document.getElementById('rp-date');


/* ──────────────────────────────────────────────────────
   WEATHER API — Fetch & Update UI
─────────────────────────────────────────────────────── */

// Map WeatherAPI condition codes to emoji icons
function getWeatherEmoji(code, isDay) {
  // Sunny / Clear
  if ([1000].includes(code)) return isDay ? '☀️' : '🌙';
  // Partly cloudy
  if ([1003].includes(code)) return isDay ? '⛅' : '🌤️';
  // Cloudy / Overcast
  if ([1006, 1009].includes(code)) return '☁️';
  // Mist / Fog
  if ([1030, 1135, 1147].includes(code)) return '🌫️';
  // Light rain / Drizzle
  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183].includes(code)) return '🌦️';
  // Heavy rain
  if ([1186, 1189, 1192, 1195, 1198, 1201].includes(code)) return '🌧️';
  // Thunderstorm
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return '⛈️';
  // Snow / Sleet
  if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216,
       1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return '❄️';
  return '🌡️';
}

// Update the right panel UI with fetched data
function updateUI(data) {
  const loc = data.location;
  const cur = data.current;

  // City name
  cityNameEl.textContent = loc.name;

  // Temperature — show as "29°" like in image (no "C")
  temperatureEl.textContent = `${Math.round(cur.temp_c)}°`;

  // Condition text
  conditionEl.textContent = cur.condition.text;

  // Wind
  windEl.textContent = `${cur.wind_kph} km/h`;

  // Humidity
  humidityEl.textContent = `${cur.humidity} %`;

  // Weather emoji icon
  rpIconEl.textContent = getWeatherEmoji(cur.condition.code, cur.is_day);

  // Date — "Today, 14 April" style
  const d = new Date(loc.localtime);
  const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
  rpDateEl.textContent = `Today, ${dateStr}`;
}

// Show/hide error message
function showError(msg) {
  rpErrorMsg.textContent = msg;
  rpError.classList.remove('hidden');
}

function hideError() {
  rpError.classList.add('hidden');
}

// Show/hide loading spinner
function setLoading(on) {
  if (on) {
    spinner.classList.remove('hidden');
  } else {
    spinner.classList.add('hidden');
  }
}

// Main fetch function
async function getWeather(city) {
  if (!city.trim()) return;

  hideError();
  setLoading(true);

  try {
    const url      = getCurrentWeather(city);
    const response = await fetch(url);

    if (!response.ok) {
      // 400 = city not found, 401 = bad API key
      if (response.status === 400) {
        throw new Error('City not found. Please check the name.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Check config.');
      } else {
        throw new Error('Failed to fetch weather data.');
      }
    }

    const data = await response.json();
    updateUI(data);

  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}


/* ──────────────────────────────────────────────────────
   DEBOUNCE — Wait 600ms after user stops typing
─────────────────────────────────────────────────────── */
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

function searchCity(city) {
  if (!city.trim()) {
    hideError();
    return;
  }
  getWeather(city);
}

// Debounced search — fires 600ms after user stops typing
const debouncedSearch = debounce(searchCity, 600);

// Wire up search input
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Also search on Enter key (immediate, no debounce)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const city = e.target.value.trim();
      if (city) getWeather(city);
    }
  });
}


/* ──────────────────────────────────────────────────────
   THEME TOGGLE
   Light / Dark — saved in localStorage
─────────────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('ws-theme') || 'light';
  applyTheme(saved);
}

// Called by onclick on HTML buttons
function setTheme(mode) {
  applyTheme(mode);
  localStorage.setItem('ws-theme', mode);
}

function applyTheme(mode) {
  const html  = document.documentElement;
  const light = document.getElementById('btn-light');
  const dark  = document.getElementById('btn-dark');

  if (mode === 'dark') {
    html.classList.remove('light');
    html.classList.add('dark');
    if (dark)  dark.classList.add('active');
    if (light) light.classList.remove('active');
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    if (light) light.classList.add('active');
    if (dark)  dark.classList.remove('active');
  }
}


/* ──────────────────────────────────────────────────────
   LIVE CLOCK + GREETING
─────────────────────────────────────────────────────── */
function updateClock() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = (h % 12 || 12).toString().padStart(2, '0');

  const timeEl = document.getElementById('live-time');
  if (timeEl) timeEl.textContent = `${h12}:${m} ${ampm}`;

  // Dynamic greeting
  const greetEl = document.getElementById('greeting-text');
  if (greetEl) {
    const word = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
    greetEl.textContent = `Good ${word}, Asif!`;
  }
}

updateClock();
setInterval(updateClock, 1000);


/* ──────────────────────────────────────────────────────
   FORECAST DAY SELECTION
─────────────────────────────────────────────────────── */
function activateDay(el) {
  document.querySelectorAll('.fc-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}


/* ──────────────────────────────────────────────────────
   SIDEBAR NAV ACTIVE STATE
─────────────────────────────────────────────────────── */
function initSidebar() {
  document.querySelectorAll('.nav-icon').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-icon').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}


/* ──────────────────────────────────────────────────────
   MONTHLY RAINFALL BAR CHART
   Pure DOM bars — no library
─────────────────────────────────────────────────────── */
const RAINFALL = [
  { rain: 55, sun: 70 }, { rain: 40, sun: 58 }, { rain: 68, sun: 52 },
  { rain: 82, sun: 38 }, { rain: 60, sun: 74 }, { rain: 44, sun: 82 },
  { rain: 28, sun: 92 }, { rain: 34, sun: 88 }, { rain: 62, sun: 60 },
  { rain: 78, sun: 44 }, { rain: 50, sun: 62 }, { rain: 42, sun: 54 },
];

function buildChart() {
  const container = document.getElementById('bar-chart');
  if (!container) return;
  container.innerHTML = '';

  RAINFALL.forEach(d => {
    const g = document.createElement('div');
    g.className = 'bar-group';

    const r = document.createElement('div');
    r.className = 'bar rain';
    r.style.height = `${(d.rain / 100) * 86}px`;
    r.title = `Rain: ${d.rain}mm`;

    const s = document.createElement('div');
    s.className = 'bar sun';
    s.style.height = `${(d.sun / 100) * 86}px`;
    s.title = `Sun: ${d.sun}hrs`;

    g.appendChild(r);
    g.appendChild(s);
    container.appendChild(g);
  });
}


/* ──────────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  buildChart();
  updateClock();

  // Load default city on startup
  getWeather('Dhaka');
});
