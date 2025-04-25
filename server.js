const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Servir archivos estáticos como index.html y CSS
app.use(express.static(path.join(__dirname, 'public')));

// Ruta que recibe la búsqueda del país y consulta a restcountries.com
app.get('/buscar', async (req, res) => {
  const nombrePais = req.query.nombre;

  if (!nombrePais) {
    return res.send(`
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Error</h1>
          <p>No se especificó ningún país.</p>
          <a href="/">Volver</a>
        </body>
      </html>
    `);
  }

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${nombrePais}`);
    const pais = response.data[0];

    res.send(`
      <html>
        <head>
          <title>${pais.name.common}</title>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>${pais.name.common}</h1>
          <p><strong>Capital:</strong> ${pais.capital ? pais.capital[0] : 'No disponible'}</p>
          <p><strong>Región:</strong> ${pais.region}</p>
          <p><strong>Población:</strong> ${pais.population.toLocaleString()}</p>
          <p><strong>Área:</strong> ${pais.area.toLocaleString()} km²</p>
          <img src="${pais.flags.svg}" alt="Bandera de ${pais.name.common}" width="200"/>
          <br><br>
          <a href="/">🔙 Volver</a>
        </body>
      </html>
    `);
  } catch (error) {
    res.send(`
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Error</h1>
          <p>No se pudo encontrar el país "${nombrePais}".</p>
          <a href="/">Volver</a>
        </body>
      </html>
    `);
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor combinado en: http://localhost:${port}`);
});




