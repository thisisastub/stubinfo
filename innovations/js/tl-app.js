const TL_ENH = [
  { id: "tts", t: "Listen to this article", why: "A text-to-speech version so the reader can listen on a phone or at a desk. The script is curated for accessibility: figure captions read as sentences, the stat markup is skipped rather than spelled out, and nothing reaches the listener as punctuation soup. (Try the sample, it works!)" },
  { id: "takeaways", t: "Key takeaways", why: "Two or three summary points above the article. A reader who bounces at the third paragraph still leaves holding the argument, and it gives search a clean answer to lift." },
  { id: "dropcap", t: "Drop caps", why: "A style choice, and a cheap one. It reads as a publication rather than a content farm, which is exactly the authority Dollarous is trying to claim, and it gives the reader an obvious place to start." },
  { id: "stats", t: "Inline stat highlights", why: "A light highlight behind every number. It supports skimmers, who are going to skim regardless, and it shows the research is there. Pure CSS on inline text, so it draws the eye without breaking the reading line or interfering with how crawlers index the page." },
  { id: "lists", t: "Styled counters and bullets", why: "Brand-coloured numerals and markers instead of browser defaults. Small thing, but it sets the table before the reader eats, and it makes an ordered list scannable as structure rather than as more text." },
  { id: "bands", t: "Alternating section grounds", why: "A light background change from section to section. Cheap visual separation that tells the reader where one idea ends and the next begins, without adding a single rule or box." },
  { id: "vocab", t: "Vocabulary pop-ups", why: "Dotted underlines under industry terms. Hover or tap for a definition in place, so a reader who does not know what a subledger is never has to leave the page to find out. Every exit to look something up is an exit." },
  { id: "chart", t: "Interactive charts", why: "Hover a slice or a legend row and the rest recede. Light interaction, but it acknowledges the reader is present rather than being read at, and it lets them answer their own question instead of parsing a four-clause sentence." },
  { id: "slides", t: "Embedded mini-slides", why: "A short summary deck built with real design hierarchy, downloadable so the reader can drop it into their own deck. People do not share articles with their leadership. They share slides." },
  { id: "quote", t: "Animated testimonials", why: "Strong brand ground, and the quote writes itself in line by line as it scrolls into view. It earns a stop in a way a grey box with a vertical rule never does, and it puts a named human in the middle of the argument." }
];
const TL_OFF = TL_ENH.reduce((o, e) => (o[e.id] = false, o), {});
const TL_ALL = TL_ENH.reduce((o, e) => (o[e.id] = true, o), {});
function TlPanel({ on, toggle, all, none, why, setWhy, busy, cur }) {
  const count = TL_ENH.filter((e) => on[e.id]).length;
  return /* @__PURE__ */ React.createElement("aside", { className: "tl-panel" + (busy ? " busy" : ""), "aria-label": "Enhancements", "aria-busy": !!busy }, /* @__PURE__ */ React.createElement("div", { className: "tl-panel-head" }, /* @__PURE__ */ React.createElement("h3", null, "Enhancements"), /* @__PURE__ */ React.createElement("span", { className: "c" }, count, " of ", TL_ENH.length, " activated | Toggle the enhancements to see them and try them out."), /* @__PURE__ */ React.createElement("button", { type: "button", className: "tl-master" + (count === TL_ENH.length ? " on" : ""), "aria-pressed": count === TL_ENH.length, onClick: count === TL_ENH.length ? none : all }, /* @__PURE__ */ React.createElement("span", { className: "tl-master-sw", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("span", { className: "tl-master-t" }, /* @__PURE__ */ React.createElement("b", null, count === TL_ENH.length ? "Enhanced" : "Enhance!"), /* @__PURE__ */ React.createElement("small", null, count === TL_ENH.length ? "Turn everything off" : "Turn everything on"))), busy && /* @__PURE__ */ React.createElement("div", { className: "tl-wait", role: "status" }, /* @__PURE__ */ React.createElement("span", { className: "tl-wait-ic", "aria-hidden": "true" }), "Enhancing one at a time. Hang on until it finishes.")), /* @__PURE__ */ React.createElement("div", { className: "tl-enh" }, TL_ENH.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.id, "data-enh-row": e.id, className: (on[e.id] ? "on" : "") + (cur === e.id ? " cur" : "") }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "tl-enh-top", "aria-pressed": !!on[e.id], onClick: () => toggle(e.id) }, /* @__PURE__ */ React.createElement("span", { className: "tl-sw", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("span", { className: "t" }, e.t)), /* @__PURE__ */ React.createElement("p", { className: "why" }, e.why)))), /* @__PURE__ */ React.createElement("div", { className: "tl-panel-foot" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", gap: "0.45rem", alignItems: "center", cursor: "pointer", marginBottom: "0.5rem" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: why, onChange: (e) => setWhy(e.target.checked) }), /* @__PURE__ */ React.createElement("span", null, "Show the rationale on hover")), "With this on, hovering any enhanced element in the article surfaces the same note you see here, pinned to the thing it explains.")));
}
function TlApp() {
  const [on, setOn] = React.useState(TL_OFF);
  const [why, setWhy] = React.useState(true);
  const viewRef = React.useRef(null);
  const popRef = React.useRef(null);
  const [allMode, setAllMode] = React.useState(false);
  const [cur, setCur] = React.useState(null);
  const allRef = React.useRef(false);
  const rootRef = React.useRef(null);
  const onRef = React.useRef(on);
  onRef.current = on;
  const queue = React.useRef([]);
  const busy = React.useRef(false);
  const job = React.useRef(null);
  const BLOCK = { tts: 1, takeaways: 1, chart: 1, quote: 1, slides: 1 };
  const TARGET = { dropcap: ".tl-lede", stats: ".tl-stat", vocab: ".tl-vocab", bands: ".tl-band.alt", lists: "ol, ul" };
  const GROW = { dropcap: 1, lists: 1 };
  const post = () => viewRef.current && viewRef.current.querySelector(".tl-post");
  const pump = () => {
    if (busy.current) return;
    const id = queue.current.shift();
    if (!id) {
      setCur(null);
      if (allRef.current) {
        allRef.current = false;
        const pane = viewRef.current && viewRef.current.querySelector(".tl-scroll");
        const panel = rootRef.current && rootRef.current.querySelector(".tl-panel");
        if (pane) pane.scrollTo({ top: 0, behavior: "smooth" });
        if (panel) panel.scrollTo({ top: 0, behavior: "smooth" });
        setAllMode(false);
      }
      return;
    }
    if (onRef.current[id]) return pump();
    busy.current = true;
    const p = post();
    let pre = [];
    if (p && GROW[id]) pre = Array.from(p.querySelectorAll(TARGET[id])).filter((el) => !el.closest("[data-enh]")).map((el) => el.getBoundingClientRect().height);
    if (p && BLOCK[id]) { const old = p.querySelector('[data-enh-plain="' + id + '"]'); pre = [old ? old.getBoundingClientRect().height : 0]; }
    job.current = { id, pre };
    setCur(id);
    setOn((s) => Object.assign({}, s, { [id]: true }));
  };
  const enqueue = (ids) => { ids.forEach((id) => { if (queue.current.indexOf(id) < 0) queue.current.push(id); }); pump(); };
  const toggle = (id) => {
    if (allRef.current) return;
    if (onRef.current[id]) { queue.current = queue.current.filter((x) => x !== id); setOn((p) => Object.assign({}, p, { [id]: false })); }
    else enqueue([id]);
  };
  React.useLayoutEffect(() => {
    const j = job.current;
    if (!j) return;
    job.current = null;
    const done = () => { busy.current = false; pump(); };
    const p = post();
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!p || reduce) return done();
    const pane = viewRef.current.querySelector(".tl-scroll");
    const els = BLOCK[j.id] ? Array.from(p.querySelectorAll('[data-enh="' + j.id + '"]')) : Array.from(p.querySelectorAll(TARGET[j.id])).filter((el) => !el.closest("[data-enh]"));
    if (!els.length) return done();
    const EASE = "cubic-bezier(.2,.8,.2,1)";
    const grow = !!(BLOCK[j.id] || GROW[j.id]);
    const isBand = j.id === "bands" || j.id === "stats";
    els.forEach((el, i) => {
      if (isBand) { const tint = j.id === "stats" ? "#DCEAE1" : "#F4F6F1"; el.style.transition = "none"; el.style.backgroundColor = "transparent"; if (j.id === "stats") el.style.boxShadow = "none"; el.style.backgroundImage = "linear-gradient(" + tint + "," + tint + ")"; el.style.backgroundRepeat = "no-repeat"; el.style.backgroundSize = "0% 100%"; }
      else el.style.clipPath = "inset(0 100% 0 0)";
      if (grow) { el._to = el.getBoundingClientRect().height; el.style.overflow = "hidden"; el.style.height = (j.pre[i] || 0) + "px"; }
    });
    const first = els[0];
    const pb = pane.getBoundingClientRect(), fb = first.getBoundingClientRect();
    const needScroll = fb.top < pb.top + 40 || fb.top > pb.bottom - 160;
    if (needScroll) pane.scrollTo({ top: pane.scrollTop + fb.top - pb.top - 90, behavior: "smooth" });
    const panel = rootRef.current && rootRef.current.querySelector(".tl-panel");
    const row = panel && panel.querySelector('[data-enh-row="' + j.id + '"]');
    if (panel && row && panel.scrollHeight > panel.clientHeight + 4) {
      const head = panel.querySelector(".tl-panel-head");
      const hh = head ? head.offsetHeight : 0;
      const rb = row.getBoundingClientRect(), qb = panel.getBoundingClientRect();
      if (rb.top < qb.top + hh + 8 || rb.bottom > qb.bottom - 8) panel.scrollTo({ top: panel.scrollTop + rb.top - qb.top - hh - 12, behavior: "smooth" });
    }
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const anim = (el, k, f, d, e) => el.animate(k, { duration: d, easing: e, fill: "forwards" }).finished.catch(() => {});
    (async () => {
      if (needScroll) await wait(420);
      if (grow) { await Promise.all(els.map((el, i) => anim(el, [{ height: (j.pre[i] || 0) + "px" }, { height: el._to + "px" }], 0, 520, EASE))); await wait(120); }
      const WIPE = "cubic-bezier(.65,0,.35,1)", stagger = els.length > 1 ? Math.min(90, 900 / els.length) : 0;
      await Promise.all(els.map((el, i) => wait(i * stagger).then(() => isBand ? anim(el, [{ backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%" }], 0, 820, WIPE) : anim(el, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], 0, 820, WIPE))));
      els.forEach((el) => {
        el.getAnimations().forEach((x) => x.cancel());
        ["clipPath", "height", "overflow", "transition", "backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundSize", "boxShadow"].forEach((k) => { el.style[k] = ""; });
      });
      await wait(allRef.current ? 650 : 140);
      done();
    })();
  }, [on]);
  const startAll = () => {
    const ids = TL_ENH.map((e) => e.id).filter((id) => !onRef.current[id]);
    if (!ids.length) return;
    allRef.current = true;
    setAllMode(true);
    enqueue(ids);
  };
  React.useEffect(() => {
    const view = viewRef.current;
    const pop = popRef.current;
    if (!view || !pop) return;
    const pane = view.querySelector(".tl-scroll");
    const hide = () => view.classList.toggle("gone", pane.scrollTop > 24);
    pane.addEventListener("scroll", hide, { passive: true });
    hide();
    let timer = null, current = null, kind = null;
    const down = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      current = null;
      kind = null;
      pop.className = "tl-pop";
    };
    const place = (anchor, text, kind2) => {
      pop.textContent = text;
      pop.className = "tl-pop " + kind2;
      const vb = view.getBoundingClientRect();
      const ab = anchor.getBoundingClientRect();
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let left = ab.left - vb.left + ab.width / 2 - pw / 2;
      left = Math.max(10, Math.min(left, vb.width - pw - 22));
      let top = ab.top - vb.top - ph - 10;
      if (top < 10) top = Math.min(ab.bottom - vb.top + 10, vb.height - ph - 10);
      pop.style.left = left + "px";
      pop.style.top = Math.max(10, top) + "px";
      pop.className = "tl-pop " + kind2 + " up";
    };
    const enter = (e) => {
      const post = pane.querySelector(".tl-post");
      const def = e.target.closest && e.target.closest("[data-def]");
      if (def && post && post.classList.contains("on-vocab")) {
        if (current === def) return;
        down();
        current = def;
        kind = "def";
        return place(def, def.getAttribute("data-def"), "def");
      }
      const w = e.target.closest && e.target.closest("[data-tlwhy]");
      if (w && post && !post.classList.contains("no-why")) {
        if (current === w) return;
        down();
        current = w;
        kind = "why";
        timer = setTimeout(() => place(w, w.getAttribute("data-tlwhy"), "why"), 360);
        return;
      }
      down();
    };
    const follow = () => {
      if (!current) return;
      const pb = pane.getBoundingClientRect();
      const ab = current.getBoundingClientRect();
      if (ab.bottom < pb.top + 4 || ab.top > pb.bottom - 4) return down();
      if (!timer) place(current, current.getAttribute(kind === "def" ? "data-def" : "data-tlwhy"), kind);
    };
    pane.addEventListener("mouseover", enter);
    pane.addEventListener("focusin", enter);
    pane.addEventListener("mouseleave", down);
    pane.addEventListener("focusout", down);
    pane.addEventListener("scroll", follow, { passive: true });
    return () => {
      pane.removeEventListener("scroll", hide);
      pane.removeEventListener("mouseover", enter);
      pane.removeEventListener("focusin", enter);
      pane.removeEventListener("mouseleave", down);
      pane.removeEventListener("focusout", down);
      pane.removeEventListener("scroll", follow);
      if (timer) clearTimeout(timer);
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "tl dlr", ref: rootRef }, /* @__PURE__ */ React.createElement("div", { className: "tl-view", ref: viewRef }, /* @__PURE__ */ React.createElement("div", { className: "tl-scroll", tabIndex: 0, role: "region", "aria-label": "Dollarous article" }, /* @__PURE__ */ React.createElement(TlBlog, { on, why })), /* @__PURE__ */ React.createElement("div", { className: "tl-pop", ref: popRef, role: "tooltip", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "tl-cue" }, "Scroll ", /* @__PURE__ */ React.createElement("span", { className: "ar" }, "\u2193"))), /* @__PURE__ */ React.createElement(
    TlPanel,
    {
      on,
      toggle,
      why,
      setWhy,
      busy: allMode,
      cur,
      all: startAll,
      none: () => { if (allRef.current) return; queue.current = []; setOn(TL_OFF); }
    }
  ));
}
const tlRoot = document.getElementById("tl-app");
if (tlRoot) ReactDOM.createRoot(tlRoot).render(React.createElement(TlApp));
