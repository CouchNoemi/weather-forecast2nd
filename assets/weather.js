var cityName = document.querySelector("#cityName");
var temp1 = document.querySelector("#temp1");
var hum1 = document.querySelector("#hum1");
var wind1 = document.querySelector("#wind1");
var temp2 = document.querySelector("#temp2");
var hum2 = document.querySelector("#hum2");
var wind2 = document.querySelector("#wind2");
let weatherContainer = document.querySelector(".top");
let forecastContainer = document.querySelector(".forecast-container");
let historyBtns;

// || = or
var cityList = JSON.parse(localStorage.getItem("cities")) || [];

function generateHistory() {
  console.log(cityList);

  for (let i = 0; i < cityList.length; i++) {
    console.log(cityList[i]);
    // 1. Target the parent
    var historyElement = document.querySelector(".history");
    // 2. Create the element we want to add
    var button = document.createElement("button");
    button.classList.add("history-button");
    // 3. Give the created element some text
    button.textContent = cityList[i];
    // 4. Add the element to the parent
    historyElement.appendChild(button);
  }
}
generateHistory();

function getWeather(name) {
  var city = name || document.getElementById("city").value;

  if (!city.trim()) {
    // "   some things   " becomes "some things"
    return;
  }

  var apiKey = "2bda322124cc7c43e43314d9953b3b7c";

  var todaysUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(todaysUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // do nothing if city is not found
      if (data.message === "city not found") return;

      var name = data.name;
      var date = new Date(data.dt * 1000).toLocaleDateString();
      cityName.innerHTML = data.name + " (" + date + ")";
      cityName.innerHTML += `<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' alt='weather icon' />`;

      //determine what time it currently in city
      //lok into the data array list and get values for the forcasted time

      var historyElement = document.querySelector(".history");

      // check if we already had it in city list
      if (!cityList.includes(name)) {
        cityList.push(name);
        localStorage.setItem("cities", JSON.stringify(cityList));
        var button = document.createElement("button");
        button.classList.add("history-button");
        button.textContent = name;
        historyElement.appendChild(button);
        addEvent();
      }

      let historyItem = localStorage.getItem(name);
      document.getElementById("temp1").innerHTML =
        celciusToFahrenheit(data.main.temp) + "°F";
      document.getElementById("hum1").innerHTML = data.main.humidity + "MPH";
      document.getElementById("wind1").innerHTML = data.wind.speed + "%";

      // this is my second api
      const {
        coord: { lat, lon },
      } = data;
      let forecastUrl = ` https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(forecastUrl)
        .then((res) => res.json())
        .then((data) => {
          const firstFiveForecast = [];

          for (let i = 0; firstFiveForecast.length < 5; i++) {
            if (i % 8 === 0) {
              firstFiveForecast.push(data.list[i]);
            };
          };

          console.log(data);

          console.log(firstFiveForecast);

          forecastContainer.innerHTML = "";
          firstFiveForecast.forEach((f) => {
            var date = new Date(f.dt * 1000).toLocaleDateString();
            let forecastEl = `
              <div class="card">
              <h2 id="cityName">(${date})</h2>
              <img src='http://openweathermap.org/img/w/${
                f.weather[0].icon
              }.png' alt='weather icon' />
              <p>
                temperature: <span id="temp2">${kelvinToFahrenheit(
                  f.main.temp
                )}°F</span><br />
                humidity: <span id="hum2">${f.main.humidity}MPH</span><br />
                wind: <span id="wind2">${f.wind.speed}%</span>
              </p>
            </div>
            `;
            forecastContainer.innerHTML += forecastEl;
          });
        });
    });
  document.getElementById("city").value = "";
}

//temp in degree celius
function celciusToFahrenheit(temp) {
  const t = (temp * 9) / 5 + 32;
  return t.toFixed(2);
}

// temp in kelvin
function kelvinToFahrenheit(temp) {
  const t = ((temp - 273.15) * 9) / 5 + 32;
  return t.toFixed(2);
}

function addEvent() {
  historyBtns = document.querySelectorAll(".history-button");
  historyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const name = e.target.innerText;
      getWeather(name);
    });
  });
}
addEvent();

let cityInput = document.getElementById("city");
cityInput.addEventListener("onkeydown", (e) => {
  console.log(e, e.keyCode, e.key);
});
