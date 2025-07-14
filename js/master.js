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

// Array para agregar a los alumnos que se inscriben
let inscriptos = [];

// Funciones
// 1. Ver los cursos disponibles
function mostrarCursos() {
  console.clear(); // Limpia la pantalla
  console.log("Estos son los cursos disponibles, ¿Hay alguno de tu interés?");
  for (let i = 0; i < cursos.length; i++) {
    console.log(`${i+1}. ${cursos[i].nombre} \n\tDuración: ${cursos[i].duracion} \n\tPrecio: ${cursos[i].precio}`);
  }
}

// 2. Inscribir a un alumno
function inscribirAlumno() {
  mostrarCursos();
  let cursoSeleccionado = prompt("Por favor seleccione un curso");
  if (cursoSeleccionado === null) return; // Retorna en caso que el usuario seleccione "cancelar"
  let indice = parseInt(cursoSeleccionado) - 1;
  if (!isNaN(indice) && indice >= 0 && indice < cursos.length) {
    let datosAlumno = prompt("Ingrese su nombre:");
    if (datosAlumno === null) return;
    datosAlumno = datosAlumno.trim();
    if (!datosAlumno) {
      alert("Nombre inválido. No se pudo completar la inscripción.");
      return;
    }
    alert(
      `${datosAlumno}, te inscribiste exitosamente al curso: ${cursos[indice].nombre}. ¡Te deseamos lo mejor en tu aprendizaje!`
    );
    inscriptos.push({
      nombreAlumno: datosAlumno,
      curso: cursos[indice].nombre,
    });
  } else {
    alert("Curso no disponible.");
  }
}

// 3. Ver alumnos inscriptos
function verInscriptos() {
  console.clear();
  if (inscriptos.length === 0) {
    console.log("No hay alumnos inscriptos.");
  } else {
    console.log("Alumnos Inscriptos:");
    for (let i = 0; i < inscriptos.length; i++) {
      console.log(`${i+1}. Nombre del alumno: ${inscriptos[i].nombreAlumno} \nCurso: ${inscriptos[i].curso}`);
    }
  }
}

// 4. Mostrar estadísticas del sistema
function muestraEstadisticas() {
  console.clear();
  // Inicializa el contador de inscriptos por curso
  let contadorCursos = {};
  for (let i = 0; i < cursos.length; i++) {
    contadorCursos[cursos[i].nombre] = 0;
  }

  if (inscriptos.length === 0) {
    console.log("No hay inscriptos aún. No hay estadísticas para mostrar.");
    return;
  }

  for (let i = 0; i < inscriptos.length; i++) {
    let curso = inscriptos[i].curso;
    contadorCursos[curso]++;
  }
  console.log("Estadísticas de inscripción por curso:");
  // Cantidad inscriptos por curso
  for (let curso in contadorCursos) {
    console.log(`${curso}: ${contadorCursos[curso]} inscriptos.`);
  }
  // Cantidad de inscriptos totales
  let totalInscriptos = inscriptos.length;
  console.log(`\nTotal de alumnos inscriptos: ${totalInscriptos}.`);
  // Curso con más inscriptos
  let cursoMasPopular = "";
  let maxInscriptos = 0;
  
  for (let curso in contadorCursos) {
    if (contadorCursos[curso] > maxInscriptos) {
      maxInscriptos = contadorCursos[curso];
      cursoMasPopular = curso;
    }
  }
  console.log(`\nEl curso más elegido es ${cursoMasPopular} con ${maxInscriptos} inscriptos.`);
}

// Pantalla Inicial
let opcion;
do {
  opcion = prompt(
    "Simulador de inscripción a cursos:\n\n" +
      "1. Ver cursos.\n" +
      "2. Inscribirse.\n" +
      "3. Ver inscriptos.\n" +
      "4. Ver estadísticas del sistema.\n" +
      "5. Salir\n"
  );

  switch (opcion) {
    case "1":
      mostrarCursos();
      break;
    case "2":
      inscribirAlumno();
      break;
    case "3":
      verInscriptos();
      break;
    case "4":
      muestraEstadisticas();
      break;
    case "5":
      if (confirm("¿Está seguro que desea salir del simulador?")) {
        alert("Gracias por utilizar el simulador.");
      } else {
        opcion = null; // Para evitar la salida del bucle
      }
      break;
    default:
      alert("Por favor ingrese una opción válida.");
      break;
  }
} while (opcion != "5");
