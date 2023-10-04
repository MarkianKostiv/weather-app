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
const userLocationManually = () => {

}

const wetherData = async () => {
  try {
    const { latitude, longitude } = await userGeolocationAuto();
    console.log(latitude, longitude);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&timezone=auto&forecast_days=1`
    );

    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error(`Data loading error: ${error}`);
  }
};

const reanderWeatherData = async () => {
  try {
    const weatherDataObj = await wetherData();
    console.log(weatherDataObj);
    const weatherDataArray = weatherDataObj["current_weather"];
    const temperature = document.querySelector(".temperature-title");
    const temperatureValue = weatherDataArray["temperature"];
  
    // Встановлюємо це значення в текстове поле
    temperature.textContent = `${temperatureValue}°C`;
  } catch (error) {
    console.error(`data loading error${error}`);
  }
};
reanderWeatherData();
