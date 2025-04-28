// script.js

function Place(location, landmarks, season, notes) {
    this.location = location;
    this.landmarks = landmarks || [];
    this.season = season;
    this.notes = notes;
  }
  
  Place.prototype.summary = function () {
    return `${this.location} (${this.season}): ${this.notes}`;
  };
  
  Place.prototype.addLandmark = function (landmark) {
    this.landmarks.push(landmark);
  };
  
  let places = JSON.parse(localStorage.getItem("places")) || [];
  
  const form = document.getElementById("placeForm");
  const placesList = document.getElementById("placesList");
  
  function updateLocalStorage() {
    localStorage.setItem("places", JSON.stringify(places));
  }
  
  function updateMap(location) {
    const encodedLocation = encodeURIComponent(location);
    document.getElementById("mapFrame").src = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  }
  
  function renderPlaces(list = places) {
    placesList.innerHTML = "";
  
    list.forEach((place, index) => {
      const listItem = document.createElement("li");
  
      listItem.innerHTML = `
        <strong>${place.location}</strong> (${place.season}) 
        <button class="details-button">Show Details</button>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
        <div class="place-details" style="display: none;">
          <p><strong>Landmarks:</strong> ${place.landmarks.join(", ")}</p>
          <p><strong>Notes:</strong> ${place.notes}</p>
        </div>
      `;
  
      listItem.querySelector(".details-button").addEventListener("click", function () {
        const details = listItem.querySelector(".place-details");
        const isVisible = details.style.display === "block";
        details.style.display = isVisible ? "none" : "block";
        if (!isVisible) updateMap(place.location);
      });
  
      listItem.querySelector(".delete-button").addEventListener("click", function () {
        places.splice(index, 1);
        updateLocalStorage();
        renderPlaces();
      });
  
      listItem.querySelector(".edit-button").addEventListener("click", function () {
        const placeToEdit = places[index];
        document.getElementById("location").value = placeToEdit.location;
        document.getElementById("landmark").value = placeToEdit.landmarks.join(", ");
        document.getElementById("season").value = placeToEdit.season;
        document.getElementById("notes").value = placeToEdit.notes;
  
        places.splice(index, 1);
        updateLocalStorage();
        renderPlaces();
      });
  
      placesList.appendChild(listItem);
    });
  }
  
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  
    const location = document.getElementById("location").value.trim();
    const landmarkInput = document.getElementById("landmark").value.trim();
    const season = document.getElementById("season").value;
    const notes = document.getElementById("notes").value.trim();
  
    const landmarks = landmarkInput ? landmarkInput.split(",").map(l => l.trim()) : [];
  
    const newPlace = new Place(location, landmarks, season, notes);
    places.push(newPlace);
    updateLocalStorage();
    renderPlaces();
    updateMap(location);
    form.reset();
  });
  
  document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
  });
  
  document.getElementById("search").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filtered = places.filter(place =>
      place.location.toLowerCase().includes(searchTerm)
    );
    renderPlaces(filtered);
  });
  
  renderPlaces();
  