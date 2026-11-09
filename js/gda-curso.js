/* Renderiza advisories.html?c=<id> a partir de window.GDA_CURSOS (js/gda-cursos.js). Sin ?c abre el primer curso. */
(() => {
  const cursos = window.GDA_CURSOS || [];
  const root = document.querySelector('[data-gda-curso]');
  if (!root || !cursos.length) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const safeUrl = url => /^https:\/\//i.test(url || '') ? url : '';
  const ext = ' target="_blank" rel="noopener noreferrer"';
  const slot = name => document.querySelector(`[data-gda-${name}]`);

  const id = new URLSearchParams(window.location.search).get('c');
  const curso = cursos.find(item => item.id === id) || cursos[0];

  document.title = `${curso.nombre} | Club CODE UP`;
  slot('crumb').textContent = `${curso.id}.md`;
  slot('tool').textContent = curso.herramienta;
  slot('title').textContent = curso.nombre;
  slot('audience').innerHTML = curso.publico ? `<i class="fa fa-user-graduate" aria-hidden="true"></i>${esc(curso.publico)}` : '';
  slot('lead').textContent = curso.descripcion;
  slot('tags').innerHTML = curso.temas.map(t => `<li>${esc(t)}</li>`).join('');
  slot('switch').innerHTML = cursos.map(item =>
    `<a class="filter-button gda-switch__item" href="advisories.html?c=${encodeURIComponent(item.id)}"${item === curso ? ' aria-current="page"' : ''}>${esc(item.nombre)}</a>`
  ).join('');

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
