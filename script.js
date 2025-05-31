const form = document.getElementById('formulario');
const input = document.getElementById('nombre');
const mensaje = document.getElementById('mensaje');
const historialUl = document.getElementById('historial');
const modoToggle = document.getElementById('modo-toggle');

// Activar modo oscuro si está guardado
if (localStorage.getItem('modo') === 'oscuro') {
  document.body.classList.add('dark-mode');
}

// Cambiar modo oscuro
modoToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const modo = document.body.classList.contains('dark-mode') ? 'oscuro' : 'claro';
  localStorage.setItem('modo', modo);
});

const actualizarHistorial = () => {
  const historial = JSON.parse(localStorage.getItem('historial')) || [];
  historialUl.innerHTML = '';
  historial.forEach(pais => {
    const li = document.createElement('li');
    li.textContent = pais;
    li.onclick = () => buscarPais(pais);
    historialUl.appendChild(li);
  });
};

const guardarEnHistorial = (pais) => {
  let historial = JSON.parse(localStorage.getItem('historial')) || [];
  historial = [pais, ...historial.filter(p => p.toLowerCase() !== pais.toLowerCase())].slice(0, 5);
  localStorage.setItem('historial', JSON.stringify(historial));
  actualizarHistorial();
};

const traducirAPaisIngles = async (texto) => {
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=es|en`);
    const data = await res.json();
    return data.responseData.translatedText;
  } catch {
    return texto; // Si falla, se usa lo que escribió el usuario
  }
};

const buscarPais = async (paisTexto) => {
  mensaje.textContent = '🔄 Traduciendo y buscando país...';
  const paisIngles = await traducirAPaisIngles(paisTexto);
  guardarEnHistorial(paisTexto);
  window.location.href = `/buscar?nombre=${encodeURIComponent(paisIngles)}`;
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = input.value.trim();
  if (!nombre) return;
  await buscarPais(nombre);
});

actualizarHistorial();
