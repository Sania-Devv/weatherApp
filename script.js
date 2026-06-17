const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const right = document.getElementById("right");
const toastContainer = document.getElementById("toastContainer");

let currentCity = "Dhaka";

// static data
const weeklyForecast = [
  { day: "Sun", icon: "⛈️", temp: 28 },
  { day: "Mon", icon: "🌧️", temp: 17 },
  { day: "Tue", icon: "⛅", temp: 20 },
  { day: "Wed", icon: "⛈️", temp: 29 },
  { day: "Thu", icon: "🌙", temp: 22 },
  { day: "Fri", icon: "🌤️", temp: 16 },
];
renderApp();

function renderApp() {
  renderSidebar();
  renderMain();
  renderRightPanel();

  setTimeout(() => {
    applyDarkMode();
    renderForecastCards();
    renderLeftCards();
    renderRightCards();
    renderBottomCard();
    initWeatherApp();
    updateClock();
    setInterval(updateClock, 1000);
  }, 0);
}

let isDarkMode = localStorage.getItem("darkMode") === "true";

function applyDarkMode() {
  const html = document.documentElement;
  const sun = document.getElementById("themeSun");
  const moon = document.getElementById("themeMoon");

  if (isDarkMode) {
    html.classList.add("dark");
    if (sun) sun.className = "p-1 px-2 rounded-full text-white/50 text-sm transition-colors";
    if (moon) moon.className = "p-1 px-2 rounded-full bg-blue-500 text-white shadow-sm text-sm transition-colors";
  } else {
    html.classList.remove("dark");
    if (sun) sun.className = "p-1 px-2 rounded-full bg-blue-500 text-white shadow-sm text-sm transition-colors";
    if (moon) moon.className = "p-1 px-2 rounded-full text-gray-500 text-sm transition-colors";
  }
}

window.globalToggleDarkMode = () => {
  isDarkMode = !isDarkMode;
  localStorage.setItem("darkMode", isDarkMode);
  applyDarkMode();
};

function updateClock() {
  const timeEl       = document.getElementById("liveTime");
  const dateEl       = document.getElementById("liveDate");
  const greetingText = document.getElementById("greetingText");
  const greetingIcon = document.getElementById("greetingIcon");

  if (!timeEl) return;

  const now  = new Date();
  const h24  = now.getHours();
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12  = h24 % 12 || 12;
  const mins = now.getMinutes().toString().padStart(2, "0");

  timeEl.textContent = `${h12}:${mins} ${ampm}`;

  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  dateEl.textContent = now.toLocaleDateString("en-US", options);

  if (h24 < 12) {
    greetingText.textContent = "Good morning!";
    greetingIcon.innerHTML = '<i class="fa-solid fa-cloud-sun text-orange-400 text-2xl"></i>';
  } else if (h24 < 17) {
    greetingText.textContent = "Good afternoon!";
    greetingIcon.innerHTML = '<i class="fa-solid fa-sun text-yellow-400 text-2xl"></i>';
  } else {
    greetingText.textContent = "Good evening!";
    greetingIcon.innerHTML = '<i class="fa-solid fa-moon text-blue-400 text-2xl"></i>';
  }
}

// sidebar
function renderSidebar() {
  sidebar.innerHTML = `
    <div class="h-full">
      <div class="bg-[#5C9CE6] dark:bg-gray-700 w-[80px] h-full overflow-hidden shadow-lg flex flex-col items-center">
        <div class="w-full h-[80px] flex items-center justify-center text-white">
          <i class="fa-solid fa-border-all text-2xl rounded"></i>
        </div>
        <div class="flex-1 w-full flex flex-col items-center justify-center gap-8 text-white/70 text-xl">
          <div></div><div></div><div></div><div></div><div></div>
        </div>
      </div>
    </div>
  `;
}
  //  MAIN LAYOUT
function renderMain() {
  main.innerHTML = `
    <div class="flex justify-between items-start mb-4 sm:mb-6">
      <div>
        <h1 id="liveTime" class="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500">--:-- --</h1>
        <p id="liveDate" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1 sm:mb-2">...</p>
        <div class="text-sm sm:text-base lg:text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span id="greetingIcon"><i class="fa-solid fa-cloud-sun text-orange-400"></i></span>
          <span id="greetingText">Good morning!</span>
        </div>
      </div>
      <div class="hidden lg:flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer" onclick="globalToggleDarkMode()">
        <div id="themeSun" class="p-1 px-2 rounded-full bg-blue-500 text-white shadow-sm text-sm transition-colors"><i class="fa-solid fa-sun text-yellow-400"></i></div>
        <div id="themeMoon" class="p-1 px-2 rounded-full text-gray-500 dark:text-gray-400 text-sm transition-colors"><i class="fa-solid fa-moon text-blue-400"></i></div>
      </div>
    </div>

    <div id="forecast" class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2 mb-4 sm:mb-6"></div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div id="leftCards"></div>
      <div id="rightCards"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div id="bottomCard"></div>
      <div class="hidden lg:block"></div>
    </div>
  `;
}
  //  FORECAST

function renderForecastCards() {
  const container = document.getElementById("forecast");
  container.innerHTML = weeklyForecast.map((item) => `
    <div class="bg-white dark:bg-gray-800 dark:text-white p-2 rounded-xl shadow text-center transition-colors">
      <div class="text-xs sm:text-sm font-semibold">${item.day}</div>
      <div class="text-lg sm:text-xl">${item.icon}</div>
      <div class="text-xs sm:text-sm font-bold">${item.temp}°</div>
    </div>
  `).join("");
}


  //  LEFT CARDS

function renderLeftCards(uvIndex = 0, airQuality = null) {
  const left = document.getElementById("leftCards");
  if (!left) return;

  const pm25 = airQuality ? Math.round(airQuality.pm2_5) : 9;
  const pm10 = airQuality ? Math.round(airQuality.pm10) : 12;
  const so2  = airQuality ? Math.round(airQuality.so2)  : 5;
  const no2  = airQuality ? Math.round(airQuality.no2)  : 4;
  const o3   = airQuality ? Math.round(airQuality.o3)   : 6;
  const co   = airQuality ? Math.round(airQuality.co / 100) : 1;

  let aqiText = "Good";
  let statusColor = "text-green-500 dark:text-green-400";
  if (uvIndex > 2 && uvIndex <= 5) { aqiText = "Moderate"; statusColor = "text-amber-500 dark:text-amber-400"; }
  else if (uvIndex > 5)            { aqiText = "Unhealthy / High"; statusColor = "text-red-500 dark:text-red-400"; }

  left.innerHTML = `
    <div class="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow transition-colors h-full flex flex-col justify-between">
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold text-slate-700 dark:text-gray-200 text-sm sm:text-base">Air Quality Index</h2>
        <span class="text-xs text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-lg">UV Index: ${uvIndex}</span>
      </div>
      <div class="flex items-center gap-3 mb-4">
        <div class="text-3xl text-green-500"><i class="fa-solid fa-wind"></i></div>
        <div>
          <div class="${statusColor} font-black text-base">${aqiText}</div>
          <div class="text-xs text-gray-400 dark:text-gray-500">Real-time air pollution metrics</div>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        ${[["PM2.5",pm25],["PM10",pm10],["SO₂",so2],["NO₂",no2],["O₃",o3],["CO",co]].map(([label,val]) => `
          <div class="bg-green-100 dark:bg-green-700/50 p-2 rounded-xl text-center min-w-0">
            <div class="text-sm font-bold text-green-600 dark:text-green-400">${val}</div>
            <div class="text-[10px] text-green-400 dark:text-green-500 font-medium">${label}</div>
          </div>`).join("")}
      </div>
    </div>
  `;
}

// right cards
function renderRightCards(sunrise = "5:40 AM", sunset = "6:50 PM") {
  const rightCards = document.getElementById("rightCards");
  if (!rightCards) return;

  rightCards.innerHTML = `
    <div class="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-2xl shadow transition-colors h-full flex flex-col justify-between">
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold text-slate-700 dark:text-gray-200 text-sm sm:text-base">Sunrise & Sunset</h2>
        <span class="text-xs text-gray-400"><i class="fa-solid fa-circle-notch"></i></span>
      </div>
      <div class="space-y-2.5">
        <div class="bg-pink-50/80 dark:bg-gray-700/50 p-3 rounded-xl">
          <div class="text-xs font-bold text-blue-500 mb-2 flex items-center gap-1">
            <i class="fa-solid fa-location-dot"></i> ${currentCity}
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl text-amber-500">☀️</span>
              <div>
                <div class="text-[10px] text-gray-400">Sunrise</div>
                <div class="text-xs font-bold">${sunrise}</div>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-2xl text-blue-400">🌙</span>
              <div>
                <div class="text-[10px] text-gray-400">Sunset</div>
                <div class="text-xs font-bold">${sunset}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-pink-50/80 dark:bg-gray-700/20 p-3 rounded-xl">
          <div class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
            <i class="fa-solid fa-location-dot"></i> Tokyo
          </div>
          <div class="grid grid-cols-2 gap-4 opacity-80">
            <div class="flex items-center gap-2">
              <span class="text-lg">☀️</span>
              <div class="text-xs"><span class="text-[10px] text-gray-400">Sunrise:</span> 4:47 AM</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg">🌙</span>
              <div class="text-xs"><span class="text-[10px] text-gray-400">Sunset:</span> 6:49 PM</div>
            </div>
          </div>
        </div>
        <div class="pt-1 border-t border-gray-100 dark:border-gray-700/50 space-y-1.5 text-[11px]">
          <div class="flex justify-between items-center text-gray-500 dark:text-gray-400 px-1">
            <span class="font-medium">📍 Kabul</span>
            <div class="flex gap-3"><span>☀️ 5:10 AM</span><span>🌙 7:01 PM</span></div>
          </div>
          <div class="flex justify-between items-center text-gray-500 dark:text-gray-400 px-1">
            <span class="font-medium">📍 Algiers</span>
            <div class="flex gap-3"><span>☀️ 5:32 AM</span><span>🌙 7:59 PM</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}


  //  BOTTOM CARD

function renderBottomCard() {
  const bottom = document.getElementById("bottomCard");
  if (!bottom) return;
  bottom.innerHTML = `
    <div class="bg-white dark:bg-gray-800 dark:text-white p-3 sm:p-4 rounded-2xl shadow transition-colors">
      <h2 class="font-bold text-sm sm:text-base mb-2">Hourly Temperature</h2>
      <canvas id="hourlyChart"></canvas>
    </div>
  `;
}

//    RIGHT PANEL

function renderRightPanel() {
  right.innerHTML = `
    <div class="flex flex-col h-full overflow-hidden">
      <div id="toastContainer" class="fixed top-4 right-4 space-y-2 z-50 pointer-events-none flex flex-col items-end"></div>

      <div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 shrink-0">
        <div class="relative flex-1 bg-white dark:bg-gray-700 rounded-2xl shadow-sm px-3 sm:px-4 py-2 flex items-center">
          <i class="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
          <input id="searchInput" class="w-full pl-2 sm:pl-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-xs sm:text-sm" placeholder="Search..." />
        </div>
        <button id="geoBtn" class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-2xl shadow flex items-center justify-center transition shrink-0">
          <i class="fa-solid fa-location-dot cursor-pointer"></i>
        </button>
      </div>

      <div id="search-spinner" class="hidden text-blue-500 text-sm text-center mb-2 shrink-0">Loading...</div>

      
      <div id="errorState" class="hidden flex-col items-center justify-center p-4 sm:p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-center shadow-md mb-4 shrink-0">
        <div class="text-4xl sm:text-5xl mb-2 sm:mb-3">⚠️</div>
        <h3 class="font-bold text-base sm:text-lg mb-1">City Not Found</h3>
        <p id="errorMsg" class="text-xs text-red-400 mb-3">Could not load weather data.</p>
        <button onclick="globalRetry()" class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition text-sm">
          Retry
        </button>
      </div>

   
      <div id="weatherCard" class="relative bg-blue-400 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-md overflow-hidden shrink-0 mb-4">
        <button id="heartIconBtn" onclick="globalToggleFav()" class="absolute top-3 right-3 text-xl focus:outline-none transition-transform active:scale-90 z-10">🤍</button>
        <div class="flex items-center gap-1 text-xs opacity-90">
          <i class="fa-solid fa-location-dot"></i>
          <span id="cityName" class="font-semibold">Dhaka</span>
        </div>
        <div class="text-center py-1">
          <div id="rp-icon" class="text-4xl mb-1">🌤️</div>
          <p id="condition" class="text-xs tracking-wide opacity-90">Sunny</p>
          <h1 id="temperature" class="text-4xl font-black mt-1">29°C</h1>
        </div>
        <div class="flex justify-between items-center text-[10px] pt-2 border-t border-white/20 opacity-90">
          <span id="wind">💨 Wind: -- km/h</span>
          <span id="humidity">💧 Hum: -- %</span>
        </div>
        <div id="rp-date" class="text-[9px] opacity-70 text-right"></div>
      </div>

      <div class="flex-1 flex flex-col min-h-0">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 shrink-0">Favorites</h3>
        <div id="favList" class="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"></div>
      </div>
    </div>
  `;
}

  //  WEATHER APP LOGIC

function initWeatherApp() {
  const searchInput  = document.getElementById("searchInput");
  const geoBtn       = document.getElementById("geoBtn");
  const spinner      = document.getElementById("search-spinner");
  const weatherCard  = document.getElementById("weatherCard");
  const errorState   = document.getElementById("errorState");
  const errorMsg     = document.getElementById("errorMsg");

  const cityNameEl    = document.getElementById("cityName");
  const temperatureEl = document.getElementById("temperature");
  const conditionEl   = document.getElementById("condition");
  const windEl        = document.getElementById("wind");
  const humidityEl    = document.getElementById("humidity");
  const rpIconEl      = document.getElementById("rp-icon");
  const rpDateEl      = document.getElementById("rp-date");
  const favList       = document.getElementById("favList");

  const API_KEY  = "780f33a2f0d443a1b7765444261506";
  const BASE_URL = "https://api.weatherapi.com/v1";
  const getURL   = (city) => `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=yes`;

  let activeAbortController = null;
  let favWeatherDataCache = JSON.parse(localStorage.getItem("favWeatherDataCache")) || {};

//  FAVOURITES
  function getFavCities()       { return JSON.parse(localStorage.getItem("favCities")) || []; }
  function saveFavCities(list)  { localStorage.setItem("favCities", JSON.stringify(list)); }

  function renderFavList() {
    const favs = getFavCities();
    if (!favList) return;
    if (favs.length === 0) { favList.innerHTML = ""; return; }
    favList.innerHTML = favs.map((city, index) => {
      const bgColors = ["bg-rose-400 text-white", "bg-amber-400 text-white"];
      const selectedStyle = bgColors[index % bgColors.length];
      const cached = favWeatherDataCache[city.toLowerCase()] || { temp: "--", wind: "--", hum: "--" };
      return `
        <div class="relative group ${selectedStyle} p-4 rounded-2xl shadow-sm flex flex-col gap-1 cursor-pointer transition-all hover:translate-y-[-2px]" onclick="globalLoadCity('${city}')">
          <button class="absolute top-2 right-3 text-white/70 hover:text-white font-bold text-xs" onclick="event.stopPropagation(); globalRemoveCity('${city}')">✕</button>
          <div class="flex justify-between items-start pr-5">
            <div class="space-y-0.5 text-xs opacity-90 font-medium">
              <div>🍃 Wind | ${cached.wind} km/h</div>
              <div>💧 Hum | ${cached.hum}%</div>
            </div>
            <div class="text-right">
              <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px]">📌 ${city}</span>
              <h3 class="text-3xl font-black mt-1">${cached.temp}°</h3>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  function updateFavBtn() {
    const heartIconBtn = document.getElementById("heartIconBtn");
    if (!heartIconBtn) return;
    const favs = getFavCities();
    heartIconBtn.innerHTML = favs.map(c => c.toLowerCase()).includes(currentCity.toLowerCase()) ? "❤️" : "🤍";
  }

  window.globalToggleFav = () => {
    if (!currentCity) return;
    let favs = getFavCities();
    const cityKey = currentCity.toLowerCase();
    if (favs.map(c => c.toLowerCase()).includes(cityKey)) {
      favs = favs.filter(c => c.toLowerCase() !== cityKey);
      delete favWeatherDataCache[cityKey];
      showToast(`${currentCity} removed from favourites`, "warning");
    } else {
      favs.push(currentCity);
      favWeatherDataCache[cityKey] = {
        temp: temperatureEl.textContent.replace("°C", "").trim(),
        wind: windEl.textContent.replace("💨 Wind: ", "").replace(" km/h", "").trim(),
        hum:  humidityEl.textContent.replace("💧 Hum: ", "").replace(" %", "").trim()
      };
      showToast(`${currentCity} added to favourites`, "success");
    }
    saveFavCities(favs);
    localStorage.setItem("favWeatherDataCache", JSON.stringify(favWeatherDataCache));
    renderFavList();
    updateFavBtn();
  };

  window.globalLoadCity   = (city) => { if (searchInput) searchInput.value = city; fetchWeather(city); };
  window.globalRemoveCity = (city) => {
    let favs = getFavCities().filter(c => c.toLowerCase() !== city.toLowerCase());
    delete favWeatherDataCache[city.toLowerCase()];
    saveFavCities(favs);
    localStorage.setItem("favWeatherDataCache", JSON.stringify(favWeatherDataCache));
    renderFavList();
    updateFavBtn();
  };

//  For Retry button — retry fetching the last failed city again
  window.globalRetry = () => fetchWeather(currentCity);

  // ERROR STATE HELPERS

  // showErrorState 
  function showErrorState(message) {
    if (errorState)  { errorState.classList.remove("hidden"); errorState.classList.add("flex"); }
    if (weatherCard)   weatherCard.classList.add("hidden");
    if (errorMsg)      errorMsg.textContent = message || "Could not load weather data.";
  }

  // hideErrorState — hide errorState and show weatherCard again
  function hideErrorState() {
    if (errorState)  { errorState.classList.add("hidden"); errorState.classList.remove("flex"); }
    if (weatherCard)   weatherCard.classList.remove("hidden");
  }

  // ── TOAST ──
  function showToast(message, type = "info") {
    const tc = document.getElementById("toastContainer");
    if (!tc) return;

    // Duplicate check
    const existing = tc.querySelectorAll(".toast-item");
    for (let t of existing) { if (t.textContent.trim() === message) return; }

   //  set color Toast
    const styles = {
      success: { bg: "bg-green-500" , icon: "✅"  },
      error:   { bg: "bg-red-500"   ,icon: "❌"},
      warning: { bg: "bg-amber-500",icon: "⚠️"},
      info:    { bg: "bg-blue-500" ,icon: "ℹ️" },
    };
    const { bg, icon } = styles[type] || styles.info;

    const toast = document.createElement("div");
    toast.className = `toast-item ${bg} text-white text-[13px] px-4 py-2 rounded-lg shadow-lg text-center transition-all duration-300 flex items-center gap-2 min-w-[220px]`;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    tc.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  //loading skeleton
  function renderSkeletons() {
    if (cityNameEl)    cityNameEl.innerHTML    = `<div class="h-4 bg-white/30 rounded w-24 animate-pulse"></div>`;
    if (temperatureEl) temperatureEl.innerHTML = `<div class="h-10 bg-white/30 rounded w-28 mx-auto animate-pulse mt-1"></div>`;
    if (conditionEl)   conditionEl.innerHTML   = `<div class="h-3 bg-white/20 rounded w-16 mx-auto animate-pulse mt-1"></div>`;
    if (rpIconEl)      rpIconEl.innerHTML      = `<div class="w-16 h-16 bg-white/20 rounded-full mx-auto animate-pulse"></div>`;

    const leftCard = document.getElementById("leftCards");
    if (leftCard) {
      leftCard.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow h-full flex flex-col justify-between animate-pulse">
          <div class="flex justify-between items-center mb-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            ${Array(6).fill('<div class="h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl"></div>').join("")}
          </div>
        </div>`;
    }

    const rightCard = document.getElementById("rightCards");
    if (rightCard) {
      rightCard.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow h-full flex flex-col justify-between animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
          <div class="space-y-2.5">
            <div class="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-xl"></div>
            <div class="h-14 bg-gray-100 dark:bg-gray-700/30 rounded-xl"></div>
            <div class="h-10 bg-gray-100 dark:bg-gray-700/20 rounded-xl"></div>
          </div>
        </div>`;
    }

    const forecastContainer = document.getElementById("forecast");
    if (forecastContainer) {
      forecastContainer.innerHTML = Array(5).fill(0).map(() => `
        <div class="bg-white dark:bg-gray-800 p-3 rounded-xl shadow text-center animate-pulse space-y-2">
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
        </div>`).join("");
    }
  }

  function setLoading(state) {
    if (spinner) spinner.classList.toggle("hidden", !state);
    if (state) renderSkeletons();
  }

 // ── FETCH WEATHER ── 
  async function fetchWeather(city) {
    if (!city || !city.trim()) return;
    if (activeAbortController) activeAbortController.abort();
    activeAbortController = new AbortController();

    //hide error state when fetch starts
    hideErrorState();
    setLoading(true);

    try {
      const res = await fetch(getURL(city), { signal: activeAbortController.signal });

     
      if (!res.ok) {
        if (res.status === 400) throw new Error(`City "${city}" not found. Please check the name.`);
        if (res.status === 401) throw new Error("Invalid API key. Please check your config.");
        throw new Error(`Server error (${res.status}). Please try again.`);
      }

      const data = await res.json();
      currentCity = data.location.name;

      cityNameEl.textContent    = `${data.location.name}, ${data.location.country}`;
      temperatureEl.textContent = `${Math.round(data.current.temp_c)}°C`;
      conditionEl.textContent   = data.current.condition.text;
      windEl.textContent        = `💨 Wind: ${data.current.wind_kph} km/h`;
      humidityEl.textContent    = `💧 Hum: ${data.current.humidity} %`;
      rpIconEl.innerHTML        = `<img src="https:${data.current.condition.icon}" class="w-16 h-16 mx-auto drop-shadow"/>`;
      rpDateEl.textContent      = new Date(data.location.localtime).toDateString();

      renderLeftCards(data.current.uv, data.current.air_quality);
      renderRightCards(data.forecast.forecastday[0].astro.sunrise, data.forecast.forecastday[0].astro.sunset);
      renderForecast(data.forecast.forecastday);
      updateFavBtn();

      const nextHours = data.forecast.forecastday[0].hour.slice(0, 8).map(item => ({ time: item.time, temp_c: item.temp_c }));
      renderHourlyChart(nextHours);

    } catch (err) {
      if (err.name === "AbortError") return;

      //  err  msg
      showErrorState(err.message);
      showToast(err.message, "error");

    } finally {
      setLoading(false);
    }
  }

  //FORECAST 
  function renderForecast(forecastDays) {
    const container = document.getElementById("forecast");
    if (!container) return;
    container.innerHTML = forecastDays.map(day => `
      <div class="bg-white dark:bg-gray-800 dark:text-white p-2 rounded shadow text-center text-xs">
        <div class="font-bold">${new Date(day.date).toDateString().slice(0, 10)}</div>
        <img src="https:${day.day.condition.icon}" class="w-10 h-10 mx-auto"/>
        <div class="font-bold mt-1">${Math.round(day.day.mintemp_c)}° / ${Math.round(day.day.maxtemp_c)}°</div>
      </div>`).join("");
  }

  //── DEBOUNCE ── 
  function debounce(fn, delay = 600) {
    let timer;
    const debounced = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
  }

  const handleSearch = debounce((value) => { fetchWeather(value); }, 600);
  searchInput.addEventListener("input",   (e) => handleSearch(e.target.value));
  searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { handleSearch.cancel(); fetchWeather(e.target.value); } });

  //── GEO BUTTON ── 
  geoBtn.addEventListener("click", () => {
    showToast("Fetching your location...", "info");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      hideErrorState();
      setLoading(true);
      try {
        const res  = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${pos.coords.latitude},${pos.coords.longitude}&days=5&aqi=yes`);
        const data = await res.json();
        currentCity = data.location.name;

        cityNameEl.textContent    = data.location.name;
        temperatureEl.textContent = `${Math.round(data.current.temp_c)}°C`;
        conditionEl.textContent   = data.current.condition.text;
        windEl.textContent        = `💨 Wind: ${data.current.wind_kph} km/h`;
        humidityEl.textContent    = `💧 Hum: ${data.current.humidity} %`;
        rpIconEl.innerHTML        = `<img src="https:${data.current.condition.icon}" class="w-16 h-16 mx-auto drop-shadow"/>`;
        rpDateEl.textContent      = new Date(data.location.localtime).toDateString();

        renderLeftCards(data.current.uv, data.current.air_quality);
        renderRightCards(data.forecast.forecastday[0].astro.sunrise, data.forecast.forecastday[0].astro.sunset);
        renderForecast(data.forecast.forecastday);
        updateFavBtn();

        const nextHours = data.forecast.forecastday[0].hour.slice(0, 8).map(item => ({ time: item.time, temp_c: item.temp_c }));
        renderHourlyChart(nextHours);
      } catch (e) {
        showErrorState("Could not load weather for your location.");
        showToast("Failed to fetch location weather.", "error");
      } finally {
        setLoading(false);
      }
    }, () => {
      showToast("Location access was denied.", "error");
    });
  });

  renderFavList();
  updateFavBtn();
  fetchWeather(currentCity);
}

//hourly chart
let hourlyChartInstance = null;
function renderHourlyChart(hourlyData) {
  const ctx = document.getElementById("hourlyChart");
  if (!ctx) return;
  if (hourlyChartInstance) hourlyChartInstance.destroy();
  hourlyChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: hourlyData.map(item => item.time.split(" ")[1].slice(0, 5)),
      datasets: [{
        label: "Temperature (°C)",
        data: hourlyData.map(item => item.temp_c),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      }],
    },
    options: { responsive: true },
  });
}