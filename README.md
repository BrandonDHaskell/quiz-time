# Quiz Time!

Welcome to Quiz Time!  Feel free to try it out at the deployed site below.  Once the page loads, select a category and take your quiz.  You can even record your score to share with friends or track your progress.

Also, if your curious and want to experiment with alternative quiz data, open up your dev console and run the following to update your quiz data on the fly:

```javascript
getQuizData("./assets/data/quiz2-data.json", initQuizTime)
```

Test your knowledge with Quiz Time!

See the [Deployed Site](https://BrandonDHaskell.github.io/quiz-time/)


## Table of Contents

1. [Technology Used](#technology-used)
2. [Overview and Strategies](#overview-and-strategies)
3. [The 'quiz-data.json' Object](#the-quiz-data.json-object)
4. [The 'scoreObj' Object](#the-scoreObj-object)
5. [Additional Features](#additional-features)
6. [Usage](#usage)
7. [Learning Points](#learning-points)
8. [Author Info](#author-info)
9. [License](#license)


## Technology Used 

| Technology        | Resource URL           | 
| ------------- | ------------- | 
| HTML    | [https://developer.mozilla.org/en-US/docs/Web/HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) | 
| CSS     | [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)      |   
| Git | [https://git-scm.com/](https://git-scm.com/)     |  
| JQuery | [https://jquery.com/](https://jquery.com/) |


## Overview and Strategies

A general overview of the Quiz Time flow is:
1. Load the page and quiz data
2. Display a welcome screen with Question Categories from the quiz data
3. Initiate a timed quiz once a Category is selected
4. Record scores after the quiz is completed
5. Display High Scores after submission
6. Alternatively, High Scores can be reviewed when not taking a quiz

The Quiz Time project uses a static webpage that is updated using JavaScript and JQuery executions.  The ```viewscreen``` element is updated with new HTML to change between the Welcome view, the Quiz view, the Score Entry view, and the High Score view based on user input.  *See the wireframe image below*.

**View Screen Wireframe**

![Wireframe](https://github.com/bhaskell7901/quiz-time/blob/main/assets/images/quiz-time-home-page-wireframe.jpg)

Quiz Time is designed to be flexible around the question data.  Multiple choice, true/false and other types of short answer questions can be asked based on the question data being passed to the Quiz Time app.  The Quiz Time app will also dynamically adjust the timer based on the number of questions to be presented.  Time is deducted when a wrong answer is selected and points are awarded for correct answers.  There are also bonus points awarded for finishing the quiz before time is up.  Questions are randomly shown each time.

High Scores can be entered and recorded for tracking performance and to show improvements over time.  Scores are tracked in the ```localStorage``` on the client.  An array of ```scoreObjects``` are used to record scores.

## The 'quiz-data.json' Object

The quiz data is contained in the ```quiz-data.json``` file and is loaded before the Welcome screen.  All question and answer data in this file is used to dynamically update the page.  

The basic structure of the ```quiz-data``` looks like this:

```javascript
{
    "category1": [
        {
            "question": "Question 1",
            "choices": {
                "a1": { 
                    "text": "answer 1",
                    "data-yes-no": "yes"
                },
                "a2": { 
                    "text": "answer 2",
                    "data-yes-no": "no"
                }
            }
        }, 
    ],
    ...
    "category2": [
        {
            "question": "Question 1",
            "choices": {
                "a1": { 
                    "text": "answer 1",
                    "data-yes-no": "np"
                },
                "a2": { 
                    "text": "answer 2",
                    "data-yes-no": "yes"
                },
                "a3": { 
                    "text": "answer 1",
                    "data-yes-no": "np"
                },
                "a4": { 
                    "text": "answer 2",
                    "data-yes-no": "yes"
                }
            }
        }
    ]
}
```

## The 'scoreObj' Object

Scores are tracked at the end of a quiz session and a ```scoreObj``` is created and added to a ```highScores``` array that is converted to a string and stored in ```localStroage```.  When adding a new score, or displaying the scores, the string is converted back to an array and updated.  Only the top 20 scores are recorded and tracked.

The basic structure of a ```scoreObj``` looks like this:

```javascript
scoreObj = {
    initials: initials,
    category: quizCategory,
    score: score
}
```


## Additional Features

* Ability to load different quiz data through the console (see [Usage](#usage) section below)
* Addition of categories to the Quiz data sets and scores
* User Input validation using ```regex``` (user input must be 2-3 letters only for score tracking)
* Dynamic timer settings based on category question definitions
* Randomized quiz questions (everytime you take the test, the question order is randomized)
* Score ranking based on score values (highest scores are alway on top)
* High Score viewing prevented when taking a quiz, this prevents users from pausing the quiz once a question is presented


## Usage

To use Quiz Time, just navigate to the [Live Site](https://bhaskell7901.github.io/quiz-time/).  Once the page loads, select the Quiz Category of questions and take your quiz.  Once the quiz is complete, enter your score to track any improvements.  High scores can be reviewed when not taking a quiz by clicking on the High Scores link.

To update the quiz questions and categories to new categories, run the following in your web console:
```javascript
getQuizData("./assets/data/quiz2-data.json", initQuizTime)
```

You can also use this to see test data:
```javascript
getQuizData("./assets/data/dummy-data.json", initQuizTime)
```


To revert back to the default quiz data, run the following:
```javascript
getQuizData("./assets/data/quiz-data.json", initQuizTime)
```


## Learning Points 

For this project, I learned o lot about JSON usage and callback functions when loading data to a webpage.  I also learned about Lambda functions and arrow notation, which was useful for the data loading in ```getQuizData()``` function, as well as for some array sorting that was used in the code.

In general, I'm still geting into the details of Github and Issue/Project tracking.  There are very useful features that are available such as Milestones and Issues.  In addition to branch protection features and code review features that will be helpful for future collaboration projects.


## Author Info

### Brandon Haskell

* [LinkedIn](https://www.linkedin.com/in/BrandonDHaskell)
* [Github](https://github.com/bhaskell7901)

## License

MIT License
