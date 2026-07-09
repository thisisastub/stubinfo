/* ============================================================
   Hero chess board — the auto-playing "Opera Game" splash.
   Adapted from a standalone React board component: only the
   board itself is kept (3D wood board, pieces, autoplay of
   Morphy's 1858 Paris Opera game, mouse-tilt). Chrome is
   re-captioned in the site's own type + color tokens.
   Plain React.createElement — needs React + ReactDOM only.
   ============================================================ */
(function () {
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') return;

  var SYM = "'Noto Sans Symbols 2','Segoe UI Symbol','DejaVu Sans',sans-serif";
  var GOLD = '#D49A3A';               // warm amber — board move highlight (harmonises with the wood)
  var VS = '\uFE0E';                  // text-presentation selector, keeps glyphs from going emoji
  var GLYPH = { K: '\u265A', Q: '\u265B', R: '\u265C', B: '\u265D', N: '\u265E', P: '\u265F' };
  var SQ = 62, BOARD = SQ * 8, RX = 53;
  var GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.011 0.16' numOctaves='3' seed='9'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0.35 0 0 -0.2'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23g)'/%3E%3C/svg%3E\")";

  // scene reference box — the board is rendered at fixed geometry, then scaled to fit the host.
  // REF_H tracks the board's *visual* tilted height (rotateX compresses it), not its 496px layout box.
  var REF_W = 550, REF_H = 350;

  function sqXY(sq) {
    var f = sq.charCodeAt(0) - 97, r = parseInt(sq[1], 10);
    return { x: f * SQ, y: (8 - r) * SQ };
  }
  function initPieces() {
    var back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
    var ps = [];
    for (var i = 0; i < 8; i++) {
      var f = String.fromCharCode(97 + i);
      ps.push({ id: 'w' + back[i] + i, type: back[i], color: 'w', sq: f + '1', dead: false });
      ps.push({ id: 'wP' + i, type: 'P', color: 'w', sq: f + '2', dead: false });
      ps.push({ id: 'bP' + i, type: 'P', color: 'b', sq: f + '7', dead: false });
      ps.push({ id: 'b' + back[i] + i, type: back[i], color: 'b', sq: f + '8', dead: false });
    }
    return ps;
  }

  // Morphy vs Duke of Brunswick & Count Isouard — Paris Opera, 1858
  var OPERA = [
    { f: 'e2', t: 'e4', san: 'e4' },
    { f: 'e7', t: 'e5', san: 'e5' },
    { f: 'g1', t: 'f3', san: 'Nf3' },
    { f: 'd7', t: 'd6', san: 'd6', n: 'The Philidor \u2014 solid, passive, already conceding the centre.' },
    { f: 'd2', t: 'd4', san: 'd4' },
    { f: 'c8', t: 'g4', san: 'Bg4?!', n: 'Develops a piece, but commits it far too early. Noted.' },
    { f: 'd4', t: 'e5', san: 'dxe5', cap: true },
    { f: 'g4', t: 'f3', san: 'Bxf3', cap: true },
    { f: 'd1', t: 'f3', san: 'Qxf3', cap: true },
    { f: 'd6', t: 'e5', san: 'dxe5', cap: true },
    { f: 'f1', t: 'c4', san: 'Bc4', n: 'Eyeing f7 \u2014 the weakest square on the board.' },
    { f: 'g8', t: 'f6', san: 'Nf6' },
    { f: 'f3', t: 'b3', san: 'Qb3', n: 'One move, two threats. Efficiency is a style.' },
    { f: 'd8', t: 'e7', san: 'Qe7' },
    { f: 'b1', t: 'c3', san: 'Nc3', n: 'Development over material. A tempo is worth more than a pawn.' },
    { f: 'c7', t: 'c6', san: 'c6' },
    { f: 'c1', t: 'g5', san: 'Bg5' },
    { f: 'b7', t: 'b5', san: 'b5?', n: 'Desperation has a notation.' },
    { f: 'c3', t: 'b5', san: 'Nxb5!', cap: true, n: 'The sacrifice. Lines matter more than pieces.' },
    { f: 'c6', t: 'b5', san: 'cxb5', cap: true },
    { f: 'c4', t: 'b5', san: 'Bxb5+', cap: true },
    { f: 'b8', t: 'd7', san: 'Nbd7' },
    { castle: true, k: ['e1', 'c1'], r: ['a1', 'd1'], san: 'O-O-O', n: 'Every white piece now aims at one file.' },
    { f: 'a8', t: 'd8', san: 'Rd8' },
    { f: 'd1', t: 'd7', san: 'Rxd7!', cap: true },
    { f: 'd8', t: 'd7', san: 'Rxd7', cap: true },
    { f: 'h1', t: 'd1', san: 'Rd1', n: 'The last piece joins. Nothing here is improvised.' },
    { f: 'e7', t: 'e6', san: 'Qe6' },
    { f: 'b5', t: 'd7', san: 'Bxd7+', cap: true },
    { f: 'f6', t: 'd7', san: 'Nxd7', cap: true },
    { f: 'b3', t: 'b8', san: 'Qb8+!!', n: 'The queen gives itself \u2014 a move calculated back at move twelve.' },
    { f: 'd7', t: 'b8', san: 'Nxb8', cap: true },
    { f: 'd1', t: 'd8', san: 'Rd8#', n: 'Mate. The plan was older than the game.' }
  ];
  var INTRO = 'Paul Morphy at the Paris Opera, 1858 \u2014 the most famous miniature in chess, finished before his opponents knew it had begun.';

  var HeroBoard = function (props) { React.Component.call(this, props); this.state = { pieces: initPieces(), ply: -1, san: '', note: INTRO, scale: 1 }; this._timers = []; };
  HeroBoard.prototype = Object.create(React.Component.prototype);
  HeroBoard.prototype.constructor = HeroBoard;

  HeroBoard.prototype.fit = function () {
    var el = this._fitEl;
    if (!el) return;
    var w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    var s = Math.min(w / REF_W, h / REF_H);
    s = Math.max(0.42, Math.min(1.16, s));
    if (Math.abs(s - this.state.scale) > 0.004) this.setState({ scale: s });
  };

  HeroBoard.prototype.componentDidMount = function () {
    var self = this;
    // responsive scale-to-fit
    if (typeof ResizeObserver !== 'undefined' && this._fitEl) {
      this._ro = new ResizeObserver(function () { self.fit(); });
      this._ro.observe(this._fitEl);
    }
    this._onResize = function () { self.fit(); };
    window.addEventListener('resize', this._onResize);
    this.fit();

    if (this.props.autoplay === false) {
      // reduced-motion / static: show the final mating net
      var ps = initPieces();
      OPERA.forEach(function (mv) { ps = self.applyMove(ps, mv); });
      this.setState({ pieces: ps, ply: OPERA.length - 1, san: 'Rd8#', note: OPERA[OPERA.length - 1].n, arrow: { f: 'd1', t: 'd8' } });
      return;
    }

    this._timers.push(setTimeout(function () { self.step(); }, 2200));

    if (this.props.motion !== 'calm') {
      this._mm = function (e) {
        if (self._raf) return;
        self._raf = requestAnimationFrame(function () {
          self._raf = null;
          var el = self._board;
          if (!el) return;
          var nx = (e.clientX / window.innerWidth) * 2 - 1;
          var ny = (e.clientY / window.innerHeight) * 2 - 1;
          el.style.transform = 'rotateX(' + (RX - ny * 2) + 'deg) rotateY(' + (nx * 1.4) + 'deg) rotateZ(' + (-nx * 1.8) + 'deg)';
        });
      };
      window.addEventListener('mousemove', this._mm);
    }
  };

  HeroBoard.prototype.componentWillUnmount = function () {
    this._timers.forEach(clearTimeout);
    if (this._mm) window.removeEventListener('mousemove', this._mm);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._ro) this._ro.disconnect();
    if (this._raf) cancelAnimationFrame(this._raf);
  };

  HeroBoard.prototype.applyMove = function (pieces, mv) {
    var ps = pieces.map(function (p) { return Object.assign({}, p); });
    if (mv.castle) {
      var k = ps.find(function (p) { return p.sq === mv.k[0] && !p.dead; });
      var r = ps.find(function (p) { return p.sq === mv.r[0] && !p.dead; });
      if (k) k.sq = mv.k[1];
      if (r) r.sq = mv.r[1];
      return ps;
    }
    if (mv.cap) { var v = ps.find(function (p) { return p.sq === mv.t && !p.dead; }); if (v) v.dead = true; }
    var m = ps.find(function (p) { return p.sq === mv.f && !p.dead; });
    if (m) m.sq = mv.t;
    return ps;
  };

  HeroBoard.prototype.step = function () {
    var self = this;
    var i = this.state.ply + 1;
    if (i >= OPERA.length) {
      this._timers.push(setTimeout(function () {
        self.setState({ pieces: initPieces(), ply: -1, san: '', note: 'Replaying the line \u2014 it runs the same every time.', arrow: null });
        self._timers.push(setTimeout(function () { self.step(); }, 2600));
      }, 4200));
      return;
    }
    var mv = OPERA[i];
    var n = Math.floor(i / 2) + 1;
    this.setState({
      pieces: this.applyMove(this.state.pieces, mv),
      ply: i,
      san: mv.castle ? (n + '. ' + mv.san) : (i % 2 === 0 ? n + '. ' + mv.san : n + '\u2026 ' + mv.san),
      note: mv.n || this.state.note,
      arrow: mv.castle ? { f: mv.k[0], t: mv.k[1] } : { f: mv.f, t: mv.t }
    });
    this._timers.push(setTimeout(function () { self.step(); }, mv.n ? 1900 : 1250));
  };

  HeroBoard.prototype.render = function () {
    var st = this.state, self = this;
    var pieces = st.pieces, san = st.san, note = st.note, arrow = st.arrow, scale = st.scale;
    var rx = RX;

    var squares = [];
    for (var r = 0; r < 8; r++) for (var f = 0; f < 8; f++) {
      var lightSq = (r + f) % 2 === 0;
      var ang = ((r * 47 + f * 31) % 70) + 55;
      squares.push(React.createElement('div', {
        key: 'sq' + r + f,
        style: { position: 'absolute', left: f * SQ, top: r * SQ, width: SQ, height: SQ,
          background: lightSq
            ? 'linear-gradient(' + ang + 'deg, #DCBA8B, #C39B63 55%, #D2AF7E)'
            : 'linear-gradient(' + ang + 'deg, #7A4823, #5E3315 55%, #6E4423)',
          boxShadow: lightSq ? 'inset 0 0 0 .5px rgba(60,30,10,.3), inset 0 1px 2px rgba(255,240,210,.25)' : 'inset 0 0 0 .5px rgba(20,8,2,.5), inset 0 1px 2px rgba(255,220,170,.08)' }
      }));
    }
    var frame = React.createElement('div', { key: 'frame', style: { position: 'absolute', inset: -27, backgroundImage: GRAIN + ', linear-gradient(155deg, #5C3117 0%, #3A1C0A 48%, #4E2810 100%)', backgroundSize: '260px 260px, 100% 100%', borderRadius: 5, boxShadow: 'inset 0 0 0 1px rgba(246,206,146,.14), inset 0 2px 10px rgba(255,224,178,.10), inset 0 0 26px rgba(0,0,0,.55)', pointerEvents: 'none' } });
    var frontEdge = React.createElement('div', { key: 'edge', style: { position: 'absolute', left: -27, top: BOARD + 27, width: BOARD + 54, height: 22, transform: 'rotateX(-90deg)', transformOrigin: 'top', background: 'linear-gradient(#331806, #1B0B02)', borderRadius: '0 0 5px 5px', pointerEvents: 'none' } });
    var bezel = React.createElement('div', { key: 'bezel', style: { position: 'absolute', inset: -3, boxShadow: '0 0 0 1.5px rgba(216,166,96,.4), 0 0 0 3px rgba(30,13,4,.9)', pointerEvents: 'none' } });
    var grain = React.createElement('div', { key: 'grain', style: { position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '260px 260px', opacity: .5, pointerEvents: 'none' } });
    var sheen = React.createElement('div', { key: 'sheen', style: { position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,232,190,.11), rgba(255,232,190,0) 36%, rgba(26,10,2,.16) 84%)', pointerEvents: 'none' } });

    var coords = [];
    for (var fc = 0; fc < 8; fc++) coords.push(React.createElement('div', { key: 'f' + fc, style: { position: 'absolute', top: BOARD + 7, left: fc * SQ, width: SQ, textAlign: 'center', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 9.5, letterSpacing: '.12em', color: 'rgba(244,206,148,.55)', textShadow: '0 1px 1px rgba(0,0,0,.65)' } }, String.fromCharCode(97 + fc)));
    for (var rc = 0; rc < 8; rc++) coords.push(React.createElement('div', { key: 'r' + rc, style: { position: 'absolute', left: -21, width: 14, top: rc * SQ, height: SQ, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 9.5, color: 'rgba(244,206,148,.55)', textShadow: '0 1px 1px rgba(0,0,0,.65)' } }, String(8 - rc)));

    var hl = [];
    if (arrow) [arrow.f, arrow.t].forEach(function (s, i) {
      var p = sqXY(s);
      hl.push(React.createElement('div', { key: 'hl' + i, style: { position: 'absolute', left: p.x, top: p.y, width: SQ, height: SQ, background: 'rgba(212,154,58,.16)', boxShadow: 'inset 0 0 0 1px rgba(212,154,58,.55)', transition: 'all .3s ease' } }));
    });

    var arrowEl = null;
    if (arrow) {
      var a = sqXY(arrow.f), b = sqXY(arrow.t);
      arrowEl = React.createElement('svg', { width: BOARD, height: BOARD, viewBox: '0 0 ' + BOARD + ' ' + BOARD, style: { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' } },
        React.createElement('line', { x1: a.x + SQ / 2, y1: a.y + SQ / 2, x2: b.x + SQ / 2, y2: b.y + SQ / 2, stroke: GOLD, strokeWidth: 3, strokeLinecap: 'round', opacity: .9 }),
        React.createElement('circle', { cx: b.x + SQ / 2, cy: b.y + SQ / 2, r: 6, fill: GOLD, opacity: .95 }),
        React.createElement('circle', { cx: a.x + SQ / 2, cy: a.y + SQ / 2, r: 4, fill: 'none', stroke: GOLD, strokeWidth: 1.5, opacity: .7 })
      );
    }

    var shadows = [], men = [];
    pieces.forEach(function (p) {
      var xy = sqXY(p.sq);
      var isW = p.color === 'w';
      var g = GLYPH[p.type] + VS;
      shadows.push(React.createElement('div', {
        key: 's' + p.id,
        style: { position: 'absolute', left: xy.x, top: xy.y, width: SQ, height: SQ, opacity: p.dead ? 0 : .8, background: 'radial-gradient(ellipse 46% 16% at 50% 83%, rgba(14,5,0,.72), transparent 74%)', transition: 'left .55s cubic-bezier(.55,.05,.3,1), top .55s cubic-bezier(.55,.05,.3,1), opacity .4s ease', pointerEvents: 'none' }
      }));

      // --- 3D piece: a short glyph extrusion (the turned body's thickness / shadowed
      //     lower rim) beneath a cylinder-shaded, top-lit face. Turns a flat font glyph
      //     into a piece with real volume — no SVG. Back copies sit behind the face and
      //     are nudged down-and-right so they read as the piece's own shaded depth. ---
      var faceBg = isW
        ? 'linear-gradient(96deg, rgba(120,78,30,.45) 0%, rgba(120,78,30,0) 24%, rgba(120,78,30,0) 76%, rgba(120,78,30,.45) 100%), linear-gradient(180deg, #FFFDF6 5%, #F6E7C8 29%, #E4CB99 57%, #C7A268 81%, #A9853F 98%)'
        : 'linear-gradient(96deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 74%, rgba(0,0,0,.6) 100%), linear-gradient(180deg, #855634 4%, #4A2A14 32%, #281306 62%, #140902 86%, #0A0401 99%)';
      var bodyColor = isW ? '#7E5C30' : '#050200';
      var layerBase = { position: 'absolute', left: 0, right: 0, bottom: 4, textAlign: 'center', fontFamily: SYM, fontSize: 48, lineHeight: 1.06, userSelect: 'none' };
      var layers = [];
      for (var d = 5; d >= 1; d--) {
        layers.push(React.createElement('div', {
          key: 'd' + d,
          style: Object.assign({}, layerBase, { transform: 'translate(' + (d * 0.4) + 'px,' + (d * 0.7) + 'px)', color: bodyColor })
        }, g));
      }
      layers.push(React.createElement('div', {
        key: 'face',
        style: Object.assign({}, layerBase, {
          color: 'transparent', backgroundImage: faceBg,
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          textShadow: isW ? '0 -0.5px 0 rgba(255,255,250,.85)' : '0 -0.5px 0 rgba(255,190,115,.4)'
        })
      }, g));

      men.push(React.createElement('div', {
        key: p.id,
        style: {
          position: 'absolute', left: xy.x, top: xy.y, width: SQ, height: SQ,
          transform: 'rotateX(' + (-rx) + 'deg)', transformOrigin: '50% 88%',
          filter: isW ? 'drop-shadow(0 4px 4px rgba(24,10,0,.4))' : 'drop-shadow(0 4px 5px rgba(0,0,0,.5))',
          opacity: p.dead ? 0 : 1,
          zIndex: 10 + Math.round(xy.y / SQ),
          transition: 'left .55s cubic-bezier(.55,.05,.3,1), top .55s cubic-bezier(.55,.05,.3,1), opacity .45s ease',
          pointerEvents: 'none'
        }
      }, layers));
    });

    var glow = React.createElement('div', { key: 'glow', style: { position: 'absolute', left: '50%', top: '58%', transform: 'translate(-50%,-50%)', width: BOARD + 230, height: BOARD * .74, background: 'radial-gradient(ellipse at 50% 44%, rgba(216,150,60,.12), transparent 60%), radial-gradient(ellipse 62% 42% at 50% 56%, rgba(6,2,0,.5), transparent 72%)', pointerEvents: 'none' } });

    var boardEl = React.createElement('div', { key: 'board', ref: function (el) { self._board = el; }, style: { width: BOARD, height: BOARD, position: 'relative', transformStyle: 'preserve-3d', transform: 'rotateX(' + rx + 'deg)', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)' } },
      frame, frontEdge, squares, grain, sheen, bezel, hl, arrowEl, coords, shadows, men);

    return React.createElement('div', {
      ref: function (el) { self._fitEl = el; },
      style: { height: '100%', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', overflow: 'visible' }
    },
      // branded ambient backlight — warm amber core + site-accent halo, heavily blurred so the board feels seated
      React.createElement('div', { key: 'backlight', style: {
        position: 'absolute', left: '50%', top: '49%', transform: 'translate(-50%,-50%)',
        width: '132%', height: '112%',
        background: 'radial-gradient(ellipse 56% 52% at 50% 42%, rgba(216,150,60,.32), transparent 66%), radial-gradient(ellipse 94% 84% at 50% 55%, color-mix(in srgb, var(--color-accent, #C44B4B) 24%, transparent), transparent 74%)',
        filter: 'blur(52px)', pointerEvents: 'none'
      } }),
      // board, scaled to fit
      React.createElement('div', { style: { width: REF_W, height: REF_H, transform: 'scale(' + scale + ')', transformOrigin: 'center center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('div', { style: { perspective: '1300px', position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          glow, boardEl
        )
      )
    );
  };

  function mount() {
    var host = document.getElementById('hero-board');
    if (!host || host._chessMounted) return;
    host._chessMounted = true;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ReactDOM.createRoot(host).render(React.createElement(HeroBoard, { autoplay: !reduce, motion: reduce ? 'calm' : 'full' }));
  }
  if (document.readyState !== 'loading') mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
