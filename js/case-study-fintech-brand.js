/* Behaviour reference for case-study-fintech-brand.html.
   DCLogic is a React-class-style base (state, setState, lifecycle). renderVals() returns the values bound to
   {{ name }} holes and data-dc-* attributes in the HTML. Port this into your own vanilla JS or React. */
const CR = {0:{kind:'Film',title:'Cover background film',by:'supplied for this case study'},1:{kind:'Illustration',title:'Empty post composers',by:'drawn for this case study'},2:{kind:'Video',title:'Writing down activity',href:'https://www.pexels.com/video/writing-down-activity-6892916/',by:'by cottonbro studio, via Pexels'},3:{kind:'Photo',title:'Workshop notes',href:'https://commons.wikimedia.org/wiki/File:0211jfTelevision_channels_from_the_Philippines_Miriam_Defensor_Santiagofvf_17.jpg',by:'by Judgefloro, public domain, via Wikimedia Commons'},5:{kind:'Framework',title:'Repurposing / Atomization Matrix',href:'https://contentstrategylibrary.com/tools/repurposing-atomization-matrix/',by:'from Content Strategy Library'},6:{kind:'Screenshot',title:'Financial blog',by:'a fictional publication built for this case study'},7:{kind:'Photo',title:'Discussing business strategy',href:'https://commons.wikimedia.org/wiki/File:Discussing_business_strategy_(Unsplash).jpg',by:'from Unsplash, CC0, via Wikimedia Commons'},8:{kind:'Framework',title:'Hero-Hub-Help',href:'https://contentstrategylibrary.com/tools/hero-hub-help/',by:'developed by Google for YouTube'},9:{kind:'Video',title:'Modern photo editing workspace setup',href:'https://www.pexels.com/video/modern-photo-editing-workspace-setup-36512046/',by:'by Jakub Zerdzicki, via Pexels, icons from Flaticon'}};
const INL = [8];
const N = 10;
const EXIT = '/content-strategy.html';
const pad = (n) => String(n).padStart(2, '0');
class Component extends DCLogic {
  state = { i: 0, cred: false, crOpen: false };
  go(n) { n = Math.max(0, Math.min(N - 1, n)); if (n !== this.state.i) this.setState({ i: n }); }
  componentDidMount() {
    this.onKey = (e) => {
      if (this.state.cred) return;
      const k = e.key, tag = e.target && e.target.closest ? e.target.closest('input,textarea') : null;
      if (tag) return;
      if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); this.go(this.state.i + 1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); this.go(this.state.i - 1); }
      else if (k === 'Home') this.go(0);
      else if (k === 'End') this.go(N - 1);
      else if (k === 'Escape') location.href = EXIT;
    };
    window.addEventListener('keydown', this.onKey);
    this.reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => this.enter(this.state.i), 60); setTimeout(() => this.enter(this.state.i), 700); window.addEventListener('load', () => this.enter(this.state.i), { once: true });
  }
  hintKeys() {
    if (this.keyAnim || this.reduce) return; this.keyAnim = true;
    const up = 'inset 0 1px 0 rgba(255,255,255,0.16),0 3px 0 #0c0d0f,0 4px 8px rgba(0,0,0,0.45)', dn = 'inset 0 1px 0 rgba(255,255,255,0.08),0 0 0 #0c0d0f,0 1px 2px rgba(0,0,0,0.4)';
    const kf = [{ transform: 'translateY(0)', boxShadow: up }, { transform: 'translateY(3px)', boxShadow: dn, offset: 0.35 }, { transform: 'translateY(3px)', boxShadow: dn, offset: 0.55 }, { transform: 'translateY(0)', boxShadow: up }];
    const foot = document.querySelector('footer'); let t = 0;
    for (let r = 0; r < 2; r++) for (const k of ['l', 'r']) { foot.querySelectorAll('kbd[data-k="' + k + '"]').forEach((el) => el.animate(kf, { duration: 260, delay: t, easing: 'ease-out' })); t += 300; }
    setTimeout(() => { this.keyAnim = false; }, t + 1500);
  }
  componentWillUnmount() { window.removeEventListener('keydown', this.onKey); }
  componentDidUpdate() { if (this._i !== this.state.i) { this._i = this.state.i; this.enter(this.state.i); } }
  enter(i) {
    document.querySelectorAll('video[data-bgv]').forEach((v) => {
      const s = +v.closest('[data-slide]').dataset.slide; v.muted = true;
      if (Math.abs(s - i) <= 1) v.preload = 'auto';
      if (s === i && !this.reduce) { const play = () => { if (+v.closest('[data-slide]').dataset.slide !== this.state.i) return; const p = v.play(); if (p && p.catch) p.catch(() => {}); }; play(); if (v.readyState < 3) { v.addEventListener('canplay', play, { once: true }); v.addEventListener('loadeddata', play, { once: true }); } } else if (!v.paused) v.pause();
    });
    const sec = document.querySelector('[data-slide="' + i + '"]'); if (!sec) return;
    const sc = sec.querySelector('[data-scroll]'); if (sc) sc.scrollTop = 0;
    document.querySelectorAll('[data-scroll]').forEach((s) => { const over = s.scrollHeight - s.clientHeight > 8; const m = over ? 'linear-gradient(to bottom,#000 calc(100% - 48px),transparent)' : 'none'; s.style.webkitMaskImage = m; s.style.maskImage = m; if (!s.dataset.w) { s.dataset.w = '1'; s.addEventListener('scroll', () => { const end = s.scrollTop + s.clientHeight >= s.scrollHeight - 4; const mm = end || s.scrollHeight - s.clientHeight <= 8 ? 'none' : 'linear-gradient(to bottom,#000 calc(100% - 48px),transparent)'; s.style.webkitMaskImage = mm; s.style.maskImage = mm; }, { passive: true }); } });
    if (this.reduce) return;
    sec.querySelectorAll('[data-rise]').forEach((el, k) => el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 620, delay: (i === 0 ? 120 : 360) + k * 80, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
  }
  renderVals() {
    const i = this.state.i;
    return {
      trackX: 'translate3d(' + (-i * 100) + 'vw,0,0)',
      counter: pad(i + 1) + ' / ' + pad(N),
      navOp: i === 0 ? 0 : 1, navPe: i === 0 ? 'none' : 'auto', navY: i === 0 ? '12px' : '0px',
      atEnd: i === N - 1,
      segs: Array.from({ length: N }, (_, k) => ({ label: 'Go to panel ' + (k + 1), bg: k === i ? 'var(--sf-brand)' : k < i ? 'var(--sf-text-muted)' : 'rgba(255,255,255,0.18)', go: () => this.go(k) })),
      hintKeys: () => this.hintKeys(),
      next: () => this.go(this.state.i + 1), prev: () => this.go(this.state.i - 1),
      exit: () => { location.href = EXIT; },
      cr: CR[i] || {}, crIn: { ['s' + i]: INL.includes(i) }, crHas: !!CR[i] && !INL.includes(i), crLink: !!(CR[i] && CR[i].href), crPlain: !!(CR[i] && !CR[i].href), crOpen: this.state.crOpen, crExp: this.state.crOpen ? 'true' : 'false', crRot: this.state.crOpen ? '0deg' : '180deg',
      toggleCr: () => this.setState((s) => ({ crOpen: !s.crOpen })), openAll: () => this.setState({ cred: true, crOpen: false }),
      stop: (e) => e.stopPropagation(), credOpen: this.state.cred, openCred: () => this.setState({ cred: true }), closeCred: () => this.setState({ cred: false }),
      touchStart: (e) => { const t = e.touches[0]; this.tx = t.clientX; this.ty = t.clientY; },
      touchEnd: (e) => { const t = e.changedTouches[0]; const dx = t.clientX - this.tx, dy = t.clientY - this.ty; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) this.go(this.state.i + (dx < 0 ? 1 : -1)); }
    };
  }
}
