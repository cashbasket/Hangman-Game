//global variables / text I want to be able to find and edit easily
var maxTries = 10;
var answers = ['walker, texas ranger','martial artist','roundhouse kick','the hitman','the delta force','flying kick','hellbound','missing in action','knockout punch','devout christian','conservative','republican','military man','patriot','greatest person ever','american hero','oklahoma rules','the most awesome human','firewalker','karate master','code of silence','the expendables 2','the colombian connection','sidekicks','the octagon','eye for an eye','forced vengeance','silent rage','trial by fire','invasion u.s.a.','lone wolf mcquade','the way of the dragon','a force of one','karate kommandos'];
var specialCharacters = [' ',',','.',':','\'','-'];
var winnerText = 'You got it! Chuck is pleased. He wants to keep playing, though, so he picked a new word/phrase for you.';
var loserText = 'You ran out of tries, and have therefore been kicked in the face. However, Chuck just thought up a new word (or phrase)! Do not disappoint him again.';
var chuckFactIntro = '<span class="fact-header">Fact:</span>';
var chuckFacts = ['Chuck Norris was bitten by a cobra, and after five days of excruciating pain, the cobra died.','Chuck Norris once kicked a horse in the chin. Its descendants today are known as giraffes.','Chuck Norris doesn\'t breathe air; he holds air hostage.','When Chuck Norris turned 18, his parents moved out.','Chuck Norris doesn\'t dial the wrong number; you answered the wrong phone.','If Chuck Norris were a Spartan in the movie "300," the movie would be called "1."','Chuck Norris is currently suing NBC, claiming "Law" and "Order" are trademarked names for his left and right legs.','Chuck Norris will never have a heart attack; his heart isn\'t nearly foolish enough to attack him.','Chuck Norris can kill two stones with one bird.','Chuck Norris does not sleep; he waits.','The easiest way to determine Chuck Norris\' age is to cut him in half and count the rings.','There is no chin underneath Chuck Norris\' beard; there is only another fist.'];
var errors = ['Only letter and number keys are allowed.','You already tried that one!'];

//global math functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getPctWidthOfOverlay() {
	return parseFloat($('#overlay').width() / $('#chuckHolder').width()) * 100;
}
//global string functions
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

//define game object
var game = { 
	currentAnswer: '',
	lastAnswer: '',
	correctGuess: false,
	isValidKeyPress: false,
	alreadyGuessed: false,
	triesLeft: maxTries,
	lettersGotten: 0,
	triedLetters: [],
	isWinner: false,
	isGameOver: false,
	wins: 0,
	faceKicks: 0,
	isReset: false,
	init: function() {
		var audio = document.getElementById('soundEffect');
		audio.volume = 0.8;
		audio.preload = true;
		$('#triesLeft').text(maxTries + ' tries remaining');
		$('.wins').text(this.wins);
		$('.face-kicks').text(this.faceKicks);
		$('#maxTriesText').text(maxTries + ' times');
		$('#tries').text('None').css('color','#ffcc00');
		$('.results').hide();
		$('.overlay-text').html(chuckFactIntro + '<br>' + this.getRandomChuckFact()).fadeIn(200);
		$('.errors').hide();
	},
	getRandomChuckFact: function() {
		var selectedFact = chuckFacts[getRandomInt(0, chuckFacts.length - 1)];
		return selectedFact;
	},
	chooseAnswer: function() {
		//reset lettersGotten every time!
		this.lettersGotten = 0;
		//select random answer from answers array
		var selectedAnswer = answers[getRandomInt(0, answers.length - 1)];
		var displayed = selectedAnswer;
		//clear out word span
		$('.word').text('');

		//add new letter span for each character in new word
		for(var i=0; i < selectedAnswer.length; i++) {
			displayed = displayed.replaceAt(i, '_');
		}
		//whenever there's a space or special character an answer, display them and add 1 to lettersGotten
		for(var i=0; i < selectedAnswer.length; i++) {
			if(specialCharacters.includes(selectedAnswer.charAt(i))) {
				displayed = displayed.replaceAt(i, selectedAnswer.charAt(i))
				this.lettersGotten++;
				console.log(displayed);
			}
		}
		//set currentAnswer property and display unsolved word/phrase
		this.currentAnswer = selectedAnswer;
		$('.word').text(displayed);
	},
	processGuess: function(guess) {
		var displayed = $('.word').text();
		// update word/phase with guess if correct
		for(var i=0; i < this.currentAnswer.length; i++) {
			if (this.currentAnswer.charAt(i) == guess.toLowerCase()) {
				displayed = displayed.replaceAt(i, guess.toUpperCase());
				this.lettersGotten++;
				this.correctGuess = true;
			}
		}
		$('.word').text(displayed);
		// update tried letters
		if (!this.isWinner) {
			if($('#tries').text() == 'None') {
				$('#tries').text('').css('color','#fff');
			} 
			if(this.triedLetters.length >= 1) {
				$('#tries').append(', ');
			}
			$('#tries').append(guess.toUpperCase());
			this.triedLetters.push(guess.toUpperCase());
		}
	},
	updateTriesLeftDisplay: function () {
		var triesSuffix = this.triesLeft > 1 ? ' tries remaining' : ' try remaining';
		$('#triesLeft').text(this.triesLeft + triesSuffix);
		if (this.triesLeft <= maxTries/2) {
			$('#triesLeft').css('color', '#ffcc00');
		}	
	},
	showErrors: function() {
		if(this.isValidKeyPress) {
			$('.errors > span').text(errors[1]);
		}
		else {
			$('.errors > span').text(errors[0]);
		}
		$('.errors').slideDown(200);
	},
	hideErrors: function() {
		$('.errors').slideUp(200);
	},
	checkForNewGuess: function(guess) {
		// check to see if user already guessed the letter
		for(var i=0; i < game.triedLetters.length; i++) {
			if(game.triedLetters[i] == guess.toUpperCase()) {
				this.alreadyGuessed = true;
				break;
			}
		}
		return this.alreadyGuessed;
	},
	checkKeyPressed: function(guessCode) {
		if((event.keyCode >= 48 && event.keyCode <= 57) || (guessCode >= 65 && guessCode <= 90) || (guessCode >= 97 && guessCode <= 122)) {
			this.isValidKeyPress = true;
		}
		return this.isValidKeyPress;
	},
	checkForWinner: function() {
		if(this.lettersGotten == this.currentAnswer.length) {
			this.isWinner = true;
		}
		return this.isWinner;
	},
	checkForGameOver: function() {
		if(this.isWinner || this.triesLeft == 0) {
			this.isGameOver = true;	
		}
		return this.isGameOver;
	},
	updateStats: function() {
		if (this.isWinner) {
			$('.wins').text(this.wins);
		}
		else {
			$('.face-kicks').text(this.faceKicks);
		}
	},
	postGame: function() {
		// congratulate user if user won
		if(this.isWinner) {
			this.wins++;
			this.playSound('absolutely-right');
		}
		// kick user in face if user lost
		else {
			this.faceKicks++;
			this.playSound('kick');
		}
		// update wins/losses and show results
		this.updateStats();
		this.showResults();			
	},
	showResults: function() {	
		if (this.isWinner) {
			$('.results').css('background-color','#b9ddb4');
			$('.result-text').css('color', '#317a27')
							 .text(winnerText);
		}
		else {
			$('.results').css('background-color', '#eecdcd');
			$('.result-text').css('color', '#be1c1c')
							 .text(loserText);
		}
		$('.results').slideDown().delay(7000).slideUp();
	},
	reset: function() {
		this.correctGuess = false;
		this.alreadyGuessed = false;
		this.isValidKeyPress = false;
		this.isWinner = false;
		this.isGameOver = false;
		this.triesLeft = maxTries;
		this.triedLetters = [];
		$('#tries').text('None').css('color','#ffcc00');
		$('#triesLeft').text(maxTries + ' tries remaining').css('color', '#fff');
		$('.overlay-text').html(chuckFactIntro + '<br>' + this.getRandomChuckFact()).fadeIn(200);
		this.lastAnswer = this.currentAnswer;
		//choose new word
		this.chooseAnswer();
		//checks to make sure the new word isn't the same as the previous word
		for(;;) {
			if (this.currentAnswer == this.lastAnswer) {
				this.chooseAnswer();
			}
			else {
				break;
			}
		}
		this.isReset = true;
		this.determineType(this.currentAnswer);
	},
	determineType: function(answer) {
		if(answer.indexOf(' ') > 0) {
			$('#answerType').text('phrase');
		}
		else {
			$('#answerType').text('word');
		}
	},
	revealChuck: function() {
		var curPct = getPctWidthOfOverlay();
		var newPct = curPct - (100/maxTries);
		$('#overlay').animate({ maxWidth: newPct + "%"},100);
	},
	playSound: function(type) {
		var audio = document.getElementById('soundEffect');
		switch (type) {
			case 'correct':
				audio.src = 'assets/mp3/correct.mp3';
				break;
			case 'absolutely-right':
				audio.src = 'assets/mp3/absolutely-right.mp3';
				break;
			case 'incorrect':
				audio.src = 'assets/mp3/swoosh.mp3';
				break;
			case 'kick':
			default:
				audio.src = 'assets/mp3/slap.mp3';
		}
	    audio.play();     
	}
};

// once the DOM is all loaded, we're good to go
$(document).ready(function () {
	// initialize game
	game.init();
	// choose the first word
	game.chooseAnswer();
	game.lastAnswer = game.currentAnswer;
	game.determineType(game.currentAnswer);

	// do stuff when key is pressed
	$(document).keyup(function(event) {
		var userGuess = event.key;
		//initialize guess every time key is pressed
		game.correctGuess = false;
		game.alreadyGuessed = false;
		game.isValidKeyPress = false;
		//don't do anything until game resets
		if(!(game.isGameOver && !game.isReset)) {
			game.isReset = false;
			// check key code so ONLY letters are accepted
			game.isValidKeyPress = game.checkKeyPressed(event.keyCode);
			if(game.isValidKeyPress) {
				//check to see if user guessed a new letter
				var isNewGuess = game.checkForNewGuess(userGuess.toUpperCase());
				if(!isNewGuess) {
					game.hideErrors();
					// process guess and update game display if needed
					game.processGuess(userGuess.toUpperCase());
				}
				else {
					game.showErrors();
				}
				// check for win status
				var justWon = game.checkForWinner();
				// if the user guesses a new letter and guesses wrong, reveal more Chuck. Otherwise, play a happy sound.
				if (!game.isGameOver && !isNewGuess && !justWon) {
					if(!game.correctGuess) {
						game.revealChuck();
						if(game.triesLeft > 1) {
							game.playSound('incorrect');
						}
						game.triesLeft--;
						game.updateTriesLeftDisplay();
						if(game.triesLeft < maxTries) {
							$('.overlay-text').fadeOut(200);
						}
					}
					else {
						game.playSound('correct');
					}
				}
				//check to see if game is over
				if(game.checkForGameOver()) {
					//if game is over, wrap things up & reset
					game.postGame();
					if (getPctWidthOfOverlay() < 100) {
						$('#overlay').animate({ maxWidth: '100%' }, 500, function() {
							game.reset();
						});
					}
					else {
						game.reset();
					}
				}
			}
			else {
				game.showErrors();
			}
		}
	})
})