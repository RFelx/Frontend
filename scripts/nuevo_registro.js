function activarModal() {
    const btn = document.getElementById("btnAgregar");
    const modalContainer =
        document.getElementById("modalContainer");

    if (!btn || !modalContainer) {
        return;
    }

    btn.addEventListener("click", async () => {
        try {
            const respuestaModal =
                await fetch("modal.html");

            if (!respuestaModal.ok) {
                throw new Error(
                    "No fue posible cargar el formulario."
                );
            }

            const contenido =
                await respuestaModal.text();

            modalContainer.innerHTML = contenido;

        } catch (error) {
            console.error(
                "Error al cargar el modal:",
                error
            );

            alert(error.message);
            return;
        }

        const modal =
            document.getElementById("modal");

        const datosAcceso =
            document.getElementById("datosAcceso");

        const areaSelect =
            document.getElementById("areaSelect");

        const anfitrionSelect =
            document.getElementById(
                "anfitrionSelect"
            );

        if (
            !modal ||
            !datosAcceso ||
            !areaSelect ||
            !anfitrionSelect
        ) {
            console.error(
                "Faltan elementos requeridos dentro del modal."
            );

            return;
        }

        modal.style.display = "flex";
        datosAcceso.style.display = "none";

        const token =
            localStorage.getItem("token");

        let anfitrionesDisponibles = [];

        /*
        ============================================
        CARGAR ÁREAS
        ============================================
        */

        try {
            const respuestaAreas = await fetch(
                "http://127.0.0.1:8000/areas/",
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            if (!respuestaAreas.ok) {
                throw new Error(
                    "No fue posible cargar las áreas."
                );
            }

            const areas =
                await respuestaAreas.json();

            areaSelect.innerHTML = `
                <option value="">
                    Selecciona un área
                </option>
            `;

            areas.forEach((area) => {
                const opcion =
                    document.createElement("option");

                opcion.value =
                    area.id_area;

                opcion.textContent =
                    area.nombre_area;

                areaSelect.appendChild(opcion);
            });

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

        /*
        ============================================
        CARGAR ANFITRIONES
        ============================================
        */

        try {
            const respuestaAnfitriones =
                await fetch(
                    "http://127.0.0.1:8000/usuarios/anfitriones/",
                    {
                        method: "GET",
                        headers: {
                            "Accept":
                                "application/json",
                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );

            if (!respuestaAnfitriones.ok) {
                throw new Error(
                    "No fue posible cargar los anfitriones."
                );
            }

            anfitrionesDisponibles =
                await respuestaAnfitriones.json();

            anfitrionSelect.innerHTML = `
                <option value="">
                    Selecciona primero un área
                </option>
            `;

            anfitrionSelect.disabled = true;

        } catch (error) {
            console.error(
                "Error al cargar anfitriones:",
                error
            );

            anfitrionSelect.innerHTML = `
                <option value="">
                    No fue posible cargar los anfitriones
                </option>
            `;

            anfitrionSelect.disabled = true;
        }

        /*
        ============================================
        FILTRAR ANFITRIONES POR ÁREA
        ============================================
        */

        areaSelect.addEventListener(
            "change",
            () => {
                const idAreaSeleccionada =
                    Number(areaSelect.value);

                anfitrionSelect.innerHTML = "";

                if (!idAreaSeleccionada) {
                    anfitrionSelect.innerHTML = `
                        <option value="">
                            Selecciona primero un área
                        </option>
                    `;

                    anfitrionSelect.disabled = true;
                    return;
                }

                const anfitrionesFiltrados =
                    anfitrionesDisponibles.filter(
                        (anfitrion) =>
                            Number(
                                anfitrion.id_area
                            ) ===
                            idAreaSeleccionada
                    );

                if (
                    anfitrionesFiltrados.length
                    === 0
                ) {
                    anfitrionSelect.innerHTML = `
                        <option value="">
                            No hay anfitriones disponibles
                        </option>
                    `;

                    anfitrionSelect.disabled = true;
                    return;
                }

                anfitrionSelect.innerHTML = `
                    <option value="">
                        Selecciona un anfitrión
                    </option>
                `;

                anfitrionesFiltrados.forEach(
                    (anfitrion) => {
                        const opcion =
                            document.createElement(
                                "option"
                            );

                        opcion.value =
                            anfitrion.id_usuario;

                        opcion.textContent =
                            anfitrion.nombre;

                        anfitrionSelect.appendChild(
                            opcion
                        );
                    }
                );

                anfitrionSelect.disabled = false;
            }
        );

        /*
        ============================================
        ELEMENTOS DEL VISITANTE
        ============================================
        */

        const visitanteBusqueda =
            document.getElementById(
                "visitanteBusqueda"
            );

        const resultadosVisitantes =
            document.getElementById(
                "resultadosVisitantes"
            );

        const idVisitante =
            document.getElementById(
                "idVisitante"
            );

        const formNuevoVisitante =
            document.getElementById(
                "formNuevoVisitante"
            );

        const nuevoNombre =
            document.getElementById(
                "nuevoNombre"
            );

        const nuevoApellido =
            document.getElementById(
                "nuevoApellido"
            );

        const nuevaIdentificacion =
            document.getElementById(
                "nuevaIdentificacion"
            );

        const nuevoTelefono =
            document.getElementById(
                "nuevoTelefono"
            );

        const btnGuardarVisitante =
            document.getElementById(
                "btnGuardarVisitante"
            );

        if (
            !visitanteBusqueda ||
            !resultadosVisitantes ||
            !idVisitante ||
            !formNuevoVisitante ||
            !nuevoNombre ||
            !nuevoApellido ||
            !nuevaIdentificacion ||
            !nuevoTelefono ||
            !btnGuardarVisitante
        ) {
            console.error(
                "Faltan elementos del formulario de visitante."
            );

            return;
        }

        let temporizadorBusqueda;

        /*
        ============================================
        BUSCAR VISITANTES
        ============================================
        */

        visitanteBusqueda.addEventListener(
            "input",
            () => {
                clearTimeout(
                    temporizadorBusqueda
                );

                const termino =
                    visitanteBusqueda.value.trim();

                idVisitante.value = "";

                resultadosVisitantes.innerHTML =
                    "";

                formNuevoVisitante.style.display =
                    "none";

                datosAcceso.style.display =
                    "none";

                areaSelect.value = "";

                anfitrionSelect.innerHTML = `
                    <option value="">
                        Selecciona primero un área
                    </option>
                `;

                anfitrionSelect.disabled = true;

                if (termino.length < 2) {
                    resultadosVisitantes.style.display =
                        "none";

                    return;
                }

                temporizadorBusqueda =
                    setTimeout(
                        async () => {
                            try {
                                const respuestaVisitantes =
                                    await fetch(
                                        `http://127.0.0.1:8000/visitantes/?nombre=${encodeURIComponent(termino)}`,
                                        {
                                            method:
                                                "GET",
                                            headers: {
                                                "Accept":
                                                    "application/json",
                                                "Authorization":
                                                    `Bearer ${token}`
                                            }
                                        }
                                    );

                                if (
                                    !respuestaVisitantes.ok
                                ) {
                                    throw new Error(
                                        "No fue posible buscar visitantes."
                                    );
                                }

                                const visitantes =
                                    await respuestaVisitantes.json();

                                resultadosVisitantes.innerHTML =
                                    "";

                                if (
                                    visitantes.length
                                    === 0
                                ) {
                                    resultadosVisitantes.style.display =
                                        "none";

                                    formNuevoVisitante.style.display =
                                        "block";

                                    datosAcceso.style.display =
                                        "none";

                                    const partesNombre =
                                        termino.split(
                                            " "
                                        );

                                    nuevoNombre.value =
                                        partesNombre[0]
                                        || "";

                                    nuevoApellido.value =
                                        partesNombre
                                            .slice(1)
                                            .join(" ");

                                    return;
                                }

                                formNuevoVisitante.style.display =
                                    "none";

                                visitantes.forEach(
                                    (visitante) => {
                                        const opcion =
                                            document.createElement(
                                                "button"
                                            );

                                        opcion.type =
                                            "button";

                                        opcion.className =
                                            "resultado-visitante";

                                        opcion.textContent =
                                            `${visitante.nombre} ${visitante.apellido}`;

                                        opcion.addEventListener(
                                            "click",
                                            () => {
                                                visitanteBusqueda.value =
                                                    opcion.textContent;

                                                idVisitante.value =
                                                    visitante.id_visitante;

                                                resultadosVisitantes.innerHTML =
                                                    "";

                                                resultadosVisitantes.style.display =
                                                    "none";

                                                formNuevoVisitante.style.display =
                                                    "none";

                                                datosAcceso.style.display =
                                                    "block";

                                                areaSelect.focus();
                                            }
                                        );

                                        resultadosVisitantes.appendChild(
                                            opcion
                                        );
                                    }
                                );

                                resultadosVisitantes.style.display =
                                    "block";

                            } catch (error) {
                                console.error(
                                    "Error al buscar visitantes:",
                                    error
                                );

                                resultadosVisitantes.innerHTML =
                                    `
                                    <div class="sin-resultados">
                                        No fue posible buscar visitantes
                                    </div>
                                `;

                                resultadosVisitantes.style.display =
                                    "block";
                            }
                        },
                        300
                    );
            }
        );

        /*
        ============================================
        REGISTRAR VISITANTE NUEVO
        ============================================
        */

        btnGuardarVisitante.addEventListener(
            "click",
            async () => {
                const nombre =
                    nuevoNombre.value.trim();

                const apellido =
                    nuevoApellido.value.trim();

                const identificacion =
                    nuevaIdentificacion.value.trim();

                const telefono =
                    nuevoTelefono.value.trim();

                if (
                    !nombre ||
                    !apellido ||
                    !identificacion ||
                    !telefono
                ) {
                    alert(
                        "Completa todos los datos del visitante."
                    );

                    return;
                }

                const datosVisitante = {
                    id_empresa: 1,
                    nombre: nombre,
                    apellido: apellido,
                    identificacion:
                        identificacion,
                    telefono: telefono
                };

                btnGuardarVisitante.disabled =
                    true;

                btnGuardarVisitante.textContent =
                    "Registrando...";

                try {
                    const respuestaNuevoVisitante =
                        await fetch(
                            "http://127.0.0.1:8000/visitantes/",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                    "Authorization":
                                        `Bearer ${token}`
                                },
                                body:
                                    JSON.stringify(
                                        datosVisitante
                                    )
                            }
                        );

                    if (
                        !respuestaNuevoVisitante.ok
                    ) {
                        let mensaje =
                            "No fue posible registrar el visitante.";

                        try {
                            const errorData =
                                await respuestaNuevoVisitante.json();

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

                    const visitanteCreado =
                        await respuestaNuevoVisitante.json();

                    visitanteBusqueda.value =
                        `${visitanteCreado.nombre} ${visitanteCreado.apellido}`;

                    idVisitante.value =
                        visitanteCreado.id_visitante;

                    resultadosVisitantes.innerHTML =
                        "";

                    resultadosVisitantes.style.display =
                        "none";

                    formNuevoVisitante.style.display =
                        "none";

                    datosAcceso.style.display =
                        "block";

                    nuevoNombre.value = "";
                    nuevoApellido.value = "";
                    nuevaIdentificacion.value =
                        "";
                    nuevoTelefono.value = "";

                    areaSelect.focus();

                    alert(
                        "Visitante registrado correctamente."
                    );

                } catch (error) {
                    console.error(
                        "Error al registrar visitante:",
                        error
                    );

                    alert(error.message);

                } finally {
                    btnGuardarVisitante.disabled =
                        false;

                    btnGuardarVisitante.textContent =
                        "Registrar visitante";
                }
            }
        );

        /*
        ============================================
        CERRAR MODAL
        ============================================
        */

        const btnCancelar =
            document.getElementById(
                "btnCancelar"
            );

        function cerrarModal() {
            modal.style.display = "none";
            modalContainer.innerHTML = "";
        }

        if (btnCancelar) {
            btnCancelar.addEventListener(
                "click",
                cerrarModal
            );
        }

        modal.addEventListener(
            "click",
            (event) => {
                if (event.target === modal) {
                    cerrarModal();
                }
            }
        );

        /*
        ============================================
        REGISTRAR ACCESO
        ============================================
        */

        const form =
            document.getElementById(
                "formRegistro"
            );

        if (!form) {
            return;
        }

        form.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                const idVisitanteSeleccionado =
                    idVisitante.value;

                const areaSeleccionada =
                    areaSelect.value;

                const anfitrionSeleccionado =
                    anfitrionSelect.value;

                const motivoVisita =
                    document
                        .getElementById(
                            "motivoVisita"
                        )
                        .value
                        .trim();

                if (!idVisitanteSeleccionado) {
                    alert(
                        "Selecciona un visitante de la lista de resultados."
                    );

                    return;
                }

                if (!areaSeleccionada) {
                    alert(
                        "Selecciona un área."
                    );

                    return;
                }

                if (!anfitrionSeleccionado) {
                    alert(
                        "Selecciona un anfitrión disponible para el área."
                    );

                    return;
                }

                if (!motivoVisita) {
                    alert(
                        "Ingresa el motivo de la visita."
                    );

                    return;
                }

                const datos = {
                    id_visitante:
                        Number(
                            idVisitanteSeleccionado
                        ),

                    id_area:
                        Number(
                            areaSeleccionada
                        ),

                    id_usuario:
                        Number(
                            anfitrionSeleccionado
                        ),

                    motivo_visita:
                        motivoVisita
                };

                const botonSubmit =
                    form.querySelector(
                        'button[type="submit"]'
                    );

                if (botonSubmit) {
                    botonSubmit.disabled = true;
                    botonSubmit.textContent =
                        "Registrando...";
                }

                try {
                    const respuestaRegistro =
                        await fetch(
                            "http://127.0.0.1:8000/registros-accesos/",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                    "Authorization":
                                        `Bearer ${token}`
                                },
                                body:
                                    JSON.stringify(
                                        datos
                                    )
                            }
                        );

                    if (!respuestaRegistro.ok) {
                        let mensaje =
                            "No fue posible registrar el ingreso.";

                        try {
                            const errorData =
                                await respuestaRegistro.json();

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

                    alert(
                        "Registro agregado correctamente."
                    );

                    cerrarModal();

                    if (
                        typeof historialRegistros
                        === "function"
                    ) {
                        historialRegistros();
                    }

                    if (
                        typeof cargarRegistros
                        === "function"
                    ) {
                        cargarRegistros();
                    }

                } catch (error) {
                    console.error(
                        "Error al registrar acceso:",
                        error
                    );

                    alert(error.message);

                } finally {
                    if (botonSubmit) {
                        botonSubmit.disabled =
                            false;

                        botonSubmit.textContent =
                            "Registrar ingreso";
                    }
                }
            }
        );
    });
}