// URL de la API Node.js (ajusta si usas IP local o Plesk)
const API_URL = "http://localhost:3000/medidas";

async function cargarMedidas() {
  const tbody = document.getElementById("tbody-medidas");
  const error = document.getElementById("error");
  error.hidden = true;

  tbody.innerHTML = `<tr><td colspan="7" class="muted">Cargando mediciones...</td></tr>`;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.medidas || data.medidas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="muted">No hay mediciones registradas.</td></tr>`;
      return;
    }

    // Ordenar de más reciente a más antigua
    const medidasOrdenadas = data.medidas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    tbody.innerHTML = "";

    medidasOrdenadas.forEach(m => {
      const fechaObj = new Date(m.fecha);
      const fecha = fechaObj.toLocaleDateString();
      const hora = fechaObj.toLocaleTimeString();

      const fila = `
        <tr>
          <td>${m.id}</td>
          <td>${m.uuid}</td>
          <td>${m.gas ?? "-"}</td>
          <td>${m.contador ?? "-"}</td>
          <td>${fecha}</td>
          <td>${hora}</td>
        </tr>`;
      tbody.innerHTML += fila;
    });

  } catch (err) {
    console.error("Error al obtener medidas:", err);
    tbody.innerHTML = "";
    error.hidden = false;
    error.textContent = "❌ Error al conectar con la API REST.";
  }
}

// Cargar al iniciar y refrescar cada 5 s
document.addEventListener("DOMContentLoaded", () => {
  cargarMedidas();
  setInterval(cargarMedidas, 10000);
});
