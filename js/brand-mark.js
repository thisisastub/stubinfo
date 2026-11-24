/* Brand mark: toggles [data-scrolled] on <html> once the page scrolls past 8px.
   Load once per page, deferred. No dependencies. Safe to run alongside other scroll listeners. */
(function () {
  var root = document.documentElement, on = false;
  function check() { var s = window.scrollY > 8; if (s !== on) { on = s; root.toggleAttribute('data-scrolled', s); } }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();
