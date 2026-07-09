/* ============================================================
   Content-strategy game tree — scroll-driven decision tree.
   Adapted from a standalone React component: the branching
   search tree that GENERATES candidates, REFUTES the weak ones,
   then EXTRACTS the surviving line as you scroll. Re-themed to
   the site tokens (accent = PV line, ink tints = the rest) and
   wired to light up the [data-plystep] pillars on the left.
   Plain React.createElement — needs React + ReactDOM only.
   ============================================================ */
(function () {
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') return;

  var A = 'var(--color-accent, #C44B4B)';                 // the surviving line / principal variation
  var LBL = "var(--font-body, ui-sans-serif, system-ui, sans-serif)";
  function tint(p) { return 'color-mix(in srgb, var(--color-text, #1A1A2E) ' + p + '%, transparent)'; }

  // node coords are laid out in a 680×560 viewBox. st: 'pv' | 'alt' | 'dead'
  var TREE = (function () {
    var N = [], L = [];
    function node(id, d, x, y, st, lbl) { N.push({ id: id, d: d, x: x, y: y, st: st, lbl: lbl }); }
    node('r', 0, 26, 280, 'pv');
    node('a', 1, 180, 120, 'alt'); node('b', 1, 180, 280, 'pv'); node('c', 1, 180, 440, 'dead', 'trend-chase');
    node('a1', 2, 334, 66, 'dead', 'me-too'); node('a2', 2, 334, 148, 'alt');
    node('b1', 2, 334, 228, 'alt'); node('b2', 2, 334, 300, 'pv'); node('b3', 2, 334, 372, 'dead', 'unprovable');
    node('c1', 2, 334, 452, 'dead'); node('c2', 2, 334, 512, 'dead');
    node('b2a', 3, 488, 252, 'dead', 'off-brand'); node('b2b', 3, 488, 322, 'pv'); node('a2a', 3, 488, 130, 'dead', 'no distribution'); node('b1a', 3, 488, 196, 'alt');
    node('pv4', 4, 642, 296, 'pv', 'THE LINE'); node('alt4', 4, 642, 214, 'alt', 'prepared branch');
    function link(p, c) { L.push({ p: p, c: c }); }
    link('r', 'a'); link('r', 'b'); link('r', 'c');
    link('a', 'a1'); link('a', 'a2'); link('b', 'b1'); link('b', 'b2'); link('b', 'b3'); link('c', 'c1'); link('c', 'c2');
    link('b2', 'b2a'); link('b2', 'b2b'); link('a2', 'a2a'); link('b1', 'b1a');
    link('b2b', 'pv4'); link('b1a', 'alt4');
    return { N: N, L: L };
  })();
  var TREE_COUNTS = ['1 POSITION', '3 CANDIDATES', '27 LINES', '214 LINES', '2,187 LINES \u00b7 1 SURVIVES'];

  var PlyTree = function (p) { React.Component.call(this, p); this.state = { p: p.motion === 'calm' ? 1 : 0 }; };
  PlyTree.prototype = Object.create(React.Component.prototype);
  PlyTree.prototype.constructor = PlyTree;

  PlyTree.prototype.paintSteps = function (pr) {
    var idx = pr < 0.4 ? 0 : pr < 0.72 ? 1 : 2;
    document.querySelectorAll('[data-plystep]').forEach(function (el) {
      var i = parseInt(el.getAttribute('data-plystep'), 10);
      el.style.opacity = i === idx ? '1' : (i < idx ? '.5' : '.2');
    });
  };

  PlyTree.prototype.componentDidMount = function () {
    var self = this;
    if (this.props.motion === 'calm') {
      // static / mobile: show the resolved tree, light every step
      document.querySelectorAll('[data-plystep]').forEach(function (el) { el.style.opacity = '1'; });
      return;
    }
    this.paintSteps(0);
    var loop = function () {
      self._raf = requestAnimationFrame(loop);
      var el = document.querySelector('[data-plywrap]');
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > window.innerHeight + 300) return;
      var total = r.height - window.innerHeight;
      if (total <= 0) return;
      var pr = Math.max(0, Math.min(1, -r.top / total));
      if (Math.abs(pr - self.state.p) > 0.003) { self.setState({ p: pr }); self.paintSteps(pr); }
    };
    this._raf = requestAnimationFrame(loop);
  };
  PlyTree.prototype.componentWillUnmount = function () { if (this._raf) cancelAnimationFrame(this._raf); };

  PlyTree.prototype.render = function () {
    var pr = this.state.p;
    var grow = Math.min(1, pr / 0.55);
    var strike = Math.max(0, Math.min(1, (pr - 0.55) / 0.18));
    var gild = Math.max(0, Math.min(1, (pr - 0.74) / 0.24));
    var depthOn = function (d) { return Math.max(0, Math.min(1, (grow * 4.6 - d + 1))); };
    var kids = [];
    var byId = {}; TREE.N.forEach(function (n) { byId[n.id] = n; });

    TREE.L.forEach(function (l, i) {
      var a = byId[l.p], b = byId[l.c];
      var on = depthOn(b.d);
      if (on <= 0) return;
      var isPV = a.st === 'pv' && b.st === 'pv' && gild > (b.d - 1) / 4;
      var deadLink = strike > 0 && (b.st === 'dead');
      var len = Math.hypot(b.x - a.x, b.y - a.y);
      kids.push(React.createElement('line', {
        key: 'l' + i, x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        style: { stroke: isPV ? A : tint(deadLink ? 7 : 16), strokeWidth: isPV ? 2.2 : 1.1, strokeDasharray: len, strokeDashoffset: len * (1 - on), transition: 'stroke .5s ease, stroke-width .5s ease' }
      }));
    });

    TREE.N.forEach(function (n) {
      var on = depthOn(n.d);
      if (on <= 0) return;
      var dead = n.st === 'dead' && strike > 0;
      var isPV = n.st === 'pv' && gild > (n.d - 0.5) / 4.5;
      var sz = n.id === 'pv4' ? 15 : n.d === 0 ? 13 : 10;
      if (isPV) kids.push(React.createElement('rect', { key: 'h' + n.id, x: n.x - sz, y: n.y - sz, width: sz * 2, height: sz * 2, style: { fill: A, opacity: 0.16 } }));
      kids.push(React.createElement('rect', {
        key: 'n' + n.id, x: n.x - sz / 2, y: n.y - sz / 2, width: sz, height: sz,
        style: { fill: dead ? 'transparent' : isPV ? A : tint(Math.round(28 + 22 * on)), stroke: dead ? tint(28) : 'none', strokeWidth: 1, opacity: on, transition: 'fill .5s ease' }
      }));
      if (dead) kids.push(React.createElement('text', { key: 'x' + n.id, x: n.x, y: n.y + 4.2, textAnchor: 'middle', style: { fill: tint(46), fontSize: 12, fontFamily: LBL } }, '\u00d7'));
      if (n.lbl && ((n.st === 'dead' && strike > 0.6) || (n.st !== 'dead' && gild > 0.5))) {
        kids.push(React.createElement('text', {
          key: 't' + n.id, x: n.x + (n.d === 4 ? -2 : 14), y: n.y + (n.d === 4 ? -16 : 4),
          textAnchor: n.d === 4 ? 'end' : 'start',
          style: { fill: n.st === 'dead' ? tint(44) : A, fontSize: 10.5, fontFamily: LBL, letterSpacing: '.06em' }
        }, n.lbl));
      }
    });
    kids.push(React.createElement('text', { key: 'rt', x: 26, y: 306, textAnchor: 'start', style: { fill: tint(52), fontSize: 10.5, fontFamily: LBL, letterSpacing: '.12em' } }, 'YOUR POSITION'));

    var dIdx = Math.max(0, Math.min(4, Math.floor(grow * 4.6)));
    var chip = { fontFamily: LBL, fontSize: 10, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase' };
    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column' } },
      React.createElement('div', { style: { flex: 1, minHeight: 0, border: '1px solid var(--color-border, rgba(120,120,120,.2))', borderRadius: 'var(--radius-lg, 14px)', background: 'radial-gradient(600px 400px at 62% 38%, color-mix(in srgb, var(--color-accent, #C44B4B) 9%, transparent), transparent 62%), color-mix(in srgb, var(--color-text, #1A1A2E) 4%, transparent)', position: 'relative', overflow: 'hidden' } },
        React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 680 560', preserveAspectRatio: 'xMidYMid meet', style: { display: 'block' } }, kids)
      )
    );
  };

  function mount() {
    var host = document.getElementById('strategy-tree');
    if (!host || host._treeMounted) return;
    host._treeMounted = true;
    var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || window.innerWidth < 900;
    ReactDOM.createRoot(host).render(React.createElement(PlyTree, { motion: reduce ? 'calm' : 'full' }));
  }
  if (document.readyState !== 'loading') mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
