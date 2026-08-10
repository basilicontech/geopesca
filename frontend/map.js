// Inicializar mapa
const map = L.map("map", {
  minZoom: 5,
  maxBounds: [
    [27.0, -18.5], // Suroeste (El Hierro)
    [44.0, 4.5], // Noreste (Galicia y Menorca)
  ],
  maxBoundsViscosity: 1.0,
}).setView([35.5, -7.0], 5);

// Capa base
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
