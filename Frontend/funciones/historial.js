async function historialRegistros() {
    const token = localStorage.getItem("token");

    try {
        const respuesta = await fetch(
            "http://127.0.0.1:8000/registros-accesos/",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible obtener los registros"
            );
        }

        const registros = await respuesta.json();

        const cuerpoTabla =
            document.querySelector("#tabla tbody");

        cuerpoTabla.innerHTML = "";

        registros.forEach((registro) => {
            const fechaEntrada = new Date(
                registro.fecha_hora_entrada
            );

            const fechaEntradaFormateada =
                fechaEntrada.toLocaleString(
                    "es-MX",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            let fechaSalidaFormateada = "Dentro";

            if (registro.fecha_hora_salida) {
                const fechaSalida = new Date(
                    registro.fecha_hora_salida
                );

                fechaSalidaFormateada =
                    fechaSalida.toLocaleString(
                        "es-MX",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );
            }

            let accion = "—";

            if (registro.estatus === "Dentro") {
                accion = `
                    <button
                        type="button"
                        class="btn-salida"
                        data-id="${registro.id_registro}"
                    >
                        Registrar salida
                    </button>
                `;
            }

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${registro.visitante}</td>
                <td>${registro.area}</td>
                <td>${registro.anfitrion}</td>
                <td>${registro.motivo_visita}</td>
                <td>${fechaEntradaFormateada}</td>
                <td>${fechaSalidaFormateada}</td>
                <td>${registro.estatus}</td>
                <td>${accion}</td>
            `;

            cuerpoTabla.appendChild(fila);
        });

        // Los eventos se asignan una sola vez,
        // después de crear todos los botones.
        document.querySelectorAll(".btn-salida")
            .forEach((boton) => {
                boton.addEventListener(
                    "click",
                    async () => {
                        const confirmar = confirm(
                            "¿Deseas registrar la salida de este visitante?"
                        );

                        if (!confirmar) {
                            return;
                        }

                        const idRegistro =
                            boton.dataset.id;

                        boton.disabled = true;
                        boton.textContent =
                            "Registrando...";

                        try {
                            const respuestaSalida =
                                await fetch(
                                    `http://127.0.0.1:8000/registros-accesos/${idRegistro}/salida`,
                                    {
                                        method: "PATCH",
                                        headers: {
                                            "Accept": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        }
                                    }
                                );

                            if (!respuestaSalida.ok) {
                                let mensajeError =
                                    "No fue posible registrar la salida.";

                                try {
                                    const error =
                                        await respuestaSalida.json();

                                    mensajeError =
                                        error.detail ||
                                        mensajeError;
                                } catch {
                                    // Conserva el mensaje predeterminado.
                                }

                                throw new Error(
                                    mensajeError
                                );
                            }

                            alert(
                                "Salida registrada correctamente."
                            );

                            await historialRegistros();

                        } catch (error) {
                            console.error(
                                "Error al registrar salida:",
                                error
                            );

                            alert(error.message);

                            boton.disabled = false;
                            boton.textContent =
                                "Registrar salida";
                        }
                    }
                );
            });

    } catch (error) {
        console.error(
            "Error al cargar registros:",
            error
        );
    }
}