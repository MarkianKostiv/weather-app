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

const wetherData = async () => {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={8f97bb40f35303f51cf60efa84697528}"
  );
};
