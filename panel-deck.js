/* Scroll-snap panel deck — reveals, stepped build, keyboard nav, progress.
   Reusable across transformation studies 01–03. No scroll interception:
   wheel / trackpad / touch stay on the native scroll path with CSS snap. */
(function () {
  var deck = document.querySelector('[data-deck]');
  if (!deck) return;
  var panels = [].slice.call(deck.querySelectorAll('.pnl'));
  if (!panels.length) return;

  var root = document.documentElement;
  var mq = window.matchMedia;
  var calm = mq && mq('(prefers-reduced-motion: reduce)').matches;
  var coarse = mq && mq('(pointer: coarse)').matches;
  var lastInput = 'scroll';
  var paintDots = null;

  /* ---- stagger index. Resting state stays revealed if this never runs. ---- */
  panels.forEach(function (p) {
    [].slice.call(p.querySelectorAll('[data-rise]')).forEach(function (el, i) {
      el.style.setProperty('--i', i);
    });
  });

  var canAnimate = !calm && 'IntersectionObserver' in window;
  if (canAnimate) root.classList.add('dk-anim');

  /* ---- entry reveals, once per panel ----
     Driven by a scroll sweep rather than IntersectionObserver: IO delivery is
     unreliable in throttled/backgrounded frames, and a panel stuck at opacity 0
     would put content in an animated-only state. Additive only, never re-hides. */
  function inView(p) {
    var r = p.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh * 0.85 && r.bottom > vh * 0.15;
  }
  function sweep() {
    panels.forEach(function (p) {
      if (!p.classList.contains('is-in') && inView(p)) p.classList.add('is-in');
      if (p.hasAttribute('data-steps') && !p.getAttribute('data-built') && inView(p)) startBuild(p);
    });
  }
  if (!canAnimate) panels.forEach(function (p) { p.classList.add('is-in'); });

  /* ---- stepped build ----
     Elements carry data-step="n". Every element sharing the lowest
     outstanding n reveals together, so one press can light several cells. */
  function stepEls(p) { return [].slice.call(p.querySelectorAll('[data-step]')); }
  function nextStep(p) {
    var n = null;
    stepEls(p).forEach(function (el) {
      if (el.classList.contains('is-on')) return;
      var v = parseInt(el.getAttribute('data-step'), 10) || 0;
      if (n === null || v < n) n = v;
    });
    return n;
  }
  function advance(p) {
    var n = nextStep(p);
    if (n === null) return false;
    stepEls(p).forEach(function (el) {
      if ((parseInt(el.getAttribute('data-step'), 10) || 0) === n) el.classList.add('is-on');
    });
    return true;
  }
  function revealAll(p) {
    stepEls(p).forEach(function (el) { el.classList.add('is-on'); });
    p.setAttribute('data-built', 'all');
  }
  function autoRun(p) {
    p.setAttribute('data-built', 'auto');
    var tick = function () { if (advance(p)) setTimeout(tick, 1000); };
    setTimeout(tick, 500);
  }

  function startBuild(p) {
    if (p.getAttribute('data-built')) return;
    if (!canAnimate) { revealAll(p); return; }
    /* Timed sequence, not a scroll- or key-driven build: arriving at the panel
       starts it and each part follows a second later, the same way every time
       and regardless of how the reader got here. */
    autoRun(p);
  }
  var builds = [].slice.call(deck.querySelectorAll('.pnl[data-steps]'));
  if (!canAnimate) builds.forEach(revealAll);

  /* Reveals must never depend on an event arriving. Scroll listeners can be
     coalesced or dropped (hidden tabs, throttled frames), and a panel stuck at
     opacity 0 would put content in an animated-only state. A cheap polling
     sweep — 13 rect reads — closes that gap and retires itself once every
     panel has been revealed. Timers still fire in hidden documents; rAF does not. */
  var poll = window.setInterval(function () {
    sweep();
    if (paintDots) paintDots();
    var pending = panels.some(function (p) { return !p.classList.contains('is-in'); });
    if (!pending) window.clearInterval(poll);
  }, 400);

  /* ---- keyboard navigation ---- */
  function activeIndex() {
    var best = 0, bestD = Infinity;
    panels.forEach(function (p, i) {
      var d = Math.abs(p.getBoundingClientRect().top);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }
  function go(i) {
    i = Math.max(0, Math.min(panels.length - 1, i));
    window.scrollTo({ top: panels[i].offsetTop, behavior: calm ? 'auto' : 'smooth' });
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    var k = e.key;
    var fwd = k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Spacebar';
    var back = k === 'ArrowUp' || k === 'PageUp';
    if (!fwd && !back) return;
    lastInput = 'key';
    var idx = activeIndex();

    /* Arrow keys only move between panels now. Stepped panels run themselves on
       a timer once they come into view, so a keypress no longer advances a build. */
    e.preventDefault();
    go(fwd ? idx + 1 : idx - 1);
  });

  ['wheel', 'touchstart', 'mousedown'].forEach(function (ev) {
    window.addEventListener(ev, function () { lastInput = 'scroll'; }, { passive: true });
  });

  /* ---- progress indicator ---- */
  var dots = document.querySelector('[data-dots]');
  if (dots) {
    panels.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      var label = p.getAttribute('data-screen-label') || String(i + 1);
      b.setAttribute('aria-label', 'Go to panel ' + label + ' of ' + panels.length);
      b.addEventListener('click', function () { lastInput = 'key'; go(i); });
      dots.appendChild(b);
    });
    var btns = [].slice.call(dots.children);
    var paint = function () {
      var idx = activeIndex();
      btns.forEach(function (b, i) {
        if (i === idx) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    };
    paintDots = paint;
    paint();
  }

  /* ---- drive reveals from scroll + resize ----
     Synchronous and time-throttled on purpose: requestAnimationFrame is paused
     in a hidden document, so a deck loaded in a background tab would never
     reveal anything if rAF were the only trigger. */
  var lastSweep = 0;
  function onMove() {
    var now = Date.now();
    if (now - lastSweep < 90) return;
    lastSweep = now;
    sweep();
    if (paintDots) paintDots();
  }
  function forceSweep() { lastSweep = 0; onMove(); }
  window.addEventListener('scroll', onMove, { passive: true });
  window.addEventListener('resize', forceSweep, { passive: true });
  window.addEventListener('load', forceSweep);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') forceSweep();
  });
  forceSweep();

  /* ---- theme ----
     Every panel now derives its base, scrim and text from the theme tokens, so
     this moves the whole deck at once. Shares the site's storage key, and the
     pre-paint applier lives inline in <head> to avoid a flash. */
  var root = document.documentElement;
  var themeBtn = document.getElementById('art-theme');
  if (themeBtn) {
    var label = function (t) { themeBtn.setAttribute('aria-label', t === 'ink' ? 'Switch to light mode' : 'Switch to dark mode'); };
    label(root.getAttribute('data-theme'));
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'ink' ? 'paper' : 'ink';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('sf.theme', next); } catch (e) {}
      label(next);
    });
  }

  /* ---- copy link ---- */
  [].slice.call(document.querySelectorAll('[data-copy-link]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var done = function () {
        btn.classList.add('ok');
        setTimeout(function () { btn.classList.remove('ok'); }, 1400);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () {});
      else done();
    });
  });
})();
