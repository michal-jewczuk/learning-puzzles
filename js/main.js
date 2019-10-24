
const targetArea = document.getElementById('solution-area');
const puzzleArea = document.getElementById('puzzles-area');
const imagesArea = document.getElementById('images-area');
const optionsArea = document.getElementById('options-area');

const newGameButton = document.getElementById('new-game');
const resetButton = document.getElementById('reset');
const chooseButton = document.getElementById('choose-image');
const uploadButton = document.getElementById('upload-image');
const cancelChooseButton = document.getElementById('cancel-choose');

const infoWinner = document.getElementById('info-winner');
const infoLooser = document.getElementById('info-looser');
const targetImage = document.getElementById('target-image');
const targetImagePreview = document.getElementById('target-image-preview');

const solutionClass = 'solution-background';
const puzzleClass = 'playable';
const mainDimension = 420;

GameModule = {

	init: () => {
		UIModule.registerEvents();
		UIModule.hideMessages();
		UIModule.drawTargetImage(targetImagePreview);
	},

	checkIfCorrect: (target, child) => {
		const targetId = GameModule.extractId(target.id);
		const childId = GameModule.extractId(child.id);
		return targetId === childId;
	},

	setUpGame: (count) => {
		UIModule.removeAllPuzzles();
		UIModule.createTargetGrid(count);
		UIModule.createPuzzles(count);
		UIModule.registerGameEvents();
		UIModule.hideMessages();
	},

	checkIfCompleted: () => {
		let result = true;
		let fullBoard = true;
		const backgrounds = Array.from(document.getElementsByClassName(solutionClass));

		backgrounds.forEach( (bg) => {
			const children = Array.from(bg.children);
			if (children.length === 0) {
				result = false;
				fullBoard = false;
			} else {
				const backgroundId = GameModule.extractId(bg.id);
				const childId = GameModule.extractId(children[0].id);
				if (backgroundId !== childId) {
					result = false;
				}
			}	
		});

		return [result, fullBoard];
	},

	extractId: (name) => {
		return parseInt(name.slice(1));
	}

	
};

UIModule = {

	registerEvents: () => {
		resetButton.addEventListener('click', EventModule.resetGameEvent);
		newGameButton.addEventListener('click', EventModule.newGameEvent);
		chooseButton.addEventListener('click', EventModule.chooseImageEvent);
		cancelChooseButton.addEventListener('click', EventModule.cancelChooseEvent);
		const images = Array.from(document.getElementsByClassName('image-to-choose'));
		images.forEach( (image) => {
			image.addEventListener('click', EventModule.imageClickedEvent);
		});
		UIModule.hideElement(imagesArea);
	},

	registerGameEvents: () => {
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

	createTargetGrid: (count) => {
		let html = '';
		for (let i = 1; i <= count; i++) {
			html += '<div class="' + solutionClass + ' s' + count + '" id="b' + i + '"></div>';

		}
		targetArea.innerHTML = html;
	},

	createPuzzles: (count) => {
		const puzzles = new Array();
		let html = '';
		for (let i = 1; i <= count; i++) {
			puzzles.push(UIModule.createPuzzle(i, count));
		}
		puzzles.sort(() => Math.random() - 0.5);
		puzzles.forEach( (puzzle) => {
			puzzleArea.innerHTML += puzzle.outerHTML;
		});
		UIModule.appendImagesToCanvases(targetImage);
		targetArea.style.backgroundImage = "url(" + targetImagePreview.src + ")";
		targetArea.style.backgroundSize = "420px 420px";
	},

	createPuzzle: (id, count) => {
		let imagePart = document.createElement('div');
		imagePart.setAttribute('class', puzzleClass + ' s' + count);
		imagePart.setAttribute('id', 'p' + id);
		imagePart.setAttribute('draggable', true);
		imagePart.appendChild(UIModule.createCanvasImage(count));
		return imagePart;
	},

	createCanvasImage: (count) => {
		const size = mainDimension / Math.sqrt(count);
		let canvas = document.createElement('canvas');
		canvas.setAttribute('width', size);
		canvas.setAttribute('height', size);
		return canvas;
	},

	appendImagesToCanvases: (image) => {
		const divs = Array.from(puzzleArea.children);
		const dimension = Math.sqrt(divs.length);
		const size = mainDimension / dimension;
		divs.forEach( (div) => {
			const elId = GameModule.extractId(div.id);
			const ctx = (div.children[0]).getContext('2d');
			const row = Math.floor( (elId-1) / dimension);
			const col = (elId - 1) % dimension;
			ctx.drawImage(image, size * col, size * row, size, size, 0, 0, size, size);
		});
	},

	showGameOver: () => {
		const gameStatus = GameModule.checkIfCompleted();
		if (gameStatus[1]) {
			if (gameStatus[0]) {
				UIModule.showElement(infoWinner);
				UIModule.hideElement(infoLooser);
			} else {
				UIModule.showElement(infoLooser);
				UIModule.hideElement(infoWinner);
			}
		}
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

		if (ev.target.className.startsWith(solutionClass)) {
			ev.target.appendChild(child);
			UIModule.applyStatus(child, GameModule.checkIfCorrect(ev.target, child));
			UIModule.showGameOver();
		} else if (ev.target.id === 'puzzles-area') {
			ev.target.appendChild(child);
			UIModule.applyNone(child);
		}
	},

	applyStatus: (element, correct) => {
		if (correct) {
			UIModule.applyCorrect(element);
		} else {
			UIModule.applyIncorrect(element);
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

	hideElement: (element) => {
		element.classList.remove('visible');
		element.classList.add('invisible');
	},

	showElement: (element) => {
		element.classList.remove('invisible');
		element.classList.add('visible');
	},

	hideMessages: () => {
		UIModule.hideElement(infoWinner);
		UIModule.hideElement(infoLooser);
	},

	removeAllPuzzles: () => {
		puzzleArea.innerHTML = '';
		targetArea.innerHTML = '';
	},

	setTargetImage: (image) => {
		targetImagePreview.src = image;
		UIModule.drawTargetImage(targetImagePreview);
	},

	drawTargetImage: (image) => {
		const ctx = targetImage.getContext('2d');
		ctx.drawImage(image, 0, 0, mainDimension, mainDimension);
	}


};

EventModule = {
	newGameEvent: () => {
		const countIndex = document.getElementById('puzzles-count').selectedIndex;
		const puzzlesCount = document.getElementsByTagName('option')[countIndex].value;
		GameModule.setUpGame(puzzlesCount);
	},

	resetGameEvent: () => {
		const backgrounds = Array.from(document.getElementsByClassName(solutionClass));
		backgrounds.forEach( (bg) => {
			const children = Array.from(bg.children);
			if (children.length > 0) {
				const child = children[0];
				bg.removeChild(child);
				UIModule.applyNone(child);
				puzzleArea.appendChild(child);
			}
		});
		UIModule.hideMessages();
	},

	chooseImageEvent: () => {
		UIModule.showElement(imagesArea);
		UIModule.hideElement(optionsArea);
	},

	imageClickedEvent: (event) => {
		UIModule.setTargetImage(event.target.src);
		UIModule.hideElement(imagesArea);
		UIModule.showElement(optionsArea);
	},

	cancelChooseEvent: () => {
		UIModule.hideElement(imagesArea);
		UIModule.showElement(optionsArea);
	}
};


GameModule.init();

