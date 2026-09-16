// Inicializar mapa
const map = L.map("map", {
  minZoom: 5,
  maxBounds: [
    [27.5, -18.5], // Suroeste (El Hierro)
    [44.5, 4.5], // Noreste (Galicia y Menorca)
  ],
  maxBoundsViscosity: 1.0,
}).setView([40.0, -7.0], 5);

// Capa base
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
