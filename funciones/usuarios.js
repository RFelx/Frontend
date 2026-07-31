function inicializarUsuarios() {
    const form = document.getElementById("formUser");
    const tablaBody = document.querySelector("#tablaUser tbody");
    
    async function cargarUsuarios() {
        try {
            const response = await fetch("http://localhost:8000/usuarios/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token") // token guardado al iniciar sesión
                }
            });

            if (!response.ok) throw new Error("Error al obtener usuarios");

            const usuarios = await response.json();

            // Limpiar tabla antes de llenarla
            tablaBody.innerHTML = "";

            usuarios.forEach(usuario => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${usuario.nombre}</td>
                    <td>${usuario.id_usuario}</td>
                `;
                tablaBody.appendChild(fila);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Evento para crear usuario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nuevoUsuario = {
            nombre: document.getElementById("nombre").value,
            correo: document.getElementById("correo").value,
            rol: document.getElementById("rol").value,
            password_hash: document.getElementById("password_hash").value,
            es_anfitrion: document.getElementById("es_anfitrion").checked
        };

        try {
            const response = await fetch("http://localhost:8000/usuarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (!response.ok) throw new Error("Error al crear usuario");

            await response.json();

            cargarUsuarios();
            form.reset();
        } catch (error) {
            console.error("Error:", error);
        }
    });

  
    cargarUsuarios();
}