// Contenido dinámico para cada sección
const views = {
    inicio: `
        <section class="dashboard">

            <div class="dashboard-header">
                <div>
                    <span class="dashboard-eyebrow">
                        Control de accesos
                    </span>

                    <h1>Dashboard</h1>

                    <p>
                        Resumen general de ingresos, salidas y
                        actividad reciente.
                    </p>
                </div>

                <button
                    type="button"
                    class="dashboard-btn-registro"
                    id="btnDashboardRegistro"
                >
                    Agregar nuevo registro
                </button>
            </div>

            <div class="dashboard-kpis">

                <article class="kpi-card">
                    <div class="kpi-icon kpi-icon-ingresos">
                        ↗
                    </div>

                    <div class="kpi-content">
                        <span class="kpi-label">
                            Ingresos recientes
                        </span>

                        <strong
                            class="kpi-value"
                            id="dash24"
                        >
                            0
                        </strong>

                        <span class="kpi-description">
                            Durante las últimas 24 horas
                        </span>
                    </div>
                </article>

                <article class="kpi-card">
                    <div class="kpi-icon kpi-icon-total">
                        ≡
                    </div>

                    <div class="kpi-content">
                        <span class="kpi-label">
                            Registros totales
                        </span>

                        <strong
                            class="kpi-value"
                            id="dashTotal"
                        >
                            0
                        </strong>

                        <span class="kpi-description">
                            Historial acumulado
                        </span>
                    </div>
                </article>

                <article class="kpi-card">
                    <div class="kpi-icon kpi-icon-salidas">
                        ↘
                    </div>

                    <div class="kpi-content">
                        <span class="kpi-label">
                            Salidas recientes
                        </span>

                        <strong
                            class="kpi-value"
                            id="dashSalidas"
                        >
                            0
                        </strong>

                        <span class="kpi-description">
                            Durante las últimas 24 horas
                        </span>
                    </div>
                </article>

                <article class="kpi-card">
                    <div class="kpi-icon kpi-icon-dentro">
                        ●
                    </div>

                    <div class="kpi-content">
                        <span class="kpi-label">
                            Personas dentro
                        </span>

                        <strong
                            class="kpi-value"
                            id="dashDentro"
                        >
                            0
                        </strong>

                        <span class="kpi-description">
                            Accesos actualmente activos
                        </span>
                    </div>
                </article>

            </div>

            <section class="dashboard-recent">

                <div class="recent-header">
                    <div>
                        <h2>Registros recientes</h2>

                        <p>
                            Movimientos registrados durante
                            las últimas 24 horas.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="btn-ver-historial"
                        id="btnVerHistorial"
                    >
                        Ver historial completo
                    </button>
                </div>

                <div class="recent-table-container">
                    <table id="tabla" class="recent-table">
                        <thead>
                            <tr>
                                <th>Visitante</th>
                                <th>Área</th>
                                <th>Anfitrión</th>
                                <th>Motivo de visita</th>
                                <th>Hora entrada</th>
                                <th>Hora salida</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody id="tablaRecientesBody">
                        </tbody>
                    </table>
                </div>

            </section>

        </section>
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
        <section class="personal-page">

            <div class="personal-header">
                <div>
                    <span class="personal-eyebrow">
                        Administración
                    </span>

                    <h1>Personal y anfitriones</h1>

                    <p>
                        Administra a los empleados con acceso a
                        SENTINEL y define quiénes pueden recibir
                        visitantes.
                    </p>
                </div>
            </div>

            <div class="personal-layout">

                <section class="personal-card personal-form-card">

                    <div class="personal-card-header">
                        <h2>Registrar empleado</h2>

                        <p>
                            Captura los datos y permisos del nuevo
                            integrante.
                        </p>
                    </div>

                    <form id="formUser" class="personal-form">

                        <div class="personal-field">
                            <label for="nombre">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Ej. María Fernández"
                                autocomplete="name"
                                required
                            >
                        </div>

                        <div class="personal-field">
                            <label for="correo">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="nombre@empresa.com"
                                autocomplete="email"
                                required
                            >
                        </div>

                        <div class="personal-field">
                            <label for="areaUsuario">
                                Área o departamento
                            </label>

                            <div class="area-selector-group">
                                <select
                                    id="areaUsuario"
                                    name="id_area"
                                    required
                                >
                                    <option value="">
                                        Selecciona un área
                                    </option>
                                </select>

                                <button
                                    type="button"
                                    id="btnMostrarNuevaArea"
                                    class="btn-nueva-area"
                                >
                                    + Nueva área
                                </button>
                            </div>
                        </div>

                        <div
                            id="formNuevaArea"
                            class="nueva-area-box"
                            style="display: none;"
                        >
                            <div class="nueva-area-header">
                                <div>
                                    <strong>Registrar nueva área</strong>

                                    <small>
                                        La nueva área aparecerá automáticamente
                                        en el selector.
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    id="btnCerrarNuevaArea"
                                    class="btn-cerrar-area"
                                    aria-label="Cerrar"
                                >
                                    ×
                                </button>
                            </div>

                            <div class="personal-field">
                                <label for="nombreNuevaArea">
                                    Nombre del área
                                </label>

                                <input
                                    type="text"
                                    id="nombreNuevaArea"
                                    placeholder="Ej. Calidad"
                                    autocomplete="off"
                                >
                            </div>

                            <div
                                id="mensajeNuevaArea"
                                class="personal-message"
                                aria-live="polite"
                            ></div>

                            <button
                                type="button"
                                id="btnGuardarNuevaArea"
                                class="btn-guardar-area"
                            >
                                Guardar área
                            </button>
                        </div>
                        <div class="personal-field">
                            <label for="rol">
                                Rol dentro del sistema
                            </label>

                            <select
                                id="rol"
                                name="rol"
                                required
                            >
                                <option value="">
                                    Selecciona un rol
                                </option>

                                <option value="Administrador">
                                    Administrador
                                </option>

                                <option value="Guardia">
                                    Guardia
                                </option>

                                <option value="Operativo">
                                    Operativo
                                </option>
                            </select>
                        </div>

                        <div class="personal-field">
                            <label for="password_hash">
                                Contraseña temporal
                            </label>

                            <input
                                type="password"
                                id="password_hash"
                                name="password_hash"
                                placeholder="Ingresa una contraseña"
                                autocomplete="new-password"
                                required
                            >
                        </div>

                        <label class="anfitrion-option">
                            <input
                                type="checkbox"
                                id="es_anfitrion"
                                name="es_anfitrion"
                            >

                            <span class="anfitrion-check"></span>

                            <span>
                                <strong>
                                    Disponible como anfitrión
                                </strong>

                                <small>
                                    Podrá ser seleccionado para recibir
                                    visitantes.
                                </small>
                            </span>
                        </label>

                        <div
                            id="mensajeUsuario"
                            class="personal-message"
                            aria-live="polite"
                        ></div>

                        <button
                            type="submit"
                            id="btnGuardarUsuario"
                            class="personal-submit"
                        >
                            Registrar empleado
                        </button>

                    </form>

                </section>

                <section class="personal-card personal-list-card">

                    <div class="personal-card-header personal-list-header">
                        <div>
                            <h2>Personal registrado</h2>

                            <p>
                                Cuentas disponibles dentro de SENTINEL.
                            </p>
                        </div>

                        <span
                            id="totalUsuarios"
                            class="personal-counter"
                        >
                            0 empleados
                        </span>
                    </div>

                    <div class="personal-table-container">

                        <table
                            id="tablaUser"
                            class="personal-table"
                        >
                            <thead>
                                <tr>
                                    <th>Empleado</th>
                                    <th>Área</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Anfitrión</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>

                            <tbody></tbody>
                        </table>

                    </div>

                </section>

            </div>

        </section>
    `,
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
        activarBotonesDashboard();
    }

    if (viewName === "actualizar") {
    inicializarUsuarios();
}

}

function activarBotonesDashboard() {
    const btnNuevoRegistro =
        document.getElementById(
            "btnDashboardRegistro"
        );

    const btnVerHistorial =
        document.getElementById(
            "btnVerHistorial"
        );

    if (btnNuevoRegistro) {
        btnNuevoRegistro.addEventListener(
            "click",
            () => {
                loadView("registrar");

                document
                    .querySelectorAll(
                        ".options__menu a"
                    )
                    .forEach((link) => {
                        link.classList.remove(
                            "selected"
                        );
                    });

                const links =
                    document.querySelectorAll(
                        ".options__menu a"
                    );

                if (links[1]) {
                    links[1].classList.add(
                        "selected"
                    );
                }
            }
        );
    }

    if (btnVerHistorial) {
        btnVerHistorial.addEventListener(
            "click",
            () => {
                loadView("registrar");

                document
                    .querySelectorAll(
                        ".options__menu a"
                    )
                    .forEach((link) => {
                        link.classList.remove(
                            "selected"
                        );
                    });

                const links =
                    document.querySelectorAll(
                        ".options__menu a"
                    );

                if (links[1]) {
                    links[1].classList.add(
                        "selected"
                    );
                }
            }
        );
    }
}

// Asignar eventos a las opciones del menú

document.addEventListener("DOMContentLoaded", () => {
    loadView("inicio");
    
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
