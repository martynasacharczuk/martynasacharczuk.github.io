
(function(){
	
	var state = 1;
	var puzzle = document.getElementById('puzzle');

	solve();

	puzzle.addEventListener('click', function(e){
		if(state == 1){
			puzzle.className = 'animate';
			shiftCell(e.target);
		}
	});
	document.getElementById('solve').addEventListener('click', solve);
	document.getElementById('scramble').addEventListener('click', scramble);

	function solve(){
		document.getElementById("p1").innerHTML = "";
		if(state == 0){
			return;
		}
		
		puzzle.innerHTML = '';
		
		var n = 1;
		for(var i = 0; i < 3; i++){
			for(var j = 0; j < 3; j++){
				var cell = document.createElement('span');
				cell.id = 'cell-'+i+'-'+j;
				cell.style.left = (j*80+1*j+1)+'px';
				cell.style.top = (i*80+1*i+1)+'px';
				
				if(n < 9){
					cell.classList.add('number');
					cell.classList.add((i%2==0 && j%2>0 || i%2>0 && j%2==0) ? 'style-1' : 'style-2');
					cell.innerHTML = (n++).toString();
				} else {
					cell.className = 'empty';
				}
				
				puzzle.appendChild(cell);
			}
		}
		
	}

	function shiftCell(cell){
		
		// Checks if selected cell has number
		if(cell.clasName != 'empty'){
			
			// Tries to get empty adjacent cell
			var emptyCell = getEmptyAdjacentCell(cell);
			
			if(emptyCell){
				// Temporary data
				var tmp = {style: cell.style.cssText, id: cell.id};
				
				// Exchanges id and style values
				cell.style.cssText = emptyCell.style.cssText;
				cell.id = emptyCell.id;
				emptyCell.style.cssText = tmp.style;
				emptyCell.id = tmp.id;
				
				if(state == 1){
					// Checks the order of numbers
					checkOrder();
				}
			}
		}
		
	}
	function getCell(row, col){
	
		return document.getElementById('cell-'+row+'-'+col);
		
	}

	function getEmptyCell(){
	
		return puzzle.querySelector('.empty');
			
	}

	function getEmptyAdjacentCell(cell){
		
		var adjacent = getAdjacentCells(cell);
		for(var i = 0; i < adjacent.length; i++){
			if(adjacent[i].className == 'empty'){
				return adjacent[i];
			}
		}
		return false;
		
	}

	function getAdjacentCells(cell){
		
		var id = cell.id.split('-');
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);
		
		var adjacent = [];

		if(row < 2){adjacent.push(getCell(row+1, col));}			
		if(row > 0){adjacent.push(getCell(row-1, col));}
		if(col < 2){adjacent.push(getCell(row, col+1));}
		if(col > 0){adjacent.push(getCell(row, col-1));}
		
		return adjacent;
		
	}
	
	function checkOrder(){
		if(getCell(2, 2).className != 'empty'){
			return;
		}
	
		var n = 1;
		for(var i = 0; i < 3; i++){
			for(var j = 0; j < 3; j++){
				if(n < 9 && getCell(i, j).innerHTML != n.toString()){
					// Order is not correct
					return;
				}
				n++;
			}
		}
		
		document.getElementById("p1").innerHTML = "TU BĘDZIE JEDNA Z KILKU PIELĘGNACYJNYCH PORAD";
		
	
	}

	function scramble(){
		document.getElementById("p1").innerHTML = "";
		if(state == 0){
			return;
		}
		
		puzzle.removeAttribute('class');
		state = 0;
		
		var previousCell;
		var i = 1;
		var interval = setInterval(function(){
			if(i <= 100){
				var adjacent = getAdjacentCells(getEmptyCell());
				if(previousCell){
					for(var j = adjacent.length-1; j >= 0; j--){
						if(adjacent[j].innerHTML == previousCell.innerHTML){
							adjacent.splice(j, 1);
						}
					}
				}
				// Gets random adjacent cell and memorizes it for the next iteration
				previousCell = adjacent[rand(0, adjacent.length-1)];
				shiftCell(previousCell);
				i++;
			} else {
				clearInterval(interval);
				state = 1;
			}
		}, 5);

	}
	
	function rand(from, to){

		return Math.floor(Math.random() * (to - from + 1)) + from;

	}

}());
