/* Thought Leadership Enhancer · the Dollarous article and its enhancements.
   Every enhancement is either a class on .tl-post or a block rendered here
   when its switch is on. The off state is the wall of text we started with. */

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

const V = ({ t, def }) => <span className="tl-vocab" data-def={def} tabIndex={0}>{t}</span>;
const S = ({ children }) => <span className="tl-stat">{children}</span>;

const TlIcon = ({ d, fill }) => <svg viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

/* ---------------- listen bar ---------------- */
function TlListen() {
  const [playing, setPlaying] = React.useState(false);
  const [at, setAt] = React.useState(0);
  const [len, setLen] = React.useState(0);
  const audio = React.useRef(null);

  React.useEffect(() => () => { if (audio.current) audio.current.pause(); }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
    else { a.pause(); setPlaying(false); }
  };
  const clock = t => {
    if (!t || !isFinite(t)) return "0:00";
    const m = Math.floor(t / 60), sec = Math.floor(t % 60);
    return m + ":" + String(sec).padStart(2, "0");
  };
  const seek = e => {
    const a = audio.current;
    if (!a || !len) return;
    const b = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - b.left) / b.width) * len;
  };

  return (
    <div className="tl-tts" data-tlwhy="A recorded read of the article, so it can be listened to on a commute or at a desk. The script is curated before it goes to voice: figure captions are read as sentences, the stat markup is skipped rather than spelled out, and nothing arrives as punctuation soup.">
      <audio ref={audio} src="dollarous-article.mp3" preload="metadata"
        onLoadedMetadata={e => setLen(e.target.duration)}
        onTimeUpdate={e => setAt(e.target.currentTime)}
        onEnded={() => { setPlaying(false); setAt(0); if (audio.current) audio.current.currentTime = 0; }} />
      <button type="button" className="pl" onClick={toggle} aria-label={playing ? "Pause" : "Listen to this article"}>
        {playing ? <TlIcon fill d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <TlIcon fill d="M8 5v14l11-7z" />}
      </button>
      <span className="lab">Listen to this article<span>Curated for screen readers</span></span>
      <span className="bar" onClick={seek} role="presentation"><i style={{ width: (len ? (at / len) * 100 : 0) + "%" }} /></span>
      <span className="dur">{playing || at ? clock(at) + " / " : ""}{clock(len)}</span>
    </div>
  );
}

/* ---------------- key takeaways ---------------- */
const TlTakeaways = () => (
  <div className="tl-take" data-tlwhy="Two or three summary points above the article. A reader who bounces at the third paragraph still leaves holding the argument, and the block gives search engines a clean answer to lift.">
    <h3>Key takeaways</h3>
    <ul>
      <li>Close time is not spent on matching. It is spent deciding what to do about the items that did not match.</li>
      <li>Most teams automate the matching first because it is the easiest half to specify, not because it is the expensive half.</li>
      <li>An exception rule you cannot write in one sentence is not ready to automate.</li>
    </ul>
  </div>
);

/* ---------------- the donut ---------------- */
function TlChart() {
  const [hot, setHot] = React.useState(null);
  const R = 60, C = 2 * Math.PI * R;
  let acc = 0;
  const focus = hot !== null;
  return (
    <div className="tl-chart" data-tlwhy="Hover a slice or a legend row and the rest recede. Light interaction, but it acknowledges that a reader is present rather than being read at, and it lets someone answer their own question instead of reading four sentences to find one number.">
      <h4>Where the close actually goes</h4>
      <p className="sub">Share of total close hours, mid-market finance teams</p>
      <div className="tl-chart-body">
        <div className={"tl-donut" + (focus ? " focus" : "")}>
          <svg viewBox="0 0 160 160" role="img" aria-label="Share of close hours by activity">
            {TL_SLICES.map((s, i) => {
              const len = (s.v / 100) * C;
              const off = -(acc / 100) * C;
              acc += s.v;
              return <circle key={s.k} className={hot === i ? "on" : ""} cx="80" cy="80" r={R} stroke={s.c}
                strokeDasharray={len + " " + (C - len)} strokeDashoffset={off}
                onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} />;
            })}
          </svg>
          <span className="mid">{focus && <React.Fragment><b>{TL_SLICES[hot].v}%</b><span>{TL_SLICES[hot].k}</span></React.Fragment>}</span>
        </div>
        <div className={"tl-legend" + (focus ? " focus" : "")}>
          {TL_SLICES.map((s, i) => (
            <button key={s.k} type="button" className={hot === i ? "on" : ""}
              onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}>
              <i style={{ background: s.c }} /><span className="k">{s.k}</span><span className="v">{s.v}%</span>
            </button>
          ))}
        </div>
      </div>
      <p className="tl-src">Source: Dollarous Financial Operations Benchmark, 2026. Illustrative sample of 240 mid-market finance teams. Figures are representative of the sample, not population estimates.</p>
    </div>
  );
}

const TlChartPlain = () => (
  <div className="tl-chart-plain">
    <p>Broken out by activity, clearing exceptions accounts for <S>44%</S> of total close hours, matching and posting for <S>24%</S>, review and sign-off for <S>19%</S>, and reporting and variance notes for the remaining <S>13%</S>, according to our 2026 benchmark of <S>240</S> mid-market finance teams.</p>
  </div>
);

/* ---------------- mini slides ---------------- */
function TlSlides() {
  const [i, setI] = React.useState(0);
  const s = TL_SLIDES[i];
  const go = n => setI((n + TL_SLIDES.length) % TL_SLIDES.length);
  return (
    <div className="tl-slides" data-tlwhy="A short summary deck built with real design hierarchy, downloadable so a reader can drop it straight into their own deck. People do not share articles with their boss. They share slides.">
      <div className="tl-slides-bar">
        <span className="mk" aria-hidden="true" /><span className="who">DOLLAROUS</span><span className="n">{i + 1} / {TL_SLIDES.length}</span>
      </div>
      <div className="tl-stage">
        <div className={"tl-slide " + s.tone}>
          <span className="rule" aria-hidden="true" />
          {s.big ? <React.Fragment><span className="big">{s.big}</span><span className="cap">{s.cap}</span></React.Fragment> : <h5>{s.h}</h5>}
          <p>{s.p}</p>
          <span className="src">Source: {s.src}</span>
        </div>
        <button type="button" className="tl-zone l" onClick={() => go(i - 1)} aria-label="Previous slide" />
        <button type="button" className="tl-zone r" onClick={() => go(i + 1)} aria-label="Next slide" />
      </div>
      <div className="tl-slides-foot">
        <div className="tl-dots">
          {TL_SLIDES.map((_, n) => <button key={n} type="button" className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={"Slide " + (n + 1)} />)}
        </div>
        <button type="button" className="dl"><TlIcon d="M12 3v12M7 11l5 5 5-5M4 21h16" />Download all five</button>
        <div className="tl-arrows">
          <button type="button" onClick={() => go(i - 1)} aria-label="Previous slide"><TlIcon d="M15 18l-6-6 6-6" /></button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Next slide"><TlIcon d="M9 6l6 6-6 6" /></button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- testimonial ---------------- */
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
    return () => { clearInterval(t); if (pane) pane.removeEventListener("scroll", check); };
  }, []);

  /* typewriter: one character at a time once it is on screen */
  React.useEffect(() => {
    if (!seen) return;
    if (reduce) return setN(TL_QUOTE.length);
    const id = setInterval(() => setN(v => {
      if (v >= TL_QUOTE.length) { clearInterval(id); return v; }
      return v + 1;
    }), 22);
    return () => clearInterval(id);
  }, [seen, reduce]);

  const done = n >= TL_QUOTE.length;
  return (
    <div ref={ref} className={"tl-quote" + (seen ? " in" : "") + (done ? " done" : "")} data-tlwhy="Strong brand ground, and the quote types itself out as it scrolls into view. It earns a stop in a way a grey box with a vertical rule never does, and it puts a named human in the middle of the argument.">
      <blockquote aria-label={TL_QUOTE}>
        <span aria-hidden="true">{TL_QUOTE.slice(0, n)}</span><span className="caret" aria-hidden="true" />
      </blockquote>
      <div className="attr">
        <span className="shot" aria-hidden="true">{TL_SME.initial}</span>
        <span className="n">{TL_SME.name}<span>{TL_SME.role}</span></span>
      </div>
    </div>
  );
}

const TlQuotePlain = () => (
  <div className="tl-quote-plain">
    <p>"The matching was never what kept us late. It was the forty items nobody had written a rule for, and the argument about who owned the decision."</p>
    <p className="attr">{TL_SME.name}, {TL_SME.role}</p>
  </div>
);

/* ---------------- share row ---------------- */
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
    const t = setTimeout(() => setPoke(false), 6000);
    return () => clearTimeout(t);
  }, [poke]);
  return (
    <div className="tl-share">
      <span className="lab">Share</span>
      {TL_SOCIAL.map(([n, d]) => (
        <a key={n} href="#" aria-label={"Share on " + n} onClick={e => { e.preventDefault(); setPoke(true); }}><TlIcon fill d={d} /></a>
      ))}
      <span className={"tl-poke" + (poke ? " up" : "")} role="status">
        <b>Another enhancement:</b> Removing social icons entirely. When was the last time you clicked one of these?
        <button type="button" onClick={() => setPoke(false)} aria-label="Dismiss">×</button>
      </span>
    </div>
  );
}

/* ---------------- the article ---------------- */
function TlBlog({ on, why }) {
  const cls = ["tl-post",
    on.dropcap && "on-dropcap", on.stats && "on-stats", on.vocab && "on-vocab",
    on.bands && "on-bands", on.lists && "on-lists", !why && "no-why"].filter(Boolean).join(" ");

  return (
    <article className={cls}>
      <header className="tl-head">
        <h1>Your close is not slow. Your exceptions are.</h1>
        <div className="tl-byline">
          <span className="face"><img src={TL_AUTHOR.shot} alt={TL_AUTHOR.name} width="88" height="88" /></span>
          <span className="who">{TL_AUTHOR.name}</span>
          <span className="role">{TL_AUTHOR.role}</span>
          <span className="meta">September 2026 · 7 min read</span>
        </div>
      </header>

      {on.tts && <TlListen />}
      {on.takeaways && <TlTakeaways />}

      <section className="tl-band">
        <p className="tl-lede">Every finance team we speak to describes the month-end close the same way. It takes too long, and nobody can say precisely where the time goes. Ask a controller to name the slowest step and you will usually hear a guess rather than a number.</p>
        <p>The guess is almost always the same one, and it is almost always wrong. Teams point at the <V t="three-way match" def="Reconciling a purchase order, a receiving document, and a supplier invoice against one another before payment is released." />, the arithmetic step where invoices, receipts, and purchase orders are lined up against one another. It feels like the bottleneck because it is the part with the most rows in it.</p>
        <p>In our 2026 benchmark of <S>240</S> mid-market finance teams, <S>62%</S> of controllers reported that resolving <V t="exceptions" def="Any item that fails an automated match and has to be decided by a person: a price variance, a partial receipt, a duplicate, a missing document." /> consumed more of their close than matching did. Median close length across the same sample was <S>8.4 days</S>. Among teams running more than one general ledger, exception volume was <S>3.2×</S> higher, and their median close ran two full days longer.</p>
      </section>

      <section className="tl-band alt">
        <h2>Where the time actually goes</h2>
        <p>We asked finance leaders to allocate their close hours across four activities. The result is not close.</p>
        {on.chart ? <TlChart /> : <TlChartPlain />}
      </section>

      <section className="tl-band">
        <h2>Why teams automate the wrong half</h2>
        <p>This is not a failure of intelligence. It is a failure of specification, and it happens for four reasons that are individually reasonable.</p>
        <ol>
          <li><b>Matching is easy to write down.</b> A rule that compares three numbers can be handed to a vendor in an afternoon. A rule that decides what to do about a partial receipt from a supplier you are already in dispute with cannot.</li>
          <li><b>The demo shows matching.</b> Every reconciliation tool leads with the volume it can process. None of them lead with the exception queue, because the exception queue is where the software stops and a person starts.</li>
          <li><b>Exceptions are unevenly distributed.</b> They cluster in a handful of suppliers and a handful of <V t="subledgers" def="A detailed ledger that feeds summary totals into the general ledger: accounts payable, accounts receivable, fixed assets, inventory." />, which makes them look like edge cases rather than the main event.</li>
          <li><b>Nobody owns the queue.</b> <S>41%</S> of the teams in our sample had automated matching before anyone had been made accountable for exception throughput. The queue belonged to whoever noticed it.</li>
        </ol>
        <p>The result is a close where the fast half got faster and the slow half stayed exactly where it was. At an average of <S>$18</S> in fully loaded handling cost per exception, a team clearing four hundred of them a month is spending real money on a problem it has never priced.</p>
      </section>

      {on.slides && <section className="tl-band alt"><TlSlides /></section>}

      <section className="tl-band">
        <h2>What the people doing it say</h2>
        {on.quote ? <TlQuote /> : <TlQuotePlain />}
      </section>

      <section className="tl-band alt">
        <h2>What to do instead</h2>
        <p>The work here is unglamorous and it is not technical. It is writing things down.</p>
        <ul>
          <li><b>Sample fifty exceptions from last close.</b> Not a report on them. The actual items, read one at a time, sorted by why they broke.</li>
          <li><b>Write the decision for the top three causes in one sentence each.</b> If a sentence will not hold it, the rule is not ready and automating it will only move the argument downstream.</li>
          <li><b>Give the queue an owner and a number.</b> Exception throughput per day, visible to the same people who see days-to-close. A queue nobody measures is a queue nobody clears.</li>
          <li><b>Set a <V t="cut-off" def="The point at which a period is closed to new entries, after which transactions post to the following period." /> you will actually hold.</b> Most exception backlogs are not accuracy problems. They are late-arriving documents that were allowed to arrive late.</li>
        </ul>
        <p>Do those four things and the automation conversation becomes a much shorter one, because you will finally be able to say what you want automated. Skip them and you will buy a faster version of the half that was never the problem.</p>
      </section>

      <TlShare />
    </article>
  );
}

Object.assign(window, { TlBlog, TlListen, TlChart, TlSlides, TlQuote, TlShare, TL_SLICES, TL_SLIDES });
