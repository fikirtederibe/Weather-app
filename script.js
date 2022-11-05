const timeE1 = document.getElementById('time');
const dateE1 = document.getElementById('date');
const currentweatherE1=document.getElementById('current-weather-items');
const timezone=document.getElementById('time_zone');
const countryE1=document.getElementById('country');
const weatherforecastE1=document.getElementById('weather_forecast')
const currentTempEl = document.getElementById('current_temp');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour;
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM';
    timeE1.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
    dateE1.innerHTML = days[day] + ', ' + date+ ' ' + months[month];

}, 1000);
fetchWeatherData()
function fetchWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=>{
    let {latitude, longitude} = success.coords;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        displayWeatherData(data);
    })
})
}
function displayWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    timezone.innerHTML = data.timezone;
    countryE1.innerHTML = data.lat + 'N ' + data.lon+'E';
    currentweatherE1.innerHTML = 
        `<div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
        </div> `;

        let otherDayWeather=''
        data.daily.forEach((day,idx)=>{
            if(idx==0){
                currentTempEl.innerHTML= 
                `<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon"class='w-icon'>
                 <div class="others">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                 </div>`
            }
            else{
                otherDayWeather+=`
                <div class="weather_forecast_item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon"class='w-icon'>
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div> 
                `
            }
        })
        weatherforecastE1.innerHTML=otherDayWeather;
}
