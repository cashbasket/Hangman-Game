//global variables
var maxTries = 6;
var words = ['walker','ranger','kickboxer','roundhouse','hitman','jumpkick','punch','hellbound','texas','braddock','dragon','christian','conservative','veteran','champion','greatest'];
var winnerText = 'Chuck is pleased, and will therefore not kick you in the face. He wants to keep playing, though, so he picked a new word for you. Guess away!';
var loserText = 'You have been kicked in the face. However, Chuck is letting you try again with a new word! Do not disappoint him.';


//initialize game object
var game = { 
	chosenWord: '',
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
		$('#maxTries').text(maxTries);
		$('#tries').text('');
		$('.results').hide();
		$('#overlay').text('Press any key to get started!');
	},
	chooseWord: function(wordArray) {
		var randomIndex = getRandomInt(0, wordArray.length - 1);
		var selectedWord = wordArray[randomIndex];
		var letterBox = document.createElement('span');
		letterBox.setAttribute('class', 'letterbox');
		letterBox.id = 'letter0';
		$('#word').append(letterBox);

		for(var i=0; i < selectedWord.length - 1; i++) {
			var nextLetter = $('#letter' + i).clone();
			nextLetter.attr('id', 'letter' + (i+1));
			nextLetter.appendTo('#word');
		}
		this.chosenWord = selectedWord;
	},
	reset: function() {
		//reset object properties
		this.winner = false;
		this.gameOver = false;
		this.triesLeft = maxTries;
		this.triedLetters = [];
		this.lettersGotten = [];
		$('#word').html('');
		$('#tries').text('');
		$('#triesHeader').css('display', 'none');
		$('#triesLeft').text(maxTries);
		this.chooseWord(words);
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



// once the DOM is all loaded, do stuff
$(document).ready(function () {
	// initialize HTML elements
	game.init();

	// choose the first word
	game.chooseWord(words);

	$(document).keyup(function(event) {
		var userGuess = event.key;
		var correctGuess = false;
		var alreadyGuessed = false;
		$('.results').hide();
		$('#overlay').text('');

		// check to see if user already guessed the letter
		for(var i=0; i < game.triedLetters.length; i++) {
			if(game.triedLetters[i] == userGuess.toUpperCase()) {
				alreadyGuessed = true;
				break;
			}
		}
		
		if(!alreadyGuessed) {
			for(var i=0; i <= game.chosenWord.length - 1; i++) {
				if ($('#letter' + i).text() == '' && game.chosenWord.charAt(i) == userGuess.toLowerCase()) {
					$('#letter' + i).append(userGuess.toLowerCase());
					game.lettersGotten.push(userGuess.toUpperCase());
					correctGuess = true;
					$('#letter' + i).css('border-bottom', 'none');
				}
			}
			if (!game.winner) { 
				if ($('#tries').text() != '') {
					$('#tries').append(', ' + userGuess.toUpperCase());
				}
				else {
					$('#tries').append(userGuess.toUpperCase());
				}
				game.triedLetters.push(userGuess.toUpperCase());
			}
		}

		// display the "tried letters" header after the first guess
		if ($('#tries').text().length == 1) {
			$('#triesHeader').css('display', 'block');
		}

		// if the user has guessed all the letters, then s/he is a winner!
		if(game.lettersGotten.length == game.chosenWord.length) {
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
			// ... do winner stuff if user won
			if(game.winner) {
				game.wins++;
				game.playSound('applause');
				$('#wins').text(game.wins);
				$('.result-well').css('background-color','#b9ddb4');
				$('.result-text').css('color', '#317a27').text(winnerText);
			}
			// ... kick user in face if user lost
			else {
				game.faceKicks++;
				game.playSound('kick');
				$('#faceKicks').text(game.faceKicks);
				$('.result-well').css('background-color', '#eecdcd');
				$('.result-text').css('color', '#f00').text(loserText);
			}

			// reset
			if (getPctWidthOfOverlay() != 100) {
				$( "#overlay" ).animate({ width: "100%" }, 500, function() {
					$('.results').slideDown();
					game.reset();
					$('#overlay').text('Press any key to get started!');
				});
			}
			else {
				$('.results').slideDown();
				game.reset();
				$('#overlay').text('Press any key to get started!');
			}
		}
	})
})

//math functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPctWidthOfOverlay() {
	return parseFloat($('#overlay').width() / $('#chuckHolder').width()) * 100;
}