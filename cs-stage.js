/* Content Strategy stage — two drivers, one selection.
   Scroll position drives the lit example by default. The moment a pointer or
   keyboard lands on an example, that pick LATCHES: it survives the mouse
   travelling into the preview pane (so buttons in there are clickable) and is
   released when the pointer leaves the stage entirely, or when the page is
   actually scrolled again. */
(function () {
  var wrap = document.querySelector('[data-plywrap]');
  if (!wrap) return;
  var steps = [].slice.call(document.querySelectorAll('[data-plystep]'));
  var panes = [].slice.call(document.querySelectorAll('[data-plypane]'));
  if (!steps.length || !panes.length) return;
  var stage = wrap.querySelector('.strategy-stage') || wrap;
  var n = steps.length, pick = -1, pickY = 0, raf = null;

  function paint(i) {
    steps.forEach(function (el, k) { el.style.opacity = k === i ? '1' : (k < i ? '.4' : '.18'); });
    panes.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
  }
  function scrollIndex() {
    var r = wrap.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    if (span <= 0) return 0;
    var p = Math.min(Math.max(-r.top / span, 0), 0.9999);
    return Math.floor(p * n);
  }
  function sync() { paint(pick >= 0 ? pick : scrollIndex()); }

  steps.forEach(function (el, k) {
    function take() { pick = k; pickY = window.pageYOffset; sync(); }
    el.addEventListener('mouseenter', take);
    el.addEventListener('focus', take);
    el.addEventListener('click', take);
  });

  // leaving the whole stage hands control back to scroll position
  stage.addEventListener('mouseleave', function () { pick = -1; sync(); });

  function onScroll() {
    // genuine scrolling releases the latch; sub-pixel jitter does not
    if (pick >= 0 && Math.abs(window.pageYOffset - pickY) > 48) pick = -1;
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; sync(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  sync();
})();
