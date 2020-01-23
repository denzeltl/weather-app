const api = {
    key: "3d765551692710a23e1e7084bc48747a",
    base: "https://api.openweathermap.org/data/2.5/"
};
const coords = {
    lat: 0,
    long: 0
};
let timeout;
const searchBox = document.querySelector(".search-box");

window.addEventListener("load", grantLocationAccess);
searchBox.addEventListener("click", resetSearchBox);
searchBox.addEventListener("keypress", enterKey);
searchBox.addEventListener("blur", searchCity);

// Start time
function startTime(timezone) {
    let utc = Date.now() - 28800000;
    const tz = timezone * 1000;
    let date = new Date(utc + tz);

    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    let s = date.getSeconds(); // 0 - 59
    let session = "AM";

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    let time = h + ":" + m + ":" + s + " " + session;
    document.querySelector(".top__time").textContent = time;

    timeout = setTimeout(function() {
        startTime(timezone);
    }, 1000);
}

// Set date
function setDate(timezone) {
    let utc = Date.now() - 28800000;
    const tz = timezone * 1000;
    let date = new Date(utc + tz);

    let day = date.getDay();
    let d = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    switch (day) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
    }

    switch (month) {
        case 1:
            month = "January";
            break;
        case 2:
            month = "February";
            break;
        case 3:
            month = "March";
            break;
        case 4:
            month = "April";
            break;
        case 5:
            month = "May";
            break;
        case 6:
            month = "June";
            break;
        case 7:
            month = "July";
            break;
        case 8:
            month = "August";
            break;
        case 9:
            month = "September";
            break;
        case 10:
            month = "October";
            break;
        case 11:
            month = "November";
            break;
        case 12:
            month = "December";
    }

    document.querySelector(".date").textContent = `${day}, ${d} ${month} ${year}`;
}

// Get lat long if location access is granted
function grantLocationAccess() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            coords.lat = position.coords.latitude;
            coords.long = position.coords.longitude;

            giveLatLong(coords.lat, coords.long);
        });
    }
}

// When search box is clicked
function resetSearchBox() {
    this.value = "";
    this.style.color = "#252525";
    this.style.borderColor = "rgba(255, 255, 255, 0)";
}

// Enter key on search box
function enterKey(e) {
    if (e.keyCode === 13) {
        this.blur();
    }
}

// Get api via city name
function searchCity() {
    fetch(`${api.base}weather?q=${this.value}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        })
        .then(displayResults)
        .catch(searchError);
}

// Get api via lat long
function giveLatLong(lat, long) {
    fetch(`${api.base}weather?lat=${coords.lat}&lon=${coords.long}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        })
        .then(displayResults)
        .catch(searchError);
}

// Set icon
function playSkycons(icon, weather, timezone) {
    let utc = Date.now() - 28800000;
    const tz = timezone * 1000;
    let date = new Date(utc + tz);
    const skycons = new Skycons({ color: "white" });
    switch (true) {
        case weather === "Clouds":
            weather = "CLOUDY";
            break;
        case weather === "Thunderstorm":
            weather = "THUNDER_RAIN";
            break;
        case weather === "Drizzle":
            weather = "SLEET";
            break;
        case weather === "Rain":
            weather = "RAIN";
            break;
        case weather === "Snow":
            weather = "SNOW";
            break;
        case weather === "Atmosphere":
            weather = "FOG";
            break;
        case weather === "Clear" && date.getHours() >= 6 && date.getHours() < 18:
            weather = "CLEAR_DAY";
            break;
        case weather === "Clear" && date.getHours() >= 18:
            weather = "CLEAR_NIGHT";
            break;
        case weather === "Clear" && date.getHours() < 6:
            weather = "CLEAR_NIGHT";
            break;
        default:
            weather = "FOG";
    }

    skycons.add(icon, Skycons[weather]);
    skycons.play();
}

// Error getting api
function searchError() {
    searchBox.value = "Sorry, city not found";
    searchBox.style.color = "#f81d1d";
    searchBox.style.borderColor = "#f81d1d";
}

// Display results
function displayResults(weather) {
    const location = document.querySelector(".top__timezone");
    location.textContent = `${weather.name}, ${weather.sys.country}`;

    const description = document.querySelector(".bottom__icon-desc__description");
    description.textContent = weather.weather[0].main;

    const degree = document.querySelector(".bottom__degrees__value");
    degree.textContent = Math.round(weather.main.temp);

    clearTimeout(timeout);
    startTime(weather.timezone);

    setDate(weather.timezone);

    const icon = document.querySelector(".bottom__icon-desc__icon");
    playSkycons(icon, weather.weather[0].main, weather.timezone);

    console.log(weather);
}

// TODO: bg, readme, responsive, animation?;
