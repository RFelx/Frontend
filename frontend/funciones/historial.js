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
            throw new Error("No fue posible obtener los registros");
        }

        const registros = await respuesta.json();

        const cuerpoTabla = document.querySelector("#tabla tbody");
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

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${registro.visitante}</td>
                <td>${registro.area}</td>
                <td>${registro.anfitrion}</td>
                <td>${registro.motivo_visita}</td>
                <td>${fechaEntradaFormateada}</td>
                <td>${fechaSalidaFormateada}</td>
            `;

            cuerpoTabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar registros:", error);
    }
}