// NOTA DE SEGURIDAD: Este método de autenticación no es seguro y solo debe usarse para prototipos.
// En una aplicación real, la validación debe hacerse en un servidor.
const users = [
    { username: 'admin1', password: 'admin123', role: 'admin' },
    { username: 'profesor1', password: 'prof123', role: 'teacher' },
    { username: 'padre1', password: 'padre123', role: 'parent' },
    { username: 'alumno1', password: 'alumno123', role: 'student' }
];

function mostrarMensaje(msg) {
    let mensaje = document.getElementById('loginMessage');
    if (!mensaje) {
        mensaje = document.createElement('div');
        mensaje.id = 'loginMessage';
        document.querySelector('.login-container').appendChild(mensaje);
    }
    mensaje.textContent = msg;
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Redirección dinámica basada en el rol.
        window.location.href = `dashboards/${user.role}.html`;
    } else {
        mostrarMensaje('Usuario o contraseña incorrectos');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});