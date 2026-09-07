/* Version 2: hovering anywhere in the showcase, the arrows included, plays the
   card that is currently up, while the background film coasts to a stop
   underneath instead of cutting. Leaving spins it back up. */
(function () {
  "use strict";
  var bg = document.querySelector(".inv-sec-bg");
  var show = document.getElementById("inv-show");
  if (!bg || !show) return;
  var film = bg.querySelector("video");
  var frames = [].slice.call(show.querySelectorAll(".inv-frame"));
  if (!film || !frames.length) return;
  var raf = null, rate = 1, hovering = false;
  var SLOW = 0.06;

  function ramp(target, done) {
    cancelAnimationFrame(raf);
    var t0 = performance.now(), from = rate, span = 900;
    (function step(now) {
      var k = Math.min(1, (now - t0) / span);
      /* ease-out, so most of the deceleration happens early — coasting */
      rate = from + (target - from) * (1 - Math.pow(1 - k, 3));
      try { film.playbackRate = Math.max(SLOW, rate); } catch (e) {}
      if (k < 1) raf = requestAnimationFrame(step);
      else if (done) done();
    })(t0);
  }

  function play(v) { if (!v) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  function syncCards() {
    frames.forEach(function (f) {
      var v = f.querySelector(".ifc-vid");
      if (!v) return;
      if (hovering && f.classList.contains("is-active")) play(v);
      else { v.pause(); v.currentTime = 0; }
    });
  }

  function rest() {
    if (hovering) return;
    hovering = true;
    bg.classList.add("is-resting");
    ramp(SLOW, function () { film.pause(); });
    syncCards();
  }
  function revive() {
    if (!hovering) return;
    hovering = false;
    bg.classList.remove("is-resting");
    play(film);
    ramp(1);
    syncCards();
  }

  /* the carousel advances on its own, so follow whichever card is up */
  var mo = new MutationObserver(function () { if (hovering) syncCards(); });
  frames.forEach(function (f) { mo.observe(f, { attributes: true, attributeFilter: ["class"] }); });

  show.addEventListener("mouseenter", rest);
  show.addEventListener("mouseleave", revive);
  show.addEventListener("focusin", function (e) {
    /* a mouse click focuses the arrows too; only a keyboard focus should hold
       the preview open */
    var t = e.target;
    if (t && t.matches && t.matches(":focus-visible")) rest();
  });
  show.addEventListener("focusout", function (e) { if (!show.contains(e.relatedTarget)) revive(); });
})();
