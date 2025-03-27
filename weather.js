const fs = require('fs');
const axios = require('axios');
const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = 'Ubon Ratchathani,TH';
const ICON_URL = 'https://openweathermap.org/img/wn/';

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&units=metric&appid=${API_KEY}`;
  const res = await axios.get(url);
  const data = res.data;
  const temp = Math.round(data.main.temp);
  const icon = `${ICON_URL}${data.weather[0].icon}@2x.png`;
  const desc = data.weather[0].description;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
  <style>
    .text { font: bold 20px sans-serif; fill: #333; }
  </style>
  <image href="${icon}" x="10" y="10" height="80" width="80"/>
  <text x="100" y="40" class="text">${CITY}</text>
  <text x="100" y="70" class="text">${temp}°C - ${desc}</text>
</svg>
`;

  fs.writeFileSync('weather.svg', svg.trim());
}

fetchWeather().catch(console.error);
