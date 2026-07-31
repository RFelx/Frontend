const loginForm =
    document.getElementById("login");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");


function mostrarError(mensaje) {
    loginMessage.textContent = mensaje;
    loginMessage.classList.add("visible");
}


function limpiarError() {
    loginMessage.textContent = "";
    loginMessage.classList.remove("visible");
}


loginForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();
        limpiarError();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        if (!email || !password) {
            mostrarError(
                "Ingresa tu correo y contraseña."
            );

            return;
        }

        loginButton.disabled = true;
        loginButton.textContent =
            "Iniciando sesión...";

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        correo: email,
                        password: password
                    })
                }
            );

            if (!response.ok) {
                let mensaje =
                    "Correo o contraseña incorrectos.";

                try {
                    const errorData =
                        await response.json();

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

            const data =
                await response.json();

            if (!data.access_token) {
                throw new Error(
                    "La respuesta del servidor no contiene un token válido."
                );
            }

            localStorage.setItem(
                "token",
                data.access_token
            );

            localStorage.setItem(
                "rol",
                data.rol || ""
            );

            localStorage.setItem(
                "nombre",
                data.nombre || ""
            );

            localStorage.setItem(
                "correo",
                data.correo || email
            );

            window.location.href =
                "/FRONTEND/paginas/inicio_pruebas.html";

        } catch (error) {
            console.error(
                "Error al iniciar sesión:",
                error
            );

            mostrarError(
                error.message ||
                "No fue posible iniciar sesión."
            );

            loginButton.disabled = false;
            loginButton.textContent =
                "Iniciar sesión";
        }
    }
);