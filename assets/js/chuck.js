
$(document).ready(function () {
	// initialize sound stuff
	var obj = document.createElement('audio');
	obj.id = 'soundEffect';
	obj.autoPlay = false;
    obj.preLoad = true;
    $('body').prepend(obj);

    // set array of Chuck-related words
    var words = [];
	words[0] = ['w','a','l','k','e','r'];
	words[1] = ['r','a','n','g','e','r'];
	words[2] = ['k','i','c','k','b','o','x','e','r'];
	words[3] = ['r','o','u','n','d','h','o','u','s','e'];
	words[4] = ['h','i','t','m','a','n'];
	words[5] = ['j','u','m','p','k','i','c','k'];
	words[6] = ['p','u','n','c','h'];
	words[7] = ['h','e','l','l','b','o','u','n','d'];
	words[8] = ['t','e','x','a','s'];
	words[9] = ['b','r','a','d','d','o','c','k'];

	// create global variables and initialize
	var chosenWord = chooseWord(words);	
	var triedLetters = [];
	var lettersGotten = [];
	var numTries = 10;
	var winner = false;
	var gameOver = false;
	var wins = 0;
	var faceKicks = 0;

	// initialize HTML elements
	$('#triesLeft').text(numTries);
	$('#wins').text(wins);
	$('#faceKicks').text(faceKicks);
	$('#tries').text('');


	// this is the fun part
	$(document).keyup(function(event) {
		var userGuess = event.key;
		var correctGuess = false;
		var alreadyGuessed = false;
		$('.results').css('display', 'none');
		$('#triesLeft').text(numTries);

		// if user guesses correctly, display letter(s)
		for(var i=0; i <= chosenWord.length - 1; i++) {
			if ($('#letter' + i).text() == '' && chosenWord[i] == userGuess) {
				$('#letter' + i).append(userGuess);
				lettersGotten.push(userGuess);
				correctGuess = true;
				$('#letter' + i).css('border-bottom', 'none');
			}
		}

		// check to see if user already guessed the letter
		for(var i=0; i < triedLetters.length; i++) {
			if(triedLetters[i] == userGuess) {
				alreadyGuessed = true;
				break;
			}
			if (i == triedLetters.length - 1 && !alreadyGuessed) {
				// add letter to guessed letters array
				triedLetters.push(userGuess);
			}
		}

		// add user's guess to list of tried letters
		if (!alreadyGuessed && !winner) {
			if ($('#tries').text() != '') {

				$('#tries').append(', ' + userGuess);
			}
			else {
				$('#tries').append(userGuess);
			}
		}

		if ($('#tries').text() != '') {
			$('#triesHeader').css('display', 'block');
		}

		// if the user has guessed all the letters, then s/he is a winner!
		if(lettersGotten.length == chosenWord.length)
			winner = true;

		// if the user guesses a new letter and guesses wrong, it's Chuck time
		if (!gameOver && !alreadyGuessed && !correctGuess && !winner) {
			revealChuck();
			playSound('kick');
			numTries--;
		}
		
		// if the user wins or runs out of tries, the game is over
		if(winner || numTries == 0)
			gameOver = true;		
		
		if(gameOver) {
			$('.results').css('display','block');

			// do winner stuff
			if(winner) {
				wins++;
				playSound('applause');
				$('#wins').text(wins);
				$('.results').css('background-color','#b9ddb4');
				$('.resultText').text('You guessed the word! Chuck is pleased, and as such will not kick you in the face. He wants to keep playing, so he picked a new word for you. Guess away!');
			}
			// kick user in face
			else {
				faceKicks++;
				playSound('kick');
				$('#faceKicks').text(faceKicks);
				$('.results').css('background-color', '#eecdcd');
				$('.resultText').text('You made Chuck mad, and have unfortunately been kicked in the face. However, he is letting you try again with a new word!');
			}

			//reset everything and pick a new word
			winner = false;
			gameOver = false;
			numTries = 10;
			triedLetters = [];
			lettersGotten = [];
			$('#word').html('');
			$('#tries').text('');
			$('#triesHeader').css('display', 'none');
			$('#blackness').css('width', '100%');
			$('#triesLeft').text(numTries);
			chosenWord = chooseWord(words);
		}
	})
})

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function revealChuck() {
	var curPct = parseFloat($('#blackness').width() / $('#chuckHolder').width()) * 100;
	var newPct = curPct - 10;

	$('#blackness').css('width', newPct + "%");
}

function playSound(type) {
	var audio = document.getElementById('soundEffect');
	if (type == 'correct') 
    	audio.src='assets/mp3/whiff.mp3';
    else if (type == 'kick')
    	audio.src='assets/mp3/slap.mp3'; 
    else if (type == 'applause')
    	audio.src='assets/mp3/applause.mp3';
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