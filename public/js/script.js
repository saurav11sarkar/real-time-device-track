const socket = io();

// Location Watch
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Error obtaining location", error);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
  );
}

// Initialize map
const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

// Marker store
const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log(`Received location from ${id}: ${latitude}, ${longitude}`);

  map.setView([latitude, longitude], 13);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // Update
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map); // New
  }
});

socket.on("client-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    console.log(`🗑 Removed marker of ${id}`);
  }
});
