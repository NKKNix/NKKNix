const fs = require('fs');
const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = 'Ubon Ratchathani,TH';

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&units=metric&appid=${API_KEY}`;
  const res = await axios.get(url);
  const data = res.data;

  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Download and convert icon to base64
  const iconResponse = await axios.get(iconURL, { responseType: 'arraybuffer' });
  const iconBase64 = Buffer.from(iconResponse.data).toString('base64');
  const iconDataURI = `data:image/png;base64,${iconBase64}`;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
  <style>
    .text { font: bold 20px sans-serif; fill: #333; }
  </style>
  <image href="${iconDataURI}" x="10" y="10" height="80" width="80"/>
  <text x="100" y="40" class="text">${CITY}</text>
  <text x="100" y="70" class="text">${temp}°C - ${description}</text>
</svg>
`;

  fs.writeFileSync('weather.svg', svg.trim());
}

fetchWeather().catch(err => {
  console.error('❌ Weather update error:', err.response?.data || err.message);
});
