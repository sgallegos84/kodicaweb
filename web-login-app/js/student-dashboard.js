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
    const taskCardsContainer = document.getElementById('task-cards-container');
    const modal = document.getElementById('modalTarea');

    // --- Contenedores de secciones ---
    const dashboardPrincipal = document.getElementById('dashboardPrincipal');
    const resumenIA = document.getElementById('resumenIA');
    const guiaEstudioIA = document.getElementById('guiaEstudioIA');


    // --- Iconos y colores por materia ---
    const materiaInfo = {
        'Matemáticas': { icon: 'fa-calculator', color: '#ff6b6b' },
        'Español': { icon: 'fa-book', color: '#4d96ff' },
        'Ciencias': { icon: 'fa-flask', color: '#2ecc71' },
        'Inglés': { icon: 'fa-language', color: '#9b59b6' },
        'Historia': { icon: 'fa-landmark', color: '#f39c12' },
        'Arte': { icon: 'fa-palette', color: '#e74c3c' },
        'Educación Física': { icon: 'fa-futbol', color: '#1abc9c' },
        'default': { icon: 'fa-file-alt', color: '#7f8c8d' }
    };

    // --- Funciones de renderizado y UI ---

    const mostrarTareas = (filtradas) => {
        taskCardsContainer.innerHTML = "";
        if (filtradas.length === 0) {
            taskCardsContainer.innerHTML = `<p class="no-tasks">¡Genial! No tienes tareas pendientes.</p>`;
            return;
        }
        filtradas.forEach(tarea => {
            const info = materiaInfo[tarea.materia] || materiaInfo.default;
            const card = document.createElement('div');
            card.className = `task-card ${tarea.completado ? 'completado' : ''}`;
            card.style.borderColor = info.color;
            card.dataset.taskId = tarea.id;

            card.innerHTML = `
                <div class="task-card-header">
                    <i class="fas ${info.icon} task-icon" style="color: ${info.color};"></i>
                    <h3 class="task-title">${tarea.nombre}</h3>
                </div>
                <div class="task-details">
                    <p><i class="fas fa-tag"></i> ${tarea.materia}</p>
                    <p><i class="fas fa-calendar-alt"></i> Entrega: ${tarea.fechaEntrega || 'N/A'}</p>
                </div>
            `;
            card.addEventListener('click', () => abrirModal(tarea.id));
            taskCardsContainer.appendChild(card);
        });
        actualizarBarraProgreso();
    };

    const filtrarTareas = () => {
        // La lógica de filtros se puede re-implementar con un modal o una sección dedicada
        // Por ahora, mostramos las no completadas por defecto.
        mostrarTareas(tareas.filter(t => !t.completado));
    };

    const actualizarBarraProgreso = () => {
        const totalTareas = tareas.filter(t => t.tipo === 'tarea').length;
        const tareasCompletadas = tareas.filter(t => t.tipo === 'tarea' && t.completado).length;
        const porcentaje = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;
        document.getElementById('tasks-progress').style.width = `${porcentaje}%`;
    };

    const resetFiltros = () => {
        let filtradas = tareas;
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
        dashboardPrincipal.classList.remove('hidden');
        resumenIA.classList.add('hidden');
        guiaEstudioIA.classList.add('hidden');
        closeMenu();
    };

    const mostrarResumen = () => {
        dashboardPrincipal.classList.add('hidden');
        resumenIA.classList.remove('hidden');
        guiaEstudioIA.classList.add('hidden');
        mostrarResumenMateria();
        closeMenu();
    };

    const mostrarGuiaEstudio = () => {
        dashboardPrincipal.classList.add('hidden');
        resumenIA.classList.add('hidden');
        guiaEstudioIA.classList.remove('hidden');
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
        modal.classList.remove('hidden');
    };

    const cerrarModal = () => modal.classList.add('hidden');

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
            formTarea.classList.toggle('hidden');
            formApunte.classList.add('hidden');
        } else {
            formApunte.classList.toggle('hidden');
            formTarea.classList.add('hidden');
        }
    };

    const crearTarea = (e) => {
        e.preventDefault();
        const materia = document.getElementById("tareaMateria").value;
        const nombre = document.getElementById("tareaNombre").value;
        const fecha = document.getElementById("tareaFecha").value;
        if (!materia || !nombre || !fecha) return;
        const hoy = new Date().toISOString().slice(0,10);
        const nuevaTarea = {
            id: tareas.length + 1,
            nombre,
            materia,
            fechaCreacion: hoy,
            fechaEntrega: fecha,
            completado: false,
            revisado: false,
            tipo: "tarea"
        };
        tareas.push(nuevaTarea);
        resetFiltros();
        alert("¡Tarea creada!");
        document.getElementById("formTarea").reset();
        toggleForm('tarea');
    };

    const crearApunte = (e) => {
        e.preventDefault();
        const materia = document.getElementById("apunteMateria").value;
        const archivo = document.getElementById("apunteArchivo").files[0];
        if (!materia || !archivo) return;
        const hoy = new Date().toISOString().slice(0,10);
        const nuevoApunte = {
            id: tareas.length + 1,
            nombre: `Apunte de ${materia} - ${archivo.name}`,
            materia,
            fechaCreacion: hoy,
            fechaEntrega: null,
            completado: true,
            revisado: false,
            tipo: "apunte",
            contenido: `Contenido simulado del archivo ${archivo.name}`
        };
        tareas.push(nuevoApunte);
        resetFiltros();
        alert("¡Apunte subido!");
        document.getElementById("formApunte").reset();
        toggleForm('apunte');
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

    const previsualizarFotos = () => {
        const input = document.getElementById("inputFotos");
        const preview = document.getElementById("previewFotos");
        const iaTexto = document.getElementById("iaTexto");
        preview.innerHTML = "";
        iaTexto.textContent = "";
        if (input.files.length > 0) {
            Array.from(input.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.maxWidth = "100px";
                    img.style.margin = "5px";
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
                // Simulación IA: mostrar nombre del archivo como texto extraído
                iaTexto.textContent += `Texto extraído de ${file.name}: [Simulación IA]\n`;
            });
        }
    }

    function mostrarResumenMateria() {
        const materia = document.getElementById("materiaResumen").value;
        const apuntes = tareas.filter(t => t.tipo === "apunte" && (materia === "" || t.materia === materia));
        const contenedor = document.getElementById("contenedorResumen");
        if (apuntes.length === 0) {
            contenedor.innerHTML = "<p>No hay apuntes para esta materia.</p>";
            return;
        }
        let html = "";
        apuntes.forEach((apunte) => {
            html += `
                <div style="border:1px solid #6dd5ed;border-radius:8px;padding:15px;margin-bottom:15px;">
                    <strong>${apunte.nombre}</strong> <br>
                    <span>Materia: ${apunte.materia}</span> <br>
                    <span>Fecha: ${apunte.fechaCreacion}</span> <br>
                    <span>Resumen IA:</span>
                    <div style="background:#e0f7fa;padding:10px;border-radius:6px;margin-top:5px;">
                        Este es un resumen simulado del apunte "${apunte.nombre}" de la materia ${apunte.materia}.
                    </div>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    }

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
            cuestionarioContainer.classList.remove('hidden');
            document.getElementById('btn-exportar-pdf').classList.remove('hidden');
        }

        resultadoGuia.classList.remove('hidden');
    };

    // --- Event Listeners ---

    // Menú
    document.querySelector('.navbar-toggle').addEventListener('click', toggleMenu);
    document.getElementById('nav-inicio').addEventListener('click', mostrarDashboard);
    document.getElementById('nav-resumen').addEventListener('click', mostrarResumen);
    document.getElementById('nav-guia-ia').addEventListener('click', mostrarGuiaEstudio);

    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-confirmar-envio').addEventListener('click', confirmarEnvio);

    // Formularios
    document.getElementById('btn-toggle-tarea').addEventListener('click', () => toggleForm('tarea'));
    document.getElementById('btn-toggle-apunte').addEventListener('click', () => toggleForm('apunte'));
    document.getElementById('btn-cancelar-tarea').addEventListener('click', () => toggleForm('tarea'));
    document.getElementById('btn-cancelar-apunte').addEventListener('click', () => toggleForm('apunte'));
    document.getElementById('formTarea').addEventListener('submit', crearTarea);
    document.getElementById('formApunte').addEventListener('submit', crearApunte);
    document.getElementById('inputFotos').addEventListener('change', previsualizarFotos);
    document.getElementById('materiaResumen').addEventListener('change', mostrarResumenMateria);

    // IA
    document.getElementById('btn-generar-guia').addEventListener('click', generarGuiaEstudio);
    document.getElementById('btn-iniciar-cuestionario').addEventListener('click', iniciarCuestionario);
    document.getElementById('btn-exportar-pdf').addEventListener('click', exportarGuiaPDF);

    // ... Aquí irían los listeners para 'submit' de los formularios 'formTarea' y 'formApunte'

    // Inicialización
    mostrarTareas(tareas.filter(t => !t.completado));
});