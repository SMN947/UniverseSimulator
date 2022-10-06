console.clear(); // for live reload in vs

var systemCanvas = document.getElementById('system');
var universe = systemCanvas.getContext('2d');
let planets = [];
let planetsRelations = {};
let systemData = {};

massFactor = 20;
sizeFactor = 20;

for (let i = 0; i < 3; i++) {
	planets.push({
		x: Math.random() * (systemCanvas.width - sizeFactor * 2) + sizeFactor,
		y: Math.random() * (systemCanvas.height - sizeFactor * 2) + sizeFactor,
		mass: massFactor * 1,
		size: sizeFactor * 1,
		color: getRndColor(),
	});
}

function simulate() {
	//Calcula AceleracionG, distancia, midPoint
	let universalG = 0.0098;
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

				let distance = calcDistance(planet.x, planet.y, planet1.x, planet1.y);
				systemData[`${j}-${i}`] = {
					planet1: i,
					planet2: j,
					midPoint: {
						x: midPointX.toFixed(2),
						y: midPointY.toFixed(2),
					},
					distance: distance,
					line: {
						origin: {x: planet.x, y: planet.y},
						destination: {x: planet1.x, y: planet1.y},
					},
					//F = G*(m1*m2/d^2
					gAceleration:
						universalG * ((planet.mass * planet.mass) / (distance * distance)),
				};
			}
		});
	});

	// Se calcula la nueva ubicacion teniendo en cuenta la aceleracion gravitacional
	/*
	x3 = x1 + gAceleration * dx
	y3 = y1 + gAceleration * dy
	*/
	for (relation of Object.keys(systemData)) {
		systemPlanet = systemData[relation];

		planet1Id = systemPlanet.planet1;
		planet2Id = systemPlanet.planet2;

		planet1 = planets[planet1Id];
		planet2 = planets[planet2Id];
		// Posicion planeta 1
		planets[planet1Id].x = planet1.x + systemPlanet.gAceleration * planet2.x;
		planets[planet1Id].y = planet1.y + systemPlanet.gAceleration * planet2.y;

		// Posicion planeta 2
		planets[planet2Id].x = planet2.x + systemPlanet.gAceleration * planet1.x;
		planets[planet2Id].y = planet2.y + systemPlanet.gAceleration * planet1.y;
	}

	drawPlanets();
	drawLines();

	console.clear();
	console.log(systemCanvas.width / 2);
	console.log(systemCanvas.height / 2);
	console.table(systemData);

	// requestAnimationFrame(simulate);
	setTimeout(() => {
		simulate();
	}, 500);
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
		let gAcel = (systemData[relation].gAceleration * 1000).toFixed(2);
		universe.moveTo(line.origin.x, line.origin.y);
		universe.lineTo(line.destination.x, line.destination.y);
		universe.stroke();

		universe.textAlign = 'center';
		universe.textBaseline = 'middle';
		universe.font = '15px Courier';
		let lineHeigth = 17;

		// draw text at the midpoint
		universe.fillStyle = 'black';
		universe.fillText(distance + 'Km', midPoint.x, midPoint.y - lineHeigth);
		universe.fillText(gAcel + 'Mts', midPoint.x, midPoint.y + lineHeigth);

		universe.fillText(
			`X:${line.origin.x.toFixed(2)}, Y:${line.origin.y.toFixed(2)}`,
			line.origin.x,
			line.origin.y
		);
		universe.fillText(
			`X:${line.destination.x.toFixed(2)}, Y:${line.destination.y.toFixed(2)}`,
			line.destination.x,
			line.destination.y
		);
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
