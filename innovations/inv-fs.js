/* Full screen for the embedded demos. Production tries the real Fullscreen API
   first; when it is unavailable or the request is refused — an embedded page, a
   browser that blocks it — the frame pins itself to the viewport instead. Both
   paths use .is-fs, so a reader sees the same thing either way. Escape exits. */
(function () {
  var pinned = [];

  function label(frame, on) {
    var btn = frame.querySelector(".dlr-fs"), lb = btn && btn.querySelector(".lb");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");
    if (lb) lb.textContent = on ? "Exit full screen" : "Full screen";
  }

  /* the pinned fallback: body scroll has to be locked because the page is still there */
  function pin(frame, on) {
    frame.classList.toggle("is-fs", on);
    document.body.classList.toggle("dlr-fs-lock", on);
    label(frame, on);
    var i = pinned.indexOf(frame);
    if (on && i < 0) pinned.push(frame);
    if (!on && i >= 0) pinned.splice(i, 1);
  }

  function current() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function request(el) {
    var fn = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fn) return Promise.reject(new Error("Fullscreen API unavailable"));
    try { return Promise.resolve(fn.call(el)); } catch (e) { return Promise.reject(e); }
  }

  function exitNative() {
    var fn = document.exitFullscreen || document.webkitExitFullscreen;
    if (fn) { try { fn.call(document); } catch (e) {} }
  }

  Array.prototype.forEach.call(document.querySelectorAll(".dlr-fs"), function (btn) {
    var frame = btn.closest(".dlr-frame");
    if (!frame) return;

    btn.addEventListener("click", function () {
      if (current() === frame) { exitNative(); return; }
      if (frame.classList.contains("is-fs")) { pin(frame, false); return; }

      request(frame).then(function () {
        /* native sizes the element itself; .is-fs still supplies the chrome
           (footer hidden, scrollable body) so the two modes match */
        frame.classList.add("is-fs");
        label(frame, true);
      }, function () {
        pin(frame, true);
      });
    });
  });

  /* a native exit can come from Escape, F11 or browser chrome — resync the label */
  ["fullscreenchange", "webkitfullscreenchange"].forEach(function (ev) {
    document.addEventListener(ev, function () {
      var el = current();
      Array.prototype.forEach.call(document.querySelectorAll(".dlr-frame"), function (frame) {
        if (el === frame || pinned.indexOf(frame) >= 0) return;
        if (frame.classList.contains("is-fs")) { frame.classList.remove("is-fs"); label(frame, false); }
      });
    });
  });

  /* native fullscreen swallows Escape itself; this is only for the pinned path */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    pinned.slice().forEach(function (frame) { pin(frame, false); });
  });
})();
