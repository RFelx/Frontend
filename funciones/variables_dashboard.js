const API_REGISTROS =
    "http://127.0.0.1:8000/registros-accesos/";


function formatearFecha(fecha) {
    if (!fecha) {
        return "—";
    }

    return new Date(fecha).toLocaleString(
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


async function obtenerRegistrosDashboard() {
    const token =
        localStorage.getItem("token");

    const respuesta = await fetch(
        API_REGISTROS,
        {
            headers: {
                "Accept": "application/json",
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );

    if (!respuesta.ok) {
        throw new Error(
            "No fue posible cargar los registros"
        );
    }

    return await respuesta.json();
}


async function cargarRegistros() {
    try {
        const registros =
            await obtenerRegistrosDashboard();

        const ahora = new Date();

        const limite = new Date(
            ahora.getTime() -
            24 * 60 * 60 * 1000
        );

        const registros24hrs =
            registros.filter((registro) => {
                const fechaEntrada =
                    new Date(
                        registro.fecha_hora_entrada
                    );

                return fechaEntrada >= limite;
            }).length;

        const registrosTotal =
            registros.length;

        const personasDentro =
            registros.filter(
                (registro) =>
                    registro.estatus === "Dentro"
            ).length;

        const dash24 =
            document.getElementById("dash24");

        const dashTotal =
            document.getElementById(
                "dashTotal"
            );

        const dashDentro =
            document.getElementById(
                "dashDentro"
            );

        if (dash24) {
            dash24.textContent =
                registros24hrs;
        }

        if (dashTotal) {
            dashTotal.textContent =
                registrosTotal;
        }

        if (dashDentro) {
            dashDentro.textContent =
                personasDentro;
        }

    } catch (error) {
        console.error(
            "Error cargando indicadores:",
            error
        );
    }
}


async function cargarSalidas() {
    try {
        const registros =
            await obtenerRegistrosDashboard();

        const ahora = new Date();

        const limite = new Date(
            ahora.getTime() -
            24 * 60 * 60 * 1000
        );

        const salidas24hrs =
            registros.filter((registro) => {
                if (
                    !registro.fecha_hora_salida
                ) {
                    return false;
                }

                const fechaSalida =
                    new Date(
                        registro.fecha_hora_salida
                    );

                return fechaSalida >= limite;
            }).length;

        const dashSalidas =
            document.getElementById(
                "dashSalidas"
            );

        if (dashSalidas) {
            dashSalidas.textContent =
                salidas24hrs;
        }

    } catch (error) {
        console.error(
            "Error cargando salidas:",
            error
        );
    }
}


async function HistorialReciente() {
    try {
        const registros =
            await obtenerRegistrosDashboard();

        const ahora = new Date();

        const limite = new Date(
            ahora.getTime() -
            24 * 60 * 60 * 1000
        );

        const recientes = registros
            .filter((registro) => {
                const fechaEntrada =
                    new Date(
                        registro.fecha_hora_entrada
                    );

                return fechaEntrada >= limite;
            })
            .sort((a, b) => {
                return (
                    new Date(
                        b.fecha_hora_entrada
                    ) -
                    new Date(
                        a.fecha_hora_entrada
                    )
                );
            })
            .slice(0, 5);

        const cuerpoTabla =
            document.getElementById(
                "tablaRecientesBody"
            );

        if (!cuerpoTabla) {
            return;
        }

        cuerpoTabla.innerHTML = "";

        if (recientes.length === 0) {
            cuerpoTabla.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="tabla-vacia"
                    >
                        No hay registros recientes.
                    </td>
                </tr>
            `;

            return;
        }

        recientes.forEach((registro) => {
            const fila =
                document.createElement("tr");

            const claseEstado =
                registro.estatus === "Dentro"
                    ? "estado-dashboard estado-dentro-dashboard"
                    : "estado-dashboard estado-salida-dashboard";

            fila.innerHTML = `
                <td>
                    <strong class="nombre-visitante">
                        ${registro.visitante}
                    </strong>
                </td>

                <td>${registro.area}</td>

                <td>${registro.anfitrion}</td>

                <td>${registro.motivo_visita}</td>

                <td>
                    ${formatearFecha(
                        registro.fecha_hora_entrada
                    )}
                </td>

                <td>
                    ${formatearFecha(
                        registro.fecha_hora_salida
                    )}
                </td>

                <td>
                    <span class="${claseEstado}">
                        ${registro.estatus}
                    </span>
                </td>
            `;

            cuerpoTabla.appendChild(fila);
        });

    } catch (error) {
        console.error(
            "Error cargando registros recientes:",
            error
        );
    }
}