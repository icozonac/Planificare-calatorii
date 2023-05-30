// Funcții JavaScript
function calculateTripDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.abs(end - start);
  const days = Math.ceil(duration / (1000 * 60 * 60 * 24));
  return days;
}

function formatDate(date) {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObject.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
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
    if (trip.transport.transportType === "null") {
      tripDetails += `<p>Transport: No transport</p>`;
    } else tripDetails += `<p>Transport: ${trip.transport.transportType}</p>`;

    tripDetails += `<p>Transport Details: ${trip.transport.transportDetails}</p>`;
  }

  if (trip.info && trip.info.otherInfo) {
    tripDetails += `<p>Other Info: ${trip.info.otherInfo}</p>`;
  }

  tripDetails += `<button class="delete-button" data-id="${trip.id}">X</button>`;
  tripDetails += `<button class="edit-button" data-id="${trip.id}">Edit</button>`;

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

function updateTripInLocalStorage(trip) {
  let trips = JSON.parse(localStorage.getItem("trips"));

  if (trips) {
    const tripIndex = trips.findIndex((t) => t.id === trip.id);

    if (tripIndex !== -1) {
      trips[tripIndex] = trip;
      localStorage.setItem("trips", JSON.stringify(trips));
    }
  }
}

function editTrip(event) {
  if (event.target.classList.contains("edit-button")) {
    const tripId = event.target.dataset.id;
    const trips = loadTripsFromLocalStorage();

    // Găsește călătoria cu id-ul tripId în lista de călătorii
    const trip = trips.find((trip) => trip.id === Number(tripId));

    if (!trip) {
      alert("Vă rugăm să completați toate câmpurile corect.");
      return;
    }

    // Populează formularul cu datele călătoriei existente
    const destinationInput = document.getElementById("destination-input");
    const startDateInput = document.getElementById("start-date-input");
    const endDateInput = document.getElementById("end-date-input");
    const transportTypeInput = document.getElementById("transport-input");
    const transportDetailsInput = document.getElementById(
      "transport-details-input"
    );
    const otherInfoInput = document.getElementById("other-info-input");

    destinationInput.value = trip.destination;
    startDateInput.value = trip.startDate;
    endDateInput.value = trip.endDate;

    if (trip.transport) {
      transportTypeInput.value = trip.transport.transportType;
      transportDetailsInput.value = trip.transport.transportDetails;
    } else {
      transportTypeInput.value = "null";
      transportDetailsInput.value = "";
    }

    if (trip.info) {
      otherInfoInput.value = trip.info.otherInfo;
    } else {
      otherInfoInput.value = "";
    }

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");

    saveButton.addEventListener("click", function () {
      // Updatează călătoria cu noile valori
      trip.destination = destinationInput.value;
      trip.startDate = startDateInput.value;
      trip.endDate = endDateInput.value;
      trip.duration = calculateTripDuration(trip.startDate, trip.endDate);
      trip.transport = Transport.create(
        transportTypeInput.value,
        transportDetailsInput.value
      );
      trip.info = Info.create(otherInfoInput.value);

      if (validateForm(trip.destination, trip.startDate, trip.endDate)) {
        updateTripInLocalStorage(trip);

        renderTrips();

        // Curăță valorile de intrare ale formularului
        destinationInput.value = "";
        startDateInput.value = "";
        endDateInput.value = "";
        transportTypeInput.value = "null";
        transportDetailsInput.value = "";
        otherInfoInput.value = "";

        // Șterge butonul de salvare din formular
        saveButton.remove();
      }
    });

    // Adaugă butonul de salvare în formular
    const travelForm = document.getElementById("travel-form");
    if (!travelForm.querySelector(".save-button")) {
      travelForm.appendChild(saveButton);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Adaugă eveniment pentru ștergerea unei călătorii
  const travelList = document.getElementById("travel-list");
  travelList.addEventListener("click", deleteTrip);

  // Adaugă eveniment pentru editarea unei călătorii
  travelList.addEventListener("click", editTrip);

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

    const trip = Trip.create(
      destination,
      startDate,
      endDate,
      transportType,
      transportDetails,
      otherInfo
    );

    saveTripToLocalStorage(trip);
    addTripToDOM(trip);

    destinationInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    transportTypeInput.value = "null";
    transportDetailsInput.value = "";
    otherInfoInput.value = "";
  });

  // Încarcă călătoriile salvate din localStorage la încărcarea paginii
  if (!localStorage.getItem("trips")) {
    localStorage.setItem("trips", JSON.stringify([]));
  }

  renderTrips();
});

function renderTrips() {
  const tripList = document.getElementById("travel-list");
  tripList.innerHTML = "";

  const savedTrips = loadTripsFromLocalStorage();
  savedTrips.forEach((trip) => {
    addTripToDOM(trip);
  });
}
