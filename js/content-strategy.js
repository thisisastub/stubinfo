/* Behaviour reference for content-strategy.html.
   DCLogic is a React-class-style base (state, setState, lifecycle). renderVals() returns the values bound to
   {{ name }} holes and data-dc-* attributes in the HTML. Port this into your own vanilla JS or React. */
class Component extends DCLogic {
  componentDidMount() {
    document.querySelectorAll('video[data-t]').forEach(v => { const seek = () => { if (v.paused) v.currentTime = +v.dataset.t || 0.1; }; if (v.readyState >= 1) seek(); else v.addEventListener('loadedmetadata', seek, { once: true }); });
  }
  renderVals() {
    const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
      enter: e => { const a = e.currentTarget, v = a.querySelector('video'), z = a.querySelector('[data-zoom]'); if (reduce()) return; if (z) z.style.transform = 'scale(1.03)'; if (v) { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); } },
      leave: e => { const a = e.currentTarget, v = a.querySelector('video'), z = a.querySelector('[data-zoom]'); if (z) z.style.transform = 'none'; if (v) { v.pause(); v.currentTime = +v.dataset.t || 0.1; } }
    };
  }
}
