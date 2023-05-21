const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const scale = 0.5;
const locations = [];

// Calculate the scaled map dimensions
const { width, height } = canvas.getBoundingClientRect();

// Draw the initial map
drawMap();

// Add click event listener to canvas
canvas.addEventListener("click", (event) => {
  const { left, top } = canvas.getBoundingClientRect();
  const x = event.clientX - left;
  const y = event.clientY - top;

  // Add the location to the list of locations without the city name
  locations.push({ x, y });

  // Draw the updated map
  drawMap();
});

function drawLocation(x, y) {
  const radius = 5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(
    50 * scale,
    50 * scale,
    width - 100 * scale,
    height - 100 * scale
  );

  // Draw lines between consecutive points
  for (let i = 1; i < locations.length; i++) {
    const { x: x1, y: y1 } = locations[i - 1];
    const { x: x2, y: y2 } = locations[i];
    drawLine(x1, y1, x2, y2);
  }

  locations.forEach(({ x, y, name }) => {
    drawLocation(x, y);

    if (name) {
      drawLabel(x, y, name);
    }
  });
}

function drawLabel(x, y, text) {
  const fontSize = 14;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#000";
  ctx.fillText(text, x, y - 15);
}

// Add submit event listener to form
const form = document.getElementById("cityForm");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityNameInput = document.getElementById("cityName");
  const cityName = cityNameInput.value.trim();

  if (cityName !== "") {
    // Add the city name to the last location
    locations[locations.length - 1].name = cityName;

    // Reset the form
    form.reset();

    // Draw the updated map
    drawMap();
  }
});

sessionStorage.setItem("locations", JSON.stringify(locations));

const savedLocations = sessionStorage.getItem("locations");
locations = savedLocations ? JSON.parse(savedLocations) : [];
