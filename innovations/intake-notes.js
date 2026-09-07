/* Content Intake Enhancer · scroll-driven reveals for the two embedded artifacts.
   Annotations fade in as you pass them. The generated brief's tells get caught
   one after another by a sweep that runs down the document. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var watchers = [];

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function tick() {
    for (var i = watchers.length - 1; i >= 0; i--) {
      if (watchers[i]() === false) watchers.splice(i, 1);
    }
  }

  /* is any part of the element inside the viewport, allowing a little lead-in */
  function onScreen(el, lead) {
    var r = el.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < h - (lead || 0);
  }

  /* the scroll cue on each embed: visible until the reader starts scrolling */
  function wireCue(view) {
    var pane = view.querySelector(".hrd-scroll, .aiv-body");
    if (!pane) return;
    var hide = function () { view.classList.toggle("gone", pane.scrollTop > 24); };
    pane.addEventListener("scroll", hide, { passive: true });
    hide();
  }

  /* my notes on their document, revealed as the reader scrolls past them */
  function wireAnnotations(pane) {
    var notes = Array.prototype.slice.call(pane.querySelectorAll(".hrd-anno"));
    if (!notes.length) return;
    if (reduce) { notes.forEach(function (n) { n.classList.add("in"); }); return; }
    var check = function () {
      var edge = pane.scrollTop + pane.clientHeight - pane.clientHeight * 0.22;
      for (var i = notes.length - 1; i >= 0; i--) {
        if (notes[i].offsetTop < edge && onScreen(pane)) {
          notes[i].classList.add("in");
          notes.splice(i, 1);
        }
      }
      return notes.length > 0;
    };
    pane.addEventListener("scroll", check, { passive: true });
    watchers.push(check);
    check();
  }

  /* the sweep: each tell lights left to right, in document order, and a few
     of them pick up a reaction once they are lit */
  function wireTells(pane) {
    var tells = Array.prototype.slice.call(pane.querySelectorAll(".aiv-tell"));
    if (!tells.length) return;
    tells.forEach(function (t) {
      var em = t.getAttribute("data-em");
      if (!em) return;
      var s = document.createElement("span");
      s.className = "aiv-em";
      s.setAttribute("aria-hidden", "true");
      s.textContent = em;
      t.insertAdjacentElement("afterend", s);
    });
    if (reduce) {
      tells.forEach(function (t) { t.classList.add("on"); });
      Array.prototype.forEach.call(pane.querySelectorAll(".aiv-em"), function (e) { e.classList.add("on"); });
      return;
    }
    var next = 0, queued = 0, started = false;
    var light = function () {
      if (!onScreen(pane, 60)) return true;
      if (!started) { started = true; queued = 1; }
      var edge = pane.scrollTop + pane.clientHeight - 30;
      while (next < tells.length && tells[next].offsetTop < edge) {
        (function (t, order) {
          setTimeout(function () {
            t.classList.add("on");
            var em = t.nextElementSibling;
            if (em && em.classList.contains("aiv-em")) setTimeout(function () { em.classList.add("on"); }, 240);
          }, order * 130 + 260);
        })(tells[next], queued++);
        next++;
      }
      return next < tells.length;
    };
    pane.addEventListener("scroll", light, { passive: true });
    watchers.push(light);
    light();
  }

  ready(function () {
    Array.prototype.forEach.call(document.querySelectorAll(".hrd-view, .aiv-view"), wireCue);
    var doc = document.querySelector(".hrd-scroll");
    if (doc) wireAnnotations(doc);
    var ai = document.querySelector(".aiv-body");
    if (ai) wireTells(ai);
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    setInterval(tick, 300);
    tick();
  });
})();
