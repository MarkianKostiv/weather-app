const userGeolocationAuto = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({ latitude, longitude });
      });
    } else {
      reject("Geolocation is not available.");
    }
  });
};

const updateLocationData = async () => {
  try {
    const { latitude, longitude } = await userGeolocationAuto();
    return { latitude, longitude };
  } catch (error) {
    console.error(`Помилка автоматичного визначення локації: ${error}`);
    return null;
  }
};

const updateAutoLocationBtn = document.querySelector(".user-autolocation-btn");
let ifUserClickedOnAutoBtn = false;
updateAutoLocationBtn.onclick = async () => {
  
  updateLocationData();
  ifUserClickedOnAutoBtn = true;

  await wetherData();
  renderWeatherData();
};

const userEntersLocation = () => {
  return new Promise(async (resolve, reject) => {
    const location = document.querySelector(".location-return");
    const enteredLocation = location.value.trim();

    if (enteredLocation === "") {
      reject("Введіть дійсну локацію.");
      return;
    }

    try {
      const locationData = await fetchLocationData(enteredLocation);

      if (locationData.status === "OK") {
        const firstResult = locationData.results[0];
        const latitude = Number(firstResult.geometry.location.lat);
        const longitude = Number(firstResult.geometry.location.lng);
        // location.value = "";
        resolve({ latitude, longitude });
      } else {
        reject("Неможливо знайти цю локацію.");
      }
    } catch (error) {
      reject(`Помилка завантаження даних: ${error}`);
    }
  });
};

const fetchLocationData = async (location) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyDmbjc-G3ZjtskIGqn5DZQSo0DcIz_6VFA`
  );
  return await response.json();
};

const wetherData = async () => {
  try {
    let latitude, longitude;

    const userInput = document.querySelector(".location-return").value.trim();

    if (userInput) {
      const manualLocation = await userEntersLocation();
      if (manualLocation) {
        latitude = manualLocation.latitude;
        longitude = manualLocation.longitude;
      }
    } else if (ifUserClickedOnAutoBtn === true) {
        const autoLocation = await updateLocationData();
        if (autoLocation) {
          latitude = autoLocation.latitude;
          longitude = autoLocation.longitude;
      }
    } 
    else {
      const autoLocation = await userGeolocationAuto();
      if (autoLocation) {
        latitude = autoLocation.latitude;
        longitude = autoLocation.longitude;
      }
    }


    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&timezone=auto&forecast_days=1`
    );
    const weatherData = await response.json();
    
    console.log(weatherData);

    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDmbjc-G3ZjtskIGqn5DZQSo0DcIz_6VFA`
    );
    const userManualLocation = await resp.json();
    const userLocation = userManualLocation.results[4].formatted_address;
    const userLanguage = navigator.language || navigator.userLanguage;
    return { weatherData, userLocation };
  } catch (error) {
    console.error(`Data loading error: ${error}`);
  }
};

const locationInput = document.querySelector(".location-return");
locationInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    try {
      const { latitude, longitude } = await userEntersLocation();

      if (latitude && longitude) {
        await wetherData();
        renderWeatherData();

        // Очищаємо поле введення
        locationInput.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  }
});

const renderWeatherData = async () => {
  try {
    const { weatherData, userLocation } = await wetherData();

    const weatherDataArray = weatherData["current_weather"];
  
    const temperature = document.querySelector(".temperature-title");
    const currentCity = document.querySelector(".current-city");
  

    const temperatureValue = weatherDataArray["temperature"];

    temperature.textContent = `${temperatureValue}°C`;
    currentCity.textContent = `${userLocation}`;
  } catch (error) {
    console.error(`data loading error${error}`);
  }
};

renderWeatherData();
