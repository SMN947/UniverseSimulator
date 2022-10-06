console.clear(); // for live reload in vs

var systemCanvas = document.getElementById('system');
var universe = systemCanvas.getContext('2d');
let planets = [];

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
	setTimeout(() => {
		drawPlanets();
	}, 1000);
}

function drawPlanets() {
	universe.clearRect(0, 0, systemCanvas, systemCanvas);
	planets.map((planet1, index) => {
		planets.map((planet, j) => {
			universe.beginPath();
			universe.fillStyle = planet.color;
			universe.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2, false);
			universe.fill();
			universe.closePath();
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
