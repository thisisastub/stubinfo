/* Thought Leadership Enhancer · shell and enhancement panel.
   Loads after tl-blog.jsx, which puts TlBlog on window. */

const TL_ENH = [
  { id: "tts", t: "Listen to this article", why: "A text-to-speech version so the reader can listen on a phone or at a desk. The script is curated for accessibility: figure captions read as sentences, the stat markup is skipped rather than spelled out, and nothing reaches the listener as punctuation soup." },
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

function TlPanel({ on, toggle, all, none, why, setWhy }) {
  const count = TL_ENH.filter(e => on[e.id]).length;
  return (
    <aside className="tl-panel" aria-label="Enhancements">
      <div className="tl-panel-head">
        <h3>Enhancements</h3>
        <span className="c">{count} of {TL_ENH.length} activated | Toggle the enhancements to see them and try them out.</span>
        <div className="tl-panel-acts">
          <button type="button" className="pri" onClick={all}>Turn everything on</button>
          <button type="button" onClick={none}>Reset</button>
        </div>
      </div>
      <div className="tl-enh">
        {TL_ENH.map(e => (
          <div key={e.id} className={on[e.id] ? "on" : ""}>
            <button type="button" className="tl-enh-top" aria-pressed={!!on[e.id]} onClick={() => toggle(e.id)}>
              <span className="tl-sw" aria-hidden="true"><i /></span>
              <span className="t">{e.t}</span>
            </button>
            <p className="why">{e.why}</p>
          </div>
        ))}
      </div>
      <div className="tl-panel-foot">
        <p>
          <label style={{ display: "flex", gap: "0.45rem", alignItems: "center", cursor: "pointer", marginBottom: "0.5rem" }}>
            <input type="checkbox" checked={why} onChange={e => setWhy(e.target.checked)} />
            <span>Show the rationale on hover</span>
          </label>
          With this on, hovering any enhanced element in the article surfaces the same note you see here, pinned to the thing it explains.
        </p>
      </div>
    </aside>
  );
}

function TlApp() {
  const [on, setOn] = React.useState(TL_OFF);
  const [why, setWhy] = React.useState(true);
  const viewRef = React.useRef(null);
  const popRef = React.useRef(null);

  const toggle = id => setOn(p => Object.assign({}, p, { [id]: !p[id] }));

  React.useEffect(() => {
    const view = viewRef.current;
    const pop = popRef.current;
    if (!view || !pop) return;
    const pane = view.querySelector(".tl-scroll");
    const hide = () => view.classList.toggle("gone", pane.scrollTop > 24);
    pane.addEventListener("scroll", hide, { passive: true });
    hide();

    /* the popup is a sibling of the scroll box, so it is positioned from the
       anchor's rect and clamped inside the pane rather than clipped by it */
    let timer = null, current = null, kind = null;
    const down = () => { if (timer) clearTimeout(timer); timer = null; current = null; kind = null; pop.className = "tl-pop"; };
    const place = (anchor, text, kind) => {
      pop.textContent = text;
      pop.className = "tl-pop " + kind;
      const vb = view.getBoundingClientRect();
      const ab = anchor.getBoundingClientRect();
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let left = ab.left - vb.left + ab.width / 2 - pw / 2;
      left = Math.max(10, Math.min(left, vb.width - pw - 22));
      let top = ab.top - vb.top - ph - 10;
      if (top < 10) top = Math.min(ab.bottom - vb.top + 10, vb.height - ph - 10);
      pop.style.left = left + "px";
      pop.style.top = Math.max(10, top) + "px";
      pop.className = "tl-pop " + kind + " up";
    };
    const enter = e => {
      const post = pane.querySelector(".tl-post");
      const def = e.target.closest && e.target.closest("[data-def]");
      if (def && post && post.classList.contains("on-vocab")) {
        if (current === def) return;
        down(); current = def; kind = "def";
        return place(def, def.getAttribute("data-def"), "def");
      }
      const w = e.target.closest && e.target.closest("[data-tlwhy]");
      if (w && post && !post.classList.contains("no-why")) {
        if (current === w) return;
        down(); current = w; kind = "why";
        timer = setTimeout(() => place(w, w.getAttribute("data-tlwhy"), "why"), 360);
        return;
      }
      down();
    };
    /* focusing an off-screen term makes the browser scroll the pane, so a
       scroll must reposition the popup rather than dismiss it. It only goes
       away once the anchor itself has left the pane. */
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

  return (
    <div className="tl dlr">
      <div className="tl-view" ref={viewRef}>
        <div className="tl-scroll" tabIndex={0} role="region" aria-label="Dollarous article">
          <TlBlog on={on} why={why} />
        </div>
        <div className="tl-pop" ref={popRef} role="tooltip" aria-hidden="true"></div>
        <span className="tl-cue">Scroll <span className="ar">↓</span></span>
      </div>
      <TlPanel on={on} toggle={toggle} why={why} setWhy={setWhy}
        all={() => setOn(TL_ALL)} none={() => setOn(TL_OFF)} />
    </div>
  );
}

const tlRoot = document.getElementById("tl-app");
if (tlRoot) ReactDOM.createRoot(tlRoot).render(React.createElement(TlApp));
