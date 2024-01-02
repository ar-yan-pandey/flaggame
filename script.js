const countryInput = document.getElementById('countryInput');
const checkButton = document.getElementById('checkButton');
const resultText = document.getElementById('result');
const mysteryFlag = document.getElementById('mysteryFlag');
const flagContainer = document.getElementById('flagContainer');
const hearts = document.querySelectorAll('.heart');
const modal = document.getElementById('modal');
const restartButton = document.getElementById('restartButton');
const modalText = document.getElementById('modalText');
const suggestionsList = document.getElementById('suggestions');

let allCountries = [];
let mysteryCountry;
let incorrectGuesses = 0;

function fetchAllCountries() {
  fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
      allCountries = data.map(country => country.name.common);
      selectMysteryCountry();
    })
    .catch(error => {
      console.error('Error fetching countries:', error);
    });
}

function selectMysteryCountry() {
  mysteryCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
  fetchMysteryFlag();
}

function fetchMysteryFlag() {
  fetch(`https://restcountries.com/v3.1/name/${mysteryCountry}`)
    .then(response => response.json())
    .then(data => {
      const flagUrl = data[0]?.flags?.svg;
      if (flagUrl) {
        mysteryFlag.src = flagUrl;
        flagContainer.style.display = 'block';
      } else {
        console.error('Flag not found for the mystery country');
      }
    })
    .catch(error => {
      console.error('Error fetching flag:', error);
    });
}

function restartGame() {
  window.location.reload(); // Reload the page to restart the game
}

function openModal(message, backgroundColor, restartBtnColor, restartBtnTextColor) {
  modalText.textContent = message;
  modalContent.style.backgroundColor = backgroundColor;

  if (restartBtnColor && restartBtnTextColor) {
    restartButton.style.backgroundColor = restartBtnColor;
    restartButton.style.color = restartBtnTextColor;
  }

  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

let lives = 3;

function displaySuggestions(input) {
  const userInput = input.toLowerCase();
  const matchingCountries = allCountries.filter(country => country.toLowerCase().includes(userInput));

  suggestionsList.innerHTML = '';

  matchingCountries.slice(0, 5).forEach(country => {
    const listItem = document.createElement('li');
    listItem.textContent = country;
    listItem.addEventListener('click', () => {
      countryInput.value = country;
      suggestionsList.style.display = 'none'; // Hide suggestions after selection
    });
    suggestionsList.appendChild(listItem);
  });

  if (input === '') {
    suggestionsList.style.display = 'none';
  } else {
    suggestionsList.style.display = 'block';
  }
}

countryInput.addEventListener('input', (e) => {
  displaySuggestions(e.target.value);
});

checkButton.addEventListener('click', () => {
  const userInput = countryInput.value.trim();

  if (userInput.toLowerCase() === mysteryCountry.toLowerCase()) {
    resultText.textContent = `Congratulations! You guessed the country correctly: ${mysteryCountry}`;
    openModal(`Correct guess! The country was: ${mysteryCountry}`, '#2ecc71', 'whitesmoke', 'green');
  } else {
    resultText.textContent = `Oops! Incorrect guess. Try again!`;
    incorrectGuesses++;
    lives--;

    if (lives === 0) {
      resultText.textContent = `Game Over!`;
      checkButton.disabled = true;

      openModal(`Game Over! The country was: ${mysteryCountry}`, '#e74c3c');
    }

    hearts[lives].classList.add('hide');
  }
});

restartButton.addEventListener('click', () => {
  closeModal();
  restartGame();
});

fetchAllCountries();
