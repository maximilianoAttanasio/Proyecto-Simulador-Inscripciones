// Array para cursos disponibles
let cursos = [];

// Array para agregar a los alumnos que se inscriben o traerlos desde el localstorage
let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];

fetch("./data/cursos.json")
  .then(response => response.json())
  .then(data => {
    cursos = data;
    // Ordena los cursos alfabéticamente
    cursos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    // Cargar todo al inicio
    mostrarCursos();
    cargarCursosEnSelect();
    cargarCursosEnFiltro();
    verInscripciones();
    mostrarEstadisticas();
  })
  .catch(error => {
    console.error("Error al cargar los cursos:", error);
  });

// "Capturamos" los elementos
// Inputs de inscripcion
const inputAlumnoNombre = document.getElementById("nombre-alumno");
const inputAlumnoDocumento = document.getElementById("documento-alumno");
const selectCurso = document.getElementById("curso-select");
const btnInscribirse = document.getElementById("btn-inscribirse");
const mensajeInscripcion = document.getElementById("mensaje-inscripcion");

// Listas
const listaCursos = document.getElementById("lista-cursos");
const listaInscripciones = document.getElementById("lista-inscriptos");

// Filtros
const inputBuscador = document.getElementById("buscador-inscriptos");
const selectFiltroCurso = document.getElementById("filtro-curso");
const selectOrden = document.getElementById("orden-inscriptos");
const contadorResultados = document.getElementById("contador-resultados");

// Estadísticas
const divEstadisticas = document.getElementById("estadisticas");

// Funciones
// Cursos
function mostrarCursos() {
  listaCursos.innerHTML = "";

  cursos.forEach((curso, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <p><strong>${i + 1}. ${curso.nombre}</strong></p>
    <p>Duración: ${curso.duracion}</p>
    <p>Precio: ${curso.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>`;
    li.classList.add("curso-item");
    listaCursos.appendChild(li);
  });
}

function cargarCursosEnSelect() {
  selectCurso.innerHTML = "";
  cursos.forEach((curso, i) => {
    const opcion = document.createElement("option");
    opcion.value = i;
    opcion.textContent = curso.nombre;
    selectCurso.appendChild(opcion);
  });
}

function cargarCursosEnFiltro() {
  selectFiltroCurso.innerHTML = "<option value=''>Todos los cursos</option>";
  cursos.forEach(curso => {
    const opcion = document.createElement("option");
    opcion.value = curso.nombre;
    opcion.textContent = curso.nombre;
    selectFiltroCurso.appendChild(opcion);
  });
}

// Inscripciones
btnInscribirse.addEventListener("click", () => {
  const alumnoNombre = inputAlumnoNombre.value.trim();
  const alumnoDocumento  = inputAlumnoDocumento.value.trim();
  const indiceCurso = selectCurso.value;

  if (!alumnoNombre || !alumnoDocumento) {
    mensajeInscripcion.textContent = "Por favor, debe completar todos los campos.";
    mensajeInscripcion.className = "error";
    return;
  }

  // Valida longitud del documento
  const documentoValido = /^\d{7,8}$/;
  if (!documentoValido.test(alumnoDocumento)) {
    mensajeInscripcion.textContent = "El documento debe tener 7 u 8 dígitos numéricos.";
    mensajeInscripcion.className = "error";
    return;
  }

  const cursoElegido = cursos[indiceCurso];

  // Se valida la duplicación del documento
  const yaInscripto = inscripciones.some(inscripto => inscripto.alumnoDocumento === alumnoDocumento && inscripto.curso === cursoElegido.nombre);

  if (yaInscripto) {
    mensajeInscripcion.textContent = `Ya se encuentra inscripto en el curso ${cursoElegido.nombre}`;
    mensajeInscripcion.className = "error";
    return;
  }

  inscripciones.push({alumnoNombre, alumnoDocumento, curso: cursoElegido.nombre});

  // Guardamos en el localstorage
  localStorage.setItem("inscripciones", JSON.stringify(inscripciones));

  mensajeInscripcion.textContent = `${alumnoNombre}, te inscribiste exitosamente al curso: ${cursoElegido.nombre}. ¡Te deseamos lo mejor en tu aprendizaje!`;
  mensajeInscripcion.className = "success";

  inputAlumnoNombre.value = "";
  inputAlumnoDocumento.value = "";

  // Borrar mensaje
  setTimeout(() => {
    mensajeInscripcion.textContent = "";
    mensajeInscripcion.className = "";
  }, 5000);

  // Recarga las listas
  verInscripciones();
  mostrarEstadisticas();
});

// 3. Ver alumnos inscriptos
function verInscripciones(lista = inscripciones) {
  listaInscripciones.innerHTML = "";

  if (lista.length === 0) {
    listaInscripciones.textContent = "No hay alumnos inscriptos.";
    return;
  }

  lista.forEach((inscripto) => {
    // Buscamos el índice real en el array original
    const indexReal = inscripciones.indexOf(inscripto);

    const li = document.createElement("li");
    li.innerHTML = `<span><p>Nombre: ${inscripto.alumnoNombre} - Documento: ${inscripto.alumnoDocumento}</p><p>Curso: ${inscripto.curso}</p></span><button class="btn-eliminar" data-index="${indexReal}">Eliminar</button>`;
    listaInscripciones.appendChild(li);
  });
  contadorResultados.textContent = `Se encontraron ${lista.length} inscriptos.`;
}

// Filtros
inputBuscador.addEventListener("input", aplicarFiltros);
selectOrden.addEventListener("change", aplicarFiltros);
selectFiltroCurso.addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  let texto = inputBuscador.value.toLowerCase();
  let listaFiltrada = inscripciones.filter(i =>
    i.alumnoNombre.toLowerCase().includes(texto) ||
    i.alumnoDocumento.includes(texto)
  );

  if (selectFiltroCurso.value) {
    listaFiltrada = listaFiltrada.filter(i => i.curso === selectFiltroCurso.value);
  }

  if (selectOrden.value === "nombre") {
    listaFiltrada.sort((a, b) => a.alumnoNombre.localeCompare(b.alumnoNombre));
  } else if (selectOrden.value === "documento") {
    listaFiltrada.sort((a, b) => a.alumnoDocumento.localeCompare(b.alumnoDocumento));
  }

  verInscripciones(listaFiltrada);
}

// Eliminamos alumnos inscriptos
listaInscripciones.addEventListener("click", (e) => {
  if (!e.target.matches(".btn-eliminar")) return;

  const index = Number(e.target.dataset.index);
  if (Number.isNaN(index)) return;

  const alumno = inscripciones[index];

  Swal.fire({
    title: `¿Eliminar a ${alumno.alumnoNombre}?`,
    text: `Se eliminará la inscripción en el curso ${alumno.curso}.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      inscripciones.splice(index, 1);
      localStorage.setItem("inscripciones", JSON.stringify(inscripciones));

      aplicarFiltros();
      mostrarEstadisticas();

      Swal.fire({
        title: "Eliminado",
        text: `${alumno.alumnoNombre} fue eliminado del curso ${alumno.curso}.`,
        icon: "success",
        timer: 2500,
        showConfirmButton: false
      });
    }
  });
});

// Mostrar estadísticas del sistema
function mostrarEstadisticas() {
  divEstadisticas.innerHTML = "";

  if (inscripciones.length === 0) {
    divEstadisticas.textContent = "No hay estadísticas para mostrar.";
    return;
  }

  const contadorCursos = {};
  cursos.forEach((curso) => (contadorCursos[curso.nombre] = 0));

  inscripciones.forEach((inscripto) => {
    contadorCursos[inscripto.curso]++;
  });

  let totalInscriptos = inscripciones.length;
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

  divEstadisticas.innerHTML = `
  <p><strong>Estadísticas de inscripción por curso:</strong></p>
  <ul>${listaDeEstadisticas}</ul>
  <p>Total de alumnos inscriptos: ${totalInscriptos}.</p>
  <p>El curso más elegido es <strong>${cursoMasPopular}</strong> con ${maxInscriptos} inscriptos.</p>
`;
}