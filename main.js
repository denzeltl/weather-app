const api = {
    key: "3d765551692710a23e1e7084bc48747a",
    base: "https:/api.openweathermap.org/data/2.5/"
};
const searchBox = document.querySelector(".search-box");

searchBox.addEventListener("click", resetSearchBox);
searchBox.addEventListener("keypress", enterKey);
searchBox.addEventListener("blur", searchCity);

function resetSearchBox() {
    this.value = "";
    this.style.color = "#252525";
    this.style.borderColor = "rgba(255, 255, 255, 0)";
}

function enterKey(e) {
    if (e.keyCode === 13) {
        this.blur();
    }
}

function searchCity() {
    fetch(`${api.base}weather?q=${this.value}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        })
        .then(displayResults)
        .catch(searchError);
}

function displayResults(weather) {
    const location = document.querySelector(".top__timezone");
    location.textContent = `${weather.name}, ${weather.sys.country}`;

    const description = document.querySelector(".bottom__icon-desc__description");
    description.textContent = weather.weather[0].main;

    const degree = document.querySelector(".bottom__degrees__value");
    degree.textContent = Math.round(weather.main.temp);
    console.log(weather);
}

function searchError() {
    searchBox.value = "Sorry, city not found";
    searchBox.style.color = "#f81d1d";
    searchBox.style.borderColor = "#f81d1d";
}
