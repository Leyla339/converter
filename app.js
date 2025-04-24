let burgerMenu = document.querySelector(".burger-menu");
let burgerOpen = document.querySelector(".burger-open");
let buttonsLeft = document.querySelectorAll(".buttons-left p");
let buttonsRight = document.querySelectorAll(".buttons-right p");
let changeLeft = document.querySelector(".change-left");
let changeRight = document.querySelector(".change-right");
let inputLeft = document.querySelector(".input-left");
let inputRight = document.querySelector(".input-right");
let lastChanged;
const API_KEY = "5616f9249559a2ed16f34f11";

// burger-menu
burgerMenu.addEventListener("click", () => {
  if (burgerOpen.style.display == "none") {
    burgerOpen.style.display = "block";
  } else {
    burgerOpen.style.display = "none";
  }
});

// clean input
function cleanInput(value) {
  value = value.replace(/\s/g, "");
  value = value.replace(/[^0-9.,]/g, "");
  value = value.replace(/,/g, ".");
  value = oneDot(value);
  if (value.startsWith(".")) {
    value = "0" + value;
  }
  const parts = value.split(".");
  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 5);
    value = parts[0] + "." + parts[1];
  }
  return value;
}

// one dot in input
function oneDot(value) {
  let firstDot = value.indexOf(".");
  if (firstDot >= 0) {
    return (
      value.slice(0, firstDot + 1) +
      value.slice(firstDot + 1).replace(/\./g, "")
    );
  }
  return value;
}

// left button click
buttonsLeft.forEach((item) => {
  item.addEventListener("click", () => {
    lastChanged = "left";
    buttonsLeft.forEach((btn) => btn.classList.remove("active-button"));
    item.classList.add("active-button");
    sameCurrency();
  });
});

// right button click
buttonsRight.forEach((item) => {
  item.addEventListener("click", () => {
    lastChanged = "right";
    buttonsRight.forEach((btn) => btn.classList.remove("active-button"));
    item.classList.add("active-button");
    sameCurrency();
  });
});

function sameCurrency() {
  const fromCurrency = document.querySelector(
    ".buttons-left .active-button"
  ).textContent;
  const toCurrency = document.querySelector(
    ".buttons-right .active-button"
  ).textContent;

  if (fromCurrency === toCurrency) {
    changeLeft.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
    changeRight.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`;
    if (lastChanged === "left") {
      inputLeft.value = inputRight.value;
    } else {
      inputRight.value = inputLeft.value;
    }
  } else {
    fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`
    )
      .then((response) => response.json())
      .then((data) => {
        const exchangeRateLeft = data.conversion_rates[toCurrency];
        if (exchangeRateLeft) {
          changeLeft.textContent = `1 ${fromCurrency} = ${exchangeRateLeft.toFixed(
            5
          )} ${toCurrency}`;
        } else {
          changeLeft.textContent = "Not founf";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        changeLeft.textContent = "Error";
      });

    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${toCurrency}`)
      .then((response) => response.json())
      .then((data) => {
        const exchangeRateRight = data.conversion_rates[fromCurrency];
        if (exchangeRateRight) {
          changeRight.textContent = `1 ${toCurrency} = ${exchangeRateRight.toFixed(
            5
          )} ${fromCurrency}`;
        } else {
          changeRight.textContent = "Not found";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        changeRight.textContent = "Erro";
      });
  }
}

inputLeft.addEventListener("input", () => {
  inputLeft.value = cleanInput(inputLeft.value);
  lastChanged = "left";

  const fromCurrency = document.querySelector(
    ".buttons-left .active-button"
  ).textContent;
  const toCurrency = document.querySelector(
    ".buttons-right .active-button"
  ).textContent;

  if (fromCurrency === toCurrency) {
    inputRight.value = inputLeft.value;
    sameCurrency();
  } else {
    convertCurrency(fromCurrency, toCurrency, inputLeft.value).then((data) => {
      inputRight.value = cleanInput(String(data));
    });
  }
});

inputRight.addEventListener("input", () => {
  inputRight.value = cleanInput(inputRight.value);
  lastChanged = "right";

  const fromCurrency = document.querySelector(
    ".buttons-right .active-button"
  ).textContent;
  const toCurrency = document.querySelector(
    ".buttons-left .active-button"
  ).textContent;

  if (fromCurrency === toCurrency) {
    inputLeft.value = inputRight.value;
    sameCurrency();
  } else {
    convertCurrency(fromCurrency, toCurrency, inputRight.value).then((data) => {
      inputLeft.value = cleanInput(String(data));
    });
  }
});

function convertCurrency(from, to, amount) {
  return fetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.result === "success") {
        return data.conversion_result;
      } else {
        console.error("Conversion error:", data);
        return "error1";
      }
    })
    .catch((error) => {
      console.error("API error:", error);
      return "error2";
    });
}

// internet
const noInternetElement = document.querySelector(".no-internet");
const internetElement = document.querySelector(".internet");
window.addEventListener("load", function () {
  if (!navigator.onLine) {
    noInternetElement.style.display = "block";
  }
});

window.addEventListener("offline", function () {
  noInternetElement.style.display = "block";
  internetElement.style.display = "none";
});

window.addEventListener("online", function () {
  noInternetElement.style.display = "none";
  internetElement.style.display = "block";
  setTimeout(function () {
    internetElement.style.display = "none";
  }, 3000);
  sameCurrency();
});

