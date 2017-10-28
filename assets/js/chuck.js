
$(document).ready(function () {
	// initialize sound stuff
	var obj = document.createElement('audio');
	obj.id = 'soundEffect';
	obj.autoPlay = false;
    obj.preLoad = true;
    $('body').prepend(obj);

    // set array of arrays
    var words = [];
	words[0] = ['w','a','l','k','e','r'];
	words[1] = ['r','a','n','g','e','r'];
	words[2] = ['k','i','c','k','b','o','x','e','r'];
	words[3] = ['r','o','u','n','d','h','o','u','s','e'];
	words[4] = ['h','i','t','m','a','n'];
	words[5] = ['j','u','m','p','k','i','c','k'];

	var chosenWord = chooseWord(words);	
	var triedLetters = [];
	var lettersGotten = [];
	var numTries = 10;
	var winner = false;
	var gameOver = false;
	$('#tries').text('');

	$(document).keyup(function(event) {
		var userGuess = event.key;
		var correctGuess = false;
		var alreadyGuessed = false;
		$('.results').css('display', 'none');

		for(var i=0; i <= chosenWord.length - 1; i++) {
			if ($('#letter' + i).text() == '' && chosenWord[i] == userGuess) {
				$('#letter' + i).append(userGuess);
				lettersGotten.push(userGuess);
				correctGuess = true;
				$('#letter' + i).css('border-bottom', 'none');
			}
		}

		triedLetters.push(userGuess);

		if(triedLetters.length == 1) {
			$('#triesHeader').css('display', 'block');
		}
		for(var i=0; i < triedLetters.length - 1; i++) {
			if(triedLetters[i] == userGuess)
				alreadyGuessed = true;
		}

		if (!alreadyGuessed && !winner) {
			if ($('#tries').text() != '') {
				$('#tries').append(', ' + userGuess);
			}
			else {
				$('#tries').append(userGuess);
			}
		}

		if(lettersGotten.length == chosenWord.length)
			winner = true;

		if (!gameOver && !alreadyGuessed && !correctGuess && !winner) {
			revealChuck();
			playSound('kick');
			numTries--;
		}
		
		if(winner || numTries == 0)
			gameOver = true;		
			
		if(gameOver) {
			$('.results').css('display','block');

			if(winner)
				$('.resultText').text('You guessed the word! Chuck is pleased, and as such will not kick you in the face. He wants to keep playing, so he picked a new word for you. Guess away!');
			else
				$('.resultText').text('You made Chuck mad, and have unfortunately been kicked in the face. However, he is letting you try again with a new word!');
			winner = false;
			gameOver = false;
			numTries = 10;
			triedLetters = [];
			lettersGotten = [];
			$('#word').html('');
			$('#tries').text('');
			$('#triesHeader').css('display', 'none');
			$('#blackness').css('width', '100%');
			chosenWord = chooseWord(words);
		}

		console.log(gameOver + ', ' + winner + ', ' + numTries);
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