const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resultsDisplay = document.getElementById('results');
const finalWpmDisplay = document.getElementById('final-wpm');
const finalAccuracyDisplay = document.getElementById('final-accuracy');
const restartButton = document.getElementById('restart-button');

let words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]; // Example words
let currentWordIndex = 0;
let currentCharIndex = 0;
let startTime;
let timerInterval;
let correctChars = 0;
let totalChars = 0;

function loadText() {
    textDisplay.innerHTML = words.map((word, index) => `<span id="word-${index}">${word.split('').map(char => `<span>${char}</span>`).join('')} </span>`).join('');
    highlightCurrentWord();
}

function highlightCurrentWord() {
    const currentWordSpan = document.getElementById(`word-${currentWordIndex}`);
    if (currentWordSpan) {
        currentWordSpan.classList.add('current');
    }
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000);
        timerDisplay.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

function updateWPM() {
    if (startTime) {
        const currentTime = new Date();
        const timeElapsed = (currentTime - startTime) / 60000; // in minutes
        const wordsTyped = correctChars / 5;
        const wpm = Math.round(wordsTyped / timeElapsed);
        wpmDisplay.textContent = `WPM: ${wpm}`;
    }
}

function updateAccuracy() {
    if (totalChars > 0) {
        const accuracy = Math.round((correctChars / totalChars) * 100);
        accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
    } else {
        accuracyDisplay.textContent = `Accuracy: 0%`;
    }
}

typingInput.addEventListener('input', () => {
    if (!startTime) {
        startTimer();
    }

    const currentWord = words[currentWordIndex];
    const typedText = typingInput.value;
    const currentWordSpan = document.getElementById(`word-${currentWordIndex}`);
    const wordChars = currentWordSpan.querySelectorAll('span');

    for (let i = 0; i < wordChars.length; i++) {
        if (i < typedText.length) {
            totalChars++;
            if (typedText[i] === currentWord[i]) {
                wordChars[i].className = 'correct';
                correctChars++;
            } else {
                wordChars[i].className = 'incorrect';
            }
        } else {
            wordChars[i].className = ''; // Reset styling for untyped characters
        }
    }

    if (typedText === currentWord + ' ') {
        typingInput.value = '';
        currentWordIndex++;
        currentCharIndex = 0;
        highlightCurrentWord();

        if (currentWordIndex === words.length) {
            clearInterval(timerInterval);
            showResults();
        }
    }

    updateWPM();
    updateAccuracy();
});

function showResults() {
    const currentTime = new Date();
    const timeTaken = (currentTime - startTime) / 60000;
    const finalWPM = Math.round(correctChars / 5 / timeTaken);
    const finalAccuracy = Math.round((correctChars / totalChars) * 100);

    finalWpmDisplay.textContent = finalWPM;
    finalAccuracyDisplay.textContent = finalAccuracy;
    resultsDisplay.style.display = 'block';
    typingInput.style.display = 'none';
}

restartButton.addEventListener('click', () => {
    words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]; // Reset words
    currentWordIndex = 0;
    currentCharIndex = 0;
    startTime = null;
    clearInterval(timerInterval);
    correctChars = 0;
    totalChars = 0;
    timerDisplay.textContent = 'Time: 0s';
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 0%';
    typingInput.value = '';
    typingInput.style.display = 'block';
    resultsDisplay.style.display = 'none';
    loadText();
});

loadText();
typingInput.focus(); // Automatically focus on the input field