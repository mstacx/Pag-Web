const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { mount } = require('../js/site-header.js');
const root = path.resolve(__dirname, '..');

function classes() {
  const values = new Set();
  return {
    add: value => values.add(value),
    remove: value => values.delete(value),
    contains: value => values.has(value),
    toggle(value, active) { if (active) values.add(value); else values.delete(value); }
  };
}

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    fire(type, event = {}) { (listeners.get(type) || []).forEach(fn => fn(event)); },
    listeners
  };
}

function menuFixture() {
  const doc = { ...eventTarget(), body: { classList: classes() } };
  const attributes = new Map();
  const menu = {
    ...eventTarget(), dataset: {},
    getAttribute: name => attributes.get(name),
    setAttribute: (name, value) => attributes.set(name, value),
    focus() { doc.activeElement = menu; }
  };
  const tabs = { ...eventTarget(), classList: classes() };
  doc.querySelector = selector => selector === '.ide-menu-toggle' ? menu : tabs;
  return { doc, menu, tabs };
}

test('the shared menu updates its label, closes with Escape, and returns focus', () => {
  const { doc, menu, tabs } = menuFixture();
  mount(doc);
  assert.equal(doc.body.classList.contains('menu-ready'), true);
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  menu.fire('click');
  assert.equal(menu.getAttribute('aria-label'), 'Cerrar menú');
  assert.equal(tabs.classList.contains('show'), true);
  doc.fire('keydown', { key: 'Escape' });
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
  assert.equal(menu.getAttribute('aria-label'), 'Abrir menú');
  assert.equal(doc.activeElement, menu);
});

test('following a menu link closes it; mounting twice does not duplicate handlers', () => {
  const { doc, menu, tabs } = menuFixture();
  mount(doc);
  mount(doc);
  assert.equal(menu.listeners.get('click').length, 1);
  menu.fire('click');
  tabs.fire('click', { target: { closest: () => null } });
  assert.equal(menu.getAttribute('aria-expanded'), 'true');
  tabs.fire('click', { target: { closest: () => ({}) } });
  assert.equal(menu.getAttribute('aria-expanded'), 'false');
});

function scrollFixture() {
  const frames = new Map();
  const styles = new Map();
  const errors = [];
  let nextFrame = 0, top = 100;
  const reveal = {
    parentElement: {}, hasAttribute: () => false,
    getBoundingClientRect: () => ({ top, height: 100 }),
    style: { setProperty: (key, value) => styles.set(key, value) }
  };
  const media = { ...eventTarget(), matches: false };
  const doc = {
    ...eventTarget(), hidden: false, body: { classList: classes() },
    documentElement: { scrollHeight: 2000 },
    querySelector: () => null,
    querySelectorAll: selector => selector === '[data-reveal]' ? [reveal] : []
  };
  const win = { ...eventTarget(), innerHeight: 720, matchMedia: () => media };
  const context = {
    document: doc, window: win,
    console: { error: (...args) => errors.push(args) },
    requestAnimationFrame: fn => { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id)
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'js/redesign.js'), 'utf8'), context);
  function flush() {
    let ticks = 0;
    while (frames.size && ticks++ < 150) {
      const [id, fn] = frames.entries().next().value;
      frames.delete(id);
      fn(ticks * 16.67);
    }
    assert.equal(frames.size, 0, 'the animation must sleep when it settles');
  }
  return { frames, styles, errors, reveal, doc, win, media, flush, setTop: value => { top = value; } };
}

test('home scroll motion settles, sleeps, and wakes when scrolling back', () => {
  const f = scrollFixture();
  f.flush();
  assert.equal(Number(f.styles.get('--p')), 1);
  f.setTop(800);
  f.win.fire('scroll');
  assert.equal(f.frames.size, 1);
  f.flush();
  assert.equal(Number(f.styles.get('--p')), 0);
  f.setTop(100);
  f.win.fire('scroll');
  f.flush();
  assert.equal(Number(f.styles.get('--p')), 1);
  assert.deepEqual(f.errors, []);
});

test('home motion cancels while hidden and resumes without losing the controller', () => {
  const f = scrollFixture();
  f.doc.hidden = true;
  f.doc.fire('visibilitychange');
  assert.equal(f.frames.size, 0);
  f.win.fire('scroll');
  assert.equal(f.frames.size, 0);
  f.doc.hidden = false;
  f.doc.fire('visibilitychange');
  assert.equal(f.frames.size, 1);
  f.flush();
  assert.equal(f.doc.body.classList.contains('home-motion-ready'), true);
});

test('a failed scroll enhancement restores the readable default instead of hiding content', () => {
  const f = scrollFixture();
  f.reveal.getBoundingClientRect = () => { throw new Error('layout unavailable'); };
  f.flush();
  assert.equal(f.doc.body.classList.contains('home-motion-ready'), false);
  assert.equal(f.errors.length, 1);
});

test('home counters contain their real values before scripts run', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const counters = [...html.matchAll(/<strong[^>]*data-count="(\d+)"[^>]*>(\d+)<\/strong>/g)];
  assert.ok(counters.length >= 6);
  counters.forEach(match => assert.equal(match[2], match[1]));
});

test('every shared preview uses real page copy and the compatibility route stays noindex', () => {
  const routes = ['index.html', 'advisories.html', 'projects.html', 'course.html', 'team.html', 'contact.html', 'blog.html', 'Blog/blog_phishing.html', 'Blog/blog_humanchip.html', 'Blog/blog_template.html', 'Blog/blog_deepfakes.html', 'Blog/blog_ia_aprendizaje.html', 'Blog/blog_figma_videojuegos.html'];
  routes.forEach(route => {
    const html = fs.readFileSync(path.join(root, route), 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.equal((html.match(/property="og:title"/g) || []).length, 1, route);
    assert.ok(html.includes(`property="og:title" content="${title}"`), route);
    assert.match(html, /property="og:image" content="https:\/\/clubcodeup\.github\.io\/Pag-Web\/media\/social\/codeup\.jpg"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, route);
  });
  assert.ok(fs.existsSync(path.join(root, 'media/social/codeup.jpg')));
  assert.match(fs.readFileSync(path.join(root, 'Blog/blog_template.html'), 'utf8'), /name="robots" content="noindex"/);
});
