const container = document.querySelector(".container");
const questionBox = document.querySelector(".question");
const choicesBox = document.querySelector(".choices");
const nextBtn = document.querySelector(".nextBtn");
const scoreCard = document.querySelector(".scoreCard");
const alert = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const timer = document.querySelector('.timer');
const skipBtn = document.querySelector('.skipBtn');
const checkBtn = document.querySelector('.checkBtn');
const submitBtn = document.querySelector('.submitBtn');
const userAnswerInput = document.getElementById('userAnswer');

let currentProblem = null;
let score = 0;
let totalQuestions = 0;
let quizOver = false;
let timeLeft = 60;
let timerId = null;

// Function to generate a random number between min and max (inclusive)
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate an array of random numbers of given length
const generateRandomNumbers = (length, min, max) => {
    return Array.from({ length }, () => getRandomNumber(min, max));
};

// Function to generate a random math problem
const generateProblem = () => {
    const numCount = getRandomNumber(2, 5); // Random number of terms between 2 and 5
    const numbers = generateRandomNumbers(numCount, 2, 40);
    const operators = ['LCM', 'HCF'];
    const operator = operators[getRandomNumber(0, operators.length - 1)];
    let question, answer;

    switch (operator) {
        case 'LCM':
            question = `Find the LCM of ${numbers.join(', ')}.`;
            answer = findLCM(numbers);
            break;
        case 'HCF':
            question = `Find the HCF of ${numbers.join(', ')}.`;
            answer = findHCF(numbers);
            break;
        default:
            question = '';
            answer = NaN;
    }

    return { question, answer };
};

// Function to find the LCM of multiple numbers
const findLCM = (numbers) => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const lcm = (a, b) => (a * b) / gcd(a, b);
    return numbers.reduce((multiple, num) => lcm(multiple, num));
};

// Function to find the HCF of multiple numbers
const findHCF = (numbers) => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    return numbers.reduce((factor, num) => gcd(factor, num));
};

// Function to display a new math problem
const showProblem = () => {
    currentProblem = generateProblem();
    questionBox.textContent = currentProblem.question;
};

// Function to check the user's answer
const checkAnswer = () => {
    const userAnswer = parseFloat(userAnswerInput.value); // Parse input as float
    const roundedAnswer = Math.round(userAnswer * 10) / 10; // Round to 1 decimal point
    if (roundedAnswer === currentProblem.answer) {
        displayAlert("Correct answer!");
        score++;
    } else {
        displayAlert(`Wrong answer! The correct answer is ${currentProblem.answer}`);
    }

    totalQuestions++;
    timeLeft = 60;
    userAnswerInput.value = '';
    showProblem();
    updateScoreCard();
};

// Function to update the score card
const updateScoreCard = () => {
    scoreCard.textContent = `Score: ${score} / ${totalQuestions}`;
};

// Function to display an alert message
const displayAlert = (msg) => {
    alert.style.display = 'block';
    alert.textContent = msg;
    setTimeout(() => {
        alert.style.display = 'none';
    }, 2000);
};

// Function to start the timer
const startTimer = () => {
    clearInterval(timerId);
    timeLeft = 60;
    timer.textContent = timeLeft;
    timerId = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerId);
            displayAlert("Time's up!");
            setTimeout(() => {
                totalQuestions++;
                updateScoreCard();
                showProblem();
                startTimer();
            }, 2000);
        }
    }, 1000);
};

// Event listeners
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    container.style.display = 'block';
    showProblem();
    startTimer();
    updateScoreCard();
});

nextBtn.addEventListener('click', () => {
    if (!quizOver) {
        checkAnswer();
    } else {
        scoreCard.textContent = `Your final score: ${score} / ${totalQuestions}`;
        scoreCard.style.display = 'block';
    }
});

// Function to skip the current question
const skipQuestion = () => {
    if (!quizOver) {
        displayAlert("Question skipped!");
        totalQuestions++;
        showProblem();
        updateScoreCard();
    }
};

// Add event listener for skip button click
skipBtn.addEventListener('click', skipQuestion);

checkBtn.addEventListener('click', () => {
    if (!quizOver) {
        checkAnswer();
    }
});
