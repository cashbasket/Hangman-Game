//global variables / text I want to be able to find and edit easily
var maxTries = 10;
var answers = ['walker texas ranger','martial artist','roundhouse kick','the hitman','the delta force','flying kick','uppercut','hellbound','missing in action','christian','conservative','republican','military man','patriot','greatest person ever','american hero','oklahoma rules','the most awesome human','firewalker','karate master','code of silence','the expendables 2','the colombian connection','sidekicks','the octagon','eye for an eye','forced vengeance','silent rage'];
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

//initialize game object
var game = { 
	currentAnswer: '',
	lastAnswer: '',
	correctGuess: false,
	wasLetterGuessed: false,
	alreadyGuessed: false,
	triesLeft: maxTries,
	lettersGotten: [],
	triedLetters: [],
	winner: false,
	gameOver: false,
	wins: 0,
	faceKicks: 0,
	isReset: false,
	init: function() {
		//set audio volume
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
		this.lettersGotten = [];
		//select random answer from answers array
		var selectedAnswer = answers[getRandomInt(0, answers.length - 1)];
		//clear out word div
		$('#word').html('');
		//create new span for letter
		var letterBox = document.createElement('span');
		letterBox.setAttribute('class', 'letterbox');
		letterBox.id = 'letter0';
		$('#word').append(letterBox);
		//add new letter span for each character in new word
		for(var i=0; i < selectedAnswer.length - 1; i++) {
			var nextLetter = $('#letter' + i).clone();
			nextLetter.attr('id', 'letter' + (i+1));
			nextLetter.appendTo('#word');
			if(selectedAnswer.charAt(i) == ' ') {
				$('#letter' + i).css('border-bottom', 'none');
			}
		}
		this.currentAnswer = selectedAnswer;
		//whenever there's a space in an answer, append them to required spans and add to lettersGotten array
		for(var i=0; i <= this.currentAnswer.length - 1; i++) {
			if(this.currentAnswer.charAt(i) == ' ') {
				$('#letter' + i).append(' ');
				this.lettersGotten.push(' ');
			}
		}
	},
	updateTriesLeftDisplay: function () {
		var triesSuffix = this.triesLeft > 1 ? ' tries remaining' : ' try remaining';
		$('#triesLeft').text(this.triesLeft + triesSuffix);
		if (this.triesLeft <= maxTries/2) {
			$('#triesLeft').css('color', '#ffcc00');
		}	
	},
	updateTriedLetters: function(guess) {
		if (!this.winner) {
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
	showErrors: function() {
		if(this.wasLetterGuessed) {
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
	checkForLetter: function(guessCode) {
		if((event.keyCode >= 48 && event.keyCode <= 57) || (guessCode >= 65 && guessCode <= 90) || (guessCode >= 97 && guessCode <= 122)) {
			this.wasLetterGuessed = true;
		}
		return this.wasLetterGuessed;
	},
	checkForWinner: function() {
		if(this.lettersGotten.length == this.currentAnswer.length) {
			this.winner = true;
		}
		return this.winner;
	},
	checkForGameOver: function() {
		if(this.winner || this.triesLeft == 0) {
			this.gameOver = true;	
		}
		return this.gameOver;
	},
	displayLetters: function(guess) {
		for(var i=0; i <= this.currentAnswer.length - 1; i++) {
			if ($('#letter' + i).text() == '' && this.currentAnswer.charAt(i) == guess.toLowerCase()) {
				$('#letter' + i).append(guess.toLowerCase());
				this.lettersGotten.push(guess.toUpperCase());
				this.correctGuess = true;
				$('#letter' + i).css('border-bottom', 'none');
			}
		}
	},
	updateStats: function() {
		if (this.winner) {
			$('.wins').text(this.wins);
		}
		else {
			$('.face-kicks').text(this.faceKicks);
		}
	},
	postGame: function() {
		// congratulate user if user won
		if(this.winner) {
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
	showResults: function(status) {	
		if (this.winner) {
			$('.results').css('background-color','#b9ddb4')
						 .css('border-color','#317a27');
			$('.result-text').css('color', '#317a27')
							 .text(winnerText);
		}
		else {
			$('.results').css('background-color', '#eecdcd')
						 .css('border-color','#be1c1c');
			$('.result-text').css('color', '#be1c1c')
							 .text(loserText);
		}
		$('.results').slideDown().delay(7000).slideUp();
	},
	reset: function() {
		//reset object properties
		this.correctGuess = false;
		this.alreadyGuessed = false;
		this.wasLetterGuessed = false;
		this.winner = false;
		this.gameOver = false;
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
		if(this.currentAnswer.indexOf(' ') > 0) {
			$('#answerType').text('phrase');
		}
		else {
			$('#answerType').text('word');
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
		$('#overlay').animate({ maxWidth: newPct + "%"},200);
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
	// initialize HTML elements
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
		game.wasLetterGuessed = false;

		if(game.gameOver && !game.isReset) {
			// don't do nothin' until game resets
		}
		else {
			game.isReset = false;
			// check key code so ONLY letters are accepted
			game.wasLetterGuessed = game.checkForLetter(event.keyCode);
			if(game.wasLetterGuessed) {
				//check to see if user guessed a new letter
				var isNewGuess = game.checkForNewGuess(userGuess.toUpperCase());
				if(!isNewGuess) {
					game.hideErrors();
					// display letters when guessed correctly
					game.displayLetters(userGuess.toUpperCase());
					// update list/array of tried letters
					game.updateTriedLetters(userGuess.toUpperCase());
				}
				else {
					game.showErrors();
				}
				// check for win status
				var isWinner = game.checkForWinner();
				// if the user guesses a new letter and guesses wrong, reveal more Chuck. Otherwise, play a happy sound.
				if (!game.gameOver && !isNewGuess && !isWinner) {
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