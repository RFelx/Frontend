async function cargarRegistros() {
    try {
        const token = localStorage.getItem("token");
        const respuesta = await fetch("http://127.0.0.1:8000/registros-accesos", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!respuesta.ok) throw new Error("No autorizado o error en la petición");

        const datos = await respuesta.json();
        console.log("Registros:", datos);

        const tabla = document.getElementById("tabla");
        tabla.innerHTML = `
            <tr>
                <th>ID de Registro</th>
                <th>ID de Visitante</th>
                <th>ID de Area</th>
                <th>ID de Usuario</th>
                <th>Motivo de Visita</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
            </tr>
        `;

        datos.forEach(fila => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${fila.id_registro}</td>
                <td>${fila.id_visitante}</td>
                <td>${fila.id_area}</td>
                <td>${fila.id_usuario}</td>
                <td>${fila.motivo_visita}</td>
                <td>${fila.fecha_hora_entrada}</td>
                <td>${fila.fecha_hora_salida}</td>

            `;
            tabla.appendChild(tr);
        });
    } catch (error) {
        console.error("Error cargando registros:", error);
    }
}
