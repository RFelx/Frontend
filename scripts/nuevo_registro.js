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
    modal.style.display = "flex";

    const datosAcceso =
    document.getElementById("datosAcceso");

    datosAcceso.style.display = "none";

    const token = localStorage.getItem("token");
    const areaSelect = document.getElementById("areaSelect");

    try {
        const respuestaAreas = await fetch(
            "http://127.0.0.1:8000/areas/",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!respuestaAreas.ok) {
            throw new Error("No fue posible cargar las áreas");
        }

        const areas = await respuestaAreas.json();

        areaSelect.innerHTML = `
            <option value="">
                Selecciona un área
            </option>
        `;

        areas.forEach((area) => {
            const opcion = document.createElement("option");

            opcion.value = area.id_area;
            opcion.textContent = area.nombre_area;

            areaSelect.appendChild(opcion);
        });

} catch (error) {
    console.error("Error al cargar áreas:", error);

    areaSelect.innerHTML = `
        <option value="">
            No fue posible cargar las áreas
        </option>
    `;
}

    const anfitrionSelect =
    document.getElementById("anfitrionSelect");

    try {
        const respuestaAnfitriones = await fetch(
            "http://127.0.0.1:8000/usuarios/anfitriones/",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!respuestaAnfitriones.ok) {
            throw new Error(
                "No fue posible cargar los anfitriones"
            );
        }

        const anfitriones =
            await respuestaAnfitriones.json();

        anfitrionSelect.innerHTML = `
            <option value="">
                Selecciona un anfitrión
            </option>
        `;

        anfitriones.forEach((anfitrion) => {
            const opcion =
                document.createElement("option");

            opcion.value = anfitrion.id_usuario;
            opcion.textContent = anfitrion.nombre;

            anfitrionSelect.appendChild(opcion);
        });

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
}

    const visitanteBusqueda =
    document.getElementById("visitanteBusqueda");

    const resultadosVisitantes =
        document.getElementById("resultadosVisitantes");

    const idVisitante =
        document.getElementById("idVisitante");
    
    const formNuevoVisitante =
    document.getElementById("formNuevoVisitante");

    const nuevoNombre =
        document.getElementById("nuevoNombre");

    const nuevoApellido =
        document.getElementById("nuevoApellido");

    const nuevaIdentificacion =
        document.getElementById("nuevaIdentificacion");

    const nuevoTelefono =
        document.getElementById("nuevoTelefono");

    const btnGuardarVisitante =
        document.getElementById("btnGuardarVisitante");

    let temporizadorBusqueda;

    visitanteBusqueda.addEventListener(
        "input",
        () => {
            clearTimeout(temporizadorBusqueda);

            const termino =
                visitanteBusqueda.value.trim();

            idVisitante.value = "";
            resultadosVisitantes.innerHTML = "";

            formNuevoVisitante.style.display = "none";
            datosAcceso.style.display = "none";

            if (termino.length < 2) {
                resultadosVisitantes.style.display = "none";
                return;
            }

            temporizadorBusqueda = setTimeout(
                async () => {
                    try {
                        const respuestaVisitantes =
                            await fetch(
                                `http://127.0.0.1:8000/visitantes/?nombre=${encodeURIComponent(termino)}`,
                                {
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/json",
                                        "Authorization": `Bearer ${token}`
                                    }
                                }
                            );

                        if (!respuestaVisitantes.ok) {
                            throw new Error(
                                "No fue posible buscar visitantes"
                            );
                        }

                        const visitantes =
                            await respuestaVisitantes.json();

                        resultadosVisitantes.innerHTML = "";

                        if (visitantes.length === 0) {
                            resultadosVisitantes.innerHTML = "";
                            resultadosVisitantes.style.display = "none";

                            formNuevoVisitante.style.display = "block";
                            datosAcceso.style.display = "none";

                            const partesNombre = termino.split(" ");

                            nuevoNombre.value = partesNombre[0] || "";
                            nuevoApellido.value =
                                partesNombre.slice(1).join(" ");

                            return;
                        }

                        formNuevoVisitante.style.display = "none";

                        visitantes.forEach((visitante) => {
                            const opcion =
                                document.createElement("button");

                            opcion.type = "button";
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

                                    resultadosVisitantes.innerHTML = "";
                                    resultadosVisitantes.style.display = "none";

                                    formNuevoVisitante.style.display = "none";
                                    datosAcceso.style.display = "block";
                                }
                            );

                            resultadosVisitantes.appendChild(opcion);
                        });

                        resultadosVisitantes.style.display =
                            "block";

                    } catch (error) {
                        console.error(
                            "Error al buscar visitantes:",
                            error
                        );

                        resultadosVisitantes.innerHTML = `
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

    btnGuardarVisitante.addEventListener(
    "click",
    async () => {
        const nombre = nuevoNombre.value.trim();
        const apellido = nuevoApellido.value.trim();
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
            identificacion: identificacion,
            telefono: telefono
        };

        try {
            const respuestaNuevoVisitante =
                await fetch(
                    "http://127.0.0.1:8000/visitantes/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(
                            datosVisitante
                        )
                    }
                );

            if (!respuestaNuevoVisitante.ok) {
                const error =
                    await respuestaNuevoVisitante.json();

                throw new Error(
                    error.detail ||
                    "No fue posible registrar el visitante"
                );
            }

            const visitanteCreado =
                await respuestaNuevoVisitante.json();

            visitanteBusqueda.value =
                `${visitanteCreado.nombre} ${visitanteCreado.apellido}`;

            idVisitante.value =
                visitanteCreado.id_visitante;

            resultadosVisitantes.innerHTML = "";
            resultadosVisitantes.style.display = "none";

            formNuevoVisitante.style.display = "none";
            datosAcceso.style.display = "block";

            nuevoNombre.value = "";
            nuevoApellido.value = "";
            nuevaIdentificacion.value = "";
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
        }
    }
);

    const btnCancelar =
        document.getElementById("btnCancelar");

    function cerrarModal() {
        modal.style.display = "none";
        modalContainer.innerHTML = "";
    }

    btnCancelar.addEventListener(
        "click",
        cerrarModal
    );

    // Configurar cierre al hacer clic fuera del modal
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Manejo del submit del formulario
    const form = document.getElementById("formRegistro");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const idVisitanteSeleccionado =
    document.getElementById("idVisitante").value;

    const areaSeleccionada =
        document.getElementById("areaSelect").value;

    const anfitrionSeleccionado =
        document.getElementById("anfitrionSelect").value;

    const motivoVisita =
        document.getElementById("motivoVisita").value.trim();

    if (!idVisitanteSeleccionado) {
        alert("Selecciona un visitante de la lista de resultados.");
        return;
    }

    if (!areaSeleccionada) {
        alert("Selecciona un área.");
        return;
    }

    if (!anfitrionSeleccionado) {
        alert("Selecciona un anfitrión.");
        return;
    }

    if (!motivoVisita) {
        alert("Ingresa el motivo de la visita.");
        return;
    }

    const datos = {
        id_visitante: Number(idVisitanteSeleccionado),
        id_area: Number(areaSeleccionada),
        id_usuario: Number(anfitrionSeleccionado),
        motivo_visita: motivoVisita
    };

      const token = localStorage.getItem("token");
      const respuesta = await fetch("http://127.0.0.1:8000/registros-accesos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      }
    );

      if (respuesta.ok) {
        alert("Registro agregado correctamente");

        cerrarModal();
        cargarRegistros();

      } else {
          const error = await respuesta.json();

         alert(
          error.detail ||
          "No fue posible registrar el ingreso."
        ); 
      }
    });
  });
}