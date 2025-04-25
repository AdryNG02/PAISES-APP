const axios = require('axios');


const pais = process.argv[2] || 'colombia'; 

const url = `https://restcountries.com/v3.1/name/${pais}`;

axios.get(url)
  .then(response => {
    const datos = response.data[0]; 

    console.log('📌 Información del País\n');
    console.log(`🌍 Nombre: ${datos.name.common}`);
    console.log(`🏙️ Capital: ${datos.capital?.[0] || 'No tiene'}`);
    console.log(`🌎 Región: ${datos.region}`);
    console.log(`🗣️ Idiomas: ${Object.values(datos.languages).join(', ')}`);
    console.log(`💰 Moneda: ${Object.values(datos.currencies).map(c => c.name + ' (' + c.symbol + ')').join(', ')}`);
    console.log(`👨‍👩‍👧‍👦 Población: ${datos.population.toLocaleString()} habitantes`);
    console.log(`🧭 Fronteras: ${datos.borders ? datos.borders.join(', ') : 'Ninguna'}`);
    console.log(`🏳️ Bandera: ${datos.flags.png}`);
  })
  .catch(error => {
    console.error('Error al obtener los datos del país:', error.message);
  });
