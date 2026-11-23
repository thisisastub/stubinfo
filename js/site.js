/* site.js — shared site behaviour that lives outside the page logic.
   Mobile menu: the hamburger toggles html.nav-open; CSS in /css/responsive.css does the rest.
   Uses event delegation, so it works on the React-rendered header. */
(function () {
  'use strict';
  var root = document.documentElement, MQ = window.matchMedia('(max-width: 820px)');

  function btn() { return document.querySelector('[data-burger]'); }
  function setOpen(open) {
    root.classList.toggle('nav-open', open);
    var b = btn();
    if (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (t.closest('[data-burger]')) { setOpen(!root.classList.contains('nav-open')); return; }
    if (root.classList.contains('nav-open')) {
      // a link in the menu was chosen, or the page behind it was tapped
      if (t.closest('#site-nav a') || !t.closest('[data-r="site-header"]')) setOpen(false);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('nav-open')) { setOpen(false); var b = btn(); if (b) b.focus(); }
  });
  (MQ.addEventListener ? MQ.addEventListener.bind(MQ, 'change') : MQ.addListener.bind(MQ))(function () { if (!MQ.matches) setOpen(false); });
})();
