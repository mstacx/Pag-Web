const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname,'..');
const roster = require('../data/members-2026-2.json');
const confirmation = require('./fixtures/member-confirmation-2026-2.json');
const read = file => fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');

test('the public roster contains only display fields and the 86 people confirmed in the supplied images', () => {
  assert.equal(roster.period,'2026-2');
  const confirmed = new Set(confirmation.groups.flatMap(g=>Object.keys(g.people)));
  assert.equal(roster.members.length,86);
  assert.equal(new Set(roster.members.map(m=>m.id)).size,86);
  assert.equal(new Set(roster.members.map(m=>m.name)).size,86);
  assert.deepEqual(new Set(roster.members.map(m=>m.id)),confirmed);
  const groups = new Set(roster.groups.map(g=>g.id));
  for (const m of roster.members) {
    assert.deepEqual(Object.keys(m).sort(),['career','group','id','image','name','role'].sort());
    assert.ok(groups.has(m.group));
    if(m.image) assert.ok(fs.existsSync(path.join(root,m.image)),m.name);
  }
  assert.deepEqual(roster.members.filter(m=>m.group==='directiva-2026').map(m=>[m.name,m.role]).sort(),[
    ['Arturo Alvarez de la Torre','Presidente'],['Gianella Silvestre','Vicepresidenta']
  ]);
  assert.equal(roster.additionalRoles.length,9);
  for (const r of roster.additionalRoles) {
    assert.ok(roster.members.some(m=>m.id===r.member),r.member);
    assert.ok(groups.has(r.group),r.group);
  }
  for (const expected of confirmation.groups) {
    const actual = Object.fromEntries([
      ...roster.members.filter(m=>m.group===expected.id).map(m=>[m.id,m.role]),
      ...roster.additionalRoles.filter(r=>r.group===expected.id).map(r=>[r.member,r.role])
    ]);
    assert.deepEqual(actual,expected.people,expected.id);
  }
  assert.equal(roster.members.find(m=>m.id==='katherine-pongo').group,'finanzas-y-legal');
  assert.ok(roster.members.some(m=>m.name==='Pamela Geraldine Malpartida'));
  assert.deepEqual(roster.members.filter(m=>!m.image),[]);
  for (const id of ['jean-trujillo','paulo-verde','gabriela-kohatsu','marcela-vicuna']) {
    assert.equal(roster.members.find(m=>m.id===id).career,'','do not invent a career missing from the confirmed sources');
  }
  assert.doesNotMatch(read('data/members-2026-2.json'),/@|tel:|fecha.*nacimiento|celular|codigo.*up/i);
});

test('the directory and the homepage portraits agree with the same roster', () => {
  const team = read('team.html');
  const home = read('index.html');
  assert.equal((home.match(/data-member-total data-count="86"/g)||[]).length,2);
  assert.match(home,/<span data-member-total>86 integrantes<\/span>/);
  assert.doesNotMatch(home,/74 activos|74.*miembros|50.*miembros activos/);
  assert.match(read('js/stats.js'),/miembros: 86\b/);
  const names = [...team.matchAll(/data-member-name="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(names.sort(),roster.members.map(m=>m.name).sort());
  const wall = home.match(/<div class="member-wall"[\s\S]*?(?=\n      <\/div>\n    <\/section>)/)[0];
  const tiles = [...wall.matchAll(/href="team.html#([^"]+)"/g)].map(m=>m[1]);
  assert.equal(tiles.length,14);
  assert.equal(new Set(tiles).size,14);
  for(const id of tiles) {
    const person = roster.members.find(m=>m.id===id);
    assert.ok(person,id);
    assert.ok(wall.includes(`src="${person.image}"`));
    assert.ok(team.includes(`id="${id}"`));
  }
  const board = home.match(/<div class="ide-scatter ide-scatter--leadership">[\s\S]*?<\/div>/)[0];
  assert.equal((board.match(/<article /g)||[]).length,2);
  for(const m of roster.members.filter(m=>m.group==='directiva-2026')) assert.ok(board.includes(m.image));
  for(const stale of ['Omar Da Silva']) {
    assert.ok(!team.includes(stale),stale);
    assert.ok(!board.includes(stale),stale);
  }
});

test('the complete roster includes the three supplied Dani portraits in their confirmed areas', () => {
  for (const [name, group] of [['Daniella Cabrera','eventos'],['Daniela García Saba','proyectos'],['Daniel Cabrera','gestion-del-aprendizaje']]) {
    const member = roster.members.find(m=>m.name===name);
    assert.ok(member,name);
    assert.equal(member.group,group);
    assert.ok(member.image && fs.existsSync(path.join(root,member.image)),name);
  }
  assert.equal(roster.members.filter(m=>m.image).length,86);
});

test('every confirmed area and role is rendered, including all nine board members and both GDA leads', () => {
  const team = read('team.html');
  const sections = [...team.matchAll(/<section class="team-group[^]*?data-team-group="([^"]+)"[^]*?<\/section>/g)];
  assert.equal(sections.length,10);
  let entries = 0;
  for (const [, id] of sections) {
    const section = sections.find(s=>s[1]===id)[0];
    const cards = [...section.matchAll(/<article\b[^]*?data-member-id="([^"]+)" data-member-role="([^"]+)"[^]*?<\/article>/g)];
    const expected = confirmation.groups.find(g=>g.id===id).people;
    assert.equal(cards.length,Object.keys(expected).length,id);
    assert.deepEqual(Object.fromEntries(cards.map(m=>[m[1],m[2]])),expected,id);
    assert.equal((section.match(/class="member-portrait__photo"/g)||[]).length,cards.length,id);
    for (const card of cards) {
      if (id==='directiva-2026' || /^(?:Director|Directora|Codirector)\b/.test(card[2])) {
        assert.match(card[0],/class="member-portrait member-portrait--lead"/,card[1]);
      }
    }
    entries += cards.length;
  }
  assert.equal(entries,95,'a shared role is shown in its area without increasing the unique-person total');
  assert.match(team,/<span id="legal" hidden><\/span>/,'legacy Legal links continue to resolve');
  assert.match(team,/Vicepresidenta y directora de Proyectos/);
});

test('Manuel has the exact supplied source pixels in a bounded SVG photo viewport', () => {
  const svg = read('media/pages/members-2026-2/manuel-fidel-serna.svg');
  assert.match(svg,/viewBox="283 397 97 79"/);
  const png = Buffer.from(svg.match(/href="data:image\/png;base64,([^"]+)"/)[1],'base64');
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(png.readUInt32BE(16),537);
  assert.equal(png.readUInt32BE(20),537);
  assert.doesNotMatch(svg,/<script|https?:\/\/(?!www\.w3\.org)|foreignObject/);
});

test('the member rendering script is idempotent', () => {
  assert.equal(execFileSync(process.execPath,['scripts/render-members.cjs'],{cwd:root,encoding:'utf8'}).trim(),'');
});
