function activarModal() {
  const btn = document.getElementById("btnAgregar");
  const modalContainer = document.getElementById("modalContainer");

  if (!btn) return;

  btn.addEventListener("click", async () => {
    // Cargar el HTML externo del modal
    const respuesta = await fetch("modal.html");
    const contenido = await respuesta.text();

    // Insertar el modal en el contenedor
    modalContainer.innerHTML = contenido;

    // Mostrar el modal
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    // Configurar cierre con la X
    const spanCerrar = document.getElementById("cerrar");
    spanCerrar.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Configurar cierre al hacer clic fuera del modal
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });

    // Manejo del submit del formulario
    const form = document.getElementById("formRegistro");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const datos = {
        id_visitante: e.target.id_visitante.value,
        id_area: e.target.id_area.value,
        id_usuario: e.target.id_usuario.value,
        motivo_visita: e.target.motivo_visita.value,
        anfitrion: e.target.anfitrion.value
      };

      const token = localStorage.getItem("token");
      const respuesta = await fetch("http://127.0.0.1:8000/registros-accesos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });

      if (respuesta.ok) {
        alert("Registro agregado correctamente");
        modal.style.display = "none"; // cerrar modal
        cargarRegistros(); // refrescar tabla
      } else {
        alert("Error al agregar registro");
      }
    });
  });
}

