const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resultsDisplay = document.getElementById('results');
const finalWpmDisplay = document.getElementById('final-wpm');
const finalAccuracyDisplay = document.getElementById('final-accuracy');
const restartButton = document.getElementById('restart-button');
const textSelect = document.getElementById('text-select');

const textOptions = {
    short: ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "a", "an", "is", "are"],
    medium: ["the quick brown fox", "jumps over the lazy dog", "how are you today", "what is your name", "hello world"],
    long: ["The quick brown fox jumps over the lazy dog. This is a short paragraph to test your typing speed and accuracy. Try to type it as fast and as accurately as possible."]
};

let words = textOptions.short; // Default text
let currentWordIndex = 0;
let currentCharIndex = 0;
let startTime;
let timerInterval;
let correctWords = 0;
let incorrectWords = 0;
let totalTypedChars = 0;
let correctTypedChars = 0;
let allTypedText = ''; // Declare allTypedText globally

function loadText() {
    textDisplay.innerHTML = words.map((word, index) => `<span id="word-${index}">${word.split('').map(char => `<span>${char}</span>`).join('')} </span>`).join('');
    highlightCurrentWord();
}

function highlightCurrentWord() {
    const currentWordSpan = document.getElementById(`word-${currentWordIndex}`);
    if (currentWordSpan) {
        const previousWordSpan = document.querySelector('#text-display .current');
        if (previousWordSpan) {
            previousWordSpan.classList.remove('current');
        }
        currentWordSpan.classList.add('current');
    }
}

function updateWPM() {
    wpmDisplay.textContent = `WPM: 0`; // Set initial WPM to 0
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const timeElapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const timeElapsedMinutes = timeElapsedSeconds / 60;
        timerDisplay.textContent = `Time: ${timeElapsedSeconds}s`;

        // Calculate and update WPM every second
        if (timeElapsedMinutes > 0) {
            const currentWPM = Math.round(correctWords / timeElapsedMinutes);
            wpmDisplay.textContent = `WPM: ${currentWPM}`;
        }
    }, 1000);
}

function updateAccuracy() {
    console.log("updateAccuracy() called");
    const currentWord = words[currentWordIndex];
    const typedText = typingInput.value;
    let correctInCurrentWord = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (i < currentWord.length && typedText[i] === currentWord[i]) {
            correctInCurrentWord++;
        }
    }
    let totalTypedSoFar = 0;
    for (let i = 0; i < currentWordIndex; i++) {
        totalTypedSoFar += words[i].length + 1;
    }
    totalTypedSoFar += typedText.length;
    let correctTypedSoFar = 0;
    for (let i = 0; i < currentWordIndex; i++) {
        correctTypedSoFar += words[i].length + 1;
    }
    correctTypedSoFar += correctInCurrentWord;
    console.log("currentWord:", currentWord);
    console.log("typedText:", typedText);
    console.log("correctInCurrentWord:", correctInCurrentWord);
    console.log("totalTypedSoFar:", totalTypedSoFar);
    console.log("correctTypedSoFar:", correctTypedSoFar);
    if (totalTypedSoFar > 0) {
        const accuracyPercentage = Math.round((correctTypedSoFar / totalTypedSoFar) * 100) + '%';
        console.log("accuracyPercentage:", accuracyPercentage);
        accuracyDisplay.textContent = "Accuracy: " + accuracyPercentage; // <----- UPDATED LINE
    } else {
        accuracyDisplay.textContent = 'Accuracy: 0%'; // Ensure initial state is correct
    }
}

typingInput.addEventListener('input', () => {
    if (!startTime) {
        startTimer();
    }

    const currentWord = words[currentWordIndex];
    const typedText = typingInput.value;
    const currentWordSpan = document.getElementById(`word-${currentWordIndex}`);
    if (!currentWordSpan) return;
    const wordChars = currentWordSpan.querySelectorAll('span');

    let currentCorrectChars = 0; // Calculate correct chars in the current word
    for (let i = 0; i < typedText.length; i++) {
        if (i < currentWord.length && typedText[i] === currentWord[i]) {
            currentCorrectChars++;
        }
    }

    for (let i = 0; i < wordChars.length; i++) {
        if (i < typedText.length) {
            wordChars[i].className = (typedText[i] === currentWord[i]) ? 'correct' : 'incorrect';
        } else {
            wordChars[i].className = '';
        }
    }

    requestAnimationFrame(updateAccuracy);

    totalTypedChars++; // Increment on every input

    // Update correctTypedChars on every input
    let totalCorrectSoFar = 0;
    for (let i = 0; i < currentWordIndex; i++) {
        totalCorrectSoFar += words[i].length + 1; // Add length + space of correct previous words
    }
    totalCorrectSoFar += currentCorrectChars;
    correctTypedChars = totalCorrectSoFar;

    console.log("CW:", correctWords, "CTC:", correctTypedChars);

    if (typedText.endsWith(' ') && typedText.trim() === currentWord) {
        typingInput.value = '';
        currentWordIndex++;
        highlightCurrentWord();
        correctWords++;
    } else if (currentWordIndex === words.length && typedText.trim() === words.slice(-1)[0]) {
        if (startTime) {
            clearInterval(timerInterval);
            showResults();
        }
    } else if (currentWordIndex < words.length && typedText.endsWith(' ') && typedText.trim() !== currentWord) {
        incorrectWords++;
        wordChars.forEach(char => char.classList.add('incorrect-full'));
        typingInput.value = '';
        currentWordIndex++;
        highlightCurrentWord();
    }

    if (currentWordIndex === words.length && startTime) {
        clearInterval(timerInterval);
        showResults();
    }
});

function showResults() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    const endTime = new Date();
    const timeTakenSeconds = (endTime - startTime) / 1000;
    const timeTakenMinutes = timeTakenSeconds / 60;

    const finalWPM = Math.round(correctWords / timeTakenMinutes) || 0;
    let expectedTotalChars = 0;
    for (let i = 0; i < words.length; i++) {
        expectedTotalChars += words[i].length + (i < words.length - 1 ? 1 : 0);
    }

    let finalCorrectChars = Math.min(correctTypedChars, expectedTotalChars); // Ensure correctTypedChars doesn't exceed expected

    const finalAccuracy = expectedTotalChars > 0 ? Math.round((finalCorrectChars / expectedTotalChars) * 100) : 0;

    console.log("--- FINAL RESULTS ---");
    console.log("Correct Words:", correctWords);
    console.log("Total Words:", words.length);
    console.log("Final Accuracy (calculated):", finalAccuracy);
    console.log("Total Expected Characters:", expectedTotalChars);
    console.log("Correct Typed Characters (Final - Limited):", finalCorrectChars);
    console.log("Correct Typed Characters (Original):", correctTypedChars);
    console.log("All Typed Text:", allTypedText);

    finalWpmDisplay.textContent = finalWPM;
    finalAccuracyDisplay.textContent = finalAccuracy;
    resultsDisplay.style.display = 'block';
    typingInput.style.display = 'none';
}

restartButton.addEventListener('click', () => {
    resetTest();
});

textSelect.addEventListener('change', (event) => {
    const selectedText = event.target.value;
    words = textOptions[selectedText].flatMap(item => item.split(' '));
    resetTest();
});

function resetTest() {
    currentWordIndex = 0;
    currentCharIndex = 0;
    startTime = null;
    clearInterval(timerInterval);
    correctWords = 0;
    incorrectWords = 0;
    totalTypedChars = 0;
    correctTypedChars = 0;
    allTypedText = ''; // Reset allTypedText
    timerDisplay.textContent = 'Time: 0s';
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 0%';
    typingInput.value = '';
    typingInput.style.display = 'block';
    resultsDisplay.style.display = 'none';
    loadText();
    typingInput.focus();
}

loadText();
typingInput.focus();