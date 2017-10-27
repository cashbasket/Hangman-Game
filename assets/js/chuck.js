
$(document).ready(function () {
	$('#shrinkBlackness').click( function() {
		var curPct = parseFloat($('#blackness').width() / $('#chuckHolder').width()) * 100;
		var newPct = curPct - 20;


			$('#blackness').css('width', newPct + "%");

	}) 
})	
