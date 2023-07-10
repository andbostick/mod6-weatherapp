var apikey = "abafa6227b7a47dd38b617d1af16898c";

//a global variable for use when there is a previous search of a city
var lastSearched;

var searchButton = $(".search");

//event listener for search button
searchButton.on("click", getSearchVal);

function getSearchVal(e) {
  e.preventDefault();
  //grabs input value
  var searchVal = $(this).parent().find("#city-text");
  //checks if input value isnt empty
  if (searchVal.val() === "") {
  } else {
    getGeoLocation(searchVal.val());
    //saves to local stoarge
    localStorage.setItem(
      searchVal.val().toLowerCase(),
      searchVal.val().toLowerCase()
    );
    //clears the input after searching
    searchVal.val("");
  }
}

function getGeoLocation(search) {
  //calls function to clear page
  clearPrevSearch();
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

      //fetches lat and lon and passes them to other functions to use them
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
      //creates a 1 day card of weather
      createCurrentDay(res);
    });
}

function useGeoLocation(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`
  )
    .then(function (data) {
      return data.json();
    })
    .then(function (res) {
      //loops through the data to return 5 seperate days of weather and creates cards
      for (var i = 0; i < res.list.length; i += 8) {
        createForecast(res.list[i]);
      }
    });
}

function createCurrentDay(weatherData) {
  var date = new Date().toLocaleDateString("en-US");
  var iconcode = weatherData.weather[0].icon;
  var currentDayCard = $(".current-day");
  var locationTitle = $("<h3>");
  var humidityData = $("<p>");
  var windData = $("<p>");
  var tempData = $("<p>");
  var icon = $("<img>");

  icon.attr("alt", "weather icon");
  icon.attr("src", `http://openweathermap.org/img/w/${iconcode}.png`);
  locationTitle.text(`${weatherData.name} (${date})`);
  humidityData.text(`Humidity: ${weatherData.main.humidity} %`);
  tempData.text(`Temp: ${weatherData.main.temp}F`);
  windData.text(`Wind: ${weatherData.wind.speed} MPH`);
  currentDayCard.append(locationTitle);
  locationTitle.append(icon);
  currentDayCard.append(tempData);
  currentDayCard.append(windData);
  currentDayCard.append(humidityData);
}

function createForecast(weatherData) {
  var dates = new Date(weatherData.dt_txt).toLocaleDateString("en-US");
  var iconcode = weatherData.weather[0].icon;
  var mainDiv = $(".forecast");
  var forcastCard = $("<div>");
  var cardBody = $("<div>");
  var locationTitle = $("<div>");
  var tempData = $("<p>");
  var humidityData = $("<p>");
  var windData = $("<p>");
  var icon = $("<img>");
  icon.attr("alt", "weather icon");
  icon.attr("src", `http://openweathermap.org/img/w/${iconcode}.png`);

  forcastCard.addClass("card bg-secondary text-white");
  locationTitle.addClass("card-header");
  cardBody.addClass("card-body");
  forcastCard.addClass("col-2 m-3 ");

  locationTitle.text(dates);
  locationTitle.append(icon);
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

function clearPrevSearch() {
  var currentForecast = $(".current-day");
  var fiveDayForecast = $(".forecast");
  currentForecast.text("");
  fiveDayForecast.text("");
}

$.each(localStorage, function (key, value) {
    //checks if the key value pair exists
    if (key == value) {
      //updates the variable we created at the begining 
        lastSearched = value;
        //regex to remove spaces
        var regex = / /g;
        //variable to apply the regex to
    var changeSpaceToDash = value;
    var sectionDiv = $("section");
    var prevSearchButton = $("<button>");
    prevSearchButton.addClass("search btn btn-primary w-100 mt-3");

        prevSearchButton.text(value);
        //removes the spaces and replaces it with a -
    prevSearchButton.attr("id", changeSpaceToDash.replaceAll(regex, "-"));
        sectionDiv.append(prevSearchButton);
        //adds the event listener to the new buttons
    $("section").on("click", `#${value}`, function () {
      getGeoLocation(value);
    });
  }
});
//checks if there was a last searched and if there was call that 
if (lastSearched) {
  console.log("searched");
  getGeoLocation(lastSearched);
}
