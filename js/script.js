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
  const trips = JSON.parse(localStorage.getItem("trips"));
  trip.id = Date.now();
  trips.push(trip);
  localStorage.setItem("trips", JSON.stringify(trips));
}

function loadTripsFromLocalStorage() {
  const trips = JSON.parse(localStorage.getItem("trips"));
  return trips;
}

function validateForm(destination, startDate, endDate) {
  if (!destination || !startDate || !endDate) {
    return false; // Unul sau mai multe câmpuri sunt goale
  }

  const currentDate = new Date();
  const selectedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);

  if (selectedStartDate > selectedEndDate) {
    return false; // Data de sfârșit este anterioară datei de început
  }

  if (
    selectedEndDate < currentDate.setHours(0, 0, 0, 0) ||
    selectedStartDate < currentDate.setHours(0, 0, 0, 0)
  ) {
    return false; // Data de început sau de sfârșit este în trecut
  }

  return true; // Toate verificările sunt trecute cu succes
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
      <button class="delete-button" data-id="${trip.id}">X</button>
      <button class="info-button" data-id="${trip.id}">Info</button>
    `;
  tripList.appendChild(tripItem);
}

function deleteTrip(event) {
  if (event.target.classList.contains("delete-button")) {
    const tripId = event.target.dataset.id;
    const trips = loadTripsFromLocalStorage();

    // Găsește călătoria cu id-ul tripId în lista de călătorii
    const tripIndex = trips.findIndex((trip) => trip.id === Number(tripId));

    if (tripIndex !== -1) {
      // Șterge călătoria din lista de călătorii
      trips.splice(tripIndex, 1);

      // Actualizează Local Storage cu lista de călătorii actualizată
      localStorage.setItem("trips", JSON.stringify(trips));
    }

    // Șterge călătoria din DOM
    event.target.parentElement.remove();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Adăugare eveniment pentru ștergerea unei călătorii
  const travelList = document.getElementById("travel-list");
  travelList.addEventListener("click", deleteTrip);

  // Exemplu de utilizare
  const travelForm = document.getElementById("travel-form");

  travelForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const destinationInput = document.getElementById("destination-input");
    const startDateInput = document.getElementById("start-date-input");
    const endDateInput = document.getElementById("end-date-input");

    const destination = destinationInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!validateForm(destination, startDate, endDate)) {
      alert("Vă rugăm să completați toate câmpurile corect.");
      return;
    }

    const trip = Trip.create(destination, startDate, endDate);
    saveTripToLocalStorage(trip);
    addTripToDOM(trip);

    destinationInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
  });

  // Încărcare călătorii salvate din localStorage la încărcarea paginii
  if (!localStorage.getItem("trips")) {
    localStorage.setItem("trips", JSON.stringify([]));
  }
  const savedTrips = loadTripsFromLocalStorage();
  savedTrips.forEach(function (trip) {
    addTripToDOM(trip);
  });
});
