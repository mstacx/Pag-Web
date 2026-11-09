/* Renderiza curso.html?c=<id> a partir de window.GDA_CURSOS (js/gda-cursos.js). */
(() => {
  const cursos = window.GDA_CURSOS || [];
  const root = document.querySelector('[data-gda-curso]');
  if (!root) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const safeUrl = url => /^https:\/\//i.test(url || '') ? url : '';
  const ext = ' target="_blank" rel="noopener noreferrer"';

  const id = new URLSearchParams(window.location.search).get('c');
  const curso = cursos.find(item => item.id === id);
  const crumb = document.querySelector('[data-gda-crumb]');

  const switcher = cursos.map(item =>
    `<a class="filter-button gda-switch__item" href="curso.html?c=${encodeURIComponent(item.id)}"${item === curso ? ' aria-current="page"' : ''}>${esc(item.nombre)}</a>`
  ).join('');

  if (!curso) {
    document.title = 'Cursos GDA | Club CODE UP';
    root.innerHTML = `
      <section class="page-shell page-intro">
        <h1>Elige tu <span class="page-title-accent">curso.</span></h1>
        <p class="page-lead">Grabaciones de asesorías, material y comunidad de cada curso que acompaña GDA.</p>
        <nav class="gda-switch" aria-label="Cursos GDA">${switcher}</nav>
      </section>`;
    return;
  }

  document.title = `${curso.nombre} | Club CODE UP`;
  if (crumb) crumb.textContent = `${curso.id}.md`;

  const ciclos = [...new Set(curso.grabaciones.map(g => g.ciclo))];
  const filas = ciclos.map(ciclo => {
    const items = curso.grabaciones.filter(g => g.ciclo === ciclo).map(g => {
      const link = safeUrl(g.link);
      const meta = [g.fecha || 'Fecha por publicar', g.asesor].filter(Boolean).map(esc).join(' · ');
      const accion = link
        ? `<a class="page-button page-button--outline gda-rec__btn" href="${esc(link)}"${ext}><i class="fa fa-play" aria-hidden="true"></i>Ver grabación</a>`
        : '<span class="gda-rec__soon">Pronto</span>';
      return `
        <li class="gda-rec">
          <span class="gda-rec__eval">${esc(g.evaluacion)}</span>
          <div><h4>${esc(g.tema)}</h4><p>${meta}</p></div>
          ${accion}
        </li>`;
    }).join('');
    return `<div class="gda-cycle"><h3 class="gda-cycle__title">ciclo/${esc(ciclo)}</h3><ul class="gda-recs">${items}</ul></div>`;
  }).join('');

  const driveCard = (url, titulo, texto, icono) => {
    const link = safeUrl(url);
    return `
      <article class="gda-card">
        <i class="fa ${icono} gda-card__icon" aria-hidden="true"></i>
        <h3>${titulo}</h3>
        <p>${texto}</p>
        ${link ? `<a class="page-link" href="${esc(link)}"${ext}>Abrir carpeta en Drive <i class="fa fa-arrow-right" aria-hidden="true"></i></a>` : '<span class="gda-rec__soon">Pronto</span>'}
      </article>`;
  };

  const whatsapp = safeUrl(curso.whatsapp);

  root.innerHTML = `
    <section class="page-shell page-intro gda-intro">
      <span class="course-entry__tool">${esc(curso.herramienta)}</span>
      <h1>${esc(curso.nombre)}</h1>
      <p class="page-lead">${esc(curso.descripcion)}</p>
      <ul class="page-tags">${curso.temas.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="page-actions">
        <a class="page-button" href="#grabaciones">Ver grabaciones <i class="fa fa-arrow-right" aria-hidden="true"></i></a>
        <a class="page-link" href="#material">Ir al material <i class="fa fa-arrow-right" aria-hidden="true"></i></a>
      </div>
      <p class="gda-notice"><i class="fa fa-lock" aria-hidden="true"></i>Grabaciones y material disponibles solo con tu cuenta UP.</p>
      <nav class="gda-switch" aria-label="Otros cursos GDA">${switcher}</nav>
    </section>

    <section class="page-shell page-section" id="grabaciones">
      <div class="page-section-head"><h2>grabaciones/</h2><p>Repasa la asesoría de cada evaluación cuando la necesites.</p></div>
      ${filas || '<p class="gda-empty">Aún no hay grabaciones publicadas para este curso.</p>'}
    </section>

    <section class="page-shell page-section" id="material">
      <div class="page-section-head"><h2>material/</h2><p>Organizado por ciclo y evaluación.</p></div>
      <div class="gda-cards">
        ${driveCard(curso.drive && curso.drive.codeup, 'Material CODE UP', 'PPTs de asesoría, ejercicios trabajados y resoluciones preparadas por nuestros asesores.', 'fa-code')}
        ${driveCard(curso.drive && curso.drive.curso, 'Material del curso', 'PPTs de clase y exámenes pasados para practicar.', 'fa-book')}
      </div>
    </section>

    <div class="page-shell">
      <section class="page-next">
        <div><h2>¿Te quedó una duda?</h2><p>Pregúntala en la comunidad del curso. Asesores y compañeros te ayudan a resolverla.</p></div>
        ${whatsapp ? `<a class="page-button" href="${esc(whatsapp)}"${ext}><i class="fab fa-whatsapp" aria-hidden="true"></i>Unirme a la comunidad</a>` : ''}
      </section>
    </div>`;
})();
