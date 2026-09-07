const TL_AUTHOR = { name: "Dev Raghunathan", role: "Director of Financial Controls, Dollarous", shot: "dev-headshot.png" };
const TL_SME = { name: "Marisol Ferreira", role: "VP, Financial Operations, Dollarous", initial: "M" };
const TL_SLICES = [
  { k: "Clearing exceptions", v: 44, c: "#0B3D2C" },
  { k: "Matching and posting", v: 24, c: "#1E8A62" },
  { k: "Review and sign-off", v: 19, c: "#14624A" },
  { k: "Reporting and variance notes", v: 13, c: "#93A896" }
];
const TL_SLIDES = [
  { tone: "l", h: "The close is not one job.", p: "It is two. One half is arithmetic and the other half is judgment, and only one of them can be handed to software.", src: "Dollarous Financial Operations Benchmark, 2026" },
  { tone: "g", big: "44%", cap: "of close time goes to clearing exceptions", p: "Not to matching. Not to posting. To deciding what to do about the things that did not match.", src: "Dollarous Financial Operations Benchmark, 2026" },
  { tone: "l", big: "41%", cap: "of teams automated the matching first", p: "The matching was already the fast part. Automating it made a fast thing faster and left the slow thing alone.", src: "Dollarous Financial Operations Benchmark, 2026" },
  { tone: "k", h: "You cannot automate a judgment nobody has written down.", p: "If the rule takes a paragraph to explain, you are not automating a process. You are automating an argument.", src: "Dollarous Financial Operations Benchmark, 2026" },
  { tone: "l", h: "Write the rule. Then automate it.", p: "Sample fifty exceptions. Sort them by why they broke. Write the decision for the top three in one sentence each. Automate those.", src: "Dollarous Financial Operations Benchmark, 2026" }
];
const V = ({ t, def }) => /* @__PURE__ */ React.createElement("span", { className: "tl-vocab", "data-def": def, tabIndex: 0 }, t);
const S = ({ children }) => /* @__PURE__ */ React.createElement("span", { className: "tl-stat" }, children);
const TlIcon = ({ d, fill }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", fill: fill ? "currentColor" : "none", stroke: fill ? "none" : "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d }));
function TlListen() {
  const [playing, setPlaying] = React.useState(false);
  const [at, setAt] = React.useState(0);
  const [len, setLen] = React.useState(0);
  const audio = React.useRef(null);
  React.useEffect(() => () => {
    if (audio.current) audio.current.pause();
  }, []);
  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };
  const clock = (t) => {
    if (!t || !isFinite(t)) return "0:00";
    const m = Math.floor(t / 60), sec = Math.floor(t % 60);
    return m + ":" + String(sec).padStart(2, "0");
  };
  const seek = (e) => {
    const a = audio.current;
    if (!a || !len) return;
    const b = e.currentTarget.getBoundingClientRect();
    a.currentTime = (e.clientX - b.left) / b.width * len;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "tl-tts", "data-tlwhy": "A recorded read of the article, so it can be listened to on a commute or at a desk. The script is curated before it goes to voice: figure captions are read as sentences, the stat markup is skipped rather than spelled out, and nothing arrives as punctuation soup." }, /* @__PURE__ */ React.createElement(
    "audio",
    {
      ref: audio,
      src: "dollarous-article.mp3",
      preload: "metadata",
      onLoadedMetadata: (e) => setLen(e.target.duration),
      onTimeUpdate: (e) => setAt(e.target.currentTime),
      onEnded: () => {
        setPlaying(false);
        setAt(0);
        if (audio.current) audio.current.currentTime = 0;
      }
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "button", className: "pl", onClick: toggle, "aria-label": playing ? "Pause" : "Listen to this article" }, playing ? /* @__PURE__ */ React.createElement(TlIcon, { fill: true, d: "M7 5h4v14H7zM13 5h4v14h-4z" }) : /* @__PURE__ */ React.createElement(TlIcon, { fill: true, d: "M8 5v14l11-7z" })), /* @__PURE__ */ React.createElement("span", { className: "lab" }, "Listen to this article", /* @__PURE__ */ React.createElement("span", null, "Curated for screen readers")), /* @__PURE__ */ React.createElement("span", { className: "bar", onClick: seek, role: "presentation" }, /* @__PURE__ */ React.createElement("i", { style: { width: (len ? at / len * 100 : 0) + "%" } })), /* @__PURE__ */ React.createElement("span", { className: "dur" }, playing || at ? clock(at) + " / " : "", clock(len)));
}
const TlTakeaways = () => /* @__PURE__ */ React.createElement("div", { className: "tl-take", "data-tlwhy": "Two or three summary points above the article. A reader who bounces at the third paragraph still leaves holding the argument, and the block gives search engines a clean answer to lift." }, /* @__PURE__ */ React.createElement("h3", null, "Key takeaways"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, "Close time is not spent on matching. It is spent deciding what to do about the items that did not match."), /* @__PURE__ */ React.createElement("li", null, "Most teams automate the matching first because it is the easiest half to specify, not because it is the expensive half."), /* @__PURE__ */ React.createElement("li", null, "An exception rule you cannot write in one sentence is not ready to automate.")));
function TlChart() {
  const [hot, setHot] = React.useState(null);
  const R = 60, C = 2 * Math.PI * R;
  let acc = 0;
  const focus = hot !== null;
  return /* @__PURE__ */ React.createElement("div", { className: "tl-chart", "data-tlwhy": "Hover a slice or a legend row and the rest recede. Light interaction, but it acknowledges that a reader is present rather than being read at, and it lets someone answer their own question instead of reading four sentences to find one number." }, /* @__PURE__ */ React.createElement("h4", null, "Where the close actually goes"), /* @__PURE__ */ React.createElement("p", { className: "sub" }, "Share of total close hours, mid-market finance teams"), /* @__PURE__ */ React.createElement("div", { className: "tl-chart-body" }, /* @__PURE__ */ React.createElement("div", { className: "tl-donut" + (focus ? " focus" : "") }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 160 160", role: "img", "aria-label": "Share of close hours by activity" }, TL_SLICES.map((s, i) => {
    const len = s.v / 100 * C;
    const off = -(acc / 100) * C;
    acc += s.v;
    return /* @__PURE__ */ React.createElement(
      "circle",
      {
        key: s.k,
        className: hot === i ? "on" : "",
        cx: "80",
        cy: "80",
        r: R,
        stroke: s.c,
        strokeDasharray: len + " " + (C - len),
        strokeDashoffset: off,
        onMouseEnter: () => setHot(i),
        onMouseLeave: () => setHot(null)
      }
    );
  })), /* @__PURE__ */ React.createElement("span", { className: "mid" }, focus && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("b", null, TL_SLICES[hot].v, "%"), /* @__PURE__ */ React.createElement("span", null, TL_SLICES[hot].k)))), /* @__PURE__ */ React.createElement("div", { className: "tl-legend" + (focus ? " focus" : "") }, TL_SLICES.map((s, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.k,
      type: "button",
      className: hot === i ? "on" : "",
      onMouseEnter: () => setHot(i),
      onMouseLeave: () => setHot(null),
      onFocus: () => setHot(i),
      onBlur: () => setHot(null)
    },
    /* @__PURE__ */ React.createElement("i", { style: { background: s.c } }),
    /* @__PURE__ */ React.createElement("span", { className: "k" }, s.k),
    /* @__PURE__ */ React.createElement("span", { className: "v" }, s.v, "%")
  )))), /* @__PURE__ */ React.createElement("p", { className: "tl-src" }, "Source: Dollarous Financial Operations Benchmark, 2026. Illustrative sample of 240 mid-market finance teams. Figures are representative of the sample, not population estimates."));
}
const TlChartPlain = () => /* @__PURE__ */ React.createElement("div", { className: "tl-chart-plain" }, /* @__PURE__ */ React.createElement("p", null, "Broken out by activity, clearing exceptions accounts for ", /* @__PURE__ */ React.createElement(S, null, "44%"), " of total close hours, matching and posting for ", /* @__PURE__ */ React.createElement(S, null, "24%"), ", review and sign-off for ", /* @__PURE__ */ React.createElement(S, null, "19%"), ", and reporting and variance notes for the remaining ", /* @__PURE__ */ React.createElement(S, null, "13%"), ", according to our 2026 benchmark of ", /* @__PURE__ */ React.createElement(S, null, "240"), " mid-market finance teams."));
function TlSlides() {
  const [i, setI] = React.useState(0);
  const s = TL_SLIDES[i];
  const go = (n) => setI((n + TL_SLIDES.length) % TL_SLIDES.length);
  return /* @__PURE__ */ React.createElement("div", { className: "tl-slides", "data-tlwhy": "A short summary deck built with real design hierarchy, downloadable so a reader can drop it straight into their own deck. People do not share articles with their boss. They share slides." }, /* @__PURE__ */ React.createElement("div", { className: "tl-slides-bar" }, /* @__PURE__ */ React.createElement("span", { className: "mk", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("span", { className: "who" }, "DOLLAROUS"), /* @__PURE__ */ React.createElement("span", { className: "n" }, i + 1, " / ", TL_SLIDES.length)), /* @__PURE__ */ React.createElement("div", { className: "tl-stage" }, /* @__PURE__ */ React.createElement("div", { className: "tl-slide " + s.tone }, /* @__PURE__ */ React.createElement("span", { className: "rule", "aria-hidden": "true" }), s.big ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "big" }, s.big), /* @__PURE__ */ React.createElement("span", { className: "cap" }, s.cap)) : /* @__PURE__ */ React.createElement("h5", null, s.h), /* @__PURE__ */ React.createElement("p", null, s.p), /* @__PURE__ */ React.createElement("span", { className: "src" }, "Source: ", s.src)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "tl-zone l", onClick: () => go(i - 1), "aria-label": "Previous slide" }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "tl-zone r", onClick: () => go(i + 1), "aria-label": "Next slide" })), /* @__PURE__ */ React.createElement("div", { className: "tl-slides-foot" }, /* @__PURE__ */ React.createElement("div", { className: "tl-dots" }, TL_SLIDES.map((_, n) => /* @__PURE__ */ React.createElement("button", { key: n, type: "button", className: n === i ? "on" : "", onClick: () => setI(n), "aria-label": "Slide " + (n + 1) }))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "dl" }, /* @__PURE__ */ React.createElement(TlIcon, { d: "M12 3v12M7 11l5 5 5-5M4 21h16" }), "Download all five"), /* @__PURE__ */ React.createElement("div", { className: "tl-arrows" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go(i - 1), "aria-label": "Previous slide" }, /* @__PURE__ */ React.createElement(TlIcon, { d: "M15 18l-6-6 6-6" })), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go(i + 1), "aria-label": "Next slide" }, /* @__PURE__ */ React.createElement(TlIcon, { d: "M9 6l6 6-6 6" })))));
}
const TL_QUOTE = "\u201CThe matching was never what kept us late. It was the forty items nobody had written a rule for, and the argument about who owned the decision.\u201D";
function TlQuote() {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  const [n, setN] = React.useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pane = el.closest(".tl-scroll");
    const check = () => {
      const r = el.getBoundingClientRect();
      const b = pane ? pane.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      if (r.top < b.bottom - 60 && r.bottom > b.top) setSeen(true);
    };
    check();
    const t = setInterval(check, 200);
    if (pane) pane.addEventListener("scroll", check, { passive: true });
    return () => {
      clearInterval(t);
      if (pane) pane.removeEventListener("scroll", check);
    };
  }, []);
  React.useEffect(() => {
    if (!seen) return;
    if (reduce) return setN(TL_QUOTE.length);
    const id = setInterval(() => setN((v) => {
      if (v >= TL_QUOTE.length) {
        clearInterval(id);
        return v;
      }
      return v + 1;
    }), 22);
    return () => clearInterval(id);
  }, [seen, reduce]);
  const done = n >= TL_QUOTE.length;
  return /* @__PURE__ */ React.createElement("div", { ref, className: "tl-quote" + (seen ? " in" : "") + (done ? " done" : ""), "data-tlwhy": "Strong brand ground, and the quote types itself out as it scrolls into view. It earns a stop in a way a grey box with a vertical rule never does, and it puts a named human in the middle of the argument." }, /* @__PURE__ */ React.createElement("blockquote", { "aria-label": TL_QUOTE }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, TL_QUOTE.slice(0, n)), /* @__PURE__ */ React.createElement("span", { className: "caret", "aria-hidden": "true" })), /* @__PURE__ */ React.createElement("div", { className: "attr" }, /* @__PURE__ */ React.createElement("span", { className: "shot", "aria-hidden": "true" }, TL_SME.initial), /* @__PURE__ */ React.createElement("span", { className: "n" }, TL_SME.name, /* @__PURE__ */ React.createElement("span", null, TL_SME.role))));
}
const TlQuotePlain = () => /* @__PURE__ */ React.createElement("div", { className: "tl-quote-plain" }, /* @__PURE__ */ React.createElement("p", null, '"The matching was never what kept us late. It was the forty items nobody had written a rule for, and the argument about who owned the decision."'), /* @__PURE__ */ React.createElement("p", { className: "attr" }, TL_SME.name, ", ", TL_SME.role));
const TL_SOCIAL = [
  ["LinkedIn", "M4 9h3v11H4zM5.5 4a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5M10 20V9h3v1.5A3.5 3.5 0 0 1 20 13.5V20h-3v-6a1.75 1.75 0 0 0-3.5 0v6z"],
  ["Facebook", "M14 9V7a2 2 0 0 1 2-2h2V2h-3a5 5 0 0 0-5 5v2H8v3h2v9h4v-9h3l1-3z"],
  ["X", "M4 4l7.2 9.3L4.4 20h2.3l5.4-5.4 4.1 5.4H20l-7.4-9.6L19.4 4h-2.3l-5 5-3.8-5z"],
  ["Instagram", "M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M17 6.6h.01"]
];
function TlShare() {
  const [poke, setPoke] = React.useState(false);
  React.useEffect(() => {
    if (!poke) return;
    const t = setTimeout(() => setPoke(false), 6e3);
    return () => clearTimeout(t);
  }, [poke]);
  return /* @__PURE__ */ React.createElement("div", { className: "tl-share" }, /* @__PURE__ */ React.createElement("span", { className: "lab" }, "Share"), TL_SOCIAL.map(([n, d]) => /* @__PURE__ */ React.createElement("a", { key: n, href: "#", "aria-label": "Share on " + n, onClick: (e) => {
    e.preventDefault();
    setPoke(true);
  } }, /* @__PURE__ */ React.createElement(TlIcon, { fill: true, d }))), /* @__PURE__ */ React.createElement("span", { className: "tl-poke" + (poke ? " up" : ""), role: "status" }, /* @__PURE__ */ React.createElement("b", null, "Another enhancement:"), " Removing social icons entirely. When was the last time you clicked one of these?", /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setPoke(false), "aria-label": "Dismiss" }, "\xD7")));
}
function TlBlog({ on, why }) {
  const cls = [
    "tl-post",
    on.dropcap && "on-dropcap",
    on.stats && "on-stats",
    on.vocab && "on-vocab",
    on.bands && "on-bands",
    on.lists && "on-lists",
    !why && "no-why"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ React.createElement("article", { className: cls }, /* @__PURE__ */ React.createElement("header", { className: "tl-head" }, /* @__PURE__ */ React.createElement("h1", null, "Your close is not slow. Your exceptions are."), /* @__PURE__ */ React.createElement("div", { className: "tl-byline" }, /* @__PURE__ */ React.createElement("span", { className: "face" }, /* @__PURE__ */ React.createElement("img", { src: TL_AUTHOR.shot, alt: TL_AUTHOR.name, width: "88", height: "88" })), /* @__PURE__ */ React.createElement("span", { className: "who" }, TL_AUTHOR.name), /* @__PURE__ */ React.createElement("span", { className: "role" }, TL_AUTHOR.role), /* @__PURE__ */ React.createElement("span", { className: "meta" }, "September 2026 \xB7 7 min read"))), on.tts && /* @__PURE__ */ React.createElement(TlListen, null), on.takeaways && /* @__PURE__ */ React.createElement(TlTakeaways, null), /* @__PURE__ */ React.createElement("section", { className: "tl-band" }, /* @__PURE__ */ React.createElement("p", { className: "tl-lede" }, "Every finance team we speak to describes the month-end close the same way. It takes too long, and nobody can say precisely where the time goes. Ask a controller to name the slowest step and you will usually hear a guess rather than a number."), /* @__PURE__ */ React.createElement("p", null, "The guess is almost always the same one, and it is almost always wrong. Teams point at the ", /* @__PURE__ */ React.createElement(V, { t: "three-way match", def: "Reconciling a purchase order, a receiving document, and a supplier invoice against one another before payment is released." }), ", the arithmetic step where invoices, receipts, and purchase orders are lined up against one another. It feels like the bottleneck because it is the part with the most rows in it."), /* @__PURE__ */ React.createElement("p", null, "In our 2026 benchmark of ", /* @__PURE__ */ React.createElement(S, null, "240"), " mid-market finance teams, ", /* @__PURE__ */ React.createElement(S, null, "62%"), " of controllers reported that resolving ", /* @__PURE__ */ React.createElement(V, { t: "exceptions", def: "Any item that fails an automated match and has to be decided by a person: a price variance, a partial receipt, a duplicate, a missing document." }), " consumed more of their close than matching did. Median close length across the same sample was ", /* @__PURE__ */ React.createElement(S, null, "8.4 days"), ". Among teams running more than one general ledger, exception volume was ", /* @__PURE__ */ React.createElement(S, null, "3.2\xD7"), " higher, and their median close ran two full days longer.")), /* @__PURE__ */ React.createElement("section", { className: "tl-band alt" }, /* @__PURE__ */ React.createElement("h2", null, "Where the time actually goes"), /* @__PURE__ */ React.createElement("p", null, "We asked finance leaders to allocate their close hours across four activities. The result is not close."), on.chart ? /* @__PURE__ */ React.createElement(TlChart, null) : /* @__PURE__ */ React.createElement(TlChartPlain, null)), /* @__PURE__ */ React.createElement("section", { className: "tl-band" }, /* @__PURE__ */ React.createElement("h2", null, "Why teams automate the wrong half"), /* @__PURE__ */ React.createElement("p", null, "This is not a failure of intelligence. It is a failure of specification, and it happens for four reasons that are individually reasonable."), /* @__PURE__ */ React.createElement("ol", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "Matching is easy to write down."), " A rule that compares three numbers can be handed to a vendor in an afternoon. A rule that decides what to do about a partial receipt from a supplier you are already in dispute with cannot."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "The demo shows matching."), " Every reconciliation tool leads with the volume it can process. None of them lead with the exception queue, because the exception queue is where the software stops and a person starts."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "Exceptions are unevenly distributed."), " They cluster in a handful of suppliers and a handful of ", /* @__PURE__ */ React.createElement(V, { t: "subledgers", def: "A detailed ledger that feeds summary totals into the general ledger: accounts payable, accounts receivable, fixed assets, inventory." }), ", which makes them look like edge cases rather than the main event."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "Nobody owns the queue."), " ", /* @__PURE__ */ React.createElement(S, null, "41%"), " of the teams in our sample had automated matching before anyone had been made accountable for exception throughput. The queue belonged to whoever noticed it.")), /* @__PURE__ */ React.createElement("p", null, "The result is a close where the fast half got faster and the slow half stayed exactly where it was. At an average of ", /* @__PURE__ */ React.createElement(S, null, "$18"), " in fully loaded handling cost per exception, a team clearing four hundred of them a month is spending real money on a problem it has never priced.")), on.slides && /* @__PURE__ */ React.createElement("section", { className: "tl-band alt" }, /* @__PURE__ */ React.createElement(TlSlides, null)), /* @__PURE__ */ React.createElement("section", { className: "tl-band" }, /* @__PURE__ */ React.createElement("h2", null, "What the people doing it say"), on.quote ? /* @__PURE__ */ React.createElement(TlQuote, null) : /* @__PURE__ */ React.createElement(TlQuotePlain, null)), /* @__PURE__ */ React.createElement("section", { className: "tl-band alt" }, /* @__PURE__ */ React.createElement("h2", null, "What to do instead"), /* @__PURE__ */ React.createElement("p", null, "The work here is unglamorous and it is not technical. It is writing things down."), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "Sample fifty exceptions from last close."), " Not a report on them. The actual items, read one at a time, sorted by why they broke."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "Write the decision for the top three causes in one sentence each."), " If a sentence will not hold it, the rule is not ready and automating it will only move the argument downstream."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "Give the queue an owner and a number."), " Exception throughput per day, visible to the same people who see days-to-close. A queue nobody measures is a queue nobody clears."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("b", null, "Set a ", /* @__PURE__ */ React.createElement(V, { t: "cut-off", def: "The point at which a period is closed to new entries, after which transactions post to the following period." }), " you will actually hold."), " Most exception backlogs are not accuracy problems. They are late-arriving documents that were allowed to arrive late.")), /* @__PURE__ */ React.createElement("p", null, "Do those four things and the automation conversation becomes a much shorter one, because you will finally be able to say what you want automated. Skip them and you will buy a faster version of the half that was never the problem.")), /* @__PURE__ */ React.createElement(TlShare, null));
}
Object.assign(window, { TlBlog, TlListen, TlChart, TlSlides, TlQuote, TlShare, TL_SLICES, TL_SLIDES });
