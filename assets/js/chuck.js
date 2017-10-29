//global variables
var maxTries = 10;
var words = ['walker','ranger','kickboxer','fighter','roundhouse','hitman','jumpkick','punch','hellbound','texas','braddock','christian','conservative','republican','veteran','patriot','greatest','american','oklahoma','awesome'];
var winnerText = 'You guessed all the letters! Chuck is pleased. He wants to keep playing, though, so he picked a new word for you. Guess away!';
var loserText = 'You ran out of tries, and have therefore been kicked in the face. However, Chuck just thought up a new word! Do not disappoint him again.';
var instructions = 'Press any letter key to get started!';

//global math functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPctWidthOfOverlay() {
	return parseFloat($('#overlay').width() / $('#chuckHolder').width()) * 100;
}

//initialize game object
var game = { 
	currentWord: '',
	lastWord: '',
	triesLeft: maxTries,
	lettersGotten: [],
	triedLetters: [],
	winner: false,
	gameOver: false,
	wins: 0,
	faceKicks: 0,
	init: function() {
		$('#triesLeft').text(maxTries);
		$('#wins').text(this.wins);
		$('#faceKicks').text(this.faceKicks);
		$('#maxTries').text(maxTries + ' times');
		$('#tries').text('');
		$('.results').hide();
		$('#overlay').text(instructions);
	},
	chooseWord: function(wordArray) {
		var randomIndex = getRandomInt(0, wordArray.length - 1);
		var selectedWord = wordArray[randomIndex];
		$('#word').html('');
		var letterBox = document.createElement('span');
		letterBox.setAttribute('class', 'letterbox');
		letterBox.id = 'letter0';
		$('#word').append(letterBox);

		for(var i=0; i < selectedWord.length - 1; i++) {
			var nextLetter = $('#letter' + i).clone();
			nextLetter.attr('id', 'letter' + (i+1));
			nextLetter.appendTo('#word');
		}
		this.currentWord = selectedWord;
	},
	reset: function() {
		//reset object properties
		this.winner = false;
		this.gameOver = false;
		this.triesLeft = maxTries;
		this.triedLetters = [];
		this.lettersGotten = [];
		$('#tries').text('');
		$('#triesHeader').hide();
		$('#triesLeft').text(maxTries).css('color', '#fff');
		$('#overlay').text(instructions);
		this.lastWord = this.currentWord;
		//choose new word
		this.chooseWord(words);
		//checks to make sure the new word isn't the same as the previous word
		for(;;) {
			if (this.currentWord == this.lastWord) {
				this.chooseWord(words);
			}
			else {
				break;
			}
		}
	},
	revealChuck: function() {
		var curPct = getPctWidthOfOverlay();
		var newPct = curPct - (100/maxTries);
		$('#overlay').css('width', newPct + "%");
	},
	playSound: function(type) {
		var audio = document.getElementById('soundEffect');
		switch (type) {
			case 'correct':
				audio.src = 'assets/mp3/correct.mp3';
				break;
			case 'applause':
				audio.src = 'assets/mp3/applause.mp3';
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
	game.chooseWord(words);
	game.lastWord = game.currentWord;

	// do lots of stuff when key is pressed
	$(document).keyup(function(event) {
		var userGuess = event.key;
		var correctGuess = false;
		var alreadyGuessed = false;

		// check key code so ONLY letters are accepted
		if((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
			$('#overlay').text('');

			// check to see if user already guessed the letter
			for(var i=0; i < game.triedLetters.length; i++) {
				if(game.triedLetters[i] == userGuess.toUpperCase()) {
					alreadyGuessed = true;
					break;
				}
			}
			
			if(!alreadyGuessed) {
				// display letters when guessed correctly
				for(var i=0; i <= game.currentWord.length - 1; i++) {
					if ($('#letter' + i).text() == '' && game.currentWord.charAt(i) == userGuess.toLowerCase()) {
						$('#letter' + i).append(userGuess.toLowerCase());
						game.lettersGotten.push(userGuess.toUpperCase());
						correctGuess = true;
						$('#letter' + i).css('border-bottom', 'none');
					}
				}
				// update list/array of tried letters
				if (!game.winner) { 
					$('#tries').append(userGuess.toUpperCase() + ' ');
					game.triedLetters.push(userGuess.toUpperCase());
				}
			}

			// display the "tried letters" header after the first guess
			if ($('#tries').text().length == 2) {
				$('#triesHeader').show();
			}

			// if the user has guessed all the letters, then s/he is a winner!
			if(game.lettersGotten.length == game.currentWord.length) {
				game.winner = true;
			}

			// if the user guesses a new letter and guesses wrong, reveal more Chuck. Otherwise, play a happy sound.
			if (!game.gameOver && !alreadyGuessed && !game.winner) {
				if(!correctGuess) {
					game.revealChuck();
					if(game.triesLeft > 1) {
						game.playSound('incorrect');
					}
					game.triesLeft--;
					$('#triesLeft').text(game.triesLeft);
					if (game.triesLeft <= maxTries/2) {
						$('#triesLeft').css('color', '#f00');
					}
				}
				else {
					game.playSound('correct');
				}
			}
			
			// if the user wins or runs out of tries, the game is over
			if(game.winner || game.triesLeft == 0)
				game.gameOver = true;		
			
			// if the game is over...
			if(game.gameOver) {
				// ... congratulate user if user won
				if(game.winner) {
					game.wins++;
					game.playSound('applause');
					$('#wins').text(game.wins);
					$('.results-panel').css('background-color','#b9ddb4');
					$('.result-text').css('color', '#317a27').text(winnerText);
				}
				// ... kick user in face if user lost
				else {
					game.faceKicks++;
					game.playSound('kick');
					$('#faceKicks').text(game.faceKicks);
					$('.results-panel').css('background-color', '#eecdcd');
					$('.result-text').css('color', '#be1c1c').text(loserText);
				}

				// display result and reset game
				if (getPctWidthOfOverlay() < 100) {
					$('#overlay').animate({ width: '100%' }, 500, function() {
						$('.results').slideDown().delay(7000).slideUp();
						game.reset();
					});
				}
				else {
					$('.results').slideDown().delay(7000).slideUp();
					game.reset();
				}
			}
		}
	})
})