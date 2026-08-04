const API_USUARIOS =
    "http://127.0.0.1:8000/usuarios/";

const API_AREAS =
    "http://127.0.0.1:8000/areas/";


async function cargarAreasUsuario(
    idAreaSeleccionada = null
) {
    const token =
        localStorage.getItem("token");

    const areaSelect =
        document.getElementById(
            "areaUsuario"
        );

    if (!areaSelect) {
        return;
    }

    areaSelect.innerHTML = `
        <option value="">
            Cargando áreas...
        </option>
    `;

    try {
        const respuesta = await fetch(
            API_AREAS,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible cargar las áreas."
            );
        }

        const areas =
            await respuesta.json();

        areaSelect.innerHTML = `
            <option value="">
                Selecciona un área
            </option>
        `;

        areas.forEach((area) => {
            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                area.id_area;

            opcion.textContent =
                area.nombre_area;

            areaSelect.appendChild(opcion);
        });

        if (idAreaSeleccionada !== null) {
            areaSelect.value =
                String(idAreaSeleccionada);
        }

    } catch (error) {
        console.error(
            "Error al cargar áreas:",
            error
        );

        areaSelect.innerHTML = `
            <option value="">
                No fue posible cargar las áreas
            </option>
        `;
    }
}


function mostrarMensajeUsuario(
    mensaje,
    tipo = "success"
) {
    const contenedor =
        document.getElementById(
            "mensajeUsuario"
        );

    if (!contenedor) {
        return;
    }

    contenedor.textContent = mensaje;

    contenedor.className =
        `personal-message visible ${tipo}`;
}


function limpiarMensajeUsuario() {
    const contenedor =
        document.getElementById(
            "mensajeUsuario"
        );

    if (!contenedor) {
        return;
    }

    contenedor.textContent = "";

    contenedor.className =
        "personal-message";
}


function mostrarMensajeNuevaArea(
    mensaje,
    tipo = "success"
) {
    const contenedor =
        document.getElementById(
            "mensajeNuevaArea"
        );

    if (!contenedor) {
        return;
    }

    contenedor.textContent = mensaje;

    contenedor.className =
        `personal-message visible ${tipo}`;
}


function limpiarMensajeNuevaArea() {
    const contenedor =
        document.getElementById(
            "mensajeNuevaArea"
        );

    if (!contenedor) {
        return;
    }

    contenedor.textContent = "";

    contenedor.className =
        "personal-message";
}


function crearBadge(
    texto,
    clase
) {
    return `
        <span class="badge-personal ${clase}">
            ${texto}
        </span>
    `;
}


async function cargarUsuarios() {
    const token =
        localStorage.getItem("token");

    const cuerpoTabla =
        document.querySelector(
            "#tablaUser tbody"
        );

    const contador =
        document.getElementById(
            "totalUsuarios"
        );

    if (!cuerpoTabla) {
        return;
    }

    cuerpoTabla.innerHTML = `
        <tr>
            <td
                colspan="6"
                class="personal-loading"
            >
                Cargando personal...
            </td>
        </tr>
    `;

    try {
        const respuesta = await fetch(
            API_USUARIOS,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible obtener el personal."
            );
        }

        const usuarios =
            await respuesta.json();

        cuerpoTabla.innerHTML = "";

        if (contador) {
            contador.textContent =
                usuarios.length === 1
                    ? "1 empleado"
                    : `${usuarios.length} empleados`;
        }

        if (usuarios.length === 0) {
            cuerpoTabla.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="personal-empty"
                    >
                        No hay personal registrado.
                    </td>
                </tr>
            `;

            return;
        }

        usuarios.forEach((usuario) => {
            const fila =
                document.createElement("tr");

            const badgeRol =
                crearBadge(
                    usuario.rol,
                    "badge-rol"
                );

            const badgeAnfitrion =
                usuario.es_anfitrion
                    ? crearBadge(
                        "Sí",
                        "badge-anfitrion"
                    )
                    : crearBadge(
                        "No",
                        "badge-no-anfitrion"
                    );

            const badgeEstado =
                usuario.activo
                    ? crearBadge(
                        "Activo",
                        "badge-activo"
                    )
                    : crearBadge(
                        "Inactivo",
                        "badge-inactivo"
                    );

            fila.innerHTML = `
                <td>
                    <div class="personal-name">
                        <strong>
                            ${usuario.nombre}
                        </strong>

                        <small>
                            ID ${usuario.id_usuario}
                        </small>
                    </div>
                </td>

                <td>
                    ${
                        usuario.nombre_area ||
                        "Sin área"
                    }
                </td>

                <td>
                    ${usuario.correo}
                </td>

                <td>
                    ${badgeRol}
                </td>

                <td>
                    ${badgeAnfitrion}
                </td>

                <td>
                    ${badgeEstado}
                </td>
            `;

            cuerpoTabla.appendChild(fila);
        });

    } catch (error) {
        console.error(
            "Error al cargar personal:",
            error
        );

        cuerpoTabla.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="personal-empty"
                >
                    No fue posible cargar el personal.
                </td>
            </tr>
        `;

        if (contador) {
            contador.textContent =
                "Sin información";
        }
    }
}


function inicializarUsuarios() {
    const form =
        document.getElementById(
            "formUser"
        );

    if (!form) {
        return;
    }

    cargarUsuarios();
    cargarAreasUsuario();

    const btnMostrarNuevaArea =
        document.getElementById(
            "btnMostrarNuevaArea"
        );

    const btnCerrarNuevaArea =
        document.getElementById(
            "btnCerrarNuevaArea"
        );

    const btnGuardarNuevaArea =
        document.getElementById(
            "btnGuardarNuevaArea"
        );

    const formNuevaArea =
        document.getElementById(
            "formNuevaArea"
        );

    const nombreNuevaArea =
        document.getElementById(
            "nombreNuevaArea"
        );

    /*
    ============================================
    MOSTRAR FORMULARIO DE NUEVA ÁREA
    ============================================
    */

    if (
        btnMostrarNuevaArea &&
        formNuevaArea &&
        nombreNuevaArea
    ) {
        btnMostrarNuevaArea.addEventListener(
            "click",
            () => {
                limpiarMensajeNuevaArea();

                formNuevaArea.style.display =
                    "flex";

                nombreNuevaArea.focus();
            }
        );
    }

    /*
    ============================================
    CERRAR FORMULARIO DE NUEVA ÁREA
    ============================================
    */

    if (
        btnCerrarNuevaArea &&
        formNuevaArea &&
        nombreNuevaArea
    ) {
        btnCerrarNuevaArea.addEventListener(
            "click",
            () => {
                formNuevaArea.style.display =
                    "none";

                nombreNuevaArea.value = "";

                limpiarMensajeNuevaArea();
            }
        );
    }

    /*
    ============================================
    REGISTRAR NUEVA ÁREA
    ============================================
    */

    if (
        btnGuardarNuevaArea &&
        nombreNuevaArea &&
        formNuevaArea
    ) {
        btnGuardarNuevaArea.addEventListener(
            "click",
            async () => {
                limpiarMensajeNuevaArea();

                const nombreArea =
                    nombreNuevaArea.value.trim();

                if (!nombreArea) {
                    mostrarMensajeNuevaArea(
                        "Ingresa el nombre del área.",
                        "error"
                    );

                    nombreNuevaArea.focus();
                    return;
                }

                const token =
                    localStorage.getItem(
                        "token"
                    );

                btnGuardarNuevaArea.disabled =
                    true;

                btnGuardarNuevaArea.textContent =
                    "Guardando...";

                try {
                    const respuesta = await fetch(
                        API_AREAS,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                                "Authorization":
                                    `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                nombre_area:
                                    nombreArea
                            })
                        }
                    );

                    if (!respuesta.ok) {
                        let mensaje =
                            "No fue posible registrar el área.";

                        try {
                            const errorData =
                                await respuesta.json();

                            if (
                                typeof errorData.detail
                                === "string"
                            ) {
                                mensaje =
                                    errorData.detail;
                            }
                        } catch {
                            // Conserva el mensaje predeterminado.
                        }

                        throw new Error(mensaje);
                    }

                    const areaCreada =
                        await respuesta.json();

                    await cargarAreasUsuario(
                        areaCreada.id_area
                    );

                    nombreNuevaArea.value = "";

                    mostrarMensajeNuevaArea(
                        "Área registrada correctamente.",
                        "success"
                    );

                    setTimeout(() => {
                        formNuevaArea.style.display =
                            "none";

                        limpiarMensajeNuevaArea();
                    }, 1000);

                } catch (error) {
                    console.error(
                        "Error al registrar área:",
                        error
                    );

                    mostrarMensajeNuevaArea(
                        error.message,
                        "error"
                    );

                } finally {
                    btnGuardarNuevaArea.disabled =
                        false;

                    btnGuardarNuevaArea.textContent =
                        "Guardar área";
                }
            }
        );
    }

    /*
    ============================================
    REGISTRAR EMPLEADO
    ============================================
    */

    form.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            limpiarMensajeUsuario();

            const nombre =
                document
                    .getElementById("nombre")
                    .value
                    .trim();

            const correo =
                document
                    .getElementById("correo")
                    .value
                    .trim();

            const idArea =
                document
                    .getElementById(
                        "areaUsuario"
                    )
                    .value;

            const rol =
                document
                    .getElementById("rol")
                    .value;

            const passwordHash =
                document
                    .getElementById(
                        "password_hash"
                    )
                    .value;

            const esAnfitrion =
                document
                    .getElementById(
                        "es_anfitrion"
                    )
                    .checked;

            const boton =
                document.getElementById(
                    "btnGuardarUsuario"
                );

            if (
                !nombre ||
                !correo ||
                !idArea ||
                !rol ||
                !passwordHash
            ) {
                mostrarMensajeUsuario(
                    "Completa todos los campos obligatorios.",
                    "error"
                );

                return;
            }

            if (passwordHash.length < 6) {
                mostrarMensajeUsuario(
                    "La contraseña debe tener al menos 6 caracteres.",
                    "error"
                );

                return;
            }

            const datosUsuario = {
                nombre: nombre,
                correo: correo,
                rol: rol,
                password_hash: passwordHash,
                activo: true,
                es_anfitrion: esAnfitrion,
                id_area: Number(idArea)
            };

            const token =
                localStorage.getItem(
                    "token"
                );

            boton.disabled = true;

            boton.textContent =
                "Registrando...";

            try {
                const respuesta = await fetch(
                    API_USUARIOS,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            "Authorization":
                                `Bearer ${token}`
                        },
                        body: JSON.stringify(
                            datosUsuario
                        )
                    }
                );

                if (!respuesta.ok) {
                    let mensaje =
                        "No fue posible registrar al empleado.";

                    try {
                        const errorData =
                            await respuesta.json();

                        if (
                            typeof errorData.detail
                            === "string"
                        ) {
                            mensaje =
                                errorData.detail;
                        }
                    } catch {
                        // Conserva el mensaje predeterminado.
                    }

                    throw new Error(mensaje);
                }

                form.reset();

                mostrarMensajeUsuario(
                    "Empleado registrado correctamente.",
                    "success"
                );

                await cargarUsuarios();

                await cargarAreasUsuario();

            } catch (error) {
                console.error(
                    "Error al registrar empleado:",
                    error
                );

                mostrarMensajeUsuario(
                    error.message,
                    "error"
                );

            } finally {
                boton.disabled = false;

                boton.textContent =
                    "Registrar empleado";
            }
        }
    );
}