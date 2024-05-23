// Initialize the modern map centered around Eindhoven
const modernMap = L.map('modernMap').setView([51.4416, 5.4697], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(modernMap);

let modernMapPoint = null;
let oldMapPoint = null;
let pointMappings = JSON.parse(localStorage.getItem('pointMappings')) || [];  // Retrieve saved mappings from localStorage

// Click event for the modern map
modernMap.on('click', function(e) {
  if (modernMapPoint) {
    modernMap.removeLayer(modernMapPoint);
  }
  modernMapPoint = L.marker(e.latlng).addTo(modernMap);
  updateCoordinatesDisplay();
});

// Initialize the old map with the image overlay
const oldMap = L.map('oldMap', {
  crs: L.CRS.Simple,
  minZoom: -4,  // Allow zooming out to see the entire image
  maxZoom: 4,   // Allow zooming in
});

const imageUrl = 'Eindhoven_current_map.png';  // Replace with your image path
const imageWidth = 2000;  // Image width in pixels
const imageHeight = 1500;  // Image height in pixels
const imageBounds = [[0, 0], [imageHeight, imageWidth]];  // Define bounds to preserve aspect ratio

L.imageOverlay(imageUrl, imageBounds).addTo(oldMap);
oldMap.setMaxBounds(imageBounds);  // Set max bounds to prevent panning outside the image

// Fit the map to the bounds of the image and set an appropriate initial zoom level
oldMap.fitBounds(imageBounds);
oldMap.setView([imageHeight / 2, imageWidth / 2], -1);  // Center the map and adjust the zoom level

// Click event for the old map
oldMap.on('click', function(e) {
  if (oldMapPoint) {
    oldMap.removeLayer(oldMapPoint);
  }
  oldMapPoint = L.marker(e.latlng).addTo(oldMap);
  updateCoordinatesDisplay();
});

function updateCoordinatesDisplay() {
  if (modernMapPoint) {
    const modernMapCoords = modernMapPoint.getLatLng();
    document.getElementById('modernCoords').textContent = `Modern Map Coordinates: ${modernMapCoords.lat.toFixed(5)}, ${modernMapCoords.lng.toFixed(5)}`;
  }

  if (oldMapPoint) {
    const oldMapCoords = oldMapPoint.getLatLng();
    document.getElementById('oldCoords').textContent = `Old Map Coordinates: X=${oldMapCoords.lat.toFixed(0)}, Y=${oldMapCoords.lng.toFixed(0)}`;
  }
}

// Event listener for the ADD button
document.getElementById('addButton').addEventListener('click', function() {
  if (modernMapPoint && oldMapPoint) {
    const modernMapCoords = modernMapPoint.getLatLng();
    const oldMapCoords = oldMapPoint.getLatLng();

    // Store the mapping of points
    const mapping = {
      modern: modernMapCoords,
      old: oldMapCoords
    };
    pointMappings.push(mapping);

    // Save the updated mappings to localStorage
    localStorage.setItem('pointMappings', JSON.stringify(pointMappings));

    console.log('Modern Map Point:', modernMapCoords);
    console.log('Old Map Point:', oldMapCoords);
    console.log('Point Mappings:', pointMappings);
  }
});

// Event listener for the RETRIEVE button
document.getElementById('retrieveButton').addEventListener('click', function() {
  document.getElementById('mappings').textContent = JSON.stringify(pointMappings, null, 2);  // Display the mappings in a readable format
});

// Event listener for the CLEAR button
document.getElementById('clearButton').addEventListener('click', function() {
  pointMappings = [];  // Clear the array
  localStorage.removeItem('pointMappings');  // Remove the data from localStorage
  document.getElementById('mappings').textContent = '';  // Clear the display
  document.getElementById('modernCoords').textContent = 'Modern Map Coordinates: ';
  document.getElementById('oldCoords').textContent = 'Old Map Coordinates: ';
});
