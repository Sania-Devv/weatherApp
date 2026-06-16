const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const right = document.getElementById("right");
const toastContainer = document.getElementById("toastContainer");

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
    applyDarkMode();
    updateClock();
    setInterval(updateClock, 60000);
    renderForecastCards();
    renderLeftCards();
    renderRightCards();
    renderBottomCard();
    initWeatherApp();
  }, 0);
}

let isDarkMode = localStorage.getItem("darkMode") === "true";

function applyDarkMode() {
  const html = document.documentElement;
  const sun = document.getElementById("themeSun");
  const moon = document.getElementById("themeMoon");
  const sunMob = document.getElementById("themeSunMobile");
  const moonMob = document.getElementById("themeMoonMobile");
  
  if (isDarkMode) {
    html.classList.add("dark");
    if(sun) sun.className = "p-1 px-2 rounded-full text-white/50 text-sm transition-colors";
    if(moon) moon.className = "p-1 px-2 rounded-full bg-blue-500 text-white shadow-sm text-sm transition-colors";
    if(sunMob) sunMob.className = "px-2 py-1 rounded-full text-white/50 text-sm";
    if(moonMob) moonMob.className = "px-2 py-1 rounded-full bg-white/30 text-white text-sm";
  } else {
    html.classList.remove("dark");
    if(sun) sun.className = "p-1 px-2 rounded-full bg-blue-500 text-white shadow-sm text-sm transition-colors";
    if(moon) moon.className = "p-1 px-2 rounded-full text-gray-500 text-sm transition-colors";
    if(sunMob) sunMob.className = "px-2 py-1 rounded-full bg-white/30 text-white text-sm";
    if(moonMob) moonMob.className = "px-2 py-1 rounded-full text-white/50 text-sm";
  }
}

window.globalToggleDarkMode = () => {
  isDarkMode = !isDarkMode;
  localStorage.setItem("darkMode", isDarkMode);
  applyDarkMode();
};

function updateClock() {
  const timeEl = document.getElementById("liveTime");
  const dateEl = document.getElementById("liveDate");
  const greetingText = document.getElementById("greetingText");
  const greetingIcon = document.getElementById("greetingIcon");
  
  if(!timeEl) return;
  
  const now = new Date();
  
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes;
  timeEl.textContent = `${hours}:${minutes} ${ampm}`;
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('en-US', options);
  
  const currentHour = now.getHours();
  if (currentHour < 12) {
    greetingText.textContent = "Good morning, Asif!";
    greetingIcon.textContent = "🌤️";
  } else if (currentHour < 18) {
    greetingText.textContent = "Good afternoon, Asif!";
    greetingIcon.textContent = "☀️";
  } else {
    greetingText.textContent = "Good evening, Asif!";
    greetingIcon.textContent = "🌙";
  }
}

/* =========================
   SIDEBAR
========================= */
function renderSidebar() {
  sidebar.innerHTML = `
    <div class="h-full flex flex-col items-start justify-center pl-0">
      <div class="bg-[#5C9CE6] dark:bg-gray-700 w-[80px] rounded-r-3xl overflow-hidden shadow-lg flex flex-col items-center">
        <!-- Active Icon (Pink) -->
        <div class="w-full h-[80px] bg-[#FF729F] flex items-center justify-center text-white cursor-pointer hover:opacity-90">
          <i class="fa-solid fa-border-all text-2xl"></i>
        </div>
        <!-- Other Icons (Blue) -->
        <div class="w-full flex flex-col items-center py-8 gap-8 text-white/70 text-xl">
          <div class="cursor-pointer hover:text-white"><i class="fa-solid fa-location-dot"></i></div>
          <div class="cursor-pointer hover:text-white"><i class="fa-solid fa-chart-simple"></i></div>
          <div class="cursor-pointer hover:text-white"><i class="fa-solid fa-compass"></i></div>
          <div class="cursor-pointer hover:text-white"><i class="fa-solid fa-calendar"></i></div>
          <div class="cursor-pointer hover:text-white"><i class="fa-solid fa-gear"></i></div>
        </div>
      </div>
    </div>
  `;
}

/* =========================
   MAIN LAYOUT
========================= */
function renderMain() {
  main.innerHTML = `
    <div class="flex justify-between items-start mb-4 sm:mb-6">
      <div>
        <h1 id="liveTime" class="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500">--:-- --</h1>
        <p id="liveDate" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1 sm:mb-2">...</p>
        <div class="text-sm sm:text-base lg:text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span id="greetingIcon">🌤️</span>
          <span id="greetingText">Good morning, Asif!</span>
        </div>
      </div>
      <div class="hidden lg:flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer" onclick="globalToggleDarkMode()">
        <div id="themeSun" class="p-1 px-2 rounded-full bg-blue-500 text-white shadow-sm text-sm transition-colors">☀️</div>
        <div id="themeMoon" class="p-1 px-2 rounded-full text-gray-500 dark:text-gray-400 text-sm transition-colors">🌙</div>
      </div>
    </div>
    <div id="forecast" class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2 mb-4 sm:mb-6"></div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
      <div id="leftCards"></div>
      <div id="rightCards"></div>
    </div>
    <div id="bottomCard"></div>
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
    <div class="bg-white dark:bg-gray-800 dark:text-white p-2 rounded-xl shadow text-center transition-colors">
      <div class="text-xs sm:text-sm font-semibold">${item.day}</div>
      <div class="text-lg sm:text-xl">${item.icon}</div>
      <div class="text-xs sm:text-sm font-bold">${item.temp}°</div>
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
    <div class="bg-white dark:bg-gray-800 dark:text-white p-3 sm:p-4 rounded-2xl shadow transition-colors h-full">
      <h2 class="font-bold text-sm sm:text-base mb-2">Air Quality Index</h2>
      <div class="text-xs sm:text-sm">PM2.5: 9.3 | PM10: 12.2</div>
      <div class="text-green-600 font-bold mt-2 text-sm sm:text-base">Good</div>
    </div>
  `;
}

/* =========================
   RIGHT COLUMN (LEFT SIDE INSIDE MAIN)
========================= */
function renderRightCards() {
  const rightCards = document.getElementById("rightCards");
  rightCards.innerHTML = `
    <div class="bg-white dark:bg-gray-800 dark:text-white p-3 sm:p-4 rounded-2xl shadow transition-colors h-full">
      <h2 class="font-bold text-sm sm:text-base mb-2">Sunrise & Sunset</h2>
      <div class="flex justify-between text-xs sm:text-sm">
        <span>🌅 5:40 AM</span>
        <span>🌇 6:50 PM</span>
      </div>
    </div>
  `;
}

/* =========================
   BOTTOM CARD (HOURLY CHART — FULL WIDTH)
========================= */
function renderBottomCard() {
  const bottom = document.getElementById("bottomCard");
  if (!bottom) return;
  bottom.innerHTML = `
    <div class="bg-white dark:bg-gray-800 dark:text-white p-3 sm:p-4 rounded-2xl shadow transition-colors">
      <h2 class="font-bold text-sm sm:text-base mb-2 sm:mb-3">Hourly Temperature</h2>
      <canvas id="hourlyChart"></canvas>
    </div>
  `;
}

/* =========================
   RIGHT PANEL (Clean Layout)
========================= */
function renderRightPanel() {
  right.innerHTML = `
    <div class="flex flex-col h-full">
      <div id="toastContainer" class="fixed top-4 right-4 space-y-2 z-50"></div>
      
      <!-- Search Bar & Profile -->
      <div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="relative flex-1 bg-white dark:bg-gray-700 rounded-2xl shadow-sm px-3 sm:px-4 py-2 flex items-center">
          <i class="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
          <input id="searchInput" class="w-full pl-2 sm:pl-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-xs sm:text-sm" placeholder="Search..." />
        </div>
        <div class="flex items-center gap-2 sm:gap-4 text-gray-400 flex-shrink-0">
          <button class="relative hover:text-gray-600 transition">
            <i class="fa-regular fa-bell text-lg sm:text-xl"></i>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-sm cursor-pointer" />
        </div>
      </div>
      
      <button id="geoBtn" class="w-full mb-3 sm:mb-4 bg-green-500 text-white p-2 rounded-xl flex items-center justify-center gap-2 shadow hover:bg-green-600 transition text-xs sm:text-sm">
        <i class="fa-solid fa-location-crosshairs"></i> Use My Location
      </button>

      <div id="search-spinner" class="hidden text-blue-500 text-sm text-center">Loading...</div>
      <div id="rp-error" class="hidden bg-red-100 text-red-600 p-2 rounded text-sm text-center">
        <span id="rp-error-msg"></span>
      </div>

      <div id="errorState" class="hidden flex-col items-center justify-center p-4 sm:p-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-center shadow-md">
        <div class="text-4xl sm:text-5xl mb-2 sm:mb-3">⚠️</div>
        <h3 class="font-bold text-base sm:text-lg mb-1">City Not Found</h3>
        <p class="text-xs sm:text-sm opacity-80 mb-3 sm:mb-4">Please check the spelling and try again.</p>
        <button onclick="globalLoadCity('Dhaka')" class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition text-sm">Retry</button>
      </div>

      <div id="weatherCard" class="relative bg-blue-400 text-white p-4 sm:p-5 rounded-2xl space-y-3 sm:space-y-4 shadow-md overflow-hidden">
        <button id="heartIconBtn" onclick="globalToggleFav()" class="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl focus:outline-none transition-transform active:scale-90 z-10" title="Favorite City">
          🤍
        </button>
        <div class="flex items-center gap-1 text-xs sm:text-sm opacity-90">
          <i class="fa-solid fa-location-dot"></i>
          <span id="cityName" class="font-semibold">Dhaka</span>
        </div>
        <div class="text-center py-1 sm:py-2">
          <div id="rp-icon" class="text-4xl sm:text-5xl mb-1">🌤️</div>
          <p id="condition" class="text-xs sm:text-sm tracking-wide opacity-90">Sunny</p>
          <h1 id="temperature" class="text-4xl sm:text-5xl font-black mt-1">29°C</h1>
        </div>
        <div class="flex justify-between items-center text-[10px] sm:text-xs pt-2 sm:pt-3 border-t border-white/20 opacity-90">
          <span id="wind">💨 Wind: -- km/h</span>
          <span id="humidity">💧 Hum: -- %</span>
        </div>
        <div id="rp-date" class="text-[9px] sm:text-[10px] opacity-70 text-right"></div>
      </div>

      <div class="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
        <div id="favList" class="space-y-2 sm:space-y-3"></div>
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
  let isInitialized = false;
  function initWeatherApp() {
    if (isInitialized) return;   // prevent double init
    isInitialized = true;
  }
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

      showToast(`${currentCity} removed from favourites`, "warning");

    } else {

      favs.push(currentCity);

      favWeatherDataCache[cityKey] = {
        temp: temperatureEl.textContent.replace('°C', '').trim(),
        wind: windEl.textContent.replace('💨 Wind: ', '').replace(' km/h', '').trim(),
        hum: humidityEl.textContent.replace('💧 Hum: ', '').replace(' %', '').trim()
      };

      showToast(`${currentCity} added to favourites`, "success");
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
  function showToast(message, type = "info") {
    const toast = document.createElement("div");

    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      warning: "bg-amber-500",
    };

    toast.className = `
    ${colors[type]}
    text-white text-[13px] px-3 py-2 rounded-lg shadow-lg
    w-full text-center
  `;

    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0", "transition-opacity", "duration-300");

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
  // function showError(msg) {
  //   // Agar pehle se koi error active chal raha hai, to naya toast push nahi hoga
  //   if (!rpError.classList.contains("hidden") && rpErrorMsg.textContent === msg) {
  //     return; 
  //   }

  //   // Purane chalte hue setTimeout timer ko clear karna zaroori hai
  //   if (errorTimeoutToken) {
  //     clearTimeout(errorTimeoutToken);
  //   }

  //   rpErrorMsg.textContent = msg;
  //   rpError.classList.remove("hidden");

  //   // Exact single instance window management closure
  //   errorTimeoutToken = setTimeout(() => {
  //     rpError.classList.add("hidden");
  //     errorTimeoutToken = null;
  //   }, 2500);
  // }

  /* =========================
      LOADING TOGGLE & SKELETONS
  ========================= */
  function renderSkeletons() {
    cityNameEl.innerHTML = `<div class="h-4 bg-white/30 rounded w-24 animate-pulse"></div>`;
    temperatureEl.innerHTML = `<div class="h-10 bg-white/30 rounded w-32 mx-auto animate-pulse mt-1"></div>`;
    conditionEl.innerHTML = `<div class="h-3 bg-white/30 rounded w-16 mx-auto animate-pulse"></div>`;
    windEl.innerHTML = `<div class="h-3 bg-white/30 rounded w-20 animate-pulse"></div>`;
    humidityEl.innerHTML = `<div class="h-3 bg-white/30 rounded w-20 animate-pulse"></div>`;
    rpIconEl.innerHTML = `<div class="w-16 h-16 bg-white/30 rounded-full mx-auto animate-pulse mb-1"></div>`;
    rpDateEl.innerHTML = ``;
    
    const container = document.getElementById("forecast");
    if (container) {
      container.innerHTML = Array(6).fill(0).map(() => `
        <div class="bg-white dark:bg-gray-800 dark:text-white p-2 rounded shadow text-center animate-pulse transition-colors">
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-2"></div>
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto my-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
        </div>
      `).join("");
    }
  }

  function setLoading(state) {
    spinner.classList.toggle("hidden", !state);
    const weatherCard = document.getElementById("weatherCard");
    const errState = document.getElementById("errorState");
    
    if (state) {
      if(errState) {
         errState.classList.add("hidden");
         errState.classList.remove("flex");
      }
      if(weatherCard) weatherCard.classList.remove("hidden");
      renderSkeletons();
    }
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
    }
    catch (err) {
      showToast("City not found. Please try again.", "error");
      const weatherCard = document.getElementById("weatherCard");
      const errState = document.getElementById("errorState");
      if(weatherCard) weatherCard.classList.add("hidden");
      if(errState) {
        errState.classList.remove("hidden");
        errState.classList.add("flex");
      }
    }
    finally {
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
        <div class="bg-white dark:bg-gray-800 dark:text-white p-2 rounded shadow text-center transition-colors">
          <div class="text-xs font-bold mb-1">
            ${new Date(day.date).toDateString().slice(0, 10)}
          </div>
          <img src="https:${day.day.condition.icon}" class="w-10 h-10 mx-auto"/>
          <div class="text-sm font-bold mt-1">
            ${Math.round(day.day.mintemp_c)}° / ${Math.round(day.day.maxtemp_c)}°
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 transition-colors">
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

    showToast("Fetching your location...", "info");

    if (!navigator.geolocation) {
      showToast("Geolocation not supported", "error");
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

        showToast("Location access denied.", "error");
      }
    );
  });

  renderFavList();
  updateFavBtn();
  fetchWeather(currentCity);
}

/* IMPORTANT */
// document.addEventListener("DOMContentLoaded", initWeatherApp);

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