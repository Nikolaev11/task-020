const form = document.querySelector('form');
localStorage.setItem('data', localStorage.getItem('data') ?? JSON.stringify([]) );

const removeChilds = (node) => node.querySelectorAll('*').forEach(child => child.remove());

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  searchText = formData.get('search');
  searchURL = encodeURI(`https://nominatim.openstreetmap.org/search?q=${searchText}&format=json&limit=1`);
  const response = await fetch(searchURL);
  const data = await response.json();
  const { boundingbox, lat, lon } = data[0];

  if (searchText.length > 0) {
    const data = JSON.parse(localStorage.getItem('data'));
    const newData = [ ...new Set([searchText, ...data])];
    localStorage.setItem('data', JSON.stringify(newData));
  }

  const mapDiv = document.querySelector('#map-div');
  removeChilds(mapDiv);
  const targetMap =  document.createElement("div");
  targetMap.id = 'map'
  mapDiv.appendChild(targetMap);
  const map = new L.map(targetMap);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  const marker = L.latLng(lat, lon);
  map.fitBounds([[boundingbox[0], boundingbox[2]], [boundingbox[1], boundingbox[3]]]);
  L.marker(marker).addTo(map);
});

form.addEventListener('input', (e) => {
const data = JSON.parse(localStorage.getItem('data'));
const text = e.target.value;
const autocompleteList = text === '' ? [] : data.filter((elem) => elem.toLowerCase().indexOf(text.toLowerCase()) === 0);

  const autocompleteDiv = document.querySelector('.autocomplete-list');
  removeChilds(autocompleteDiv);
  autocompleteList.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item;
    div.addEventListener('click', (e) => {
      document.querySelector('#input-text').value = item;
      removeChilds(autocompleteDiv);
    });
    autocompleteDiv.appendChild(div);
});
});
