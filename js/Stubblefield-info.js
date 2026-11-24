/* Behaviour reference for Stubblefield.info.html.
   DCLogic is a React-class-style base (state, setState, lifecycle). renderVals() returns the values bound to
   {{ name }} holes and data-dc-* attributes in the HTML. Port this into your own vanilla JS or React. */
const AV = ['ricardo','tj','john','paul','teresa','tara','mary','david'];
const HERO_MEDIA = [['/assets/posters/chess.webp', '/assets/hero/chess.mp4'], ['/assets/posters/atlanta-skyline.webp', '/assets/hero/home/atlanta-skyline.mp4'], ['/assets/posters/hero-tl-t2.webp', '/assets/hero/home/thought-leadership.mp4'], ['/assets/posters/hero-lab.webp', '/innovations/hero-lab.mp4'], ['/assets/media/office-isometric-poster.jpg', '/assets/hero/home/office-isometric.mp4']];
const NAMES = ['Ricardo Gutierrez','TJ Jackson','John Ujda','Paul Sansone','Teresa Minnaugh','Tara Gilchrist','Mary Fajimi','David Papa'];
class Component extends DCLogic {
  state = { f: 0, q: 0, sent: false, paused: false };
  quoteRef = React.createRef();
  componentDidMount() {
    this._q = this.state.q;
    this.restart();
    // hero slides only load when they come up; fetch every still frame now and the next slide's video ahead of time
    this.warmNext = () => { clearTimeout(this.wt); this.wt = setTimeout(() => DC.warm(HERO_MEDIA[(this.state.f + 1) % 5][1]), 1200); };
    const warmAll = () => { HERO_MEDIA.forEach(m => DC.warm(m[0])); this.warmNext(); };
    if (document.readyState === 'complete') warmAll(); else window.addEventListener('load', warmAll, { once: true });
    const el = this.quoteRef.current; if (!el) return;
    this.check = () => { const r = el.getBoundingClientRect(); const vis = r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.15; if (vis === this.vis) return; this.vis = vis; if (vis && !this.seen) this.show(); this.qTimer(); };
    window.addEventListener('scroll', this.check, { passive: true }); window.addEventListener('resize', this.check);
    this.hideQuote(); this.check();
    // WCAG 2.2.2: rotation pauses while the pointer or keyboard focus is on the testimonials, and stops once a visitor picks one
    const sec = el.closest('section') || el; const hold = (on) => { this.hold = on; this.qTimer(); };
    sec.addEventListener('mouseenter', () => hold(true)); sec.addEventListener('mouseleave', () => hold(false));
    sec.addEventListener('focusin', () => hold(true)); sec.addEventListener('focusout', (e) => { if (!sec.contains(e.relatedTarget)) hold(false); });
    this.fb = setTimeout(() => { if (!this.seen && this.quoteRef.current) this.quoteRef.current.style.opacity = ''; }, 4000);
  }
  show() { this.seen = true; clearTimeout(this.fb); clearTimeout(this.wt); this.reveal(); }
  qTimer() { clearInterval(this.qt); if (!this.vis || this.hold || this.picked || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; this.qt = setInterval(() => { if (this.vis && !this.hold) this.setState(s => ({ q: (s.q + 1) % 8 })); }, 7000); }
  componentDidUpdate() {
    if (this._p !== this.state.paused || this._f !== this.state.f) { this._p = this.state.paused; this._f = this.state.f; if (this.warmNext) this.warmNext(); requestAnimationFrame(() => document.querySelectorAll('[data-hero] video').forEach(v => { if (this.state.paused) v.pause(); else { const p = v.play(); if (p && p.catch) p.catch(() => {}); } })); } if (this._q !== this.state.q) { this._q = this.state.q; if (this.seen) this.reveal(); else this.show(); } }
  componentWillUnmount() { (this.lts || []).forEach(clearTimeout); clearInterval(this.t); clearInterval(this.qt); clearTimeout(this.fb); window.removeEventListener('scroll', this.check); window.removeEventListener('resize', this.check); }
  hideQuote() { const el = this.quoteRef.current; if (el && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.style.opacity = '0'; }
  reveal() {
    const el = this.quoteRef.current; if (!el) return; el.style.opacity = '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    requestAnimationFrame(() => {
      const bq = el.querySelector('blockquote'), cap = el.querySelector('figcaption'); if (!bq) return;
      if (!bq.dataset.split) { bq.dataset.split = '1'; const words = bq.textContent.split(/(\s+)/); bq.textContent = ''; words.forEach(w => { if (/^\s+$/.test(w) || !w) bq.appendChild(document.createTextNode(w)); else { const s = document.createElement('span'); s.textContent = w; s.style.display = 'inline-block'; bq.appendChild(s); } }); }
      const spans = [...bq.querySelectorAll('span')]; const tops = []; spans.forEach(s => { const y = s.offsetTop; if (!tops.includes(y)) tops.push(y); });
      clearTimeout(this.lt); (this.lts || []).forEach(clearTimeout); this.lts = [];
      const groups = tops.map(y => spans.filter(s => s.offsetTop === y));
      if (cap) { const kids = [...cap.children]; (kids.length ? kids : [cap]).forEach(k => groups.push([k])); }
      groups.flat().forEach(n => { n.style.transition = 'none'; n.style.transform = 'none'; n.style.opacity = '0'; });
      groups.forEach((g, i) => this.lts.push(setTimeout(() => g.forEach(n => { n.style.opacity = '1'; }), 150 + i * 220)));
    });
  }
  restart() {}
  swipe(e) { const t = e.changedTouches[0]; if (this.sx == null) return 0; const dx = t.clientX - this.sx, dy = t.clientY - this.sy; this.sx = null; return Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 ? (dx < 0 ? 1 : -1) : 0; }
  renderVals() {
    const { f, q, sent, paused } = this.state;
    const v = {
      featCount: (f + 1) + ' of 5',
      featPrev: () => this.setState(s => ({ f: (s.f + 4) % 5 })), featNext: () => this.setState(s => ({ f: (s.f + 1) % 5 })),
      // swipe: hero carousel and testimonials (horizontal flick of 50px+, mostly sideways)
      heroTouchStart: e => { const t = e.touches[0]; this.sx = t.clientX; this.sy = t.clientY; },
      heroTouchEnd: e => { const d = this.swipe(e); if (d) this.setState(s => ({ f: (s.f + (d > 0 ? 1 : 4)) % 5 })); },
      qTouchStart: e => { const t = e.touches[0]; this.sx = t.clientX; this.sy = t.clientY; },
      qTouchEnd: e => { const d = this.swipe(e); if (d) { this.picked = true; this.setState(s => ({ q: (s.q + (d > 0 ? 1 : 7)) % 8 })); this.qTimer(); } },
      quoteRef: this.quoteRef,
      paused, playing: !paused, pausedAttr: paused ? 'true' : 'false', pauseLabel: paused ? 'Play carousel' : 'Pause carousel', togglePause: () => this.setState({ paused: !paused }),
      people: AV.map((a, i) => ({ name: NAMES[i], src: '/assets/avatars/' + a + '.png', sel: i === q ? 'true' : 'false', ring: i === q ? '2px solid var(--sf-text)' : '2px solid transparent', op: i === q ? 1 : 0.55, pick: () => { this.picked = true; this.setState({ q: i }); this.qTimer(); } })),
      formOpen: !sent, formSent: sent,
      send: e => { e.preventDefault(); const f = e.currentTarget; if (this.state.sending) return; this.setState({ sending: true, formErr: '' }); DC.sendForm(f).then(d => { if (d && d.success) { f.reset(); this.setState({ sent: true, sending: false }); } else this.setState({ sending: false, formErr: ((d && d.message) ? d.message + ' ' : 'Couldn’t send right now. ') + 'Please try again.' }); }); }, sending: this.state.sending ? 'true' : 'false', formErr: this.state.formErr,
      reset: () => this.setState({ sent: false })
    };
    const E = React.createElement;
    v.cslIdent = E('span', { key: 'csl' + f, style: { display: 'grid', gap: '20px', width: '40%', maxWidth: '420px' } },
      E('img', { src: 'assets/csl-logo-white.svg', alt: 'Content Strategy Library', 'data-csl-anim': '', style: { width: '100%', display: 'block', animation: 'cslWipe 5s cubic-bezier(.2,.7,.2,1) infinite', animationPlayState: paused ? 'paused' : 'running' } }),
      E('span', { 'data-csl-anim': '', 'aria-hidden': 'true', style: { height: '1px', backgroundImage: 'repeating-linear-gradient(90deg,var(--sf-text) 0 3px,transparent 3px 6px)', transformOrigin: 'left', animation: 'cslRule 5s cubic-bezier(.2,.7,.2,1) infinite', animationPlayState: paused ? 'paused' : 'running' } }));
    v.featProgress = E('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '4px' } }, [0, 1, 2, 3, 4].map(i => E('span', { key: i, style: { height: '2px', overflow: 'hidden', background: 'color-mix(in srgb,var(--sf-text) 18%,transparent)' } }, i < f ? E('span', { style: { display: 'block', height: '100%', background: 'var(--sf-text-muted)' } }) : i === f ? E('span', { key: 'p' + f, 'data-prog': '', onAnimationEnd: () => this.setState(s => ({ f: (s.f + 1) % 5 })), style: { display: 'block', height: '100%', background: 'var(--sf-text-muted)', transformOrigin: 'left', animation: 'sfProg ' + (f === 0 ? '4.8s' : '5s') + ' linear both', animationPlayState: paused ? 'paused' : 'running' } }) : null)));
    v.featHref = ['/what-i-do.html', '/content-strategy.html', '/innovations/thought-leadership.html', '/innovations/', '/articles/content-strategy-library.html'][f];
    v.fi = f === 0;
    for (let i = 0; i < 4; i++) v['f' + i] = f === i + 1;
    // step-start, not steps(1,end): a 1ms animation can finish at progress 0.9999…, and an end-step never flips,
    // which left words 2+ hidden until the exit animation began (the "pause after word 1")
    const words = (txt, tag, hold = 750) => { const ws = txt.split(' '); return E(tag, { style: { margin: 0, font: '800 clamp(44px,min(9.5vw,16vh),150px)/0.95 var(--sf-font-display)', letterSpacing: '-0.035em', color: 'var(--sf-text)', maxWidth: '11ch', display: 'flex', flexWrap: 'wrap', gap: '0 0.24em' } }, ws.map((w, i) => E('span', { key: i, 'data-word': '', style: { display: 'inline-block', animation: 'sfWord 1ms step-start ' + (950 + i * 220) + 'ms both, sfWordOut 1ms step-start ' + (950 + (ws.length - 1) * 220 + hold + i * 150) + 'ms forwards', animationPlayState: paused ? 'paused' : 'running' } }, w))); };
    v.introWords = words('How many steps ahead is your content?', 'h1');
    ['Changing the right minds', 'Beyond the wall of text', 'Brewing up new solutions', 'Strategy tools and frameworks'].forEach((s, k) => { v['words' + k] = words(s, 'p', 1750); });
    for (let i = 0; i < 8; i++) v['q' + i] = q === i;
    return v;
  }
}
