document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo (en una app real, vendrían de una API)
    let tareas = [
        { id: 1, nombre: "Matemáticas: Resolver ejercicios página 45", materia: "Matemáticas", fechaCreacion: "2025-09-01", fechaEntrega: "2025-09-05", completado: false, revisado: false, tipo: "tarea" },
        { id: 2, nombre: "Español: Leer capítulo 3 y hacer resumen", materia: "Español", fechaCreacion: "2025-09-02", fechaEntrega: "2025-09-06", completado: true, revisado: false, tipo: "tarea" },
        { id: 3, nombre: "Ciencias: Proyecto sobre el ciclo del agua", materia: "Ciencias", fechaCreacion: "2025-08-30", fechaEntrega: "2025-09-10", completado: false, revisado: true, tipo: "tarea" },
        { id: 4, nombre: "Inglés: Estudiar vocabulario de la unidad 2", materia: "Inglés", fechaCreacion: "2025-09-03", fechaEntrega: "2025-09-07", completado: true, revisado: true, tipo: "tarea" },
        { id: 5, nombre: "Apunte sobre la Revolución Francesa", materia: "Historia", fechaCreacion: "2025-09-04", fechaEntrega: null, completado: true, revisado: true, tipo: "apunte", contenido: "La Revolución Francesa fue un período de agitación social y política en Francia..." },
        { id: 6, nombre: "Apunte de Ecuaciones de primer grado", materia: "Matemáticas", fechaCreacion: "2025-09-05", fechaEntrega: null, completado: true, revisado: true, tipo: "apunte", contenido: "Una ecuación de primer grado es una igualdad que involucra una o más variables a la primera potencia..." }
    ];

    let tareaSeleccionadaId = null;
    let preguntasCuestionario = [];

    // Selectores de elementos del DOM
    const navbarLinks = document.getElementById('navbarLinks');
    const tablaTareasBody = document.querySelector("#tablaTareas tbody");
    const modal = document.getElementById('modalTarea');

    // --- Funciones de renderizado y UI ---

    const mostrarTareas = (filtradas) => {
        tablaTareasBody.innerHTML = "";
        if (filtradas.length === 0) {
            tablaTareasBody.innerHTML = `<tr><td colspan="7" data-label="Resultado">No hay tareas que coincidan con los filtros.</td></tr>`;
            return;
        }
        filtradas.forEach(tarea => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="Tarea"><a href="#" data-task-id="${tarea.id}">${tarea.nombre}</a></td>
                <td data-label="Materia">${tarea.materia}</td>
                <td data-label="Fecha de creación">${tarea.fechaCreacion}</td>
                <td data-label="Fecha de entrega">${tarea.fechaEntrega || 'N/A'}</td>
                <td data-label="Completado">${tarea.completado ? "Completado" : "Pendiente"}</td>
                <td data-label="Revisado por padre">${tarea.revisado ? "Revisado" : "No revisado"}</td>
                <td data-label="Tipo">${tarea.tipo === "apunte" ? "Apunte" : "Tarea"}</td>
            `;
            tablaTareasBody.appendChild(tr);
        });
    };

    const filtrarTareas = () => {
        const fecha = document.getElementById("filtroFecha").value;
        const materia = document.getElementById("filtroMateria").value;
        const completado = document.getElementById("filtroCompletado").value;
        const revisado = document.getElementById("filtroRevisado").value;

        let filtradas = tareas;

        if (!fecha && !materia && !completado && !revisado) {
            filtradas = tareas.filter(t => !t.completado);
        } else {
            if (fecha) filtradas = filtradas.filter(t => t.fechaEntrega === fecha);
            if (materia) filtradas = filtradas.filter(t => t.materia === materia);
            if (completado) filtradas = filtradas.filter(t => (completado === "completado") === t.completado);
            if (revisado) filtradas = filtradas.filter(t => (revisado === "revisado") === t.revisado);
        }
        mostrarTareas(filtradas);
    };

    const resetFiltros = () => {
        document.getElementById("filtroFecha").value = "";
        document.getElementById("filtroMateria").value = "";
        document.getElementById("filtroCompletado").value = "";
        document.getElementById("filtroRevisado").value = "";
        mostrarTareas(tareas.filter(t => !t.completado));
    };

    // --- Funciones de navegación y menú ---

    const toggleMenu = () => navbarLinks.classList.toggle('show');
    const closeMenu = () => {
        if (window.innerWidth <= 700) {
            navbarLinks.classList.remove('show');
        }
    };

    const mostrarDashboard = () => {
        document.getElementById("dashboardPrincipal").style.display = "block";
        document.getElementById("resumenIA").style.display = "none";
        document.getElementById("guiaEstudioIA").style.display = "none";
        closeMenu();
    };

    const mostrarResumen = () => {
        document.getElementById("dashboardPrincipal").style.display = "none";
        document.getElementById("resumenIA").style.display = "block";
        document.getElementById("guiaEstudioIA").style.display = "none";
        // mostrarResumenMateria(); // Asumiendo que esta función existe y es relevante
        closeMenu();
    };

    const mostrarGuiaEstudio = () => {
        document.getElementById("dashboardPrincipal").style.display = "none";
        document.getElementById("resumenIA").style.display = "none";
        document.getElementById("guiaEstudioIA").style.display = "block";
        closeMenu();
    };

    // --- Lógica de Modales y Formularios ---

    const abrirModal = (taskId) => {
        tareaSeleccionadaId = taskId;
        const tarea = tareas.find(t => t.id === taskId);
        if (!tarea) return;

        document.getElementById("modalTitulo").textContent = tarea.nombre;
        document.getElementById("inputFotos").value = "";
        document.getElementById("previewFotos").innerHTML = "";
        document.getElementById("iaTexto").textContent = "";
        modal.style.display = "flex";
    };

    const cerrarModal = () => modal.style.display = "none";

    const confirmarEnvio = () => {
        if (tareaSeleccionadaId !== null) {
            const tarea = tareas.find(t => t.id === tareaSeleccionadaId);
            if (tarea) {
                tarea.completado = true;
                tarea.revisado = false; // Pendiente por revisión de tutor
            }
            cerrarModal();
            filtrarTareas();
            alert("¡Tarea enviada! Estatus actualizado.");
        }
    };

    const toggleForm = (tipo) => {
        const formTarea = document.getElementById("formTareaContainer");
        const formApunte = document.getElementById("formApunteContainer");
        if (tipo === "tarea") {
            const isHidden = formTarea.style.display === "none" || formTarea.style.display === "";
            formTarea.style.display = isHidden ? "block" : "none";
            formApunte.style.display = "none";
        } else {
            const isHidden = formApunte.style.display === "none" || formApunte.style.display === "";
            formApunte.style.display = isHidden ? "block" : "none";
            formTarea.style.display = "none";
        }
    };

    // --- Lógica de Exportación y Cuestionario ---

    const exportarGuiaPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const guiaContent = document.getElementById('contenidoGuia');
        const cuestionarioContent = document.getElementById('cuestionarioForm');
        const resultadoContent = document.getElementById('cuestionarioResultado');

        doc.setFontSize(18);
        doc.text("Guía de Estudio Personalizada", 14, 22);
        
        doc.setFontSize(12);
        doc.html(guiaContent, {
            callback: function (doc) {
                let finalY = doc.lastAutoTable.finalY || 60; // Posición después del contenido de la guía
                doc.addPage();
                doc.setFontSize(18);
                doc.text("Cuestionario de Práctica", 14, 22);
                doc.setFontSize(12);
                
                let questionText = "";
                preguntasCuestionario.forEach((q, index) => {
                    questionText += `${index + 1}. ${q.pregunta}\n`;
                    q.opciones.forEach(opt => questionText += `   - ${opt}\n`);
                    questionText += `\nRespuesta Correcta: ${q.respuesta}\n\n`;
                });

                doc.text(questionText, 14, 30);

                doc.save('guia_de_estudio.pdf');
            },
            x: 14,
            y: 30,
            width: 180
        });
    };

    const calificarCuestionario = () => {
        let correctas = 0;
        preguntasCuestionario.forEach((pregunta, index) => {
            const form = document.getElementById('cuestionarioForm');
            const selected = form.querySelector(`input[name="pregunta${index}"]:checked`);
            if (selected && selected.value === pregunta.respuesta) {
                correctas++;
            }
        });
        const total = preguntasCuestionario.length;
        const resultadoDiv = document.getElementById('cuestionarioResultado');
        resultadoDiv.innerHTML = `Resultado: ${correctas} de ${total} correctas. (${Math.round((correctas/total)*100)}%)`;
    };

    const iniciarCuestionario = () => {
        const apuntes = tareas.filter(t => t.tipo === 'apunte' && t.contenido);
        const formContainer = document.getElementById('cuestionarioForm');
        document.getElementById('cuestionarioResultado').innerHTML = "";
        formContainer.innerHTML = "";

        // Simulación de generación de preguntas
        preguntasCuestionario = [
            { pregunta: "¿Qué evento marcó el inicio de la Revolución Francesa?", opciones: ["La toma de la Bastilla", "La coronación de Napoleón", "La guerra de los Cien Años"], respuesta: "La toma de la Bastilla" },
            { pregunta: "En una ecuación de primer grado, ¿cuál es el exponente máximo de la variable?", opciones: ["0", "1", "2"], respuesta: "1" }
        ];

        let formHTML = '';
        preguntasCuestionario.forEach((pregunta, index) => {
            formHTML += `<div class="pregunta" style="margin-bottom: 15px;">`;
            formHTML += `<p><strong>${index + 1}. ${pregunta.pregunta}</strong></p>`;
            pregunta.opciones.forEach(opcion => {
                formHTML += `<label style="display: block; margin-left: 10px;"><input type="radio" name="pregunta${index}" value="${opcion}"> ${opcion}</label>`;
            });
            formHTML += `</div>`;
        });

        formHTML += `<button id="btn-calificar">Calificar Examen</button>`;
        formContainer.innerHTML = formHTML;

        document.getElementById('btn-calificar').addEventListener('click', calificarCuestionario);
    };

    // --- Lógica de IA ---

    const generarGuiaEstudio = () => {
        const apuntes = tareas.filter(t => t.tipo === 'apunte' && t.contenido);
        const resultadoGuia = document.getElementById('resultadoGuia');
        const contenidoGuia = document.getElementById('contenidoGuia');
        const cuestionarioContainer = document.getElementById('cuestionarioContainer');

        if (apuntes.length === 0) {
            contenidoGuia.innerHTML = "<p>No se encontraron apuntes para generar la guía. ¡Sube algunos primero!</p>";
        } else {
            let guiaHTML = "<h4>Temas Clave Identificados:</h4><ul>";
            apuntes.forEach(apunte => {
                guiaHTML += `<li><strong>${apunte.materia}:</strong> ${apunte.nombre.replace('Apunte sobre ', '')}</li>`;
            });
            guiaHTML += "</ul><p><strong>Recomendación de estudio:</strong> Repasa los conceptos de ecuaciones y los eventos principales de la Revolución Francesa, ya que parecen ser los temas más recientes.</p>";
            contenidoGuia.innerHTML = guiaHTML;
            cuestionarioContainer.style.display = 'block';
            document.getElementById('btn-exportar-pdf').style.display = 'block';
        }

        resultadoGuia.style.display = 'block';
    };

    // --- Event Listeners ---

    // Menú
    document.querySelector('.navbar-toggle').addEventListener('click', toggleMenu);
    document.getElementById('nav-inicio').addEventListener('click', mostrarDashboard);
    document.getElementById('nav-resumen').addEventListener('click', mostrarResumen);
    document.getElementById('nav-guia-ia').addEventListener('click', mostrarGuiaEstudio);

    // Filtros
    document.getElementById('btn-filtrar').addEventListener('click', filtrarTareas);
    document.getElementById('btn-limpiar-filtros').addEventListener('click', resetFiltros);

    // Modal
    tablaTareasBody.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.taskId) {
            e.preventDefault();
            const taskId = parseInt(e.target.dataset.taskId, 10);
            abrirModal(taskId);
        }
    });
    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-confirmar-envio').addEventListener('click', confirmarEnvio);

    // Formularios
    document.getElementById('btn-toggle-tarea').addEventListener('click', () => toggleForm('tarea'));
    document.getElementById('btn-toggle-apunte').addEventListener('click', () => toggleForm('apunte'));
    document.getElementById('btn-cancelar-tarea').addEventListener('click', () => toggleForm('tarea'));
    document.getElementById('btn-cancelar-apunte').addEventListener('click', () => toggleForm('apunte'));

    // IA
    document.getElementById('btn-generar-guia').addEventListener('click', generarGuiaEstudio);
    document.getElementById('btn-iniciar-cuestionario').addEventListener('click', iniciarCuestionario);
    document.getElementById('btn-exportar-pdf').addEventListener('click', exportarGuiaPDF);

    // ... Aquí irían los listeners para 'submit' de los formularios 'formTarea' y 'formApunte'

    // Inicialización
    mostrarTareas(tareas.filter(t => !t.completado));
});