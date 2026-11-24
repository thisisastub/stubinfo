/* Behaviour reference for what-i-do.html.
   DCLogic is a React-class-style base (state, setState, lifecycle). renderVals() returns the values bound to
   {{ name }} holes and data-dc-* attributes in the HTML. Port this into your own vanilla JS or React. */
class Component extends DCLogic {
  state = { sent: false };
  heroRef = React.createRef(); cardRef = React.createRef(); graphWrap = React.createRef(); canvasRef = React.createRef();
  static RAW = `1. Content strategy
• Content strategy development
◦ Audience research
◦ Persona development
• Content planning
◦ Content roadmapping
◦ Editorial planning
◦ Content calendars
• Content audits
◦ Content gap analysis
• Information architecture
◦ Topic clusters
• Content governance
◦ Brand voice
◦ Style guides
◦ Editorial standards
◦ Content lifecycle management
◦ Content refresh programs
• Content measurement
◦ Content KPIs
◦ Performance reporting
◦ Content ROI modeling
• Stakeholder alignment
• Executive communication
• CMS migration planning (headless CMS)
2. AI search visibility (AEO / GEO) and SEO
• Answer engine optimization (AEO)
• Generative engine optimization (GEO)
◦ LLM visibility
◦ AI brand representation (ChatGPT, Gemini, Perplexity, Claude)
◦ Google AI Overviews optimization
◦ AI citation tracking
◦ AI share of voice
• Structured data
• Schema markup
• Entity optimization
• SEO content strategy
◦ Keyword research
◦ Search intent research
◦ On-page optimization
◦ Content refreshes for organic growth
• Original research
• Citable data
3. AI content operations
• AI content operations (ContentOps)
◦ AI workflow design
◦ Prompt engineering
◦ Context engineering
◦ AI output evaluation
◦ AI content QA
◦ Human-in-the-loop editorial review
• AI governance
• Responsible AI guidelines
• AI adoption
• Team enablement
• Content intake workflows
• Content request workflows
• Content repurposing pipelines
◦ Text to video
◦ Text to audio
◦ Text to social
4. AI product building
• AI prototyping
• Rapid prototyping
• Agentic workflows
• AI agents
◦ MCP integrations
• Interactive content
• Marketing tools
◦ Calculators
◦ Branching intake forms
◦ Kiosk experiences
◦ Touchscreen experiences
• Web apps
• Progressive web apps (PWAs)
• Product discovery
• Requirements writing
• UX writing
• Product content
5. Writing and editorial
• Content writing
◦ Long-form content
◦ B2B content
◦ Website copy
◦ Landing page copy
◦ Healthcare content
• Thought leadership
• Executive ghostwriting
• Brand journalism
• Storytelling
• Editing
• Copyediting
• Research-backed writing
• Source citation
6. Brand, social and campaigns
• Brand messaging
• Brand positioning
• Social media strategy
• Community management
• Integrated digital campaigns
• Creative direction
◦ Design direction
◦ Video direction
◦ Design systems
◦ Visual identity`;
  static tree() {
    if (Component._t) return Component._t;
    const out = []; let c, s;
    Component.RAW.split('\n').forEach(l => { l = l.trim(); if (!l) return;
      if (/^\d+\./.test(l)) { c = { name: l.replace(/^\d+\.\s*/, ''), kids: [] }; out.push(c); }
      else if (l[0] === '•') { s = { name: l.slice(1).trim(), kids: [], hasKids: false }; c.kids.push(s); }
      else if (l[0] === '◦') { s.kids.push({ name: l.slice(1).trim() }); s.hasKids = true; } });
    return (Component._t = out);
  }
  // Phones get the tappable list instead of the canvas map (see css/responsive.css).
  // The map starts only once the viewport is wide enough, e.g. after rotating a tablet.
  componentDidMount() {
    this.mq = window.matchMedia('(max-width: 720px)');
    this.onMq = () => { if (!this.mq.matches && !this.graphOn) { this.graphOn = true; this.initGraph(); } };
    this.mq.addEventListener ? this.mq.addEventListener('change', this.onMq) : this.mq.addListener(this.onMq);
    this.onMq();
  }
  componentWillUnmount() { clearInterval(this.idle); cancelAnimationFrame(this.raf); this.ro && this.ro.disconnect(); this.mq && (this.mq.removeEventListener ? this.mq.removeEventListener('change', this.onMq) : this.mq.removeListener(this.onMq)); }
  initGraph() {
    const cv = this.canvasRef.current, wrap = this.graphWrap.current, hero = this.heroRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'), css = getComputedStyle(document.documentElement), v = (n, d) => (css.getPropertyValue(n).trim() || d);
    const C = { text: v('--sf-text', '#F2F3F0'), muted: v('--sf-text-muted', '#A0A59E'), ctrl: v('--sf-control-border', '#6B7077'), hi: v('--sf-link', '#C8F169'), surf: v('--sf-surface', '#1A1D20') };
    const FB = v('--sf-font-body', 'sans-serif'), FONT = ['600 16px ' + FB, '500 14px ' + FB, '400 14px ' + FB], FILL = [C.text, C.muted, C.ctrl], LH = [20, 18, 18];
    const N = [], L = [], R = [10, 6.5, 4.5], S = [1100, 200, 90], by = {};
    const mk = (name, lv, x, y) => { const n = { name, lv, x, y, vx: 0, vy: 0, nb: [], w: 0 }; N.push(n); by[name] = n; return n; };
    const tree = Component.tree();
    tree.forEach((c, ci) => { const a = ci / tree.length * Math.PI * 2, cn = mk(c.name, 0, Math.cos(a) * 420, Math.sin(a) * 230);
      c.kids.forEach(s => { const sn = mk(s.name, 1, cn.x + (Math.random() - .5) * 160, cn.y + (Math.random() - .5) * 160); L.push([cn, sn, 110, .35, 't']);
        s.kids.forEach(x => { const xn = mk(x.name, 2, sn.x + (Math.random() - .5) * 70, sn.y + (Math.random() - .5) * 70); xn.parent = sn; L.push([sn, xn, 40, .6, 't']); }); }); });
    const cats = N.filter(n => n.lv === 0); for (let i = 0; i < cats.length; i++) for (let j = i + 1; j < cats.length; j++) L.push([cats[i], cats[j], 380, .03, 'c']);
    [['Information architecture', 'Structured data'], ['Topic clusters', 'SEO content strategy'], ['Content governance', 'AI governance'], ['Brand voice', 'Brand messaging'], ['Content refresh programs', 'Content refreshes for organic growth'], ['Audience research', 'Search intent research'], ['Content intake workflows', 'Branching intake forms'], ['Original research', 'Research-backed writing'], ['Citable data', 'Source citation'], ['Thought leadership', 'Executive communication'], ['Agentic workflows', 'AI workflow design'], ['Text to video', 'Video direction'], ['Design systems', 'Style guides'], ['Social media strategy', 'Text to social'], ['AI brand representation (ChatGPT, Gemini, Perplexity, Claude)', 'Brand positioning'], ['Stakeholder alignment', 'Requirements writing'], ['Content KPIs', 'AI citation tracking'], ['Editorial standards', 'AI content QA']]
      .forEach(([p, q]) => { if (by[p] && by[q]) L.push([by[p], by[q], 260, .008, 'x']); });
    L.forEach(([a, b]) => { a.nb.push(b); b.nb.push(a); });
    let ob = null, W = 0, H = 0, dpr = 1, alpha = 1, target = 0, hover = null, drag = null, view = { k: 1, x: 0, y: 0 }, narrow = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const measure = () => N.forEach(n => { ctx.font = FONT[n.lv]; const lines = []; let cur = ''; n.name.split(' ').forEach(wd => { const tr = cur ? cur + ' ' + wd : wd; if (cur && ctx.measureText(tr).width > 190) { lines.push(cur); cur = wd; } else cur = tr; }); lines.push(cur); n.lines = lines; n.w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 10; n.h = lines.length * LH[n.lv]; });
    const box = n => [n.x - n.w / 2, n.y - R[n.lv], n.x + n.w / 2, n.y + R[n.lv] + 4 + n.h];
    const size = () => { narrow = hero.clientWidth < 860; Object.assign(wrap.style, narrow ? { position: 'relative', inset: 'auto', height: '620px', order: '2' } : { position: 'absolute', inset: '0', height: 'auto', order: '' });
      dpr = window.devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; fit(); const card = this.cardRef.current; if (false && card) { const cr = cv.getBoundingClientRect(), kr = card.getBoundingClientRect(); ob = [kr.left - cr.left - 12 - view.x, kr.top - cr.top - 12 - view.y, kr.right - cr.left + 12 - view.x, kr.bottom - cr.top + 12 - view.y]; } else ob = null; if (!reduce) kick(0); else { for (let i = 0; i < 200; i++) tick(); alpha = 0; } draw(); };
    const fit = () => { view = { k: 1, x: W / 2 + (narrow ? 0 : W * .06), y: H / 2 }; };
    const tick = () => {
            for (let i = 0; i < N.length; i++) { const a = N[i], ba = box(a);
        for (let j = i + 1; j < N.length; j++) { const b = N[j]; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy; if (d2 < 1) { dx = Math.random() - .5; dy = Math.random() - .5; d2 = 1; }
          if (d2 < 360000) { const f = (S[a.lv] + S[b.lv]) / 2 * alpha / d2; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f; }
          if (a.lv === 2 || b.lv === 2) continue; const bb = box(b), ox = Math.min(ba[2], bb[2]) - Math.max(ba[0], bb[0]) + 6, oy = Math.min(ba[3], bb[3]) - Math.max(ba[1], bb[1]) + 4;
          if (ox > 0 && oy > 0) { const st = .22; if (ox < oy * 1.8) { const s = Math.sign((ba[0] + ba[2]) - (bb[0] + bb[2])) || 1; a.vx += s * ox * st; b.vx -= s * ox * st; } else { const s = Math.sign((ba[1] + ba[3]) - (bb[1] + bb[3])) || 1; a.vy += s * oy * st; b.vy -= s * oy * st; } } } }
      L.forEach(([a, b, len, st]) => { const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - len) / d * alpha * st * .5; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f; });
      const gx = narrow ? .02 : .007, gy = narrow ? .014 : .045;
      N.forEach(n => { n.vx -= n.x * gx * alpha; n.vy -= n.y * gy * alpha; if (n === drag) { n.vx = n.vy = 0; return; } const sx0 = 24 - view.x, sx1 = W - 24 - view.x, sy0 = 24 - view.y, sy1 = H - 40 - view.y - n.h, M = 0;
        if (n.y < sy0 + M) n.vy += (sy0 + M - n.y) * .06; if (n.y > sy1 - M) n.vy -= (n.y - sy1 + M) * .06; if (n.x < sx0 + M) n.vx += (sx0 + M - n.x) * .04; if (n.x > sx1 - M) n.vx -= (n.x - sx1 + M) * .04;
        n.vx *= .55; n.vy *= .55; n.x += n.vx; n.y += n.vy;
        { const mx = n.lv === 0 ? n.w / 2 + 40 : 10, my0 = n.lv === 0 ? 50 : 12, my1 = n.lv === 0 ? n.h + 60 : 26; const hx0 = mx - view.x, hx1 = W - mx - view.x, hy0 = my0 - view.y, hy1 = H - my1 - view.y; if (n.x < hx0) { n.x = hx0; n.vx = 0; } if (n.x > hx1) { n.x = hx1; n.vx = 0; } if (n.y < hy0) { n.y = hy0; n.vy = 0; } if (n.y > hy1) { n.y = hy1; n.vy = 0; } }

        if (ob) { const b = box(n), ox = Math.min(b[2], ob[2]) - Math.max(b[0], ob[0]), oy = Math.min(b[3], ob[3]) - Math.max(b[1], ob[1]); if (ox > 0 && oy > 0) { if (ox < oy) { n.x += ox; n.vx = Math.max(n.vx, 0); } else { n.y += oy; n.vy = Math.max(n.vy, 0); } } } });
      alpha += (target - alpha) * .02;
    };
    let arrived = new Set(), lastUser = -1e9, userIn = false, idleIdx = -1;
    const lit = n => !hover || arrived.has(n);
    const setHover = n => { if (n === hover) return; hover = n; arrived = new Set(n ? [n] : []); if (n) L.forEach(ln => { if (ln[0] === n || ln[1] === n) { ln.src = n; ln.p = 0; ln.sp = reduce ? 1 : .018 + Math.random() * .05; } }); };
    const vis = n => n.lv < 2 || (hover && (n === hover || hover.nb.includes(n) || (hover.lv === 2 && n.parent === hover.parent)));
    const ease = (o, k, v) => { const c = o[k] == null ? v : o[k]; const nv = c + (v - c) * .16; o[k] = Math.abs(v - nv) < .01 ? v : nv; return o[k] !== v; };
    const draw = () => {
      let moving = false;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.lineCap = 'round';
      const P = n => [n.x * view.k + view.x, n.y * view.k + view.y];
      N.forEach(n => { const l = lit(n); moving = ease(n, 'v', vis(n) ? 1 : 0) | moving; moving = ease(n, 'on', hover && l ? 1 : 0) | moving; moving = ease(n, 'dm', !hover || !l ? 1 : 0) | moving; moving = ease(n, 'hv', n === hover ? 1 : 0) | moving; });
      const BASE = { c: .14, t: .4, x: .4 };
      ['c', 't', 'x'].forEach(type => L.forEach(ln => { const [a, b, , , ty] = ln; if (ty !== type) return; moving = ease(ln, 'on', hover && (a === hover || b === hover) ? 1 : 0) | moving;
        if (hover && ln.src === hover && (a === hover || b === hover) && ln.p < 1) { ln.p = Math.min(1, ln.p + ln.sp); moving = true; if (ln.p >= 1) arrived.add(a === hover ? b : a); }
        const v = Math.min(a.v, b.v); if (v < .01) return; const [x1, y1] = P(a), [x2, y2] = P(b), dm = Math.max(a.dm, b.dm) * (1 - ln.on);
        ctx.setLineDash(ty === 'x' ? [0, 6] : []); ctx.lineWidth = ty === 'x' ? 2 : 1;
        ctx.globalAlpha = v * BASE[ty] * (1 - .7 * dm) * (1 - ln.on * (ln.p || 0)); ctx.strokeStyle = ty === 'c' ? C.muted : C.ctrl; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        if (ln.on > .01 && ln.src) { const [sx, sy] = P(ln.src), [ex, ey] = P(ln.src === a ? b : a), p = ln.p == null ? 1 : ln.p; ctx.globalAlpha = v * ln.on * .9; ctx.strokeStyle = C.hi; ctx.lineWidth = ty === 'x' ? 2 : 1.5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + (ex - sx) * p, sy + (ey - sy) * p); ctx.stroke(); } }));
      ctx.setLineDash([]);
      const order = N.filter(n => n.v > .01).sort((a, b) => (a.on - b.on) || (b.lv - a.lv));
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      order.forEach(n => { const [x, y] = P(n), fade = n.v * (1 - .72 * n.dm) * (n.lv === 1 ? .78 : 1), ty = y + R[n.lv] + 4;
        ctx.globalAlpha = fade; ctx.fillStyle = FILL[n.lv]; ctx.beginPath(); ctx.arc(x, y, R[n.lv], 0, 7); ctx.fill();
        if (n.on > .01) { ctx.globalAlpha = n.v * n.on; ctx.fillStyle = n.hv > .5 ? C.hi : C.text; ctx.fill(); }
        ctx.font = FONT[n.lv];
        ctx.globalAlpha = fade * .85; ctx.fillStyle = C.surf; ctx.fillRect(x - n.w / 2, ty - 1, n.w, n.h);
        if (n.hv > .01) { ctx.globalAlpha = n.v * n.hv; ctx.fillStyle = '#111315'; ctx.fillRect(x - n.w / 2 - 4, ty - 4, n.w + 8, n.h + 6); }
        ctx.globalAlpha = fade; ctx.fillStyle = FILL[n.lv]; n.lines.forEach((l, li) => ctx.fillText(l, x, ty + 1 + li * LH[n.lv]));
        if (n.on > .01) { ctx.globalAlpha = n.v * n.on; ctx.fillStyle = n.hv > .5 ? C.hi : C.text; n.lines.forEach((l, li) => ctx.fillText(l, x, ty + 1 + li * LH[n.lv])); } });
      ctx.globalAlpha = 1; return moving;
    };
    const redraw = () => { if (!this.raf) this.raf = requestAnimationFrame(loop); };
    const loop = () => { tick(); const m = draw(); if (alpha > .004 || target > 0 || m) this.raf = requestAnimationFrame(loop); else this.raf = 0; };
    const kick = (tg) => { target = tg; alpha = Math.max(alpha, .25); if (!this.raf) this.raf = requestAnimationFrame(loop); };
    const pick = e => { const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top; let best = null, bd = 1e9;
      N.forEach(n => { if (!vis(n)) return; const x = n.x * view.k + view.x, y = n.y * view.k + view.y, dx = x - mx, dy = y - my, d = dx * dx + dy * dy;
        const inLabel = Math.abs(mx - x) < n.w / 2 && my > y && my < y + R[n.lv] + 4 + n.h;
        if ((d < 196 || inLabel) && d < bd) { bd = d; best = n; } }); return best; };
    cv.addEventListener('pointermove', e => { userIn = true; lastUser = performance.now(); if (drag) { const r = cv.getBoundingClientRect(); drag.x = (e.clientX - r.left - view.x) / view.k; drag.y = (e.clientY - r.top - view.y) / view.k; kick(.2); return; } const n = pick(e); if (n !== hover) { setHover(n); cv.style.cursor = n ? 'grab' : 'default'; redraw(); } });
    cv.addEventListener('pointerleave', () => { userIn = false; lastUser = performance.now(); if (!drag && hover) { setHover(null); redraw(); } });
    cv.addEventListener('pointerdown', e => { lastUser = performance.now(); const n = pick(e); if (!n) { if (hover) { setHover(null); redraw(); } return; } setHover(n); if (e.pointerType === 'mouse') { drag = n; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; kick(.2); } else redraw(); });
    const up = () => { if (!drag) return; drag = null; cv.style.cursor = hover ? 'grab' : 'default'; target = 0; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    const start = () => { measure(); this.ro = new ResizeObserver(size); this.ro.observe(hero); size();
      if (reduce) { for (let i = 0; i < 500; i++) tick(); alpha = 0; draw(); } else this.raf = requestAnimationFrame(loop); };
    const idle = () => { if (reduce || userIn || drag || document.hidden || performance.now() - lastUser < 3000) return; idleIdx = (idleIdx + 1) % cats.length; setHover(cats[idleIdx]); redraw(); };
    this.idle = setInterval(idle, 2600); setTimeout(idle, 1200);
    document.fonts && document.fonts.ready ? document.fonts.ready.then(start) : start();
  }
  renderVals() {
    return { cardRef: this.cardRef, heroRef: this.heroRef, graphWrap: this.graphWrap, canvasRef: this.canvasRef, skillTree: Component.tree(),
      formOpen: !this.state.sent, formSent: this.state.sent, send: e => { e.preventDefault(); const f = e.currentTarget; if (this.state.sending) return; this.setState({ sending: true, formErr: '' }); DC.sendForm(f).then(d => { if (d && d.success) { f.reset(); this.setState({ sent: true, sending: false }); } else this.setState({ sending: false, formErr: ((d && d.message) ? d.message + ' ' : 'Couldn’t send right now. ') + 'Please try again.' }); }); }, sending: this.state.sending ? 'true' : 'false', formErr: this.state.formErr, reset: () => this.setState({ sent: false }) };
  }
}
