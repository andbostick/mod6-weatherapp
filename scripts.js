var apikey = "abafa6227b7a47dd38b617d1af16898c";

function getGeoLocation() {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=" +
      apikey
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
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`
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
      }
    });
}

function createCurrentDay(weatherData) {
  var currentDayCard = $(".card-body");
  var locationTitle = $("<h3>");
  locationTitle.text(weatherData.name);
  currentDayCard.append(locationTitle);
}

getGeoLocation();
