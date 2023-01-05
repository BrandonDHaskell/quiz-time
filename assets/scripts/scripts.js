var quizData = {};

var viewscreenEl = $(".viewscreen");

var timeDisplay = document.getElementById("counter");

var timerCount = 0;

function getQuizData(url, callback){
    fetch(url)
        .then(response => response.json())
        .then(data => quizData = data)
        .then(() => callback());
}

function clearViewscreen(){
    viewscreenEl.text("");
}

function displayWelcomeScreen(){
    var welcomeTitle = $('<h2>').text("Welcome to Quiz Time!");
    var btnDiv = $('<div>').text("div");
    
    var categories = Object.keys(quizData);
    console.log(categories);

    welcomeTitle.addClass("welcome-title");
    viewscreenEl.append(welcomeTitle);
    viewscreenEl.append(btnDiv);

}

// Returns a <div> with buttons based on a list of categories
function getButton(btnLabel){
    var btn = $('<button>').text(btnLabel);
}

function setTimer(seconds){
    timerCount = seconds;
}

function runTimer(){
    if( timerCount > 0){
        timeDisplay.innerText = timerCount;
        timerCount--;
    } else {
        clearTimeout(runTimer);
        timeDisplay.innerText = timerCount;
    }
}

function initQuiz(){
    console.log(quizData);
    displayWelcomeScreen();
    setTimer(10);
    setInterval(runTimer, 1000);
    clearViewscreen();
}


getQuizData("./assets/data/quiz-data.json", initQuiz);
