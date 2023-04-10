var cityName = document.querySelector("#cityName");
var temp1 = document.querySelector("#temp1");
var hum1 = document.querySelector("#hum1");
var wind1 = document.querySelector("#wind1");
var temp2 = document.querySelector("#temp2");
var hum2 = document.querySelector("#hum2");
var wind2 = document.querySelector("#wind2");
// || = or
var cityList = JSON.parse(localStorage.getItem("cities")) || [];

function generateHistory() {
  console.log(cityList);
  /**
   * for; = we are starting a loop
   * let i = 0; = we are creating a variable to loop over in our condition
   * i< cityList.length; = Our condition if the condition is true, continue the loop, if it's false, stop the loop
   * i++; = Once we finish the code in the loop, increase our looping variable
   */

  for (let i = 0; i < cityList.length; i++) {
    console.log(cityList[i]);
    // 1. Target the parent
    var historyElement = document.querySelector(".history");
    // 2. Create the element we want to add
    var button = document.createElement("button");
    // 3. Give the created element some text
    button.textContent = cityList[i];
    // 4. Add the element to the parent
    historyElement.appendChild(button);
  }
}

generateHistory();
function getWeather() {
  var city = document.getElementById("city").value;

  if (city === "") {
    return;
  }

  console.log("city is>>>", city);

  var apiKey = "2bda322124cc7c43e43314d9953b3b7c";

  var todaysUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(todaysUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      var name = data.name;
      var date = new Date(data.dt * 1000).toLocaleDateString();
      console.log(date);
      cityName.textContent = data.name + " " + date;

      //determine what time it currently in city
      //lok into the data array list and get values for the forcasted time

      var historyElement = document.querySelector(".history");
      cityList.push(name);
      localStorage.setItem("cities", JSON.stringify(cityList));
      let historyItem = localStorage.getItem(name);
      console.log(historyItem);
      var button = document.createElement("button");
      button.textContent = name;
      historyElement.appendChild(button);
      document.getElementById("temp1").innerHTML = data.main.temp;
      document.getElementById("hum1").innerHTML = data.main.humidity;
      document.getElementById("wind1").innerHTML = data.wind.speed;
    });

  // this is my second api
  // var apiKey = "2bda322124cc7c43e43314d9953b3b7c";
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(forecastUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data.list[3].dt);
      // var name = data.city.name;
      // cityName.textContent = data.city.name;

      // console.log(new Date(1680987600 * 1000).toLocaleDateString())
      // console.log(data.list[0].dt_txt);
      //determine what time it currently in city
      //lok into the data array list and get values for the forcasted time

      // console.log(`localStorage ${name} - ${localStorage.getItem(name)}`);
      // console.log(localStorage.getItem(name));
      // var historyElement = document.querySelector(".history");
      // localStorage.setItem(name, JSON.stringify(data));
      // let historyItem = localStorage.getItem(name);
      // console.log(historyItem);
      // var button = document.createElement("button");
      // button.textContent = name;
      // historyElement.appendChild(button);
      document.getElementById("temp2").innerHTML = data.list[3].main.temp;
      document.getElementById("hum2").innerHTML = data.list[3].main.humidity;
      document.getElementById("wind2").innerHTML = data.list[3].wind.speed;
    });
}
getWeather();
