# quiz-time
A webpage to display and run a a quiz program
# Quiz Time!

Welcome to Quiz Time!  Feel free to try it out at the deployed site below.  Once the page loads, select a category and take your quiz.  You can even record your score to share with friends or track your progres.

Test your knowledge with Quiz Time!

See the [Deployed Site](https://bhaskell7901.github.io/quiz-time/)


## Table of Contents

1. [Technology Used](#technology-used)
2. [Overview and Strategies](#overview-and-strategies)
3. [The 'formDataObj' Object](#the-formdataobj-object)
4. [The 'characterTypeList' Object](#the-charactertypelist-object)
5. [The 'passwordGenerator' Object](#the-passwordgenerator-object)
    1. [Functions](#functions)
6. [Password Generator: Behind the Scenes](#password-generator-behind-the-scenes)
7. [Additional Features](#additional-features)
8. [Usage](#usage)
9. [Learning Points](#learning-points)
10. [Author Info](#author-info)


## Technology Used 

| Technology Used         | Resource URL           | 
| ------------- |:-------------:| 
| HTML    | [https://developer.mozilla.org/en-US/docs/Web/HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) | 
| CSS     | [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)      |   
| Git | [https://git-scm.com/](https://git-scm.com/)     |  
| JQuey | [https://jquery.com/](https://jquery.com/) |


## Overview and Strategies

A general overview of the Quiz Time flow is:
1. Load the page and quiz data
2. Display a welcome screen with Question Categories from the quiz data
3. Initiate a timed quiz once a Category is selected
4. Record scores after the quiz is completed
5. Display High Scores after submission
6. Alternatively, High Scores can be reviewed when not taking a quiz

The Quiz Time project uses a static webpage that is updated using JavaScript and JQuery executions.  The ```viewscreen``` element is updated with new HTML to change between the Welcome view, the Quiz view, the Score Entry view, and the High Score view based on user input.  *See the wireframe image below*.

The Quiz Time project is designed to be flexible around the question data.  Multiple choice, true/false and other other type of short answer questions can be asked based on the question data being passed to the Quiz Time app.  The quiz data is contained in the ```quiz-data.json``` file and is loaded before the Welcome screen.  The basic structure of the ```quiz-data``` looks like this:

```javascript

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
        }, ...
        
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
                }
            }
        },

```


The Quiz Time app will also dynamically adjust the timer based on the number of questions to be presented.


View Screen Wireframe
---
![Wireframe](https://github.com/bhaskell7901/quiz-time/blob/main/assets/images/quiz-time-home-page-wireframe.jpg)

For the Password Generator project, I wanted to create a password generator that was flexible enough to be used by people anywhere, so I focused on making the application to be extensible from a language perspective.  A ```characterTypeList``` object is used to encapsulate the language to be used to generate a password.  This could be contextual to a country, a region, or just a language preference by the user.  A ```formDataObj``` object is use to determine, given a language definition, what characteristics of that language's characters should be used to generate the password, i.e.: how long it should be, inclusion of special characters, etc.  The ```passwordGenerator``` object uses these two objects to generate a random password that is language specific and criteria specific to the user.

I also wanted to explore form data, and capturing form data from a webpage.  I expanded on the HTML and added a form to get user data to build a ```formDataObj``` object to pass to the ```passwordGenerator``` object.  The form functionality is explained in more detail below.

One of the criteria for the project was to incorporate ```alert```, ```prompt```, and ```confirm``` window inputs.  To meet the criteria I enabled it as a feature on the form.  Once the checkbox is checked, the form inputs are ignored and the user will be prompted for there input.


## The 'formDataObj' Object

The ```formDataObj``` is the object used to capture the user input.  The basic structure looks like:

```javascript

formDataObj = {
    meta : {},
    data : {}
}

```

The ```meta``` property contains the password length a boolean flag to determine whether to require at least one instance of a character set.  The ```data``` property contains keys as strings to the ```characterTypeList``` object.  They are used to determine what character sets to use.  If if they are not present in the data propery, then they are not used.

Here is what a ```formDataObj``` might look like:

```javascript

formDataObj = {
    meta : {
        charCount : "128",
        includeOneOfEach : true,
    },
    data : {
        specChars : "specChars",
        numChars : "numChars",
        capChars : "capChars", 
        lwrChars : "lwrChars"
    }
};

```

## The 'characterTypeList' Object

The ```characterTypeList``` is used to define the pool of characters that can be used to generate a password.  The basic structure looks like:

```javasctript

characterTypeList = { 
    specChars : [],
    numChars : [],
    capChars : [], 
    lwrChars : [], 
};

```

Each property is an array of single characters.  The property names are used by the formDataObj to determine when to include the arrays in password generation.


## The 'passwordGenerator' Object

The passwordGenerator flow:

Once the ```passwordGenerator``` is created, a ```characterTypeList``` is passed in using the ```setPasswordCharacterTypeList()``` function to set the language for the password to be generated from.  If the ```characterTypeList``` has the proper formatting (an object list of single character arrays), then it is added to the property of the same name and the ```hasCharLists``` value is set to true and the function returns true.  

If not, then ```hasCharLists``` 

### Functions

```setPasswordCharacterTypeList(obj)``` - Validates the object being passed in is a ```characterTypeList``` sets the object in the generator if true

```getPasswordCharacterTypeList()``` - Returns a copy of this object's ```characterTypeList```

```getFormData()``` - Gets the form data from the HTML page and returns a ```formDataObj```

```hasFormattedTypeLists(charTypesLists)``` - Validates if a ```characterTypeList``` is properly formatted

```characterTypeMatches(charTypes)``` - Compares the index references from the ```data``` property of the ```formDataObj``` to the ```characterTypeList``` and returns matching arrays for generating passwords

```getRandomIndex(indexLength)``` - A function to randomly gnerate a number to refer to a character array

```isImpossibleCondition( charTypes, pswdLength, boolIncludeAtLeastOne )``` - Tests for an impossible condition where a user may specify using more character sets than there are characters in the password.  An exmple would be specifying using the sets: special characters, numbers and upper case letters; including at least one of each character and setting the password length to 2.  In this case, there are more characters sets than there are password chracters and we cannot ensure at least one of each character in a character set will be used.  For this assingment, that condition is not possible.  However, I wanted the ```passwordGenerator``` to be flexible in other use cases.

```getCompleteCharacterArray(matchList)``` - Concatenates all the character set arrays into a single array to ensure more random character generation.  All of the characters are contained in sets.  A strategy might be to randomly select a set, then randomly select a character within that set.  However, this would lead to unwanted character weighting making a less secure password.  I chose to combine all the usable to characters into a single array and randomly select a character from the single array.


```validNumber(formDataObj)``` - Determines whether the input password length is a number or not.

```promptForNumber()``` - Prompts the user to input a number

```promptForData``` - Confirms if the user wants to include which character sets

```getInputFromPrompts``` - Handles the prompting feature of the ```passwordGenerator``` for getting user input through window prompts

```generatePassword``` - Generates a random password 


## Password Generator: Behind the Scenes

Behind the scenes, the Password Generator creates 3 ```characterTypeList``` and ```formDataObj``` objects.  One using English characters, one using Cyrillic characters, and one using Devanagari (Hindi).  A single ```passwordGenerator``` object is created and used for the demo and for the live site example.

On page loading, a demo is run using ```console.log``` to show password generation outputs after swapping languages.  The language is then put back to English for the live site.  The outputs of the demo can be viewed in the console.


## Additional Features

* Ability to switch between using the form and prompting using the *Enable Prompting* checkbox
* Ability to force inclusiveness or not for all character types chosen using the *Inclusive* checkbox
* Using ```get``` and ```set``` functions to set language and evaluate the language externally

Three ways to get input:
1. Using form input
2. Using prompts
3. Passing a ```formDataObj``` to ```passwordGenerator``` as an optional parameter to the ```generatePassword``` function


## Usage 

To use the Password Generator, just navigate to the [Live Site](https://bhaskell7901.github.io/pswd-generator/).  Then use the options in the form to determine how you want to generate a password.

![Password Generator image](https://github.com/bhaskell7901/pswd-generator/blob/main/assets/images/pswd-generator.png)

**Enable Prompting** - select this option if you want to be prompted for input.  Form data will be ignored when generating passwords through prompting.

**Number** - the number of characters to use in your password.

**Special**  - the special set of characters.

**Numbers** - the numerical characters.

**Caps** - captial letters.

**Lower** - lower case letters.

Click *Generate Password* to get your password!


## Learning Points 

I learned a lot about JavaScript objects from this project, and about getting data from multiple sources and still formatting it in a way that can be used again and again.  When I started the project, I was very familiar with arrays and how to use them.  I actually finished the project early and decided to refactor my code to utilize JavaScript object.  The first round of code is in the project in the [scripts.js](https://github.com/bhaskell7901/pswd-generator/blob/main/assets/scripts/script.js) file.  This project is using the second file, [scripts2.js](https://github.com/bhaskell7901/pswd-generator/blob/main/assets/scripts/scripts2.js).

One of the areas where I want to continue to push myself is utilizing Github to organzie my workflow.  The issue tracker and branches are an area I'm looking to start incoroporating into my next projects.



## Author Info

### Brandon Haskell

* [LinkedIn](https://www.linkedin.com/in/BrandonDHaskell)
* [Github](https://github.com/bhaskell7901)
