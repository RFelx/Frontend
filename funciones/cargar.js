
// Contenido dinámico para cada sección
const views = {
    inicio: `
        <div class="dashboard" id="dash">
            <h2 id="dash24"></h2>
            <h2 id="dashTotal"></h2>
            <h2 id="dashSalidas"></h2>
        </div>
        <div class="titulor">
            <h2>Registros Recientes</h2>
        </div>
        <div class="tabla">
            <table id="tabla" border="1">
                <tr>
                    <th>ID de Registro</th>
                    <th>ID de Visitante</th>
                    <th>ID de Area</th>
                    <th>ID de Usuario</th>
                    <th>Motivo de Visita</th>
                    <th>Hora Entrada</th>
                    <th>Hora Salida</th>
                </tr>
            </table>
        </div>
    `,
    registrar: `
        <div class="titulor">
            <h2>Historial de Registros</h2>

            <button class="Agregar" id="btnAgregar">
                Agregar Nuevo Registro
            </button>

            <div id="modalContainer"></div>
        </div>

        <div class="tabla">
            <table id="tabla" border="1">
                <thead>
                    <tr>
                        <th>Visitante</th>
                        <th>Área a Visitar</th>
                        <th>Anfitrión</th>
                        <th>Motivo de Visita</th>
                        <th>Hora Entrada</th>
                        <th>Hora Salida</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>

                <tbody></tbody>
            </table>
        </div>
    `,
    actualizar: `
        <h1>Usuarios y Areas</h1>
        <p>Bottom Text.</p>
    `
};

// Función para reemplazar el contenido de <main>
function loadView(viewName) {
    const main = document.querySelector("main");
    main.innerHTML = views[viewName] || "<h1>404</h1><p>Vista no encontrada</p>";

    // Si la vista es "registrar", entonces ya existe la tabla en el DOM
    if (viewName === "registrar") {
        historialRegistros(); // aquí sí podemos llenarla con datos
        activarModal();
    }

    if (viewName === "inicio") {
        cargarRegistros();
        HistorialReciente();
        cargarSalidas();
    }

}

// Asignar eventos a las opciones del menú

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".options__menu a");

    links.forEach((link, index) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Quitar la clase selected de todos
            links.forEach(l => l.classList.remove("selected"));

            // Agregarla solo al que se presionó
            link.classList.add("selected");

            // Cargar la vista correspondiente
            if (index === 0) loadView("inicio");
            if (index === 1) loadView("registrar");
            if (index === 2) loadView("actualizar");
        });
    });
});
