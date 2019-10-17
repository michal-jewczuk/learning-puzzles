MainModule = {

	DOMel: {
		playableArea: document.getElementById('playable-section'),
		targetArea: document.getElementById('target-area'),
		puzzleArea: document.getElementById('puzzles-area'),
		puzzles: Array.from(document.getElementsByClassName('playable')),
		backgrounds: Array.from(document.getElementsByClassName('main-area-background'))
	},

	init: () => {
		MainModule.registerEvents();
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
		if (ev.target.className === 'main-area-background'
			|| ev.target.id === 'puzzles-area') {
			ev.target.appendChild(child);
		}
	},

	registerEvents: () => {
	        MainModule.DOMel.puzzleArea.addEventListener('drop', MainModule.drop);	
		MainModule.DOMel.puzzleArea.addEventListener('dragover', MainModule.allowDrop);

		MainModule.DOMel.puzzles.forEach( (puzzle) => {
			puzzle.addEventListener('dragstart', MainModule.drag);
		});

		MainModule.DOMel.backgrounds.forEach( (bg) => {
	        	bg.addEventListener('drop', MainModule.drop);	
			bg.addEventListener('dragover', MainModule.allowDrop);
		});
	}

};

MainModule.init();

