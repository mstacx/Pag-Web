/*
 * Datos de los cursos GDA (Gestión de Aprendizaje).
 * Este es el único archivo que hay que editar para actualizar la página de cursos (advisories.html).
 *
 * - Para publicar una grabación: agrega una fila en `grabaciones` del curso.
 *   El `link` es el enlace de Teams. Si queda vacío (''), el botón sale como "Pronto".
 * - Los enlaces de Drive deben estar restringidos a cuentas UP, nunca "cualquier persona con el enlace".
 * - No publicar teléfonos ni correos personales de asesores.
 * - Para agregar un curso: copia un bloque completo y cambia `id` (va en la URL: advisories.html?c=id).
 */
window.GDA_CURSOS = [
  {
    id: 'nivelacion',
    nombre: 'Nivelación en Informática',
    herramienta: 'Excel',
    publico: 'Todas las facultades',
    descripcion: 'Curso transversal de Excel: desde funciones básicas hasta herramientas avanzadas para organizar, analizar y automatizar datos.',
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
    publico: 'Facultad de Ingeniería',
    descripcion: 'Introducción a la programación en Python: desde los conceptos básicos hasta resolver problemas con código propio.',
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
    nombre: 'Analítica de Datos para los Negocios',
    herramienta: 'Excel · Python',
    publico: 'Facultad de Ciencias Empresariales',
    descripcion: 'Excel y Python aplicados al análisis de datos de negocio: limpiar información, visualizar hallazgos y crear reportes útiles.',
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
    herramienta: 'R · Stata',
    publico: 'Facultad de Economía y Finanzas',
    descripcion: 'Curso práctico de R y Stata para analizar microdatos de la ENAHO: manejo de bases, estadística descriptiva e inferencia.',
    temas: ['ENAHO', 'Manejo de bases', 'Descriptiva', 'Inferencia'],
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
    id: 'arquitectura',
    nombre: 'Arquitectura del Sistema de Información',
    herramienta: 'SQL · Power BI',
    publico: 'Facultad de Ingeniería',
    descripcion: 'Bases de datos con SQL y visualización en Power BI: consultar, relacionar y presentar información para la toma de decisiones.',
    temas: ['Consultas SQL', 'Joins', 'Modelo de datos', 'Dashboards'],
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
