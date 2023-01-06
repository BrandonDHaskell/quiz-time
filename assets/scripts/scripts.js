const instructionsText = "Welcome to Quiz Time.  Select the category below and start taking your quiz.  Your score is based on the number of questions you answer correctly and the total time left.  Questions are randomly displayed so chose wisely. ;)"
const qTime = 8;                        // sets the timer to qTime seconds per question
const qTimePenalty = 4;                 // reduces the timer by qTimePenalty when an incorrect

var quizData = {};                      // JSON data
var quizArray = [];                     // temp array of questions to quiz the user
var viewscreenEl = $(".viewscreen");    // reference to the view screen element
var questionEl;                         // placeholder reference for the question element
var answerDiv;                          // placeholder reference for the answer element
var timerIntervalId = 0;                // for stopping the interval call for the quiz timer
var quizActive = false;                 // used to prevent access to high scores when quiz is running
var quizCategory = "";                  // selected category of questions
var quizQuestion = 0;                   // for index references to the quizArray
var correctCount = 0;                   // for tracking correctly answered questions
var timerCount = 0;                     // quiz timer in seconds
var finalScore = 0;



/*
    Set and get functions
*/

function setTimer(seconds){
    timerCount = seconds;
    displayTimer();
}

function setScore(){
    finalScore = correctCount + timerCount;
    return finalScore;
}

function getQuizData(url, callback){
    fetch(url)
        .then(response => response.json())
        .then(data => quizData = data)
        .then(() => callback());
}

function getHighScoreInputForm(){
    var formEl = $('<form>');
    var inputText = $('<input>');
    var inputButton = $('<input>');

    inputText.prop('type', 'text');
    inputText.prop('id', 'initials');
    inputButton.prop('value', 'Submit');
    inputButton.prop('type', 'submit');

    formEl.append(inputText);
    formEl.append(inputButton);
    formEl.on('submit', function(event){
        var initials = $('#initials').val();
        let regPattern = /^[a-zA-z]{2,3}$/;

        event.preventDefault();
        document.prevent
        if( regPattern.test(initials) ){
            var scoreObj = getScoreObject(initials );
            addHighScore(scoreObj);
            displayHighScores();
        } else {
            $('#initials').val("");
            alert("Initials must be a 2-3 letters!");
        }
    });
    return formEl;
}

function getHighScoresTable(){
    var highScores = getHighScoresArr();

    if( highScores ){
        var tbl = $('<table>');
        var thr = $('<tr>');

        // Build and add header row to table
        thr.append('<th colspan="1" scope="col">Rank</th>');
        thr.append('<th colspan="1" scope="col">Initials</th>');
        thr.append('<th colspan="1" scope="col">Category</th>');
        thr.append('<th colspan="1" scope="col">Score</th>');
        tbl.append(thr);

        // Build and add score data to table
        highScores.forEach(function(item, index, arr){
            var tr = $('<tr>');

            tr.append('<td>' + (Number.parseInt(index) + 1) + '<td>');
            tr.append('<td>' + item.initials + '<td>');
            tr.append('<td>' + item.category + '<td>');
            tr.append('<td>' + item.score + '<td>');
            tbl.append(tr);
        });
        return tbl;
    } else {
        return false;
    }
}

function getReturnToQuizButton(){
    var btn = $('<button>');

    btn.text('Return');
    btn.on('click', function(){
        initQuizTime();
    })
    return btn;
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
            setTimeout(advanceQuiz, 680);
        }
    });
    return div;
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
function getCatButton(btnLabel){
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

// if scores exist, return pre-sorted array of scores
function getHighScoresArr(){
    var scores = localStorage.getItem("highScores");

    if( scores ){
        scores = JSON.parse(scores);
        return scores;
    } else {
        return false;
    }
}

function getScoreObject(initials){
    var score = setScore();
    var scoreObj = {
        initials: initials,
        category: quizCategory,
        score: score
    }
    return scoreObj;
}


/*
    Helper functions
*/

function clearViewscreen(){
    viewscreenEl.html("");
}

function disableButtons(){
    $('.ans-btn').prop('disabled', true);
}

function addHighScore(scoreObj){
    var highScores = localStorage.getItem("highScores");

    // get previous data, or initialize new
    if( highScores ){
        highScores = JSON.parse(highScores);
    } else {
        highScores = [];
    }
    highScores.push(scoreObj);

    // sort then clip if more than 20 records
    highScores.sort((a, b) => b.score - a.score);
    if ( highScores.length > 20 ){
        highScores = highScores.slice(0, 20);
    }
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function runTimer(){
    if( timerCount > 0){
        timerCount--;
        displayTimer();
    } else {
        quizActive = false;
        clearInterval(timerIntervalId);
        displayTimer();
        clearViewscreen();
        displayHighScoreEntry();
    }
}

function correctAnswerClicked(event){
    correctCount++;
    event.target.innerText = "✅ " + event.target.innerText;
}

function incorrectAnswerClicked(event){
    event.target.innerText = "❌ " + event.target.innerText;
    timerCount = timerCount - qTimePenalty;
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
        quizActive = false;
        clearInterval(timerIntervalId);
        clearViewscreen();
        displayHighScoreEntry();
    }
}

function startQuiz(){
    clearViewscreen();
    questionEl = getQuestionElement();
    answerDiv = getAnswerDiv();
    quizArray = getQuizQuestions();
    timerCount = quizArray.length * qTime; // dynamic timer based on question count
    quizQuestion = 0;
    correctCount = 0;
    setTimer(timerCount);
    timerIntervalId = setInterval(runTimer, 1000);
    quizActive = true;
    advanceQuiz();
}


/*
    Initialization and dispaly specific functions
*/

function displayTimer(){
    document.getElementById("counter").innerText = timerCount;
}

function displayHighScores(){
    if(!quizActive){
        var tbl = getHighScoresTable();

        clearViewscreen();
        if( tbl ){
            var btn = getReturnToQuizButton();
            viewscreenEl.append(tbl);
            viewscreenEl.append(btn);
        }
    } else {
        alert("Please finish your quiz...");
    }
    
}

function displayHighScoreEntry(){
    var headerEl = $('<h2>');
    var promptEl = $('<h3>');
    var formEl = getHighScoreInputForm();

    setScore();
    headerEl.text("High Score!");
    promptEl.text("Your score is " + finalScore + ". Enter your initials...");
    viewscreenEl.append(headerEl);
    viewscreenEl.append(promptEl);
    viewscreenEl.append(formEl);
}

function displayWelcomeScreen(){
    var welcomeTitle = $('<h2>').text("Welcome to Quiz Time!");
    var instructionsEl = $('<p>').text(instructionsText);
    var btnDiv = getCatButtonDiv();
    var categories = Object.keys(quizData);

    setTimer(0);
    displayTimer();
    welcomeTitle.addClass("welcome-title");

    // Build category selection buttons
    for(cat in categories){
        btnDiv.append(getCatButton(categories[cat]));
    }

    viewscreenEl.append(welcomeTitle);
    viewscreenEl.append(instructionsEl);
    viewscreenEl.append(btnDiv);
}

function initQuizTime(){
    clearViewscreen();
    displayWelcomeScreen();
}

getQuizData("./assets/data/quiz-data.json", initQuizTime);
