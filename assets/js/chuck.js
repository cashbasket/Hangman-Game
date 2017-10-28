
$(document).ready(function () {
	// initialize sound stuff
	var audioElement = document.createElement('audio');
	audioElement.id = 'soundEffect';
	audioElement.autoPlay = false;
    audioElement.preLoad = true;
    $('body').prepend(audioElement);

    // define array of Chuck words
	var words = ['walker','ranger','kickboxer','roundhouse','hitman','jumpkick','punch','hellbound','texas','braddock'];

	// initialize game object
	var game = { 
		chosenWord: chooseWord(words),
		numTries: 6,
		lettersGotten: [],
		triedLetters: [],
		winner: false,
		gameOver: false,
		wins: 0,
		faceKicks: 0
	};

	// initialize HTML elements
	$('#triesLeft').text(game.numTries);
	$('#wins').text(game.wins);
	$('#faceKicks').text(game.faceKicks);
	$('#tries').text('');

	// time for action
	$(document).keyup(function(event) {
		var userGuess = event.key;
		var correctGuess = false;
		var alreadyGuessed = false;
		$('.results').css('display', 'none');
		

		// if user guesses correctly, display letter(s)
		for(var i=0; i <= game.chosenWord.length - 1; i++) {
			if ($('#letter' + i).text() == '' && game.chosenWord.charAt(i) == userGuess) {
				$('#letter' + i).append(userGuess);
				game.lettersGotten.push(userGuess);
				correctGuess = true;
				$('#letter' + i).css('border-bottom', 'none');
			}
		}

		// check to see if user already guessed the letter
		for(var i=0; i < game.triedLetters.length; i++) {
			if(game.triedLetters[i] == userGuess) {
				alreadyGuessed = true;
				break;
			}
		}

		// if user hasn't already guessed the current letter
		if (!alreadyGuessed) {
			if (!game.winner) {
				if ($('#tries').text() != '') {
					$('#tries').append(', ' + userGuess);
				}
				else {
					$('#tries').append(userGuess);
				}
				game.triedLetters.push(userGuess);
			}			
		}

		if ($('#tries').text() != '') {
			$('#triesHeader').css('display', 'block');
		}

		// if the user has guessed all the letters, then s/he is a winner!
		if(game.lettersGotten.length == game.chosenWord.length)
			game.winner = true;

		// if the user guesses a new letter and guesses wrong, it's Chuck time. Otherwise, play a happy sound.
		if (!game.gameOver && !alreadyGuessed && !game.winner) {
			if(!correctGuess) {
				revealChuck();
				playSound('kick');
				game.numTries--;
				$('#triesLeft').text(game.numTries);
			}
			else {
				playSound('correct');
			}
		}
		
		// if the user wins or runs out of tries, the game is over
		if(game.winner || game.numTries == 0)
			game.gameOver = true;		
		
		// if the game is over...
		if(game.gameOver) {
			$('.results').css('display','block');

			// do winner stuff if user won
			if(game.winner) {
				game.wins++;
				playSound('applause');
				$('#wins').text(game.wins);
				$('.results').css('background-color','#b9ddb4');
				$('.resultText').text('You guessed the word! Chuck is pleased, and as such will not kick you in the face. He wants to keep playing, so he picked a new word for you. Guess away!');
			}
			// kick user in face if user lost
			else {
				game.faceKicks++;
				playSound('kick');
				$('#faceKicks').text(game.faceKicks);
				$('.results').css('background-color', '#eecdcd');
				$('.resultText').text('You made Chuck mad, and have unfortunately been kicked in the face. However, he is letting you try again with a new word!');
			}

			//reset object properties
			game.winner = false;
			game.gameOver = false;
			game.numTries = 6;
			game.triedLetters = [];
			game.lettersGotten = [];

			//reset curtain & game
			if (getPctWidthOfOverlay() != 100) {
				$( "#overlay" ).animate({ width: "100%" }, 500, function() {
					reset(game.numTries);
					game.chosenWord = chooseWord(words);
				});
			}
			else {
				reset(game.numTries);
				game.chosenWord = chooseWord(words);
			}
		}
	})
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reset(tries) {
	$('#word').html('');
	$('#tries').text('');
	$('#triesHeader').css('display', 'none');
	$('#triesLeft').text(tries);
}

function getPctWidthOfOverlay() {
	return parseFloat($('#overlay').width() / $('#chuckHolder').width()) * 100;
}

function revealChuck() {
	var curPct = getPctWidthOfOverlay();
	var newPct = curPct - (100/6);

	$('#overlay').css('width', newPct + "%");
}

function playSound(type) {
	var audio = document.getElementById('soundEffect');
	switch (type) {
		case 'correct':
			audio.src = 'assets/mp3/correct.mp3';
			break;
		case 'applause':
			audio.src = 'assets/mp3/applause.mp3';
			break;
		case 'kick':
		default:
			audio.src = 'assets/mp3/slap.mp3';
	}
    audio.play();     
}

function chooseWord(wordArray) {
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
	return selectedWord;
}