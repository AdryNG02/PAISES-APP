const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/buscar', async (req, res) => {
  const nombrePais = req.query.nombre;

  if (!nombrePais) {
    return res.send(`<html><head><title>Error</title></head><body>
    <h1>Error</h1><p>No se especificó ningún país.</p><a href="/">Volver</a>
    </body></html>`);
  }

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${nombrePais}`);
    const pais = response.data[0];

    const idiomas = pais.languages ? Object.values(pais.languages).join(', ') : 'No disponible';
    const monedas = pais.currencies ? Object.values(pais.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'No disponible';

    const lat = pais.latlng[0];
    const lng = pais.latlng[1];

    res.send(`
      <html>
        <head>
          <title>${pais.name.common}</title>
          <link rel="stylesheet" href="/style.css">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        </head>
        <body>
          <h1>${pais.name.common}</h1>
          <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : 'No disponible'}</p>
          <p><strong>Región:</strong> ${pais.region}</p>
          <p><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
          <p><strong>Área:</strong> ${pais.area.toLocaleString()} km²</p>
          <p><strong>Idioma(s):</strong> ${idiomas}</p>
          <p><strong>Moneda(s):</strong> ${monedas}</p>
          <img src="${pais.flags.svg}" alt="Bandera de ${pais.name.common}" width="200"/>
          
          <div id="map" style="height: 400px; margin-top: 1rem;"></div>

          <br><br><a href="/">🔙 Volver</a>

          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            const map = L.map('map').setView([${lat}, ${lng}], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            L.marker([${lat}, ${lng}]).addTo(map)
              .bindPopup("${pais.name.common}")
              .openPopup();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    res.send(`<html><head><title>Error</title></head><body>
    <h1>Error</h1><p>No se pudo encontrar el país "${nombrePais}".</p><a href="/">Volver</a>
    </body></html>`);
  }
});

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${port}`);
});









