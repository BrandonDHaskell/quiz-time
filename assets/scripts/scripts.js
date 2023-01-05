const instructionsText = "Welcome to Quiz Time.  Select the category below and start taking your quiz.  Your score is based on the number of questions you answer correctly and the total time left.  Questions are randomly displayed so chose wisely. ;)"
const qTime = 5;                        // sets the timer to qTime seconds per question

var quizData = {};                      // JSON data
var quizArray = [];                     // array of questions to quiz the user
var viewscreenEl = $(".viewscreen");    // reference to the view screen element
var questionEl;                         // placeholder reference for the question element
var answerDiv;                          // placeholder reference for the answer element
var timerIntervalId = 0;                // for stopping the interval call for the quiz timer
var quizActive = false;                 // used to prevent access to high scores when quiz is running
var quizCategory = "";                  // selected category of questions
var quizQuestion = 0;                   // for index references to the quizArray
var correctCount = 0;                   // for tracking correctly answered questions
var timerCount = 0;                     // for timing the quiz


function getHighScoreInputForm(){
    var formEl = $('<form>');
    var inputText = $('<input>');
    var inputButton = $('<input>');

    inputText.prop('type', 'text');
    inputButton.prop('value', 'Submit');
    inputButton.prop('type', 'submit');


    formEl.append(inputText);
    formEl.append(inputButton);
    // formEl.on('submit', storeHighScore);

    return formEl;
}

function displayHighScoreEntry(){
    var headerEl = $('<h2>');
    var promptEl = $('<h3>');
    var formEl = getHighScoreInputForm();

    headerEl.text("High Score!");
    promptEl.text("Enter your initials...");
    viewscreenEl.append(headerEl);
    viewscreenEl.append(promptEl);
    viewscreenEl.append(formEl);
    console.log("Time: " + timerCount);
    console.log("Correct: " + correctCount);
}

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
        clearInterval(timerIntervalId);
        clearViewscreen();

        displayHighScoreEntry();
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
    quizActive = true;
    advanceQuiz();
}

function displayWelcomeScreen(){
    var welcomeTitle = $('<h2>').text("Welcome to Quiz Time!");
    var instructionsEl = $('<p>').text(instructionsText);
    var btnDiv = getCatButtonDiv();
    var categories = Object.keys(quizData);

    welcomeTitle.addClass("welcome-title");

    // Build category selection buttons
    for(cat in categories){
        btnDiv.append(getButton(categories[cat]));
    }

    viewscreenEl.append(welcomeTitle);
    viewscreenEl.append(instructionsEl);
    viewscreenEl.append(btnDiv);
}

function initQuizTime(){
    clearViewscreen();
    displayWelcomeScreen();
}

function getQuizData(url, callback){
    fetch(url)
        .then(response => response.json())
        .then(data => quizData = data)
        .then(() => callback());
}

getQuizData("./assets/data/quiz-data.json", initQuizTime);
