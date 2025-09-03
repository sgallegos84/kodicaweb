// This file contains the JavaScript functionality specific to the Parent dashboard. 
// It includes features relevant to parents, such as viewing their child's progress and communicating with teachers.

document.addEventListener('DOMContentLoaded', function() {
    // Example function to fetch and display child's progress
    function fetchChildProgress() {
        // Simulated data fetching
        const progressData = {
            name: "Juan Pérez",
            grades: {
                math: "A",
                science: "B",
                history: "A-"
            }
        };

        // Displaying the child's progress in the dashboard
        const progressContainer = document.getElementById('progress');
        progressContainer.innerHTML = `<h2>Progreso de ${progressData.name}</h2>
                                       <p>Matemáticas: ${progressData.grades.math}</p>
                                       <p>Ciencias: ${progressData.grades.science}</p>
                                       <p>Historia: ${progressData.grades.history}</p>`;
    }

    // Example function to handle communication with teachers
    function sendMessageToTeacher() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;

        // Simulated message sending
        if (message) {
            alert(`Mensaje enviado al profesor: ${message}`);
            messageInput.value = ''; // Clear input after sending
        } else {
            alert('Por favor, escribe un mensaje antes de enviar.');
        }
    }

    // Event listeners for buttons
    document.getElementById('fetchProgressBtn').addEventListener('click', fetchChildProgress);
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessageToTeacher);
});