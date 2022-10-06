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
	drawPlanets();

	console.clear();
	console.table(systemData);

	// requestAnimationFrame(simulate);
	setTimeout(() => {
		simulate();
	}, 1000);
}

let tsInicio = new Date();
function drawPlanets() {
	tsInicio = new Date();
	planetsRelations = {};
	universe.clearRect(0, 0, systemCanvas.width, systemCanvas.height);
	planets.map((planet1, i) => {
		planets.map((planet, j) => {
			universe.beginPath();
			universe.fillStyle = planet.color;
			universe.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2, false);
			universe.fill();
			universe.closePath();

			// Trazo de lineas entre planetas
			if (i != j && planetsRelations[`${i}-${j}`] == undefined) {
				//Guarda relaciones para no procesar 2 veces
				planetsRelations[`${i}-${j}`] = {d: 10};
				planetsRelations[`${j}-${i}`] = {d: 10};

				universe.moveTo(planet1.x, planet1.y);
				universe.lineTo(planet.x, planet.y);
				universe.stroke();
			}
		});
	});
}

simulate();

function getRndColor() {
	var r = (255 * Math.random()) | 0,
		g = (255 * Math.random()) | 0,
		b = (255 * Math.random()) | 0;
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function setVal(id, html) {
	document.getElementById(id).innerHTML = html;
}
