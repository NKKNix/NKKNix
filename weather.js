const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

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

  const iconResponse = await axios.get(iconURL, { responseType: 'arraybuffer' });
  const iconBase64 = Buffer.from(iconResponse.data).toString('base64');
  const iconDataURI = `data:image/png;base64,${iconBase64}`;
  const timeInBangkok = new Intl.DateTimeFormat('en-TH', {
  timeZone: 'Asia/Bangkok',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
}).format(new Date());

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120">
  <style>
    .label { font: bold 18px sans-serif; fill: #333; }
  </style>

  <!-- Icon on the left -->
  <image href="${iconDataURI}" x="20" y="20" height="80" width="80"/>

  
  <text x="120" y="45" class="label">${CITY}</text>
  <text x="120" y="70" class="label">${temp}°C - ${description}</text>
  <text x="120" y="95" class="label">Updated: ${timeInBangkok} (TH)</text>
</svg>
`;


  fs.writeFileSync('weather.svg', svg.trim());
}

fetchWeather().catch(err => {
  console.error('❌ Weather update error:', err.response?.data || err.message);
});
