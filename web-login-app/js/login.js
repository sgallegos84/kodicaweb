function mostrarMensaje(msg) {
    let mensaje = document.getElementById('loginMessage');
    if (!mensaje) {
        mensaje = document.createElement('div');
        mensaje.id = 'loginMessage';
        document.querySelector('.login-container').appendChild(mensaje);
    }
    mensaje.textContent = msg;
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        // NOTA DE SEGURIDAD: En una app real, la validación debe hacerse en un servidor (backend).
        // Esto es solo una simulación para separar los datos.
        const response = await fetch('../config/users.json');
        const users = await response.json();

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Guardar información del usuario para usar en los dashboards (opcional)
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            // Redirección dinámica basada en el rol.
            window.location.href = `dashboards/${user.role}.html`;
        } else {
            mostrarMensaje('Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error al cargar los datos de usuario:', error);
        mostrarMensaje('Error en el sistema. Intente más tarde.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});