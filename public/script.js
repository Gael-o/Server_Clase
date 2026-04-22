document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    console.log("Intentando login para:", user);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await response.json();

        if (data.success) {
            alert("¡Login exitoso! Bienvenido, ID del usuario: " + data.userId);
            window.location.href = "juego.html?userId=" + data.userId;
            // Aquí es donde mandaremos al usuario al juego después
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        console.error("Error al comunicarse con el backend:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

