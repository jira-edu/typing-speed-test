let words = [];
let timer = 60;
let score = 0;
let currentIndex = 0;
let testStarted = false;

const wordDisplay = document.getElementById("word-display");
const userInput = document.getElementById("user-input");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

async function fetchWords() {
    try {
        const response = await fetch("https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt");
        const text = await response.text();
        words = text.split("\n").filter(word => word.trim() !== "");
    } catch (error) {
        console.error("Error fetching word list:", error);
    }
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTest() {
    userInput.disabled = false;
    userInput.focus();
    shuffleArray(words); // Shuffle the array before starting the test
    displayNextWord();
}

function startTimer() {
    const interval = setInterval(() => {
        timer--;
        
        if (timer > 0) {
            timerDisplay.textContent = `เวลาคงเหลือ ${timer} วินาที`;
        } else {
            timerDisplay.textContent = "หมดเวลา !"; // Updated text here
            timerDisplay.style.color = "red"; // Change text color to red
            clearInterval(interval);
            userInput.disabled = true;
            showResult();
        }
    }, 1000);
}

function displayNextWord() {
    userInput.value = ""; // Clear the user input

    if (currentIndex < words.length) {
        let randomIndex = Math.floor(Math.random() * words.length);
        let word = words[randomIndex];

        // Check if the word has 6 letters or fewer
        while (word.length > 6) {
            randomIndex = Math.floor(Math.random() * words.length);
            word = words[randomIndex];
        }

        // Store the original word as a data attribute
        wordDisplay.setAttribute("data-original-word", word);

        // Display the word in black color initially
        wordDisplay.innerHTML = `<span class="initial">${word}</span>`;
        currentIndex++;
    } else {
        showResult();
    }
}




userInput.addEventListener("input", () => {
    if (!testStarted) {
        testStarted = true;
        startTimer();
    }

    const inputText = userInput.value.trim();
    const originalWord = wordDisplay.getAttribute("data-original-word");

    let displayHTML = "";

    for (let i = 0; i < originalWord.length; i++) {
        if (inputText[i] === undefined) {
            displayHTML += `<span class="remaining">${originalWord.substring(i)}</span>`;
            break;
        }

        if (inputText[i] === originalWord[i]) {
            displayHTML += `<span class="correct">${originalWord[i]}</span>`;
        } else {
            displayHTML += `<span class="incorrect">${originalWord[i]}</span>`;
        }
    }

    wordDisplay.innerHTML = displayHTML;

    if (inputText === originalWord) {
        score++;
        scoreDisplay.textContent = `จำนวนคำ: ${score}`;
        userInput.value = "";
        displayNextWord();
    }
});

const reloadButton = document.getElementById("reload-button");

reloadButton.addEventListener("click", () => {
    location.reload(); // Reload the page
});


// Fetch words and start test when the page loads
fetchWords().then(startTest);
