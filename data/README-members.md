# Equipo CODE UP · 2026-2

`members-2026-2.json` es la única fuente pública del directorio, los retratos del inicio y los contadores de integrantes.

Actualización del **13 de octubre de 2026**, confirmada por la organización a través de las diez láminas entregadas por el usuario: Directiva, Eventos, Marketing Diseño, Marketing Redes, Consulting, Investigación y Divulgación, Proyectos, Gestión del Talento, Gestión del Aprendizaje y Finanzas y Legal. El usuario indicó expresamente «Usar únicamente las imágenes»: la pertenencia y los cargos que muestran esas láminas tienen prioridad sobre el formulario incompleto.

La lista contiene **86 personas distintas**, **95 fichas de funciones** y **10 secciones**. Los nueve integrantes de la directiva aparecen allí; sus funciones dentro de cada área también se muestran. Mildred dirige Diseño y Redes; Gianella es vicepresidenta y directora de Proyectos. Una persona con varios cargos sigue contando una sola vez.

Las cuatro incorporaciones respecto a la importación del formulario son Jean Trujillo, Paulo Verde, Gabriela Kohatsu y Marcela Vicuña. Omar Da Silva se retiró del directorio actual conforme a la confirmación del usuario; su archivo de foto se conserva. Rubí Rojas pasa a dirigir Investigación y Divulgación; Jean dirige GDA y Sebastián Taco es codirector. Mayra Chacaliaza, Lucero Vera y Katherine Pongo aparecen en Finanzas y Legal. Los cargos de coordinación proceden de las láminas, incluidas Tania Chávez, Gabriel Silva y Marcela Vicuña. El rótulo Kimberly Luján conserva el identificador anterior `kimberlin-lujan`; Diego Huerta conserva `diego-huertas`, para no romper enlaces.

Las carreras previamente confirmadas por el formulario se conservan para las personas incluidas. Las cuatro incorporaciones tienen carrera vacía porque las láminas no la indican; el directorio omite ese campo cuando falta. Solo se publican nombre de presentación, cargo, área, carrera y referencia de foto. No se publican los formularios, contactos personales, fechas de nacimiento ni códigos universitarios.

**Las 86 personas tienen imagen.** Jean y Marcela reutilizan fotografías originales ya presentes en el repositorio. Paulo y Gabriela tienen sus originales identificados por nombre en la carpeta de Drive entregada por la organización; sus versiones WebP corrigen EXIF y eliminan metadatos. La imagen de Manuel Serna procede de su retrato expresamente rotulado en la lámina de Investigación y Divulgación: un SVG muestra ese sector del PNG completo mediante `viewBox`, conservando exactamente los píxeles proporcionados. Su resolución está limitada por la captura. Luciana Pereyra conserva la imagen de mascota suministrada por ella y mostrada en la lámina. No se generan ni retocan rostros.

`additionalRoles` contiene los cargos adicionales como `{ "member", "group", "role" }`; el identificador referencia a una persona de `members`. Cada ficha adicional tiene un ancla distinta y utiliza la misma foto. Los directores y codirectores abren su área con retratos destacados; los coordinadores mantienen su cargo visible. El resto conserva el mosaico y las animaciones del diseño vigente.

Finanzas y Legal vuelve a ser una sección conjunta. Se conservan `finanzas-y-legal` y el alias `legal` para los enlaces antiguos. Los originales de las fotos y las fotografías históricas de eventos permanecen en el repositorio.

## Mantenimiento

Actualizar primero el JSON con la confirmación de la organización. `node scripts/render-members.cjs` genera un parche para `team.html`, `index.html` y `js/stats.js`; no escribe esos archivos automáticamente. Aplicar y revisar el parche. El inicio conserva su composición y sus dos retratos de presidencia y vicepresidencia.

La transcripción independiente de las diez láminas está en `tests/fixtures/member-confirmation-2026-2.json`. Las pruebas cotejan las personas, los cargos y la pertenencia exacta por área, las funciones adicionales, los enlaces únicos y el total sin duplicados.

Verificación: `node --test --test-reporter=spec`.
