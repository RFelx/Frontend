document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();

    // Eliminar token del localStorage
    localStorage.removeItem("token");

    // Redirigir a la página de login
    window.location.href = "/FRONTEND/index.html"; 
});