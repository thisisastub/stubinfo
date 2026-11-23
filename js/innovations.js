/* Behaviour reference for innovations.html.
   DCLogic is a React-class-style base (state, setState, lifecycle). renderVals() returns the values bound to
   {{ name }} holes and data-dc-* attributes in the HTML. Port this into your own vanilla JS or React. */
class Component extends DCLogic {
  state = { open: false };
  renderVals() {
    return { isOpen: this.state.open, open: () => this.setState({ open: true }), close: () => this.setState({ open: false }), stop: e => e.stopPropagation(),
      enter: e => { const a = e.currentTarget, v = a.querySelector('video'), z = a.querySelector('[data-zoom]'); if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; if (z) z.style.transform = 'scale(1.03)'; if (v) { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); } },
      leave: e => { const a = e.currentTarget, v = a.querySelector('video'), z = a.querySelector('[data-zoom]'); if (z) z.style.transform = 'none'; if (v) { v.pause(); v.currentTime = 0.1; } } };
  }
}
