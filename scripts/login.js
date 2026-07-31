document.getElementById("login").addEventListener("submit", async (event) => {
    event.preventDefault(); //

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                correo: email,       
                password: password   
            })
        });

        if (!response.ok) {
            throw new Error("Correo o contraseña incorrectos");
        }

        const data = await response.json();
        console.log("Token recibido:", data.access_token);

        
        localStorage.setItem("token", data.access_token);

      
        window.location.href = "/FRONTEND/paginas/inicio_pruebas.html";
    } catch (error) {
        alert(error.message);
    }
});