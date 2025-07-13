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
    <p>🌡 Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind: ${data.wind.speed} m/s</p>
    <p> Pressure: ${data.main.pressure} hPa</p>
    <p> Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
  `;
}