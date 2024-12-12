const apiUrl = "https://opentdb.com/api.php?amount=5&category=12&difficulty=hard&type=multiple";
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');

let shuffledQuestions, currentQuestionIndex;
let score = 0;

let currentQuestion = null;

startButton.addEventListener("click", fetchQuestions);

async function fetchQuestions() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch trivia questions");
        }
        const data = await response.json();
        shuffledQuestions = data.results;
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = score;
        displayQuestion();
        startButton.style.display = 'none';
        nextButton.style.display = 'none';
    } catch (error) {
        console.log(error);
        document.getElementById('feedback-message').textContent = "Error fetching trivia questions.";
    }
}

function displayQuestion() {
    currentQuestion = shuffledQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerHTML = currentQuestion.question;
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

    // Shuffle answers
    for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }

    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    allAnswers.forEach(answer => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'choice';
        radio.value = answer;

        radio.addEventListener('change', handleAnswerSelection);

        label.appendChild(radio);
        label.appendChild(document.createTextNode(answer));
        answersContainer.appendChild(label);
        answersContainer.appendChild(document.createElement('br'));
    });
}

function handleAnswerSelection(event) {
    const selectedAnswer = event.target.value;
    const correctAnswer = currentQuestion.correct_answer;
    const feedbackMessage = document.getElementById('feedback-message');

    if (selectedAnswer === correctAnswer) {
        feedbackMessage.textContent = "Correct! 🎉";
        score++;
        scoreElement.textContent = score;
    } else {
        feedbackMessage.textContent = `Wrong! The correct answer was: ${correctAnswer}`;
    }

    const allRadioButtons = document.querySelectorAll('input[name="choice"]');
    allRadioButtons.forEach(button => button.disabled = true);

    nextButton.style.display = 'inline-block';
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        displayQuestion();
        nextButton.style.display = 'none';
        document.getElementById('feedback-message').textContent = '';
    } else {
        document.getElementById('question-container').innerHTML = '<h2>Quiz Complete!</h2>';
        document.getElementById('answers-container').innerHTML = '';
        nextButton.style.display = 'none';
    }
});
