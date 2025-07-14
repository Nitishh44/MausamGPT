async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "40b30c129c3c8704a652160300e6957a";
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