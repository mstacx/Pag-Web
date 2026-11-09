/*
 * Datos de los cursos GDA (Gestión de Aprendizaje).
 * Este es el único archivo que hay que editar para actualizar la página curso.html.
 *
 * - Para publicar una grabación: agrega una fila en `grabaciones` del curso.
 *   El `link` es el enlace de Teams. Si queda vacío (''), el botón sale como "Pronto".
 * - Los enlaces de Drive deben estar restringidos a cuentas UP, nunca "cualquier persona con el enlace".
 * - No publicar teléfonos ni correos personales de asesores.
 * - Para agregar un curso: copia un bloque completo y cambia `id` (va en la URL: curso.html?c=id).
 */
window.GDA_CURSOS = [
  {
    id: 'nivelacion',
    nombre: 'Nivelación en Informática',
    herramienta: 'Excel',
    descripcion: 'Manejo de Excel desde funciones básicas hasta herramientas avanzadas para organizar, analizar y automatizar datos.',
    temas: ['Fórmulas', 'Funciones lógicas', 'Funciones de búsqueda', 'Filtros avanzados', 'Tablas dinámicas'],
    whatsapp: 'https://chat.whatsapp.com/',
    drive: {
      codeup: 'https://drive.google.com/',
      curso: 'https://drive.google.com/'
    },
    grabaciones: [
      { ciclo: '2026-II', evaluacion: 'PC1', tema: 'Expresión matemática en una imagen', fecha: '', asesor: '', link: 'https://www.youtube.com/' },
      { ciclo: '2026-II', evaluacion: 'PC2', tema: 'Funciones lógicas', fecha: '', asesor: '', link: 'https://www.youtube.com/' },
      { ciclo: '2026-II', evaluacion: 'Parcial', tema: 'Funciones de búsqueda', fecha: '', asesor: '', link: 'https://www.youtube.com/' },
      { ciclo: '2026-II', evaluacion: 'Final', tema: 'Filtros avanzados', fecha: '', asesor: '', link: '' }
    ]
  },
  {
    id: 'programacion',
    nombre: 'Herramientas de Programación',
    herramienta: 'Python',
    descripcion: 'Python desde conceptos básicos hasta estructuras aplicadas a automatización, análisis de datos y resolución de problemas.',
    temas: ['Fundamentos', 'Condicionales y bucles', 'Funciones', 'Estructuras de datos'],
    whatsapp: 'https://chat.whatsapp.com/',
    drive: {
      codeup: 'https://drive.google.com/',
      curso: 'https://drive.google.com/'
    },
    grabaciones: [
      { ciclo: '2026-II', evaluacion: 'PC1', tema: 'Por definir', fecha: '', asesor: '', link: 'https://www.youtube.com/' },
      { ciclo: '2026-II', evaluacion: 'Parcial', tema: 'Por definir', fecha: '', asesor: '', link: '' }
    ]
  },
  {
    id: 'analitica',
    nombre: 'Analítica de Datos',
    herramienta: 'Python · R · Excel',
    descripcion: 'Análisis e interpretación de datos para limpiar información, visualizar hallazgos y crear reportes útiles.',
    temas: ['Limpieza', 'Visualización', 'Reportes'],
    whatsapp: 'https://chat.whatsapp.com/',
    drive: {
      codeup: 'https://drive.google.com/',
      curso: 'https://drive.google.com/'
    },
    grabaciones: [
      { ciclo: '2026-II', evaluacion: 'PC1', tema: 'Por definir', fecha: '', asesor: '', link: 'https://www.youtube.com/' },
      { ciclo: '2026-II', evaluacion: 'Parcial', tema: 'Por definir', fecha: '', asesor: '', link: '' }
    ]
  },
  {
    id: 'estadistica',
    nombre: 'Estadística Aplicada',
    herramienta: 'Stata',
    descripcion: 'Uso de Stata para análisis descriptivo, inferencial y manejo de bases de datos en investigaciones y proyectos académicos.',
    temas: ['Descriptiva', 'Inferencia', 'Bases de datos'],
    whatsapp: 'https://chat.whatsapp.com/',
    drive: {
      codeup: 'https://drive.google.com/',
      curso: 'https://drive.google.com/'
    },
    grabaciones: [
      { ciclo: '2026-II', evaluacion: 'PC1', tema: 'Por definir', fecha: '', asesor: '', link: 'https://www.youtube.com/' },
      { ciclo: '2026-II', evaluacion: 'Parcial', tema: 'Por definir', fecha: '', asesor: '', link: '' }
    ]
  }
];
