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
    },
    {
        question: "מהו השיפוע של משיק לפרבולה y = x^2 בנקודה x = 2?",
        options: ["2", "4", "6", "8"],
        answer: "4"
    },
    {
        question: "מה קורה לערך ה-y של הפרבולה y = ax^2 כאשר a שלילי?",
        options: ["הערכים עולים", "הערכים יורדים", "הפרבולה לא משתנה", "הפרבולה מסתובבת"],
        answer: "הערכים יורדים"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let playerName = "";
let timer;
let timeLeft = 10;
let timeBetweenQuestions = 2; // זמן הפסקה בין השאלות (שניות)

function startGame() {
    playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        document.getElementById("player-name").style.border = "2px solid red";
        document.getElementById("error-message").innerText = "אנא הכנס שם!";
        return;
    }
    document.getElementById("error-message").innerText = "";
    document.getElementById("player-name").style.border = "";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("start-btn").style.display = "none";
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
            checkAnswer(null, null); // נבדוק אם השחקן לא ענה
            document.getElementById("next-btn").style.display = "block";
        }
    }, 1000);

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => checkAnswer(button, option);
        optionsContainer.appendChild(button);
    });
}

function updateTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.innerText = `זמן שנותר: ${timeLeft} שניות`;
    timerElement.style.color = timeLeft > 5 ? "green" : timeLeft > 2 ? "orange" : "red";
}

function checkAnswer(button, selectedOption) {
    clearInterval(timer);
    const correctAnswer = questions[currentQuestionIndex].answer;
    document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
    
    if (selectedOption === correctAnswer) {
        button.style.backgroundColor = "green";
        score++;
    } else if (selectedOption !== null) {
        button.style.backgroundColor = "red";
    }

    // הצגת תשובה נכונה אם השחקן טעה או אם נגמר הזמן
    if (timeLeft === 0 && selectedOption !== correctAnswer) {
        document.querySelectorAll("#options button").forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.style.backgroundColor = "green";
            }
        });
    }

    document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        document.getElementById("next-btn").style.display = "none"; // נסתר כפתור Next
        setTimeout(loadQuestion, timeBetweenQuestions * 1000); // ממתינים לפני שמטעינים את השאלה הבאה
    } else {
        endGame();
    }
}

function endGame() {
    document.getElementById("quiz-container").innerHTML = `
        <h2>סיימת את החידון! ציון: ${score}/${questions.length}</h2>
        <button onclick='viewLeaderboard()'>הראה לוח תוצאות</button>
        <button onclick='restartGame()'>שחק שוב</button>
    `;
    savePlayerScore();
}

function restartGame() {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 10; // איפוס זמן
    document.getElementById("quiz-container").innerHTML = "";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("start-btn").style.display = "block";
}

function savePlayerScore() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
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

function viewLeaderboard() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("start-btn").style.display = "none";
    document.getElementById("leaderboard-container").style.display = "block";
}

updateLeaderboard();
<div id="leaderboard-container" style="display:none;">
    <table id="leaderboard"></table>
    <button onclick="viewLeaderboard()">חזור למשחק</button>
</div>
