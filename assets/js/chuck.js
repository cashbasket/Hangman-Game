$(document).ready(function () {
	
	var words = [];
	words[0] = ['w','a','l','k','e','r'];
	words[1] = ['r','a','n','g','e','r'];
	words[2] = ['k','i','c','k','b','o','x','e','r'];

	$('#shrinkBlackness').click( function() {
		var curPct = parseFloat($('#blackness').width() / $('#chuckHolder').width()) * 100;
		var newPct = curPct - 20;

		$('#blackness').css('width', newPct + "%");
	}) 
})