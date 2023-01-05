const instructionsText = "Welcome to Quiz Time.  Select the category below and start taking your quiz.  Your score is based on the number of questions you answer correctly and the total time left.  Questions are randomly displayed so chose wisely. ;)"
const qTime = 5; // sets the timer to qTime seconds per question

var quizData = {};
var quizArray = [];
var viewscreenEl = $(".viewscreen");
var answerDiv;
var questionEl;
var timerIntervalId = 0;

var quizActive = false;  // used to prevent access to high scores when quiz is running
var quizCategory = "";
var quizQuestion = 0;
var correctCount = 0;
var timerCount = 0;



function clearViewscreen(){
    viewscreenEl.html("");
}

function correctAnswerClicked(event){
    correctCount++;
    event.target.innerText = "✅ " + event.target.innerText;
}

function incorrectAnswerClicked(event){
    event.target.innerText = "❌ " + event.target.innerText;
    
    timerCount = timerCount - 5;
    if(timerCount < 0 ){
        timerCount = 0;
    }
    displayTimer();
}

function advanceQuiz(){
    if(quizQuestion < quizArray.length){
        questionEl.text(quizArray[quizQuestion].question);
        answerDiv = getAnswerButtons(answerDiv, quizArray[quizQuestion].choices);
        viewscreenEl.append(questionEl);
        viewscreenEl.append(answerDiv);
        quizQuestion++;
    } else {
        clearViewscreen();
    }
}

function getAnswerDiv(){
    var div = $('<div>');

    div.addClass('btn-div');
    div.on('click', function(event){
        if(event.target.tagName === "BUTTON"){
            if(event.target.dataset.yesno === 'yes' ){
                correctAnswerClicked(event);
            } else {
                incorrectAnswerClicked(event);
            }
            disableButtons();
            setTimeout(advanceQuiz, 750);
        }
    });
    return div;
}

function disableButtons(){
    $('.ans-btn').prop('disabled', true);
}

function getAnswerButtons(btnDiv, choicesObj){
    btnDiv.html("");

    for( choice in choicesObj ){
        var btn = $('<button>');

        btn.addClass('ans-btn');
        btn.attr('data-yesno', choicesObj[choice]["data-yes-no"]);
        btn.text(choicesObj[choice]["text"]);
        btnDiv.append(btn);
    }
    return btnDiv;
}

function getQuestionElement(){
    var elm = $('<h2>');

    elm.addClass("question-text");
    return elm;
}

function getQuizQuestions(){
    let arr = [];
    arr = quizData[quizCategory].slice();
    arr.sort((a, b) => 0.5 - Math.random());
    return arr;
}

// Returns a <div> with buttons based on a list of categories
function getButton(btnLabel){
    var btn = $('<button>');

    btn.text(btnLabel);
    btn.attr("name", btnLabel.toLowerCase());
    return btn;
}

function getCatButtonDiv(){
    var btnDiv = $('<div>');

    btnDiv.addClass('btn-div');
    btnDiv.on('click', function(event){
        if(event.target.tagName === "BUTTON"){
            quizCategory = event.target.innerText;
            startQuiz();
        }
    });
    return btnDiv;
}

function displayTimer(){
    document.getElementById("counter").innerText = timerCount;
}

function setTimer(seconds){
    timerCount = seconds;
    displayTimer();
}

function runTimer(){
    if( timerCount > 0){
        timerCount--;
        displayTimer();
    } else {
        clearInterval(timerIntervalId);
        displayTimer();
    }
}

function startQuiz(){
    clearViewscreen();
    questionEl = getQuestionElement();
    answerDiv = getAnswerDiv();
    quizArray = getQuizQuestions();
    timerCount = quizArray.length * qTime;
    quizQuestion = 0;
    setTimer(timerCount);
    timerIntervalId = setInterval(runTimer, 1000);
    advanceQuiz();
}

function displayWelcomeScreen(){
    var welcomeTitle = $('<h2>').text("Welcome to Quiz Time!");
    var instructionsEl = $('<p>').text(instructionsText);
    var btnDiv = getCatButtonDiv();
    var categories = Object.keys(quizData);

    // Build category selection buttons
    for(cat in categories){
        btnDiv.append(getButton(categories[cat]));
    }

    welcomeTitle.addClass("welcome-title");
    viewscreenEl.append(welcomeTitle);
    viewscreenEl.append(instructionsEl);
    viewscreenEl.append(btnDiv);
}

function initQuiz(){
    clearViewscreen();
    displayWelcomeScreen();
    // setTimer(10);
    // timerIntervalId = setInterval(runTimer, 1000);
}

function getQuizData(url, callback){
    fetch(url)
        .then(response => response.json())
        .then(data => quizData = data)
        .then(() => callback());
}

getQuizData("./assets/data/quiz-data.json", initQuiz);
