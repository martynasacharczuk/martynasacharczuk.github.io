
var turn = 'X';
var game_type = 3;
var total_turns = 0;
var robot = true;
var finished = false;

var selections = new Array(); 
	selections['X'] = new Array();
	selections['Y'] = new Array();

var scores = new Array(); 
	scores['X'] = 0;
	scores['Y'] = 0;

// Resetting parameters on reseting game
function resetParams() {
	turn = 'X';
	game_type = 3;
	total_turns = 0;
	robot = true;
	finished = false;

	selections['X'] = new Array();
	selections['Y'] = new Array();
}


// Change turn after another
function changeTurn(){
	if (turn == 'X') turn = 'Y';
	else turn = 'X';
}


// Winner patterns, match selected patterns on every turn for every player
function winnerPatterns() {
	var wins = Array();

	// 3 x 3 winning patterns;
	if (game_type==3) wins = [ 
								[11,12,13], [21,22,23], [31,32,33],
						 		[11,21,31], [12,22,32], [13,23,33], 
						 		[11,22,33], [13,22,31]
						 	];
	return wins
}


// Robot patterns, for auto players of every game board
function DefaultRobotPatterns() {
	var robot_turns = Array();

	// 3 x 3 winning patterns;
	if (game_type==3) robot_turns = [22,11,33,13,21,23,12,32,31];

	return robot_turns
}


// Checking winner of selected type on selection
function checkWinner() {

	var selected = selections[turn].sort();
	var win_patterns = winnerPatterns();

	finished = false;
	for (var x=0; x < win_patterns.length; x++) {
		
		if (finished != true) { 
			finished = isWinner(win_patterns[x], selections[turn]);

			if ( finished === true ) {
				
				scoreUpdate(turn);
				disableAllBoxes();

				alert('Player '+turn+' Won !!');
				
				break;
			} 
		}
	}

	// If no one wins; declare DRAW
	if ( ( total_turns == (game_type*game_type) ) && finished === false ) { 
		alert('Game Draw!');
		finished = true;
		disableAllBoxes(); 
	}
}


// Verifying each selections with winning pattern
function isWinner(win_pattern, selections){

	var match = 0;

	for (var x=0; x<win_pattern.length; x++) {
		for (var y=0; y<selections.length; y++) {
			if (win_pattern[x]==selections[y]) {
				match++;
			}
		}
	}

	if (match==win_pattern.length) return true;

	return false;
}

function disableAllBoxes() {

	var elements = document.getElementsByClassName("grid-box");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].disabled =true;
	}

}


// Resetting autoplayer to true on change games
function resetAIButton() {
	var checkbox = document.getElementById('robot'); 	
	checkbox.checked = 'checked';
}

function generateGame(){

	resetParams();
	game_type = 3;
	robot_object = document.getElementById('robot'); 
	if (robot_object.checked === true) robot = true; 
	else  robot = false;

	// Clearing board for new game
	document.getElementById('game-board').innerHTML = '';

	// Generating board
	for (var row = 1; row <= 3; row++){
		for (var col = 1; col <= 3; col++) {
			var unique_name = 'grid-'+row+'-'+col;
			var unique_id = row+''+col;
			var button = document.createElement("input");

			button.setAttribute("value", ' ');
			button.setAttribute("id", unique_id);
			button.setAttribute("name", unique_name);
			button.setAttribute("class", 'grid-box');
			button.setAttribute("type", 'button');
			button.setAttribute("onclick", "markCheck(this)");
			document.getElementById('game-board').appendChild(button);
		}

		var breakline = document.createElement("br");
			document.getElementById('game-board').appendChild(breakline);
	}

}

function markCheck(obj){

	obj.value = turn;
	total_turns++;

	if (turn == 'X' ) {
		obj.setAttribute("class", 'green-player');
	} else {
		obj.setAttribute("class", 'red-player');
	}

	obj.setAttribute("disabled", 'disabled');
	selections[turn].push(Number(obj.id));

	checkWinner();
	changeTurn();

	if (robot===true) autoTurn();
}

function autoTurn(again=false) {

	is_empty_result = true;

	if (turn === 'X' || finished === true) return false;

	var robot_pattern = '';
	if (again==true) robot_pattern = DefaultRobotPatterns();
	else robot_pattern = getAutoTurnPattern(); 

	for(var x = 0; x < robot_pattern.length; x++) {
		var desired_obj = document.getElementById(robot_pattern[x]);
		if (desired_obj.value == '' || desired_obj.value == ' ') { 
			markCheck(desired_obj); 
			is_empty_result = false;
			break;
		} 
	}

}

function getAutoTurnPattern() {

	var pattern = [];
	pattern = getMostNearestPattern('Y');
	if (pattern.length <= 0) {
		pattern = getMostNearestPattern('X');
		if (pattern.length <= 0) {
			pattern = DefaultRobotPatterns();
		}
	}

	return pattern;
	
}

function getMostNearestPattern(turn){

	var matches = 0;

	var selected = selections[turn].sort();
	var win_patterns = winnerPatterns();

	finished = false;
	for (var x=0; x < win_patterns.length; x++) {
		var intersected = intersectionArray(selected, win_patterns[x]);

		if ( intersected.length==(win_patterns[x].length-1) ) {

			for (var y=0; y < win_patterns[x].length; y++) {
				obj = document.getElementById(win_patterns[x][y]);
				if (obj.value == '' || obj.value == ' ') {
					return win_patterns[x];	
				}
			}
		}

	}
	return [];
}

function intersectionArray(x, y){

    var response = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                response.push(x[i]);
                break;
            }
        }
    }
    return response;

}


function scoreUpdate(turn){
	scores[turn]++;
	document.getElementById('score-'+turn).innerHTML = scores[turn];
}