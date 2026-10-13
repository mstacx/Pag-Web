// Run from the repository root. Emits an apply_patch patch; never edits source files itself.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const roster = require('../data/members-2026-2.json');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const members = roster.members;
const get = id => { const member = members.find(m => m.id === id); if (!member) throw Error('Unknown member: '+id); return member; };
const rank = role => {
  if (role === 'Presidente') return 0;
  if (role === 'Vicepresidenta') return 1;
  if (/^(?:Director|Directora|Codirector|Codirectora)\b/.test(role)) return 2;
  if (/^(?:Coordinador|Coordinadora)\b/.test(role)) return 3;
  if (role === 'Miembro') return 4;
  throw Error('Unknown role: '+role);
};
const byRank = (a,b) => rank(a.role)-rank(b.role) || a.name.localeCompare(b.name,'es');
const groupMembers = group => members.filter(m => m.group === group).sort(byRank);
// A second post in another area (e.g. the vice-president who also directs Proyectos). The person is still counted once.
const extraRoles = (roster.additionalRoles || []).map(r => {
  if (!roster.groups.some(g => g.id === r.group)) throw Error('Unknown group: '+r.group);
  return {...get(r.member), group: r.group, role: r.role, extra: true};
});
const areaPeople = group => [...groupMembers(group), ...extraRoles.filter(m => m.group === group)].sort(byRank);
// Each area opens with the person who leads it: the director, or the coordinator when there is none.
const leadsOf = (group, people) => {
  if (group === 'directiva-2026') return people;
  const directors = people.filter(m => rank(m.role) === 2);
  return directors.length ? directors : people.filter(m => rank(m.role) === 3).slice(0, 1);
};
const shortName = g => g.id === 'directiva-2026' ? 'Directiva' : g.name.replace('Marketing e Imagen · ', 'Marketing · ');
// The subject in this supplied landscape photo is on the right; keep her inside the crop.
const portraitPositions = {'daniella-cabrera':'100% 28%','glenda-huapaya':'100% 28%'};
function portrait(member, hint) {
  const career = hint && member.career ? `<span class="member-portrait__career">${esc(member.career)}</span>` : '';
  if (!member.image) return `<div class="member-portrait__empty" aria-label="Fotografía no disponible"><span aria-hidden="true">${esc(member.name.split(' ').filter((_,i,a) => i === 0 || i === a.length-1).map(s => s[0]).join(''))}</span><small>Foto por compartir</small>${career}</div>`;
  const position = portraitPositions[member.id] ? ` style="object-position: ${portraitPositions[member.id]}"` : '';
  return `<div class="member-portrait__photo"><img src="${esc(member.image)}" alt="${esc(member.name)}" loading="lazy" decoding="async" width="480" height="600"${position}>${career}</div>`;
}
function card(member, lead) {
  const anchor = member.extra ? ` id="${member.id}--${member.group}"` : ` id="${member.id}" data-member-name="${esc(member.name)}"`;
  const identity = `${anchor} data-member-id="${member.id}" data-member-role="${esc(member.role)}"`;
  const label = member.group === 'directiva-2026' && member.id === 'gianella-silvestre' ? 'Vicepresidenta y directora de Proyectos' : member.role;
  const role = member.role === 'Miembro' ? '' : `<p class="member-portrait__role">${esc(label)}</p>`;
  const career = member.career ? `<p>${esc(member.career)}</p>` : '';
  if (lead) return `<article class="member-portrait member-portrait--lead"${identity}>${portrait(member, false)}<h4>${esc(member.name)}</h4>${role}${career}</article>`;
  return `<article class="member-portrait"${identity}>${portrait(member, true)}<h4>${esc(member.name)}</h4>${role}</article>`;
}
const areas = roster.groups.map(g => ({group: g, people: areaPeople(g.id)}));
const directory = `<div class="page-section-head"><h2>Una familia, muchos talentos.</h2><p>${members.length} personas en ${areas.length} áreas. Equipo ${roster.period}.</p></div>\n`
  + `<div class="team-areas-bar"><nav class="team-areas" aria-label="Áreas del equipo">${areas.map(({group: g, people}) => `<a href="#${g.id}">${esc(shortName(g))}<span aria-hidden="true">${people.length}</span></a>`).join('')}</nav></div>\n`
  + areas.map(({group: g, people}) => {
    const leads = new Set(leadsOf(g.id, people));
    const about = g.description ? `<p>${esc(g.description)}</p>` : '';
    const aliases = (g.aliases || []).map(id => `<span id="${esc(id)}" hidden></span>`).join('');
    return `<section class="team-group${g.id === 'directiva-2026' ? ' team-group--board' : ''}" data-team-group="${g.id}" aria-labelledby="${g.id}">${aliases}<div class="team-group__head"><h3 id="${g.id}">${esc(g.name)}</h3><span data-group-count>${people.length} ${people.length === 1 ? 'persona' : 'personas'}</span>${about}</div><div class="team-portraits">` + people.map(m => card(m, leads.has(m))).join('\n') + '</div></section>';
  }).join('\n');
const featured = [
  ['tania-chavez','gianella-silvestre','matias-desmonteix','luz-marina-calderon','joel-pariona','manuel-sebastian-taco','valentino-montes'],
  ['naomi-torres','leonor-balabarca','lesly-campos','gaby-perez','gianpietro-palacios','paula-romero','verika-hinostroza']
];
const wall = '<div class="member-wall" aria-label="Algunas de las personas que forman CODE UP">\n' + featured.map(row => '          <ul class="member-wall__row">\n' + row.map(id => {
  const m = get(id);
  return `            <li><a class="member-wall__tile" href="team.html#${m.id}"><img src="${m.image}" width="560" height="700" alt="${esc(m.name)}" loading="lazy" decoding="async"><span class="member-wall__name" aria-hidden="true">${esc(m.name)}</span></a></li>`;
}).join('\n') + '\n          </ul>').join('\n') + '\n        </div>';
const board = '<div class="ide-scatter ide-scatter--leadership">\n' + groupMembers('directiva-2026').map((m,i) => `                    <article class="ide-scatter__item ide-scatter__item--${i+1}" data-reveal><img src="${m.image}" alt="${esc(m.name)}, ${esc(m.role.toLowerCase())} de CODE UP" loading="lazy" decoding="async"><h3>${esc(m.name)}</h3><p>${esc(m.role.toLowerCase())}</p></article>`).join('\n') + '\n                </div>';
const patch = [];
function update(file, replacements) {
  const source = fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
  let updated = source;
  for (const [expression,value] of replacements) {
    if (!expression.test(updated)) throw Error(`Missing section in ${file}: ${expression}`);
    updated = updated.replace(expression,value);
  }
  if (updated === source) return;
  // One contextual whole-file hunk makes generation deterministic, including subsequent runs.
  patch.push(`*** Update File: ${path.join(root,file).replace(/\\/g,'/')}\n@@\n` + source.trimEnd().split('\n').map(l=>'-'+l).join('\n') + '\n' + updated.trimEnd().split('\n').map(l=>'+'+l).join('\n'));
}
update('team.html', [[/<div class="page-section-head"><h2>Una familia, muchos talentos\.<\/h2>[\s\S]*?(?=\n<\/section>\n<div class="page-shell"><div class="page-cat-rail")/, directory]]);
update('index.html', [
  [/<div class="member-wall"[\s\S]*?(?=\n      <\/div>\n    <\/section>)/, wall],
  [/<div class="ide-scatter(?: ide-scatter--leadership)?">[\s\S]*?<\/div>/, board],
  [/data-split-words>Directiva 2026(?:-2)?<\/h2>/, 'data-split-words>Directiva 2026-2</h2>'],
  [/<span><strong(?: data-member-total)? data-count="\d+">\d+<\/strong> (?:miembros activos|integrantes)<\/span>/, `<span><strong data-member-total data-count="${members.length}">${members.length}</strong> integrantes</span>`],
  [/<strong(?: data-member-total)? data-count="\d+">\d+<\/strong><span>miembros<\/span>/, `<strong data-member-total data-count="${members.length}">${members.length}</strong><span>miembros</span>`],
  [/<span(?: data-member-total)?>\d+ (?:activos|integrantes)<\/span>/, `<span data-member-total>${members.length} integrantes</span>`]
]);
update('js/stats.js', [[/miembros: \d+/, `miembros: ${members.length}`]]);
if (patch.length) console.log('*** Begin Patch\n' + patch.join('\n') + '\n*** End Patch');
