// Array con cursos disponibles
let cursos = [
  {
    nombre: "Desarrollo Web",
    duracion: "3 meses",
    precio: 30000,
  },
  {
    nombre: "Marketing Digital",
    duracion: "2 meses",
    precio: 25000,
  },
  {
    nombre: "Diseño Gráfico",
    duracion: "4 meses",
    precio: 28000,
  },
  {
    nombre: "Desarrollo de Videojuegos",
    duracion: "5 meses",
    precio: 50000,
  },
];

// Array para agregar a los alumnos que se inscriben o traerlos desde el localstorage
let inscriptos = JSON.parse(localStorage.getItem("inscriptos")) || [];

// "Capturamos" los elementos
const listaCursos = document.getElementById("lista-cursos");
const cursoSelect = document.getElementById("curso-select");
const btnInscribirse = document.getElementById("btn-inscribirse");
const mensajeInscripcion = document.getElementById("mensaje-inscripcion");
const listaInscriptos = document.getElementById("lista-inscriptos");
const estadisticasDiv = document.getElementById("estadisticas");
const nombreAlumnoInput = document.getElementById("nombre-alumno");

// Funciones
// 1. Ver los cursos disponibles
function mostrarCursos() {
  listaCursos.innerHTML = "";

  cursos.forEach((curso, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <p><strong>${i + 1}. ${curso.nombre}</strong></p>
    <p>Duración: ${curso.duracion}</p>
    <p>Precio: $${curso.precio}</p>
  `;
    li.classList.add("curso-item");
    listaCursos.appendChild(li);
  });
}

// 2. Inscribir a un alumno
function cargarCursosEnSelect() {
  cursoSelect.innerHTML = "";
  cursos.forEach((curso, i) => {
    const opcion = document.createElement("option");
    opcion.value = i;
    opcion.textContent = curso.nombre;
    cursoSelect.appendChild(opcion);
  });
}

btnInscribirse.addEventListener("click", () => {
  const nombre = nombreAlumnoInput.value.trim();
  const indiceCurso = cursoSelect.value;

  if (!nombre) {
    mensajeInscripcion.textContent = "Por favor, ingrese un nombre válido.";
    return;
  }

  const cursoElegido = cursos[indiceCurso];
  inscriptos.push({ nombreAlumno: nombre, curso: cursoElegido.nombre });

  // Guardamos en el localstorage
  localStorage.setItem("inscriptos", JSON.stringify(inscriptos));

  mensajeInscripcion.textContent = `${nombre}, te inscribiste exitosamente al curso: ${cursoElegido.nombre}. ¡Te deseamos lo mejor en tu aprendizaje!`;
  nombreAlumnoInput.value = ""; // Limpia el Input

  // Recarga las listas
  verInscriptos();
  muestraEstadisticas();
});

// 3. Ver alumnos inscriptos
function verInscriptos() {
  listaInscriptos.innerHTML = "";

  if (inscriptos.length === 0) {
    listaInscriptos.textContent = "No hay alumnos inscriptos.";
    return;
  }

  inscriptos.forEach((inscripto, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${inscripto.nombreAlumno} | Curso: ${inscripto.curso}`;
    listaInscriptos.appendChild(li);
  });
}

// 4. Mostrar estadísticas del sistema
function muestraEstadisticas() {
  estadisticasDiv.innerHTML = "";

  if (inscriptos.length === 0) {
    estadisticasDiv.textContent = "No hay estadísticas para mostrar.";
    return;
  }

  const contadorCursos = {};
  cursos.forEach((curso) => (contadorCursos[curso.nombre] = 0));

  inscriptos.forEach((inscripto) => {
    contadorCursos[inscripto.curso]++;
  });

  let totalInscriptos = inscriptos.length;
  let cursoMasPopular = "";
  let maxInscriptos = 0;

  let listaDeEstadisticas = "";
  for (let curso in contadorCursos) {
    listaDeEstadisticas += `<li>${curso}: ${contadorCursos[curso]} inscriptos</li>`;
    if (contadorCursos[curso] > maxInscriptos) {
      maxInscriptos = contadorCursos[curso];
      cursoMasPopular = curso;
    }
  }

  estadisticasDiv.innerHTML = `
  <p><strong>Estadísticas de inscripción por curso:</strong></p>
  <ul>${listaDeEstadisticas}</ul>
  <p>Total de alumnos inscriptos: ${totalInscriptos}.</p>
  <p>El curso más elegido es <strong>${cursoMasPopular}</strong> con ${maxInscriptos} inscriptos.</p>
`;

  // estadisticasDiv.innerHTML = estadisticasHTML;
}

// Cargar todo al inicio
mostrarCursos();
cargarCursosEnSelect();
verInscriptos();
muestraEstadisticas();
