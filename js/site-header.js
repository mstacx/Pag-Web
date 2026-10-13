(function (factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') api.mount(document);
})(function () {
  'use strict';

  function mount(doc) {
    const menu = doc.querySelector('.ide-menu-toggle');
    const tabs = doc.querySelector('.ide-tabs-wrap');
    if (!menu || !tabs || menu.dataset.menuMounted) return;

    const toggle = open => {
      tabs.classList.toggle('show', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    menu.addEventListener('click', () => toggle(menu.getAttribute('aria-expanded') !== 'true'));
    doc.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        toggle(false);
        menu.focus();
      }
    });
    tabs.addEventListener('click', event => {
      if (event.target.closest('a')) toggle(false);
    });
    toggle(false);
    menu.dataset.menuMounted = 'true';
    // Only hide the mobile links after their control is functional.
    doc.body.classList.add('menu-ready');
  }

  return { mount };
});
