const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const right = document.getElementById("right");

// GLOBAL VARIABLE: Isko top par rakhna zaroori hai taake poore code ko current city ka pata ho
let currentCity = "Dhaka"; 

/* =========================
   STATIC DATA
========================= */
const weeklyForecast = [
  { day: "Sun", icon: "⛈️", temp: 28 },
  { day: "Mon", icon: "🌧️", temp: 17 },
  { day: "Tue", icon: "⛅", temp: 20 },
  { day: "Wed", icon: "⛈️", temp: 29 },
  { day: "Thu", icon: "🌙", temp: 22 },
  { day: "Fri", icon: "🌤️", temp: 16 },
];

/* =========================
   INIT
========================= */
renderApp();

function renderApp() {
  renderSidebar();
  renderMain();
  renderRightPanel();

  setTimeout(() => {
    renderForecastCards();
    renderLeftCards();
    renderRightCards(); 
    initWeatherApp();
  }, 0);
}

/* =========================
   SIDEBAR
========================= */
function renderSidebar() {
  sidebar.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Weather App</h2>
    <button class="block mb-2">Dashboard</button>
    <button class="block mb-2">Locations</button>
    <button class="block mb-2">Settings</button>
  `;
}

/* =========================
   MAIN LAYOUT
========================= */
function renderMain() {
  main.innerHTML = `
    <h1 class="text-2xl font-bold mb-4">Weather Dashboard</h1>
    <div id="forecast" class="grid grid-cols-6 gap-2 mb-6"></div>
    <div class="grid grid-cols-2 gap-4">
      <div id="leftCards" class="space-y-4"></div>
      <div id="rightCards" class="space-y-4"></div>
    </div>
  `;
}

/* =========================
   FORECAST
========================= */
function renderForecastCards() {
  const container = document.getElementById("forecast");
  container.innerHTML = weeklyForecast
    .map(
      (item) => `
    <div class="bg-white p-2 rounded shadow text-center">
      <div class="text-sm font-semibold">${item.day}</div>
      <div class="text-xl">${item.icon}</div>
      <div class="text-sm font-bold">${item.temp}°</div>
    </div>
  `
    )
    .join("");
}

/* =========================
   LEFT CARDS
========================= */
function renderLeftCards() {
  const left = document.getElementById("leftCards");
  left.innerHTML = `
    <div class="bg-white p-4 rounded shadow">
      <h2 class="font-bold mb-2">Air Quality Index</h2>
      <div class="text-sm">PM2.5: 9.3 | PM10: 12.2</div>
      <div class="text-green-600 font-bold mt-2">Good</div>
    </div>
   <div class="bg-white p-4 rounded shadow mt-4">
      <h2 class="font-bold mb-2">Hourly Temperature</h2>
      <canvas id="hourlyChart"></canvas>
   </div>
  `;
}

/* =========================
   RIGHT COLUMN (LEFT SIDE INSIDE MAIN)
========================= */
function renderRightCards() {
  const rightCards = document.getElementById("rightCards");
  rightCards.innerHTML = `
    <div class="bg-white p-4 rounded shadow">
      <h2 class="font-bold mb-2">Sunrise & Sunset</h2>
      <div class="flex justify-between text-sm">
        <span>🌅 5:40 AM</span>
        <span>🌇 6:50 PM</span>
      </div>
    </div>
    <div class="bg-blue-100 p-4 rounded shadow">
      <h3 class="font-bold">Tokyo</h3>
      <p>🌤️ 26°</p>
    </div>
    <div class="bg-orange-100 p-4 rounded shadow">
      <h3 class="font-bold">New York</h3>
      <p>☀️ 31°</p>
    </div>
  `;
}

/* =========================
   RIGHT PANEL (Clean Layout)
========================= */
function renderRightPanel() {
  right.innerHTML = `
    <div class="flex flex-col gap-4">
      <div id="toastContainer" class="fixed top-4 right-4 space-y-2 z-50"></div>
      <div>
        <input id="searchInput" class="w-full p-2 border rounded" placeholder="Search city..." />
        <button id="geoBtn" class="w-full mt-2 bg-green-500 text-white p-2 rounded flex items-center justify-center gap-2">
          <i class="fa-solid fa-location-crosshairs"></i> Use My Location
        </button>
      </div>

      <div id="search-spinner" class="hidden text-blue-500 text-sm text-center">Loading...</div>
      <div id="rp-error" class="hidden bg-red-100 text-red-600 p-2 rounded text-sm text-center">
        <span id="rp-error-msg"></span>
      </div>

      <div id="weatherCard" class="relative bg-blue-400 text-white p-5 rounded-2xl space-y-4 shadow-md overflow-hidden">
        
        <button id="heartIconBtn" onclick="globalToggleFav()" class="absolute top-4 right-4 text-2xl focus:outline-none transition-transform active:scale-90 z-10" title="Favorite City">
          🤍
        </button>

        <div class="flex items-center gap-1 text-sm opacity-90">
          <i class="fa-solid fa-location-dot"></i>
          <span id="cityName" class="font-semibold">Dhaka</span>
        </div>
        
        <div class="text-center py-2">
          <div id="rp-icon" class="text-5xl mb-1">🌤️</div>
          <p id="condition" class="text-sm tracking-wide opacity-90">Sunny</p>
          <h1 id="temperature" class="text-5xl font-black mt-1">29°C</h1>
        </div>

        <div class="flex justify-between items-center text-xs pt-3 border-t border-white/20 opacity-90">
          <span id="wind">💨 Wind: -- km/h</span>
          <span id="humidity">💧 Hum: -- %</span>
        </div>
        
        <div id="rp-date" class="text-[10px] opacity-70 text-right"></div>
      </div>

      <div class="space-y-2">
        <div id="favList" class="space-y-3">
          </div>
      </div>

    </div>
  `;
}

// Global variable timeout track karne ke liye taake overlapping na ho
let errorTimeoutToken = null;

function initWeatherApp() {
  const searchInput = document.getElementById("searchInput");
  const geoBtn = document.getElementById("geoBtn"); 
  const spinner = document.getElementById("search-spinner");
  const rpError = document.getElementById("rp-error");
  const rpErrorMsg = document.getElementById("rp-error-msg");

  const cityNameEl = document.getElementById("cityName");
  const temperatureEl = document.getElementById("temperature");
  const conditionEl = document.getElementById("condition");
  const windEl = document.getElementById("wind");
  const humidityEl = document.getElementById("humidity");
  const rpIconEl = document.getElementById("rp-icon");
  const rpDateEl = document.getElementById("rp-date");
  const favList = document.getElementById("favList");

  const API_KEY = "780f33a2f0d443a1b7765444261506";
  const BASE_URL = "https://api.weatherapi.com/v1";

  /* =========================
      FAVORITES LOGIC
  ========================= */
  let favWeatherDataCache = JSON.parse(localStorage.getItem("favWeatherDataCache")) || {};

  function getFavCities() {
    return JSON.parse(localStorage.getItem("favCities")) || [];
  }

  function saveFavCities(list) {
    localStorage.setItem("favCities", JSON.stringify(list));
  }

  function renderFavList() {
    const favs = getFavCities();
    if (!favList) return;

    if (favs.length === 0) {
      favList.innerHTML = ``;
      return;
    }

    favList.innerHTML = favs
      .map((city, index) => {
        const bgColors = ["bg-rose-400 text-white", "bg-amber-400 text-white"];
        const selectedStyle = bgColors[index % bgColors.length];
        
        const cached = favWeatherDataCache[city.toLowerCase()] || {
          temp: "--",
          wind: "--",
          hum: "--"
        };

        return `
        <div class="relative group ${selectedStyle} p-4 rounded-2xl shadow-sm flex flex-col gap-1 cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-md" 
             onclick="globalLoadCity('${city}')">
          
          <button 
            class="absolute top-2 right-3 text-white/70 hover:text-white font-bold text-xs p-1" 
            onclick="event.stopPropagation(); globalRemoveCity('${city}')"
            title="Remove">
            ✕
          </button>

          <div class="flex justify-between items-start pr-5">
            <div class="space-y-0.5 text-xs opacity-90 font-medium">
              <div>🍃 Wind | ${cached.wind} km/h</div>
              <div>💧 Hum | ${cached.hum}%</div>
            </div>
            
            <div class="text-right">
              <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px]">
                📌 ${city}
              </span>
              <h3 class="text-3xl font-black mt-1">${cached.temp}°</h3>
            </div>
          </div>
          
        </div>
      `;
      })
      .join("");
  }

  function updateFavBtn() {
    const heartIconBtn = document.getElementById("heartIconBtn");
    if (!heartIconBtn) return;
    
    const favs = getFavCities();
    if (favs.map(c => c.toLowerCase()).includes(currentCity.toLowerCase())) {
      heartIconBtn.innerHTML = `❤️`;
    } else {
      heartIconBtn.innerHTML = `🤍`;
    }
  }

  /* =========================
      GLOBAL WINDOW TRIGGERS
  ========================= */
  window.globalToggleFav = () => {
    if (!currentCity) return;
    let favs = getFavCities();
    const cityKey = currentCity.toLowerCase();

    if (favs.map(c => c.toLowerCase()).includes(cityKey)) {
      favs = favs.filter((c) => c.toLowerCase() !== cityKey);
      delete favWeatherDataCache[cityKey];
    } else {
      favs.push(currentCity);
      favWeatherDataCache[cityKey] = {
        temp: temperatureEl.textContent.replace('°C', '').trim(),
        wind: windEl.textContent.replace('💨 Wind: ', '').replace(' km/h', '').trim(),
        hum: humidityEl.textContent.replace('💧 Hum: ', '').replace(' %', '').trim()
      };
    }

    saveFavCities(favs);
    localStorage.setItem("favWeatherDataCache", JSON.stringify(favWeatherDataCache));
    renderFavList();
    updateFavBtn();
  };

  window.globalLoadCity = (city) => {
    if (searchInput) searchInput.value = city;
    fetchWeather(city);
  };

  window.globalRemoveCity = (city) => {
    let favs = getFavCities().filter((c) => c.toLowerCase() !== city.toLowerCase());
    delete favWeatherDataCache[city.toLowerCase()];
    saveFavCities(favs);
    localStorage.setItem("favWeatherDataCache", JSON.stringify(favWeatherDataCache));
    renderFavList();
    updateFavBtn();
  };

  /* =========================
      URL BUILDER (CITY SEARCH)
  ========================= */
  const getURL = (city) =>
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no`;

  /* =========================
      💥 FIXED ERROR HANDLER (SINGLE POPUP LOCK)
  ========================= */
  function showError(msg) {
    // Agar pehle se koi error active chal raha hai, to naya toast push nahi hoga
    if (!rpError.classList.contains("hidden") && rpErrorMsg.textContent === msg) {
      return; 
    }

    // Purane chalte hue setTimeout timer ko clear karna zaroori hai
    if (errorTimeoutToken) {
      clearTimeout(errorTimeoutToken);
    }

    rpErrorMsg.textContent = msg;
    rpError.classList.remove("hidden");

    // Exact single instance window management closure
    errorTimeoutToken = setTimeout(() => {
      rpError.classList.add("hidden");
      errorTimeoutToken = null;
    }, 2500);
  }

  /* =========================
      LOADING TOGGLE
  ========================= */
  function setLoading(state) {
    spinner.classList.toggle("hidden", !state);
  }

  /* =========================
      FETCH WEATHER (CITY SEARCH)
  ========================= */
  async function fetchWeather(city) {
    if (!city || !city.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(getURL(city));
      if (!res.ok) throw new Error("Invalid city name");

      const data = await res.json();
      currentCity = data.location.name; 

      /* =========================
         CURRENT WEATHER UPDATE
      ========================= */
      cityNameEl.textContent = `${data.location.name}, ${data.location.country}`;
      temperatureEl.textContent = `${Math.round(data.current.temp_c)}°C`;
      conditionEl.textContent = data.current.condition.text;
      windEl.textContent = `💨 Wind: ${data.current.wind_kph} km/h`;
      humidityEl.textContent = `💧 Hum: ${data.current.humidity} %`;

      rpIconEl.innerHTML = `
        <img src="https:${data.current.condition.icon}" class="w-16 h-16 mx-auto drop-shadow"/>
      `;

      rpDateEl.textContent = new Date(data.location.localtime).toDateString();
      
      updateFavBtn();
      renderForecast(data.forecast.forecastday);

      const todayHourly = data.forecast.forecastday[0].hour;
      const nextHours = todayHourly.slice(0, 8).map((item) => ({
        time: item.time,
        temp_c: item.temp_c,
      }));

      renderHourlyChart(nextHours);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
    renderFavList();
  }

  /* =========================
      FORECAST UI RENDER
  ========================= */
  function renderForecast(forecastDays) {
    const container = document.getElementById("forecast");
    if (!container) return;

    container.innerHTML = forecastDays
      .map((day) => {
        return `
        <div class="bg-white p-2 rounded shadow text-center">
          <div class="text-xs font-bold mb-1">
            ${new Date(day.date).toDateString().slice(0, 10)}
          </div>
          <img src="https:${day.day.condition.icon}" class="w-10 h-10 mx-auto"/>
          <div class="text-sm font-bold mt-1">
            ${Math.round(day.day.mintemp_c)}° / ${Math.round(day.day.maxtemp_c)}°
          </div>
          <div class="text-xs text-gray-600">
            ${day.day.condition.text}
          </div>
        </div>
      `;
      })
      .join("");
  }

  /* =========================
      DEBOUNCE (SEARCH DELAY)
  ========================= */
  function debounce(fn, delay = 600) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const handleSearch = debounce((value) => {
    fetchWeather(value);
  }, 600);

  /* =========================
      SEARCH EVENTS
  ========================= */
  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });

  // Jab user Enter hit karega, to chalte hue debounce search ko abort karega taake double call na ho
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      fetchWeather(e.target.value);
    }
  });

  /* =========================
      📍 GEOLOCATION FEATURE
  ========================= */
  geoBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showError("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no`,
          );
          if (!res.ok) throw new Error("Location weather not found");

          const data = await res.json();
          currentCity = data.location.name;

          cityNameEl.textContent = `${data.location.name}, ${data.location.country}`;
          temperatureEl.textContent = `${Math.round(data.current.temp_c)}°C`;
          conditionEl.textContent = data.current.condition.text;
          windEl.textContent = `💨 Wind: ${data.current.wind_kph} km/h`;
          humidityEl.textContent = `💧 Hum: ${data.current.humidity} %`;

          rpIconEl.innerHTML = `
            <img src="https:${data.current.condition.icon}" class="w-16 h-16 mx-auto drop-shadow"/>
          `;

          rpDateEl.textContent = new Date(data.location.localtime).toDateString();
          renderForecast(data.forecast.forecastday);
          updateFavBtn();
        } catch (err) {
          showError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        showError("Location access denied.");
      }
    );
  });

  renderFavList();
  updateFavBtn();
  fetchWeather(currentCity);
}

/* IMPORTANT */
document.addEventListener("DOMContentLoaded", initWeatherApp);

/* =========================
   CHART
========================= */
let hourlyChartInstance = null;

function renderHourlyChart(hourlyData) {
  const ctx = document.getElementById("hourlyChart");
  if (!ctx) return;

  if (hourlyChartInstance) {
    hourlyChartInstance.destroy();
  }

  const labels = hourlyData.map((item) => item.time.split(" ")[1].slice(0, 5));
  const temps = hourlyData.map((item) => item.temp_c);

  hourlyChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temps,
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}