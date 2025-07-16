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

  function showWeather(data) {
  const card = document.getElementById("weatherCard");
  card.classList.remove("hidden");

  card.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>${data.weather[0].description}</p>
    
  `;

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

// Open chatbot
 const chatbotIcon = document.getElementById("chatbotIcon");
 const chatbotWindow = document.getElementById("chatbotWindow");
 const closeBtn = document.getElementById("closeChatbotBtn");

 chatbotIcon.addEventListener("click", () => {
  chatbotWindow.classList.toggle("hidden");
 });

// Close chatbot
closeBtn.addEventListener("click", () => {
  chatbotWindow.classList.add("hidden");
});
});

// Handle chat
function sendChat() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  const chatBox = document.getElementById("chatMessages");

  if (!message) return;

  // Show user message
  const userMsg = document.createElement("div");
  userMsg.textContent = "You: " + message;
  chatBox.appendChild(userMsg);

  // Show bot reply
  const botMsg = document.createElement("div");
  botMsg.textContent = "MausamGPT: " + getFakeResponse(message);
  chatBox.appendChild(botMsg);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getFakeResponse(msg) {
  if (msg.toLowerCase().includes("rain")) return "Yes, it's expected to rain ☔";
  if (msg.toLowerCase().includes("temperature")) return "Current temperature is 33°C 🌡";
  return "I'm still learning! Try asking about weather.";
}