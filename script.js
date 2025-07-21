async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = API_KEY;
  if (!city) {
    alert("plse enter a city name");
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch (url);
    const data = await response.json();
    console.log(data);
    if (data.cod !== 200){
      alert("City not found!");
      return;
    }
    showWeather(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Something went Wrong.");
  }
  
}
let lastWeatherData = null;

  function showWeather(data) {
    lastWeatherData = data;
  const card = document.getElementById("weatherCard");
  card.classList.remove("hidden");
  card.classList.add("fade-in");

  card.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>${data.weather[0].description}</p>
    
  `;
  card.classList.remove("hidden");
  card.classList.add("fade-in");

  // ✅ Update today's highlights
  const temp = document.getElementById("temperature");
  if (temp) temp.textContent = `${data.main.temp.toFixed(1)}°C`;

  const humidity = document.getElementById("humidity");
  if (humidity) humidity.textContent =` ${data.main.humidity}%`;

  const wind = document.getElementById("wind");
  if (wind) wind.textContent = `${data.wind.speed} m/s`;

  const pressure = document.getElementById("pressure");
  if (pressure) pressure.textContent = `${data.main.pressure} hPa`;

  const sunrise = document.getElementById("sunrise");
  if (sunrise) {
    const time = new Date(data.sys.sunrise * 1000);
    const hrs = time.getHours().toString().padStart(2, "0");
    const min = time.getMinutes().toString().padStart(2, "0");
    sunrise.textContent = `${hrs}:${min} AM`;
  }
}
async function fetchCitySuggestions(query) {
  const apiUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population`;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key":
        GEO_API_KEY,
        "X-RapidAPI-Host":
        "wft-geo-db.p.rapidapi.com"
      }
    });
    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error("City suggestions error:", error);
    return [];
  }
}
const cityInput = document.getElementById("cityInput");
const citySuggestions = document.getElementById("citySuggestions");

cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();

  if (query.length < 2) return;

  const cities = await fetchCitySuggestions(query);
  citySuggestions.innerHTML = "";

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = `${city.city}, ${city.countryCode}`;
    citySuggestions.appendChild(option);
  });
});
async function handleCityInput() {
  const query = cityInput.value.trim();

  if (query.length < 2) return;
  const cities = await fetchCitySuggestions(query);
  citySuggestions.innerHTML = "";
  cities.forEach(city => {
    const option = document.createElement("Option");
    option.value = `${city.city}, ${city.countryCode}`;
    citySuggestions.appendChild(option);
  })
}
document.getElementById("detectLocationBtn").addEventListener("click", getUserLocation);
function getUserLocation(){
  if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      }, error => {
        console.error("Location error:", error);
        alert("Unable to fetch your location");
      }
    );
  } else {
    alert("Geolocation not supported in your browser.");
  }
}
async function getWeatherByCoords(lat, lon) {
 const apikey = API_KEY;
 const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
 try {
  const response = await fetch(url);
  const data = await response.json();
  showWeather(data);
 } catch (error) {
  console.error("Error fetching weather by location:", error);
 }
}

document.addEventListener("DOMContentLoaded", function () {
  const chatbotIcon   = document.getElementById("chatbotIcon");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const sendBtn       = document.getElementById("chatSendBtn");
  const inputEl       = document.getElementById("chatInput");

  // --- safety checks ---
  if (!chatbotIcon || !chatbotWindow) {
    console.warn("Chatbot icon/window missing in HTML.");
    return;
  }
  if (!sendBtn || !inputEl) {
    console.warn("Chat input or send button missing.");
  }

  // open/close toggle
  chatbotIcon.addEventListener("click", () => {
    chatbotWindow.classList.toggle("hidden");
  });

  // send on click
  if (sendBtn) {
    sendBtn.addEventListener("click", sendChat);
  }

  // send on Enter
  if (inputEl) {
    inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendChat();
      }
    });
  }
});
function addBubble(text, type) {
  const chatBox = document.getElementById("chatMessages");
  if (!chatBox) return;
  const bubble = document.createElement("div");
  bubble.classList.add ("bubble", type, "fade-in");
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  bubble.className = "bubble " + type;
  chatBox.scrollTop = chatBox.scrollHeight;
  bubble.classList.add("fade-in");
}

 async function sendChat() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  const chatBox = document.getElementById("chatMessages");
  if (!message) return;
 chatBox.innerHTML += `<div>You: ${message}</div>`;
 input.value = "";

 const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:
      JSON.stringify({ message })
 });

 const data = await res.json();
 chatBox.innerHTML += `<div>MausamGPT: ${data.reply}</div>`
}

function getFakeResponse(msg) {
  msg = String(msg || "");
  msg = msg.toLowerCase();
  if (msg.includes("rain"))         return "Yes, it's expected to rain ☔";
  if (msg.includes("temperature"))  return "Current temperature is 33°C 🌡";
  return "I'm still learning! Try asking about weather.";
}