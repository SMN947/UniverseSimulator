console.clear(); // for live reload in vs

var systemCanvas = document.getElementById('system');
var universe = systemCanvas.getContext('2d');
let planets = [];
let planetsRelations = {};
let systemData = {};

massFactor = 20;
sizeFactor = 20;

for (let i = 0; i < 5; i++) {
	planets.push({
		x: Math.random() * (systemCanvas.width - sizeFactor * 2) + sizeFactor,
		y: Math.random() * (systemCanvas.height - sizeFactor * 2) + sizeFactor,
		mass: massFactor * 1,
		size: sizeFactor * 1,
		color: getRndColor(),
	});
}

function simulate() {
	//Añadir calculos de simulacion
	let randSeed = 10;
	planets = planets.map((planet, i) => {
		planet.x += Math.random() * (randSeed - -randSeed) + -randSeed;
		planet.y += Math.random() * (randSeed - -randSeed) + -randSeed;
		return planet;
	});
	//
	planets.map((planet1, i) => {
		planets.map((planet, j) => {
			// Trazo de lineas entre planetas
			if (i != j && planetsRelations[`${i}-${j}`] == undefined) {
				//Guarda relaciones para no procesar 2 veces
				planetsRelations[`${i}-${j}`] = {d: 10};
				planetsRelations[`${j}-${i}`] = {d: 10};

				let midPointX = planet.x + (planet1.x - planet.x) * 0.5;
				let midPointY = planet.y + (planet1.y - planet.y) * 0.5;

				universe.fillStyle = '#000000';
				universe.fillRect(midPointX, midPointY, sizeFactor / 2, sizeFactor / 2);

				systemData[`${j}-${i}`] = {
					midPoint: {
						x: midPointX.toFixed(2),
						y: midPointY.toFixed(2),
					},
					distance: calcDistance(planet.x, planet.y, planet1.x, planet1.y),
					line: {
						origin: {x: planet.x, y: planet.y},
						destination: {x: planet1.x, y: planet1.y},
					},
				};
			}
		});
	});

	drawPlanets();
	drawLines();

	//console.clear();
	//console.table(systemData);

	// requestAnimationFrame(simulate);
	setTimeout(() => {
		simulate();
	}, 2000);
}

let tsInicio = new Date();
function drawPlanets() {
	tsInicio = new Date();
	planetsRelations = {};
	universe.clearRect(0, 0, systemCanvas.width, systemCanvas.height);

	planets.map((planet, i) => {
		universe.beginPath();
		universe.fillStyle = planet.color;
		universe.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2, false);
		universe.fill();
		universe.closePath();
	});
}

function drawLines() {
	for (relation of Object.keys(systemData)) {
		let line = systemData[relation].line;
		let distance = systemData[relation].distance;
		let midPoint = systemData[relation].midPoint;
		universe.moveTo(line.origin.x, line.origin.y);
		universe.lineTo(line.destination.x, line.destination.y);
		universe.stroke();

		universe.textAlign = 'center';
		universe.textBaseline = 'middle';
		universe.font = '15px Courier';
		let text = [distance, distance, 1, 2, 3, 4];

		// draw text at the midpoint
		universe.fillStyle = '#000';
		for (var i = 0; i < text.length; i++)
			universe.fillText(distance, midPoint.x, midPoint.y);
	}
}

simulate();

function calcDistance(x1, y1, x2, y2) {
	let a = x1 - x2;
	let b = y1 - y2;

	return Math.sqrt(a * a + b * b).toFixed(2);
}
function getRndColor() {
	var r = (255 * Math.random()) | 0,
		g = (255 * Math.random()) | 0,
		b = (255 * Math.random()) | 0;
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function setVal(id, html) {
	document.getElementById(id).innerHTML = html;
}
