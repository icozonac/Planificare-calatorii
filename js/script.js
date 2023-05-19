// Funcții JavaScript
function calculateTripDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.abs(end - start);
  const days = Math.ceil(duration / (1000 * 60 * 60 * 24));
  return days;
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function saveTripToLocalStorage(trip) {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  trips.push(trip);
  localStorage.setItem("trips", JSON.stringify(trips));
}

function loadTripsFromLocalStorage() {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];
  return trips;
}

// Obiecte JavaScript
const Trip = {
  create(destination, startDate, endDate) {
    const duration = calculateTripDuration(startDate, endDate);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    return {
      destination,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      duration,
    };
  },
};

// Gestionarea DOM prin biblioteci JavaScript
function addTripToDOM(trip) {
  const tripList = document.getElementById("travel-list");
  const tripItem = document.createElement("div");
  tripItem.classList.add("trip-item");
  tripItem.innerHTML = `
        <h3>${trip.destination}</h3>
        <p>Start: ${trip.startDate}</p>
        <p>End: ${trip.endDate}</p>
        <p>Duration: ${trip.duration} days</p>
        <button class="delete-button" data-id="${trip.id}">Delete</button>
      `;
  tripList.appendChild(tripItem);
}

function deleteTrip(event) {
  if (event.target.classList.contains("delete-button")) {
    const tripId = event.target.dataset.id;
    // Cod pentru ștergerea călătoriei cu id-ul tripId

    // Ștergerea călătoriei din DOM
    event.target.parentElement.remove();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // ...

  // Adăugare eveniment pentru ștergerea unei călătorii
  const travelList = document.getElementById("travel-list");
  travelList.addEventListener("click", deleteTrip);
});

// Format JSON (consum prin JavaScript)
function saveTripsToJsonFile() {
  const trips = loadTripsFromLocalStorage();
  const jsonData = JSON.stringify(trips);

  // Salvare jsonData într-un fișier JSON
}

// Exemplu de utilizare
document.addEventListener("DOMContentLoaded", function () {
  const travelForm = document.getElementById("travel-form");

  travelForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const destinationInput = document.getElementById("destination-input");
    const startDateInput = document.getElementById("start-date-input");
    const endDateInput = document.getElementById("end-date-input");

    const destination = destinationInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    const trip = Trip.create(destination, startDate, endDate);
    saveTripToLocalStorage(trip);
    addTripToDOM(trip);

    destinationInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
  });

  // Încărcare călătorii salvate din localStorage la încărcarea paginii
  const savedTrips = loadTripsFromLocalStorage();
  savedTrips.forEach(function (trip) {
    addTripToDOM(trip);
  });
});
