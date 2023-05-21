var canvas = document.getElementById("mapCanvas");
var ctx = canvas.getContext("2d");

var scale = 0.5; // Factor de scalare pentru a face harta mai mică
var locations = [];

// Calculați dimensiunile hărții scalate
var width = canvas.width;
var height = canvas.height;

// Desenați harta inițială
drawMap();

// Adăugați eveniment de clic pe canvas
canvas.addEventListener("click", function (event) {
  var rect = canvas.getBoundingClientRect();
  var x = (event.clientX - rect.left) * scale;
  var y = (event.clientY - rect.top) * scale;

  // Invert the y-axis to match the coordinate system (optional, if needed)
  y = canvas.height - y;

  // Adăugați locația în lista de locații fără denumirea orașului
  locations.push({ x, y });

  // Desenați harta actualizată
  drawMap();
});

// Adăugați eveniment de submit pe formular
var form = document.getElementById("cityForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityNameInput = document.getElementById("cityName");
  var cityName = cityNameInput.value;

  if (cityName.trim() !== "") {
    // Adăugați numele orașului la ultima locație
    locations[locations.length - 1].name = cityName;

    // Resetați formularul
    form.reset();

    // Desenați harta actualizată
    drawMap();
  }
});

function drawMap() {
  // Curățați canvas-ul
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenați fundalul hărții
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenați conturul hărții
  ctx.strokeStyle = "#000";
  ctx.strokeRect(
    50 * scale,
    50 * scale,
    width - 100 * scale,
    height - 100 * scale
  );

  // Desenați locațiile existente și etichetele
  locations.forEach(function (location) {
    drawLocation(location.x, location.y);
    if (location.name) {
      drawLabel(location.x, location.y, location.name);
    }
  });
}

function drawLocation(x, y) {
  // Desenați cercul pentru locație
  var radius = 5; // Dimensiunea punctului
  ctx.beginPath();
  ctx.arc(x, y + radius, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
}

function drawLabel(x, y, text) {
  // Desenați eticheta pentru locație
  var fontSize = 14; // Dimensiunea textului
  ctx.font = fontSize + "px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#000";
  ctx.fillText(text, x, y - 15);
}
