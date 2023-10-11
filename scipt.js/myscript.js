console.log("hello");
const phoneNumberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const formattedPhoneNumber = createPhoneNumber(phoneNumberArray);

function createPhoneNumber(numbers) {
  const firstNumber = numbers.slice(0, 3).join("");
  const midleNumber = numbers.slice(3, 6).join("");
  const lastNumber = numbers.slice(6, 10).join("");
  return `(${firstNumber}) ${midleNumber}-${lastNumber}`;
}

console.log(formattedPhoneNumber);

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

const userEntersLocation = () => {
  return new Promise((resolve, reject) => {
    const location = document.querySelector(".location-return");
    let enteredLocation = ""; // Локальна змінна для зберігання останнього введеного значення

    const handleKeydown = (event) => {
      if (event.key === "Enter" && location.value.trim() !== "") {
        enteredLocation = location.value.trim(); // Оновлюємо останнє введене значення
        console.log(enteredLocation); // Виводимо останнє введене значення
        location.value = "";
        resolve(enteredLocation);
      } else if (event.key === "Enter") {
        event.preventDefault();
        reject("Введіть дійсну локацію.");
      }
    };

    location.addEventListener("keydown", handleKeydown);
  });
};

const userLocationManually = async () => {
  try {
    const userEnteredLocation = await userEntersLocation();
    console.log(userEnteredLocation);

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${userEnteredLocation}&key=AIzaSyDmbjc-G3ZjtskIGqn5DZQSo0DcIz_6VFA`
    );
    const locationData = await response.json();
    console.log(locationData);

    if (locationData.status === "OK") {
      const firstResult = locationData.results[0];
      console.log(firstResult);
      const latitude = firstResult.geometry.location.lat;
      const longitude = firstResult.geometry.location.lng;
      console.log(`${latitude}, ${longitude}`);
      return { latitude, longitude };
    } else {
      console.error("Неможливо знайти цю локацію.");
    }
  } catch (error) {
    console.error(`Data loading error: ${error}`);
  }
};

userLocationManually();

const wetherData = async () => {
  try {
    const { latitude, longitude } = await userGeolocationAuto();
    // console.log(latitude, longitude);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&timezone=auto&forecast_days=1`
    );

    const weatherData = await response.json();
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDmbjc-G3ZjtskIGqn5DZQSo0DcIz_6VFA`
    );
    const userManualLocation = await resp.json();
    console.log(userManualLocation);
    const userCity =
      userManualLocation.results[0].address_components[3].long_name;
    console.log(userCity);
    return { weatherData, userCity };
  } catch (error) {
    console.error(`Data loading error: ${error}`);
  }
};

const renderWeatherData = async () => {
  try {
    const { weatherData, userCity } = await wetherData();
    // console.log(weatherDataObj);
    const weatherDataArray = weatherData["current_weather"];
    // console.log(weatherDataArray);
    const temperature = document.querySelector(".temperature-title");
    const currentCity = document.querySelector(".current-city");
    for (item in weatherDataArray) {
      // console.log(item);
    }

    const temperatureValue = weatherDataArray["temperature"];

    temperature.textContent = `${temperatureValue}°C`;
    currentCity.textContent = `${userCity}`;
  } catch (error) {
    console.error(`data loading error${error}`);
  }
};

renderWeatherData();

