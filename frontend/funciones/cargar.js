
// Contenido dinámico para cada sección
const views = {
    inicio: `
        <h1>Title Exemple</h1><br>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam sapiente cumque dicta animi explicabo sequi. Ex amet et, dolor eligendi commodi consectetur quo voluptatibus, cum nemo porro veniam at blanditiis?</p> <br>

        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident adipisci beatae impedit quia, deleniti quasi sequi iusto exercitationem nihil nulla, laboriosam dolore corrupti fuga officiis? Odit a mollitia id magnam amet delectus quia blanditiis reprehenderit explicabo eveniet! Rem voluptatum explicabo ipsum quae, dolorum, laudantium doloribus a, illum saepe sapiente accusantium dicta reiciendis? Amet iure porro voluptatum error fugit odit voluptas?</p>
   
    `,
    registrar: `
    <div class="titulor">
        <h2>Historial de Registros</h2>
        <button class="Agregar" id="btnAgregar">Agregar Nuevo Registro</button>
        <div id="modalContainer"></div>
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
    actualizar: `
        <h1>Actualizar</h1>
        <p>Selecciona un registro para actualizarlo.</p>
    `
};

// Función para reemplazar el contenido de <main>
function loadView(viewName) {
    const main = document.querySelector("main");
    main.innerHTML = views[viewName] || "<h1>404</h1><p>Vista no encontrada</p>";

    // Si la vista es "registrar", entonces ya existe la tabla en el DOM
    if (viewName === "registrar") {
        cargarRegistros(); // aquí sí podemos llenarla con datos
        activarModal();
    }
}

// Asignar eventos a las opciones del menú
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".options__menu a").forEach((link, index) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            if (index === 0) loadView("inicio");
            if (index === 1) loadView("registrar");
            if (index === 2) loadView("actualizar");
        });
    });
});
