const questions = [
    {
        question: "מהי צורתה הכללית של פונקציה ריבועית?",
        options: ["y = mx + b", "y = ax^2 + bx + c", "y = ax + b", "y = x^3 + bx + c"],
        answer: "y = ax^2 + bx + c"
    },
    {
        question: "לפרבולה y = (x - 3)^2 - 4, מה נקודת הקדקוד?",
        options: ["(3,4)", "(-3,-4)", "(3,-4)", "(-3,4)"],
        answer: "(3,-4)"
    },
    {
        question: "לאיזה כיוון תיפתח הפרבולה y = -2x^2 + 5x - 3?",
        options: ["למעלה", "למטה", "שמאלה", "ימינה"],
        answer: "למטה"
    },
    {
        question: "לפרבולה y = x^2 - 4x + 3, מהם נקודות החיתוך עם ציר ה-X?",
        options: ["(1,0) ו-(3,0)", "(0,3) ו-(0,-4)", "(2,0) ו-(3,0)", "(0,1) ו-(0,-3)"],
        answer: "(1,0) ו-(3,0)"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let playerName = "";
let timer;
let timeLeft = 10;

function startGame() {
    playerName = document.getElementById("player-name").value;
    if (!playerName) {
        alert("אנא הכנס שם!");
        return;
    }
    document.getElementById("quiz-container").style.display = "block";
    document.querySelector("button").style.display = "none";
    loadQuestion();
}

function loadQuestion() {
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("timer").style.display = "block";
    timeLeft = 10;
    updateTimer();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
            clearInterval(timer);
            alert("נגמר הזמן! 😢");
            nextQuestion();
        }
    }, 1000);

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function updateTimer() {
    document.getElementById("timer").innerText = `זמן שנותר: ${timeLeft} שניות`;
}

function checkAnswer(selectedOption) {
    clearInterval(timer);
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedOption === correctAnswer) {
        alert("תשובה נכונה! 🎉");
        score++;
    } else {
        alert("תשובה שגויה! 😢 התשובה הנכונה היא: " + correctAnswer);
    }
    document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    document.getElementById("quiz-container").innerHTML = `<h2>סיימת את החידון! ציון: ${score}/${questions.length}</h2>`;
    savePlayerScore();
}

function savePlayerScore() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5); // שמור רק 5 שחקנים מובילים
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
}

function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let table = document.getElementById("leaderboard");
    table.innerHTML = `<tr><th>שם</th><th>ניקוד</th></tr>`;
    leaderboard.forEach(player => {
        let row = table.insertRow();
        row.insertCell(0).innerText = player.name;
        row.insertCell(1).innerText = player.score;
    });
}

updateLeaderboard();
