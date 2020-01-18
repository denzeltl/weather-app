const api = {
    key: "3d765551692710a23e1e7084bc48747a",
    base: "https:/api.openweatherapp.org/data/2.5/"
};
const searchBox = document.querySelector(".search-box");

searchBox.addEventListener("keypress", enterKey);
searchBox.addEventListener("blur", searchCity);

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
        .then(displayResults);
}

function displayResults(weather) {
    console.log(weather);
}
