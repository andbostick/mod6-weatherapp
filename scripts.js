var apikey = "abafa6227b7a47dd38b617d1af16898c";

var searchButton = $(".search");

searchButton.on("click", getSearchVal);

function getSearchVal(e) {
  e.preventDefault();
  var searchVal = $(this).parent().find("#city-text").val();
  getGeoLocation(searchVal)
}

function getGeoLocation(search) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apikey}
      `
  )
    .then(function (data) {
      return data.json();
    })
    .then(function (res) {
      var lat = res[0].lat;
      var lon = res[0].lon;
      console.log(lat, lon);
      getCurrentDay(lat, lon);
      useGeoLocation(lat, lon);
    });
}

function getCurrentDay(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`
  )
    .then(function (data) {
      return data.json();
    })
    .then(function (res) {
      console.log(res);
      createCurrentDay(res);
    });
}

function useGeoLocation(lat, lon) {
  console.log(lat, lon);
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`
  )
    .then(function (data) {
      return data.json();
    })
    .then(function (res) {
      for (var i = 0; i < res.list.length; i += 8) {
        console.log(res.list[i]);
        createForecast(res.list[i]);
      }
    });
}

function createCurrentDay(weatherData) {
  var currentDayCard = $(".current-day");
  var locationTitle = $("<h3>");
  var humidityData = $("<p>");
  var windData = $("<p>");
  var tempData = $("<p>");
  locationTitle.text(weatherData.name);
  humidityData.text(`Humidity: ${weatherData.main.humidity} %`);
  tempData.text(`Temp: ${weatherData.main.temp}F`);
  windData.text(`Wind: ${weatherData.wind.speed} MPH`);
  currentDayCard.append(locationTitle);
  currentDayCard.append(tempData);
  currentDayCard.append(windData);
  currentDayCard.append(humidityData);
}

function createForecast(weatherData) {
  var mainDiv = $(".forecast");
  var forcastCard = $("<div>");
  var cardBody = $("<div>");
  var locationTitle = $("<div>");
  var tempData = $("<p>");
  var humidityData = $("<p>");
  var windData = $("<p>");

  forcastCard.addClass("card");
  locationTitle.addClass("card-header");
  cardBody.addClass("card-body");
  forcastCard.addClass("col-2 m-3 ");

  locationTitle.text(weatherData.dt_txt);
  tempData.text(`Temp: ${weatherData.main.temp}F`);
  windData.text(`Wind: ${weatherData.wind.speed} MPH`);
  humidityData.text(`Humidity: ${weatherData.main.humidity} %`);

  mainDiv.append(forcastCard);
  forcastCard.append(locationTitle);
  forcastCard.append(cardBody);
  cardBody.append(tempData);
  cardBody.append(windData);
  cardBody.append(humidityData);
}


