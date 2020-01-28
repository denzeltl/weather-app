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
const searchBoxSuggestions = document.querySelector(".search-box__suggestions");

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
    this.style.color = "#252525";
    this.style.borderColor = "rgba(255, 255, 255, 0)";
}

// Enter key on search box
function enterKey(e) {
    if (e.keyCode === 13) {
        const firstCity = searchBoxSuggestions.firstElementChild;
        searchCity(firstCity);
        searchBoxSuggestions.innerHTML = "";
        searchBox.value = firstCity.innerText;
        this.blur();
    }
}

// Get api via city name
function searchCity(li) {
    const city = li.innerText;
    fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
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
        case weather === "Clear" && date.getHours() >= 6 && date.getHours() < 18:
            weather = "CLEAR_DAY";
            break;
        case weather === "Clear" && (date.getHours() >= 18 || date.getHours() < 6):
            weather = "CLEAR_NIGHT";
            break;
        default:
            weather = "FOG";
    }
    skycons.add(icon, Skycons[weather]);
    skycons.play();
}

// Set bg
function setBg(weather, timezone) {
    let utc = Date.now() - 28800000;
    const tz = timezone * 1000;
    let date = new Date(utc + tz);
    const main = document.querySelector(".main");
    switch (true) {
        case weather === "Clouds" && date.getHours() >= 6 && date.getHours() < 18:
            main.style.background = "linear-gradient(to right top, rgba(65, 89, 94, 1) 0%, rgba(59, 214, 255, 1) 100%)";
            break;
        case weather === "Clouds" && (date.getHours() >= 18 || date.getHours() < 6):
            main.style.background = "linear-gradient(to right top, rgba(16,67,105,1) 0%, rgba(39,75,172,1) 50%, rgba(90,88,101,1) 100%)";
            break;
        case weather === "Thunderstorm":
            main.style.background = "linear-gradient(to right top, rgba(18,15,64,1) 0%, rgba(16,55,152,1) 60%, rgba(177,176,52,1) 100%)";
            break;
        case weather === "Drizzle":
            main.style.background = "linear-gradient(to right top, rgba(19,33,181,1) 0%, rgba(94,190,255,1) 100%)";
            break;
        case weather === "Rain":
            main.style.background = "linear-gradient(to right top, rgba(13, 30, 75, 1) 0%, rgba(31, 149, 181, 1) 100%)";
            break;
        case weather === "Snow":
            main.style.background = "linear-gradient(to right top, rgba(65,73,148,1) 0%, rgba(138,211,255,1) 100%)";
            break;
        case weather === "Clear" && date.getHours() >= 6 && date.getHours() < 18:
            main.style.background = "linear-gradient(to right top, rgba(191,57,13,1) 0%, rgba(251,187,23,1) 80%, rgba(250,247,38,1) 100%)";
            break;
        case weather === "Clear" && (date.getHours() >= 18 || date.getHours() < 6):
            main.style.background = "linear-gradient(to right top, rgba(5,17,74,1) 0%, rgba(8,12,156,1) 60%, rgba(13,6,228,1) 100%)";
            break;
        default:
            main.style.background = getCssValuePrefix() + "linear-gradient(" + "to right top" + ", " + "rgba(13, 30, 75, 1) 0%" + ", " + "rgba(31, 149, 181, 1) 100%" + ")";
    }
}

// Detect autocomplete
async function detectAutoComplete(e) {
    const response = await fetch("/data/city.list.json");
    const cities = await response.json();
    console.log(e);
    // Match text input
    let matches = cities.filter(city => {
        const regex = new RegExp(`^${e}`, "gi");
        return city.name.match(regex);
    });

    if (matches[0] === undefined) {
        searchBoxSuggestions.innerHTML = "<li class='no-results'>No results</li>";
    } else {
        displayMatches(matches);
    }

    if (e.length === 0) {
        matches = [];
        searchBoxSuggestions.innerHTML = "";
    }
}

// Display matches to li dom
function displayMatches(matches) {
    if (matches.length > 0) {
        const list = matches
            .map(
                match => `
            <li>${match.name}, ${match.country}</li>
        `
            )
            .slice(0, 50)
            .sort()
            .join("");
        searchBoxSuggestions.innerHTML = list;

        const lis = document.querySelectorAll(".search-box__suggestions li");
        lis.forEach(li => {
            li.addEventListener("click", function() {
                searchBoxSuggestions.innerHTML = "";
                searchBox.value = this.innerText;
                searchCity(li);
            });
        });
    }
}

// Error getting api
function searchError() {
    searchBox.value = "";
    searchBox.placeholder = "Sorry, city not found";
    searchBox.style.color = "#f81d1d";
    searchBox.style.borderColor = "#f81d1d";
    searchBoxSuggestions.innerHTML = "";
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

    setBg(weather.weather[0].main, weather.timezone);
}

window.addEventListener("load", grantLocationAccess);
searchBox.addEventListener("click", resetSearchBox);
searchBox.addEventListener("keydown", enterKey);
searchBox.addEventListener("keyup", function() {
    detectAutoComplete(this.value);
});

// TODO:  readme
