//global variables / text I want to be able to find and edit easily
var maxTries = 10;
var answers = ['walker, texas ranger','martial artist','roundhouse kick','the hitman','the delta force','flying kick','hellbound','missing in action','knockout punch','devout christian','conservative','republican','military man','patriot','greatest person ever','american hero','oklahoma rules','the most awesome living human','firewalker','karate master','code of silence','the expendables 2','the colombian connection','sidekicks','the octagon','eye for an eye','forced vengeance','silent rage','trial by fire','invasion u.s.a.','lone wolf mcquade','the way of the dragon','a force of one','karate kommandos'];
var specialCharacters = [' ',',','.',':','\'','-'];
var winnerText = 'You got it! Chuck is pleased. He wants to keep playing, though, so he picked something else for you.';
var loserText = 'Chuck got real mad, so you have just been kicked in the face. However, he wants you to try again on something new.';
var factHeader = '<span class="fact-header">Fact:</span>';
var facts = ['Chuck Norris was bitten by a cobra, and after five days of excruciating pain, the cobra died.','Chuck Norris once kicked a horse in the chin. Its descendants today are known as giraffes.','Chuck Norris doesn\'t breathe air; he holds air hostage.','When Chuck Norris turned 18, his parents moved out.','Chuck Norris doesn\'t dial the wrong number; you answer the wrong phone.','If Chuck Norris were a Spartan in the movie "300," the movie would be called "1."','Chuck Norris is currently suing NBC, claiming "Law" and "Order" are trademarked names for his left and right legs.','Chuck Norris will never have a heart attack; his heart isn\'t nearly foolish enough to attack him.','Chuck Norris can kill two stones with one bird.','Chuck Norris does not sleep; he waits.','The easiest way to determine Chuck Norris\' age is to cut him in half and count the rings.','There is no chin underneath Chuck Norris\' beard; there is only another fist.'];
var alreadyGuessedError = 'You already tried that one!';
var invalidGuessError = 'Only letter and number keys are allowed.';
var instructionText = 'Press a letter or number key to get started!';

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
	triesLeft: maxTries,
	charsGotten: 0,
	triedLetters: [],
	answersLeft: answers,
	wins: 0,
	losses: 0,
	isReset: false,
	init: function() { 
		var audio = document.getElementById('soundEffect');
		audio.volume = 0.8;
		audio.preload = true;
		$('#triesLeft').text(maxTries + ' tries remaining');
		$('.wins').text(this.wins);
		$('.losses').text(this.losses);
		$('#maxTriesText').text(maxTries + ' times');
		$('#tries').text('None').css('color','#ffcc00');
		$('.results').hide();
		$('.overlay-text').html(factHeader + '<br>' + this.getRandomFact()).fadeIn(200);
		$('.errors').hide();
		$('.get-started').text(instructionText);

		this.currentAnswer = this.chooseAnswer();
		this.prepareGameDisplay(this.currentAnswer);
	},
	getRandomFact: function() {
		var selectedFact = facts[getRandomInt(0, facts.length - 1)];
		return selectedFact;
	},
	chooseAnswer: function() {
		//reset charsGotten every time!
		this.charsGotten = 0;
		//select random answer from answersLeft array
		var selectedAnswer = this.answersLeft[getRandomInt(0, this.answersLeft.length - 1)];
		//remove selected answer from answersLeft array
		this.answersLeft.splice(this.answersLeft.indexOf(selectedAnswer), 1);

		return selectedAnswer;
	},
	prepareGameDisplay: function(answer) {
		var displayed = answer;
		//replace all non-special characters in answer with underscores
		for(var i=0; i < answer.length; i++) {
			if(!specialCharacters.includes(answer.charAt(i)))
				displayed = displayed.replaceAt(i, '_');
			else {
				//add special characters to characters gotten total
				this.charsGotten++;
			}
		}
		$('.word').text(displayed);

		//display either "current word" or "current phrase" depending on how many words are in the answer
		if(answer.indexOf(' ') > 0) {
			$('#answerType').text('phrase');
		}
		else {
			$('#answerType').text('word');
		}
	},
	processGuess: function(guess) {
		var displayed = $('.word').text();
		var correctGuess = false;
		// update word/phase with guess if correct
		for(var i=0; i < this.currentAnswer.length; i++) {
			if (this.currentAnswer.charAt(i) == guess.toLowerCase()) {
				displayed = displayed.replaceAt(i, guess.toUpperCase());
				this.charsGotten++;
				correctGuess = true;
			}
		}
		$('.word').text(displayed);

		// update tried letters
		if (!this.checkForWinner()) {
			if($('#tries').text() == 'None') {
				$('#tries').text('').css('color','#fff');
			} 
			if(this.triedLetters.length >= 1) {
				$('#tries').append(', ');
			}
			$('#tries').append(guess.toUpperCase());
			this.triedLetters.push(guess.toUpperCase());
		}
		$('#gameDisplay').removeClass('pulsate');

		if(!correctGuess) {
			this.openCurtain();
			if(this.triesLeft > 1) {
				this.playSound('incorrect');
			}
			this.triesLeft--;
			this.updateTriesLeftDisplay();
			if(this.triesLeft < maxTries) {
				$('.overlay-text').fadeOut(200);
			}
		}
		else {
			this.playSound('correct');
		}
	},
	updateTriesLeftDisplay: function () {
		var triesSuffix = this.triesLeft > 1 ? ' tries remaining' : ' try remaining';
		$('#triesLeft').text(this.triesLeft + triesSuffix);
		if (this.triesLeft <= parseFloat(maxTries/2)) {
			$('#triesLeft').css('color', '#ffcc00');
		}	
	},
	showErrors: function(type) {
		switch(type) {
			case 'already-guessed':
				$('.errors > span').text(alreadyGuessedError);
				break;
			case 'invalid-guess':
			default:
				$('.errors > span').text(invalidGuessError);
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
				return true;
			}
		}
		return false;
	},
	checkForValidKeyCode: function(keyCode) {
		if((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
			return true;
		}
		return false;
	},
	checkForWinner: function() {
		if(this.charsGotten == this.currentAnswer.length) {
			return true;
		}
		return false;
	},
	checkForGameOver: function() {
		if(this.checkForWinner() || this.triesLeft == 0) {
			return true;
		}
		return false;
	},
	updateStats: function() {
		if (this.checkForWinner()) {
			$('.wins').text(this.wins);
		}
		else {
			$('.losses').text(this.losses);
		}
	},
	showResults: function() {	
		if (this.checkForWinner()) {
			$('.results').css('background-color','#b9ddb4');
			$('.result-text').css('color', '#317a27').text(winnerText);
		}
		else {
			$('.results').css('background-color', '#eecdcd');
			$('.result-text').css('color', '#be1c1c').text(loserText);
		}
		$('.results').slideDown().delay(7000).slideUp();
	},
	openCurtain: function() {
		var curPct = getPctWidthOfOverlay();
		var newPct = curPct - parseFloat(100/maxTries);
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
	},
	reset: function() {
		this.triesLeft = maxTries;
		this.triedLetters = [];
		$('.word').text('');
		$('#gameDisplay').addClass('pulsate');
		$('#tries').text('None').css('color','#ffcc00');
		$('#triesLeft').text(maxTries + ' tries remaining').css('color', '#fff');
		$('.overlay-text').html(factHeader + '<br>' + this.getRandomFact()).fadeIn(200);
		//if all answers have been used, repopulate array
		if(this.answersLeft.length == 0) {
			this.answersLeft = answers;
		}
		//choose new word
		this.currentAnswer = this.chooseAnswer();
		this.prepareGameDisplay(this.currentAnswer);
		this.isReset = true;
	},
	onGuess: function (keyCode) {
		var key = String.fromCharCode(keyCode);
		var alreadyGuessed;

		//don't do anything until game resets
		if(!(this.checkForGameOver() && !this.isReset)) {
			this.isReset = false;
			// check key code so ONLY letters are accepted
			if(this.checkForValidKeyCode(keyCode)) {
				//check to see if user guessed a new letter
				alreadyGuessed = this.checkForNewGuess(key.toUpperCase());
				if(!alreadyGuessed) {
					this.hideErrors();
					//if it's a new letter, process the guess
					this.processGuess(key.toUpperCase());
				}
				else {
					//otherwise, let 'em know they already guessed that letter
					this.showErrors('already-guessed');
				}

				//check to see if guess results in game over
				if(this.checkForGameOver()) {
					// congratulate user if user won
					if(this.checkForWinner()) {
						this.wins++;
						this.playSound('absolutely-right');
					}
					// kick user in face if user lost
					else {
						this.losses++;
						this.playSound('kick');
					}

					// update wins/losses and show results
					this.updateStats();
					this.showResults();	
					
					return true;
				}
				else {
					return false;
				}
			}
			else {
				this.showErrors('invalid-guess');
			}
		}
	}
};

// once the DOM is all loaded, we're good to go
$(document).ready(function () {
	// initialize game for first time
	game.init();
	// do stuff when key is pressed
	$(document).keyup(function(event) {
		//after key is pressed, check to see if the guess results in game over
		var over = game.onGuess(event.keyCode);
		//if game is over, reset game
		if (over) {
			// if the curtain isn't closed, close it and THEN reset the game
			if(getPctWidthOfOverlay() < 100)
				$('#overlay').animate({ maxWidth: '100%' }, 500, function() {
					game.reset();
				});
			// otherwise, just reset the game
			else {
				game.reset();
			}
		}
	})
})