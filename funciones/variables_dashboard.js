// Variables globales
let registros24hrs = 0;
let registrosTotal = 0;
let salidas24hrs = 0;

const API_REGISTROS = "http://127.0.0.1:8000/registros-accesos/";

async function cargarRegistros() {
  const token = localStorage.getItem("token");
  const respuesta = await fetch(API_REGISTROS, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!respuesta.ok) {
    document.getElementById("dash24").innerText = "Error al cargar";
    return;
  }

  const registros = await respuesta.json();

  // Calcular límite de 24h
  const ahora = new Date();
  const limite = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

  // Filtrar registros recientes
  const recientes = registros.filter(r => {
    const fechaRegistro = new Date(r.fecha_hora_entrada); 
    return fechaRegistro >= limite;
  }
);

  // Guardar cantidades en variables globales
  registros24hrs = recientes.length;
  registrosTotal = registros.length;

  // Mostrar en el h2 (últimas 24h)
  document.getElementById("dash24").innerText =
    `Registros en últimas 24h: ${registros24hrs}`;

  document.getElementById("dashTotal").innerText =
    `Registros Totales: ${registrosTotal}`;
}

cargarRegistros();

async function HistorialReciente() {
  try {
    const token = localStorage.getItem("token");
    const respuesta = await fetch(API_REGISTROS, {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );

    if (!respuesta.ok) throw new Error("No autorizado o error en la petición");

    const datos = await respuesta.json();

    // Calcular límite de 24h
    const ahora = new Date();
    const limite = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

    // Filtrar solo los registros recientes
    const recientes = datos.filter(r => {
      const fechaRegistro = new Date(r.fecha_hora_entrada);
      return fechaRegistro >= limite;
    }
  );

    console.log("Registros recientes:", recientes);

    const tabla = document.getElementById("tabla");
    tabla.innerHTML = `
      <tr>
        <th>Visitante</th>
        <th>Área</th>
        <th>Anfitrión</th>
        <th>Motivo de Visita</th>
        <th>Hora Entrada</th>
        <th>Hora Salida</th>
      </tr>
    `;

    recientes.forEach(fila => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${fila.visitante}</td>
        <td>${fila.area}</td>
        <td>${fila.anfitrion}</td>
        <td>${fila.motivo_visita}</td>
        <td>${formatearFecha(fila.fecha_hora_entrada)}</td>
        <td>${formatearFecha(fila.fecha_hora_salida)}</td>
      `;
      tabla.appendChild(tr);
    }
  );
  } catch (error) {
    console.error("Error cargando registros:", error);
  }
}

HistorialReciente();

async function cargarSalidas() {
  const token = localStorage.getItem("token");
  const respuesta = await fetch(API_REGISTROS, {
    headers: {"Authorization": `Bearer ${token}`
  }
});

  if (!respuesta.ok) {
    document.getElementById("dashSalidas").innerText = "Error al cargar";
    return;
  }

  const registros = await respuesta.json();

  // Calcular límite de 24h
  const ahora = new Date();
  const limite = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

  // Filtrar registros recientes
  const recientes = registros.filter(r => {
    const fechaRegistro = new Date(r.fecha_hora_salida); 
    return fechaRegistro >= limite;
  });

  // Guardar cantidades en variables globales
  salidas24hrs = recientes.length;

  // Mostrar salidas en las ultimas 24hrs en el h2
  document.getElementById("dashSalidas").innerText =
    `Salidas en últimas 24h: ${salidas24hrs}`;
}

cargarSalidas();

function formatearFecha(fecha) {
  if (!fecha) {
    return "Dentro";
  }

  return new Date(fecha).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}