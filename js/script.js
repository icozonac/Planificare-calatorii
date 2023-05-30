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
  let trips = JSON.parse(localStorage.getItem("trips"));
  if (!trips) {
    trips = [];
  }

  trip.id = Date.now();

  if (
    trip.transport &&
    trip.transport.transportType &&
    trip.transport.transportDetails
  ) {
    // Nu face nimic - transportul este deja definit corect
  } else {
    trip.transport = null;
  }

  if (trip.info && trip.info.otherInfo) {
    // Nu face nimic - info este deja definit corect
  } else {
    trip.info = null;
  }

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
  create(
    destination,
    startDate,
    endDate,
    transportType,
    transportDetails,
    otherInfo
  ) {
    const duration = calculateTripDuration(startDate, endDate);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    return {
      destination,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      duration,
      transport: transportType
        ? Transport.create(transportType, transportDetails)
        : null,
      info: otherInfo ? Info.create(otherInfo) : null,
    };
  },
};

const Transport = {
  create(transportType, transportDetails) {
    return {
      transportType,
      transportDetails,
    };
  },
};

const Info = {
  create(otherInfo) {
    return {
      otherInfo,
    };
  },
};

// Gestionarea DOM prin biblioteci JavaScript
function addTripToDOM(trip) {
  const tripList = document.getElementById("travel-list");
  const tripItem = document.createElement("div");
  tripItem.classList.add("trip-item");

  let tripDetails = `
    <h3>${trip.destination}</h3>
    <p>Start: ${trip.startDate}</p>
    <p>End: ${trip.endDate}</p>
    <p>Duration: ${trip.duration} days</p>
  `;

  if (
    trip.transport &&
    trip.transport.transportType &&
    trip.transport.transportDetails
  ) {
    tripDetails += `<p>Transport: ${trip.transport.transportType}</p>`;
    tripDetails += `<p>Transport Details: ${trip.transport.transportDetails}</p>`;
  }

  if (trip.info && trip.info.otherInfo) {
    tripDetails += `<p>Other Info: ${trip.info.otherInfo}</p>`;
  }

  tripDetails += `<button class="delete-button" data-id="${trip.id}">X</button>`;

  tripItem.innerHTML = tripDetails;
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
    const transportTypeInput = document.getElementById("transport-input");
    const transportDetailsInput = document.getElementById(
      "transport-details-input"
    );
    const otherInfoInput = document.getElementById("other-info-input");

    const destination = destinationInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const transportType = transportTypeInput.value;
    const transportDetails = transportDetailsInput.value;
    const otherInfo = otherInfoInput.value;

    if (!validateForm(destination, startDate, endDate)) {
      alert("Vă rugăm să completați toate câmpurile corect.");
      return;
    }

    const trip = Trip.create(destination, startDate, endDate);
    const transport = Transport.create(transportType, transportDetails);
    const info = Info.create(otherInfo);

    trip.transport = transport;
    trip.info = info;

    saveTripToLocalStorage(trip);
    addTripToDOM(trip);

    destinationInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    transportTypeInput.value = "null";
    transportDetailsInput.value = "";
    otherInfoInput.value = "";
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
