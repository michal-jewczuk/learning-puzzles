
const targetArea = document.getElementById('solution-area');
const puzzleArea = document.getElementById('puzzles-area');
const solutionClass = 'solution-background';
const puzzleClass = 'playable';

MainModule = {

	init: () => {
		GameModule.setUpGame();
		UIModule.registerEvents();
	},

	checkIfCorrect: (target, child) => {
		const targetId = MainModule.extractId(target.id);
		const childId = MainModule.extractId(child.id);
		if (targetId === childId) {
			MainModule.applyCorrect(child);
		} else {
			MainModule.applyIncorrect(child);
		}
	},

	applyCorrect: (element) => {
		element.classList.remove('incorrect');
		element.classList.add('correct');
	},

	applyIncorrect: (element) => {
		element.classList.remove('correct');
		element.classList.add('incorrect');
	},

	applyNone: (element) => {
		element.classList.remove('correct');
		element.classList.remove('incorrect');
	},

	extractId: (name) => {
		return parseInt(name.slice(1));
	},


};

GameModule = {

	setUpGame: () => {
		const count = 9;
		GameModule.createTargetGrid(count);
		GameModule.createPuzzles(count);
	},

	createTargetGrid: (count) => {
		let html = '';
		for (let i = 1; i <= count; i++) {
			html += '<div class="' + solutionClass + '" id="b' + i + '"></div>';

		}
		targetArea.innerHTML = html;
	},

	createPuzzles: (count) => {
		const puzzles = new Array();
		let html = '';
		for (let i = 1; i <= count; i++) {
			puzzles.push(GameModule.createPuzzle(i));

		}
		puzzles.sort(() => Math.random() - 0.5);
		puzzleArea.innerHTML = puzzles.reduce((e1, e2) => e1 + e2);
	},

	createPuzzle: (id) => {
		let html = '<div class="' + puzzleClass + '" id="p' + id + '" draggable="true">';
		html += '<p>element #' + id + '</p>';
		html += '</div>';
		return html;
	}

	
};

UIModule = {

	registerEvents: () => {
	        puzzleArea.addEventListener('drop', UIModule.drop);	
		puzzleArea.addEventListener('dragover', UIModule.allowDrop);

		const backgrounds = Array.from(document.getElementsByClassName(solutionClass));
		const puzzles = Array.from(document.getElementsByClassName(puzzleClass));

		puzzles.forEach( (puzzle) => {
			puzzle.addEventListener('dragstart', UIModule.drag);
		});

		backgrounds.forEach( (bg) => {
	        	bg.addEventListener('drop', UIModule.drop);	
			bg.addEventListener('dragover', UIModule.allowDrop);
		});
	},

	allowDrop: (ev) => {
		ev.preventDefault();
	},
	
	drag: (ev) => {
		ev.dataTransfer.setData("childId", ev.target.id);
	},

	drop: (ev) => {
		ev.preventDefault();
		const data = ev.dataTransfer.getData("childId");
		const child = document.getElementById(data);

		if (child === null) {
			return true;
		}

		if (ev.target.className === solutionClass) {
			ev.target.appendChild(child);
			MainModule.checkIfCorrect(ev.target, child);
		} else if (ev.target.id === 'puzzles-area') {
			ev.target.appendChild(child);
			MainModule.applyNone(child);
		}
	}

};





MainModule.init();

