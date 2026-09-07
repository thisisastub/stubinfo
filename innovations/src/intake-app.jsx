/* Content Intake Enhancer · the working request form.
   Dollarous-branded. Tile selection, per-type branching steps,
   and resource-scoped output sheets. */

const IX_ICONS = {
  blog: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  case: "M4 4h16v13H7l-3 3zM8 9h8M8 13h5",
  landing: "M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M3 12h18M12 3c2.5 2.4 2.5 15 0 18M12 3c-2.5 2.4-2.5 15 0 18",
  creative: "M3 3h18v18H3zM3 9h18M9 9v12",
  email: "M3 6h18v12H3zM3 6l9 7 9-7",
  quick: "M13 2 4 14h6l-1 8 9-12h-6z",
  webinar: "M3 4h18v12H3zM8 20h8M12 16v4M9 8l4 2-4 2z",
  enable: "M4 4h11l5 5v11H4zM15 4v5h5M8 14h8M8 17h5",
  social: "M7 2h10v20H7zM10 19h4",
  video: "M3 5h18v14H3zM3 9h18M8 5v4M16 5v4",
  qr: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3M20 20h1M17 20h1M20 17h1"
};

function IxIcon({ k }) {
  return React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
    React.createElement("path", { d: IX_ICONS[k] }));
}
const Check = () => React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, React.createElement("path", { d: "M20 6 9 17l-5-5" }));

const T = (id, label, o = {}) => Object.assign({ id, label, type: "text" }, o);
const A = (id, label, o = {}) => Object.assign({ id, label, type: "area" }, o);
const O = (id, label, opts, o = {}) => Object.assign({ id, label, type: "one", opts }, o);
const M = (id, label, opts, o = {}) => Object.assign({ id, label, type: "many", opts }, o);
const D = (id, label, o = {}) => Object.assign({ id, label, type: "date" }, o);

const IX_TYPES = [
  { id: "blog", label: "Blog", desc: "Articles and thought leadership", accent: "#0B3D2C", steps: [
    { title: "The basics", fields: [T("topic", "Topic", { req: 1, ph: "One line" }), T("byline", "Byline", { req: 1, ph: "Who is this attributed to?" }), T("stakeholders", "Stakeholders", { req: 1, help: "Who has to see it before it publishes" })] },
    { title: "Audience & goals", fields: [O("audience", "Primary audience", ["Controller", "CFO", "Analyst", "Mixed"], { req: 1 }), T("segment", "Which segment", { when: a => a.audience === "Controller" || a.audience === "CFO", help: "Company size, systems, or vertical" }), A("goals", "Goals", { req: 1 }), A("keyMessages", "Key messages", { req: 1, help: "Three to five, one per line" })] },
    { title: "Research", fields: [A("sources", "Research resources", { req: 1, help: "Three to five links" }), T("smes", "Subject-matter experts", { req: 1 }), T("data", "Data to cite")] },
    { title: "Optional", optional: 1, fields: [T("campaign", "Campaign"), T("cta", "Call to action"), T("seo", "SEO keywords", { ph: "Comma separated" }), T("prior", "Previous content to reference")] }
  ] },
  { id: "case", label: "Case Study", desc: "Client success stories", accent: "#5E6B4F", steps: [
    { title: "Client & scope", fields: [A("profile", "Client profile", { req: 1, help: "Industry, size, systems in place, monthly transaction volume" }), T("began", "When the relationship began", { req: 1 }), O("approved", "Client has approved being named", ["Yes", "No", "Anonymous only"], { req: 1 })] },
    { title: "The story", fields: [A("problem", "The problem they came with", { req: 1 }), A("solution", "What we did", { req: 1 }), A("results", "Results", { req: 1, help: "Only the numbers you will let us print" }), O("quote", "Testimonial", ["Have one", "Need to request", "No"], { req: 1 })] },
    { title: "Approvals", fields: [T("approvers", "Approvers", { req: 1 }), D("deadline", "Hard deadline")] }
  ] },
  { id: "landing", label: "Landing Page", desc: "Web pages and microsites", accent: "#14624A", steps: [
    { title: "Purpose & goals", fields: [T("audience", "Target audience", { req: 1, ph: "Who is this page for?" }), O("goal", "Goal of this page", ["Leads", "Informational", "Cross-site promotion"], { req: 1 }), O("conversion", "Primary conversion action", ["Sign-up form", "Read more", "Download", "Contact"], { req: 1 }), D("goLive", "Target go-live", { req: 1 })] },
    { title: "Build", fields: [O("design", "Design", ["Use a template", "Custom"], { req: 1 }), T("precedent", "An existing page it should resemble", { when: a => a.design === "Custom", req: 1, help: "Custom pages are one-offs. We build very few." }), M("findable", "How people reach it", ["Search", "Main nav", "An existing hub page", "Link only"], { req: 1 })] },
    { title: "The form", when: a => a.conversion === "Sign-up form" || a.conversion === "Contact", fields: [M("capture", "Fields to capture", ["Name", "Work email", "Company", "Phone", "Monthly volume", "Consent"], { req: 1 }), T("recipient", "Who receives the fills", { req: 1 })] }
  ] },
  { id: "creative", label: "Creative", desc: "Design and visual assets", accent: "#A8873C", steps: [
    { title: "The asset", fields: [O("kind", "Asset type", ["Static image", "Carousel", "Animation", "Print"], { req: 1 }), M("sizes", "Sizes needed", ["1080×1080 feed", "1080×1920 story", "1200×628 link card", "1600×900 web hero", "8.5×11 print"], { req: 1, help: "Pick every size. We build to spec, not to guess." })] },
    { title: "Content", fields: [A("copyInGraphic", "Copy that appears on the asset", { req: 1, help: "Whatever you type here is what gets set in type" }), T("cta", "Call to action"), T("approver", "Approver", { req: 1 })] },
    { title: "Print", when: a => a.kind === "Print", fields: [T("quantity", "Quantity", { req: 1 }), D("inHand", "In-hand date", { req: 1, help: "When it must be at its destination, not when it ships" }), T("shipTo", "Ship to", { req: 1 })] }
  ] },
  { id: "email", label: "Email", desc: "Campaign and marketing email", accent: "#7A2E33", steps: [
    { title: "Campaign", fields: [O("campaign", "Campaign", ["Close Faster", "Spend Visibility", "Audit Ready", "Payments Modernization", "None"], { req: 1 }), T("segment", "Audience segment", { req: 1, help: "Or paste a link to the audience list" }), D("goLive", "Send date", { req: 1 })] },
    { title: "Build", fields: [O("templated", "Build", ["Use a template", "Custom build"], { req: 1 }), O("template", "Template", ["Announcement", "Two-column digest", "Single-CTA plain", "Event invite"], { when: a => a.templated === "Use a template", req: 1 }), T("subject", "Subject line", { req: 1 }), T("preheader", "Preheader")] },
    { title: "Content", fields: [A("body", "Email copy", { req: 1 }), T("cta", "Call to action", { req: 1 }), O("needsGraphic", "Needs a graphic", ["Yes", "No"], { req: 1, help: "Yes routes a sized request to Design automatically" }), T("approver", "Approver", { req: 1 })] }
  ] },
  { id: "webinar", label: "Webinar", desc: "Live sessions and replays", accent: "#2F5D7C", steps: [
    { title: "The session", fields: [T("topic", "Session title", { req: 1 }), T("speakers", "Speakers", { req: 1, help: "Internal, external, or both" }), D("airs", "Date it airs", { req: 1 }), O("reg", "Registration", ["Gated form", "Open link"], { req: 1 })] },
    { title: "Promotion", fields: [M("promo", "Promote through", ["Email", "Social", "Landing page", "Sales outreach"], { req: 1 }), A("abstract", "Abstract", { req: 1, help: "Two or three sentences, as you would say it out loud" }), O("replay", "After it airs", ["Post the replay", "Gate the replay", "Nothing"], { req: 1 })] },
    { title: "Replay", when: a => a.replay === "Post the replay" || a.replay === "Gate the replay", fields: [T("replayHome", "Where the replay lives", { req: 1 }), O("cutdowns", "Cut-downs for social", ["Yes", "No"], { req: 1 })] }
  ] },
  { id: "enable", label: "Sales Enablement", desc: "One-pagers and battlecards", accent: "#6E4A6B", steps: [
    { title: "The piece", fields: [O("kind", "Format", ["One-pager", "Battlecard", "Objection guide", "Deck section"], { req: 1 }), T("whoUses", "Who uses it", { req: 1, help: "And at which point in the conversation" }), A("claim", "The claim it has to support", { req: 1 })] },
    { title: "Proof", fields: [A("proof", "Proof we are allowed to print", { req: 1, help: "Named customers need approval. Say if you have it." }), O("cleared", "Legal has cleared the numbers", ["Yes", "Not yet"], { req: 1 }), T("clearedBy", "Who is clearing them", { when: a => a.cleared === "Not yet", req: 1 }), T("approver", "Approver", { req: 1 })] }
  ] },
  { id: "social", label: "Social", desc: "Social posts and graphics", accent: "#1E8A62", steps: [
    { title: "The post", fields: [M("platforms", "Platforms", ["LinkedIn", "Instagram", "X", "YouTube"], { req: 1 }), O("format", "Format", ["Still graphic", "Carousel", "Video", "Animation"], { req: 1, help: "Still: one stat or one line. Carousel: several grouped points. Video: a concept that needs explaining." })] },
    { title: "Copy", fields: [A("copyInGraphic", "Copy that appears on the graphic", { req: 1, help: "Whatever you type here is what gets set in type" }), A("caption", "Caption", { req: 1 }), T("ctaUrl", "Call-to-action URL", { req: 1 })] },
    { title: "Assets", fields: [O("needsGraphic", "The graphic", ["Design builds it", "I have the file"], { req: 1 }), M("sizes", "Sizes", ["1080×1080 feed", "1080×1920 story", "1200×628 link card"], { when: a => a.needsGraphic === "Design builds it", req: 1 }), D("goLive", "Go-live date", { req: 1 })] }
  ] },
  { id: "video", label: "Video", desc: "Video content and clips", accent: "#3C4A57", steps: [
    { title: "The cut", fields: [T("fileLink", "Link to the file", { req: 1 }), T("title", "Title", { req: 1 }), O("embed", "Embed on the site", ["Yes", "No"], { req: 1 }), T("page", "Which page", { when: a => a.embed === "Yes", req: 1 }), O("gated", "Gated", ["Yes", "No"], { req: 1 })] },
    { title: "Snippets", fields: [O("snippets", "Short cuts for social", ["Yes", "No"], { req: 1 }), A("snippetSpecs", "Snippet notes", { when: a => a.snippets === "Yes", help: "9:16, thirty seconds or less" }), O("thumb", "Thumbnail", ["Design builds it", "Use the title card"], { req: 1 })] }
  ] }
];

const IX_DIMS = {
  "1080×1080 feed": [1080, 1080, "px", "Feed"],
  "1080×1920 story": [1080, 1920, "px", "Story"],
  "1200×628 link card": [1200, 628, "px", "Link card"],
  "1600×900 web hero": [1600, 900, "px", "Web hero"],
  "8.5×11 print": [8.5, 11, "in", "Print"]
};

const byId = id => IX_TYPES.find(t => t.id === id);

const DEMO_SEL = ["creative", "email", "social"];
const DEMO_META = { who: "Priya Raman, Growth Marketing", camp: "Close Faster, Q3" };
const DEMO_LINE = "You cannot automate a judgment nobody has written down.";
const DEMO = {
  social: { platforms: ["LinkedIn", "Instagram"], format: "Still graphic", copyInGraphic: DEMO_LINE,
    caption: "Most teams automate the matching. The matching was never the problem. Five questions before you automate anything in the close.",
    ctaUrl: "dollarous.example/close-faster/calculator", needsGraphic: "Design builds it",
    sizes: ["1080×1080 feed", "1080×1920 story"], goLive: "2026-09-29" },
  creative: { kind: "Static image", sizes: ["1080×1080 feed", "1080×1920 story", "1200×628 link card"],
    copyInGraphic: DEMO_LINE, cta: "Price your own close", approver: "Marisol Ferreira" },
  email: { campaign: "Close Faster", segment: "Mid-market controllers, 200–800 invoices a month", goLive: "2026-10-01",
    templated: "Use a template", template: "Single-CTA plain", subject: "Your close is not slow. Your exceptions are.",
    preheader: "Three sentences and a calculator.",
    body: "Three sentences, then the calculator link. Same message as the blog, not the blog intro.",
    cta: "Price your own close", needsGraphic: "Yes", approver: "Marisol Ferreira" }
};
const wait = ms => new Promise(r => setTimeout(r, ms));
const liveSteps = (t, ans) => t.steps.filter(s => !s.when || s.when(ans));
const liveFields = (s, ans) => s.fields.filter(f => !f.when || f.when(ans));
const filled = (f, ans) => { const v = ans[f.id]; return f.type === "many" ? Array.isArray(v) && v.length > 0 : !!(v && String(v).trim()); };

function Field({ f, val, onChange, flash, tap }) {
  const lab = React.createElement("span", { className: "lab" }, f.label, f.req ? React.createElement("span", { className: "req" }, "*") : null);
  const help = f.help ? React.createElement("span", { className: "help" }, f.help) : null;
  let ctl;
  if (f.type === "one" || f.type === "many") {
    const arr = f.type === "many" ? (val || []) : null;
    ctl = React.createElement("div", { className: "ix-opts" }, f.opts.map(o => {
      const on = f.type === "many" ? arr.includes(o) : val === o;
      return React.createElement("button", { key: o, type: "button", className: "ix-opt" + (on ? " on" : "") + (tap === o ? " tap" : ""), "aria-pressed": on,
        onClick: () => onChange(f.id, f.type === "many" ? (on ? arr.filter(x => x !== o) : arr.concat([o])) : o) }, o);
    }));
  } else if (f.type === "area") {
    ctl = React.createElement("textarea", { className: "ix-in", value: val || "", placeholder: f.ph || "", onChange: e => onChange(f.id, e.target.value) });
  } else {
    ctl = React.createElement("input", { className: "ix-in", type: f.type === "date" ? "date" : "text", value: val || "", placeholder: f.ph || "", onChange: e => onChange(f.id, e.target.value) });
  }
  return React.createElement("div", { className: "ix-f" + (flash ? " fill" : "") }, lab, help, ctl);
}

function TypePicker({ sel, setSel, onBegin, onDemo, demo, tap, press }) {
  const tip = !demo && sel.length > 0 && sel.length < 3;
  return React.createElement("div", { className: "ix-card" },
    React.createElement("h2", { className: "ix-h" }, "What do you need?"),
    React.createElement("p", { className: "ix-sub" }, "Pick every piece this campaign requires. You only answer the questions your picks create."),
    React.createElement("div", { className: "ix-tiles" }, IX_TYPES.map(t => {
      const on = sel.includes(t.id);
      return React.createElement("button", { key: t.id, type: "button", className: "ix-tile" + (on ? " on" : "") + (tap && tap.tile === t.id ? " tap" : ""), style: { "--tc": t.accent }, "aria-pressed": on, disabled: !!demo,
        onClick: () => setSel(on ? sel.filter(x => x !== t.id) : sel.concat([t.id])) },
        React.createElement("span", { className: "chk" }, React.createElement(Check, null)),
        React.createElement("span", { className: "ico" }, React.createElement(IxIcon, { k: t.id })),
        React.createElement("span", { className: "tt" }, t.label),
        React.createElement("span", { className: "td" }, t.desc));
    })),
    tip ? React.createElement("div", { className: "ix-tip", role: "status" },
      React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", "aria-hidden": "true" }, React.createElement("path", { d: "M12 16v-4M12 8h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" })),
      React.createElement("span", null, React.createElement("b", null, "Add 3–5 content needs."), " Campaigns that ship on time usually move a single message across a few formats at once.")) : null,
    React.createElement("div", { className: "ix-chips" }, sel.length === 0
      ? React.createElement("span", { className: "ix-chips-empty" }, "Nothing selected yet.")
      : sel.map(id => { const t = byId(id); return React.createElement("span", { key: id, className: "ix-chip", style: { "--tc": t.accent } }, t.label,
          React.createElement("button", { type: "button", "aria-label": "Remove " + t.label, onClick: () => setSel(sel.filter(x => x !== id)) }, "×")); })),
    React.createElement("div", { className: "ix-nav" },
      demo ? null : React.createElement("button", { type: "button", className: "ix-btn demo", onClick: onDemo }, "Fill out an example"),
      React.createElement("button", { type: "button", className: "ix-btn go" + (press === "go" ? " press" : ""), disabled: demo || sel.length === 0, onClick: onBegin },
        sel.length === 0 ? "Select at least one" : "Begin " + sel.length + (sel.length === 1 ? " request" : " requests") + " →"))
  );
}

function StepScreen({ t, tIdx, total, step, sIdx, sTotal, ans, setAns, onBack, onNext, onChangeTypes, nextLabel, demo, flash, tap, press }) {
  const fields = liveFields(step, ans);
  const missing = fields.some(f => f.req && !filled(f, ans));
  const set = (id, v) => setAns(Object.assign({}, ans, { [id]: v }));
  return React.createElement("div", { className: "ix-card", style: { "--ix-accent": t.accent } },
    React.createElement("div", { className: "ix-top" },
      React.createElement("span", { className: "ix-pill" }, "Request ", tIdx + 1, " of ", total),
      React.createElement("span", { className: "ix-pill type" }, React.createElement(IxIcon, { k: t.id }), t.label),
      React.createElement("span", { className: "ix-step-n" }, "Step ", sIdx + 1, " of ", sTotal, step.optional ? " · optional" : ""),
      demo ? null : React.createElement("button", { type: "button", className: "ix-change", onClick: onChangeTypes }, "Change types")),
    React.createElement("div", { className: "ix-prog" }, Array.from({ length: sTotal }, (_, i) =>
      React.createElement("i", { key: i, className: i < sIdx ? "done" : i === sIdx ? "now" : "" }))),
    React.createElement("h2", { className: "ix-h" }, step.title),
    React.createElement("div", { className: "ix-fields" }, fields.map(f => {
      const el = React.createElement(Field, { key: f.id, f, val: ans[f.id], onChange: set, flash: flash === f.id, tap: tap && tap.f === f.id ? tap.v : null });
      return f.when ? React.createElement("div", { key: f.id + "-b", className: "ix-branch" }, React.createElement("span", { className: "ix-branch-tag" }, "Because you chose that"), el) : el;
    })),
    React.createElement("div", { className: "ix-nav" },
      React.createElement("button", { type: "button", className: "ix-btn", onClick: onBack, disabled: !!demo }, "← Back"),
      React.createElement("button", { type: "button", className: "ix-btn go" + (press === "next" ? " press" : ""), disabled: !!demo || missing, onClick: onNext },
        demo ? nextLabel : (missing ? "Fill the required fields" : nextLabel)))
  );
}

/* ---------- output sheets ---------- */
const dash = "—";
const pxList = sizes => {
  const a = (sizes || []).map(s => { const d = IX_DIMS[s]; return d ? d[0] + " × " + d[1] + " " + d[2] : s; });
  if (!a.length) return dash;
  return a.length === 1 ? a[0] : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
};
const v = x => (Array.isArray(x) ? (x.length ? x.join(", ") : dash) : (x && String(x).trim() ? x : dash));
const Row = ({ k, val, mono }) => React.createElement("div", { className: "rq-row" },
  React.createElement("span", { className: "k" }, k), React.createElement("span", { className: "v" + (mono ? " mono" : "") }, val));

function SizeRow({ sizes }) {
  const list = (sizes || []).map(s => [s].concat(IX_DIMS[s] || [1, 1, "px", s]));
  const cap = 54;
  return React.createElement("div", { className: "rq-sizes" }, list.map(([key, w, h, unit, name]) => {
    const k = cap / Math.max(w, h);
    return React.createElement("div", { key, className: "rq-size" },
      React.createElement("span", { className: "bx", style: { width: Math.round(w * k) + "px", height: Math.round(h * k) + "px" } }),
      React.createElement("span", { className: "d" }, w + "×" + h + " " + unit),
      React.createElement("span", { className: "n", title: name }, name));
  }));
}

const WarnIcon = () => React.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
  React.createElement("path", { d: "M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" }),
  React.createElement("path", { d: "M12 9v4M12 17h.01" }));

function Sheet({ t, ans, all, idx }) {
  const id = "DLR-" + String(2140 + idx * 3);
  const owner = { social: "Social", creative: "Design", email: "Email", blog: "Editorial", case: "Editorial", landing: "Web", video: "Video", webinar: "Events", enable: "Product Marketing" }[t.id];
  const rows = [];
  let dep = null, extra = null;

  if (t.id === "social") {
    rows.push(["Platforms", v(ans.platforms)], ["Format", v(ans.format)], ["Copy on the graphic", v(ans.copyInGraphic)], ["Caption", v(ans.caption)], ["Link", v(ans.ctaUrl)], ["Go-live", v(ans.goLive)]);
    if (ans.needsGraphic === "Design builds it") {
      const cr = all.find(x => x.t.id === "creative");
      dep = { k: "Dependencies", v: "Design delivers " + pxList(ans.sizes) + (cr ? ". Tracked on the Design sheet." : ". No Design request was raised, so this one is waiting on nothing.") };
    }
  } else if (t.id === "creative") {
    rows.push(["Asset type", v(ans.kind)], ["Copy to set", v(ans.copyInGraphic)], ["Call to action", v(ans.cta)], ["Approver", v(ans.approver)]);
    if (ans.kind === "Print") rows.push(["Quantity", v(ans.quantity)], ["In hand", v(ans.inHand)], ["Ship to", v(ans.shipTo)]);
    extra = React.createElement("div", { className: "rq-row" },
      React.createElement("span", { className: "k" }, "Build at these sizes"),
      React.createElement(SizeRow, { sizes: ans.sizes }));
    const so = all.find(x => x.t.id === "social");
    const em = all.find(x => x.t.id === "email");
    const from = [so && so.ans.needsGraphic === "Design builds it" ? "Social" : null, em && em.ans.needsGraphic === "Yes" ? "Email" : null].filter(Boolean);
    if (from.length) dep = { k: "Dependencies", v: from.join(" and ") + " are waiting on this file before either can schedule." };
  } else if (t.id === "email") {
    rows.push(["Campaign", v(ans.campaign)], ["Segment", v(ans.segment)], ["Send date", v(ans.goLive)], ["Subject", v(ans.subject)], ["Call to action", v(ans.cta)]);
    extra = React.createElement("div", { className: "rq-row" },
      React.createElement("span", { className: "k" }, ans.templated === "Use a template" ? "Template · " + v(ans.template) : "Custom build"),
      React.createElement("div", { className: "rq-mail" },
        React.createElement("div", { className: "mh" }, React.createElement("span", null, "DOLLAROUS")),
        React.createElement("div", { className: "hero" }, React.createElement("em", null, ans.needsGraphic === "Yes" ? "1200×628 from Design" : "no hero image")),
        React.createElement("div", { className: "mb" },
          React.createElement("span", { className: "t" }, v(ans.subject)),
          React.createElement("i", null), React.createElement("i", null), React.createElement("i", { className: "s" }),
          React.createElement("span", { className: "cta" }, (v(ans.cta) || "").slice(0, 22))),
        React.createElement("div", { className: "mf" }, React.createElement("i", null), React.createElement("i", null))));
    if (ans.needsGraphic === "Yes") dep = { k: "Dependencies", v: "Design delivers a 1200 × 628 px header. Raised automatically when you answered yes." };
  } else {
    liveSteps(t, ans).forEach(s => liveFields(s, ans).forEach(f => rows.push([f.label, v(ans[f.id])])));
  }

  return React.createElement("div", { className: "rq", style: { "--rc": t.accent } },
    React.createElement("div", { className: "rq-head" },
      React.createElement("span", { className: "to" }, "To " + owner),
      React.createElement("span", { className: "ti" }, t.label + " request"),
      React.createElement("span", { className: "id" }, id)),
    React.createElement("div", { className: "rq-body" },
      rows.slice(0, 7).map(([k, val]) => React.createElement(Row, { key: k, k, val })), extra),
    dep ? React.createElement("div", { className: "rq-dep" },
      React.createElement("span", { className: "k" }, React.createElement(WarnIcon, null), dep.k), React.createElement("div", { className: "v" }, dep.v)) : null,
    React.createElement("div", { className: "rq-foot" },
      React.createElement("span", null, rows.length + " fields · 1 page"),
      React.createElement("span", null, ans.approver ? "Approver: " + ans.approver : "Requested by Growth Marketing"))
  );
}

function Results({ sel, answers, onRestart, onEdit }) {
  const all = sel.map(id => ({ t: byId(id), ans: answers[id] || {} }));
  const total = all.reduce((n, x) => n + liveSteps(x.t, x.ans).reduce((m, s) => m + liveFields(s, x.ans).length, 0), 0);
  return React.createElement("div", { className: "ix-out" },
    React.createElement("div", { className: "ix-out-h" },
      React.createElement("h3", null, "Submitted. " + all.length + (all.length === 1 ? " sheet" : " sheets") + " went out."),
      React.createElement("p", null, "Each resource receives only the fields that belong to them, with dependencies named. Nobody reads a section that is not theirs.")),
    React.createElement("div", { className: "rq-grid" }, all.map((x, i) => React.createElement(Sheet, { key: x.t.id, t: x.t, ans: x.ans, all, idx: i }))),
    React.createElement("div", { className: "ix-restart" },
      React.createElement("button", { type: "button", className: "ix-btn", onClick: onEdit }, "← Edit the request"),
      React.createElement("button", { type: "button", className: "ix-btn", onClick: onRestart }, "Start over"),
      React.createElement("p", null, "You answered " + total + " fields. The old document asked for 214."))
  );
}

function IntakeApp() {
  const [phase, setPhase] = React.useState("start");
  const [sel, setSel] = React.useState(["social", "creative", "email"]);
  const [answers, setAnswers] = React.useState({});
  const [pos, setPos] = React.useState([0, 0]);
  const [meta, setMeta] = React.useState({ who: "", camp: "" });
  const [demo, setDemo] = React.useState(false);
  const [flash, setFlash] = React.useState(null);
  const [tap, setTap] = React.useState(null);
  const [press, setPress] = React.useState(null);
  const stop = React.useRef(false);

  React.useEffect(() => () => { stop.current = true; }, []);

  const finishDemo = () => {
    stop.current = true;
    setDemo(false); setFlash(null); setTap(null); setPress(null);
    setSel(DEMO_SEL); setMeta(DEMO_META);
    setAnswers(Object.assign({}, DEMO));
    setPhase("done");
  };

  /* the walkthrough. Every simulated click is announced before it lands, since
     there is no cursor on screen to explain what just happened. */
  const clickPause = async () => { await wait(520); if (stop.current) return; setPress("next"); await wait(340); setPress(null); await wait(120); };

  const runDemo = async () => {
    stop.current = false;
    setDemo(true); setFlash(null); setTap(null); setPress(null);
    setAnswers({}); setSel([]); setMeta(DEMO_META);
    setPhase("pick"); await wait(820);
    if (stop.current) return;

    /* tick the content types one at a time, so the branching is seen happening */
    const picked = [];
    for (const id of DEMO_SEL) {
      if (stop.current) return;
      setTap({ tile: id }); await wait(300);
      picked.push(id); setSel(picked.slice()); setTap(null);
      await wait(420);
    }
    await wait(520);
    if (stop.current) return;
    setPress("go"); await wait(360); setPress(null);
    setPos([0, 0]); setPhase("run"); await wait(520);

    for (let ti = 0; ti < DEMO_SEL.length; ti++) {
      const t = byId(DEMO_SEL[ti]);
      const data = DEMO[t.id];
      let acc = {};
      for (let si = 0; si < 12; si++) {
        const steps2 = liveSteps(t, acc);
        if (si >= steps2.length) break;
        if (stop.current) return;
        setPos([ti, si]);
        await wait(560);
        // re-derive the field list after every answer: a branch field can be
        // revealed by a sibling answered moments earlier in the same step
        const seen = new Set();
        for (let pass = 0; pass < 8; pass++) {
          const fs = liveFields(steps2[si], acc).filter(f => !seen.has(f.id) && data[f.id] !== undefined);
          if (!fs.length) break;
          for (const f of fs) {
            if (stop.current) return;
            seen.add(f.id);
            const target = data[f.id];
            setFlash(f.id);
            if (f.type === "one" || f.type === "many") {
              // press each choice in turn, with a ripple where the tap lands
              const vals = Array.isArray(target) ? target : [target];
              let held = f.type === "many" ? [] : null;
              for (const val of vals) {
                if (stop.current) return;
                setTap({ f: f.id, v: val });
                await wait(300);
                if (f.type === "many") { held = held.concat([val]); acc = Object.assign({}, acc, { [f.id]: held.slice() }); }
                else acc = Object.assign({}, acc, { [f.id]: val });
                setAnswers(prev => Object.assign({}, prev, { [t.id]: acc }));
                setTap(null);
                await wait(240);
              }
              await wait(180);
              continue;
            }
            if (typeof target === "string" && (f.type === "text" || f.type === "area")) {
              // type it in, so the viewer sees words being written rather than pasted
              const chunk = target.length > 70 ? 3 : 2;
              for (let c = chunk; c < target.length; c += chunk) {
                if (stop.current) return;
                const part = target.slice(0, c);
                acc = Object.assign({}, acc, { [f.id]: part });
                setAnswers(prev => Object.assign({}, prev, { [t.id]: acc }));
                await wait(30);
              }
            }
            acc = Object.assign({}, acc, { [f.id]: target });
            setAnswers(prev => Object.assign({}, prev, { [t.id]: acc }));
            await wait(typeof target === "string" && f.type !== "date" ? 240 : 300);
          }
        }
        setFlash(null);
        await clickPause();
      }
    }
    if (stop.current) return;
    setDemo(false); setFlash(null); setTap(null); setPress(null);
    setPhase("done");
  };

  const cur = sel[pos[0]] ? byId(sel[pos[0]]) : null;
  const ans = (cur && answers[cur.id]) || {};
  const steps = cur ? liveSteps(cur, ans) : [];
  const step = steps[pos[1]];

  const setAns = next => setAnswers(Object.assign({}, answers, { [cur.id]: next }));

  const advance = () => {
    if (pos[1] + 1 < steps.length) return setPos([pos[0], pos[1] + 1]);
    if (pos[0] + 1 < sel.length) return setPos([pos[0] + 1, 0]);
    setPhase("done");
  };
  const retreat = () => {
    if (pos[1] > 0) return setPos([pos[0], pos[1] - 1]);
    if (pos[0] > 0) { const p = byId(sel[pos[0] - 1]); return setPos([pos[0] - 1, liveSteps(p, answers[p.id] || {}).length - 1]); }
    setPhase("pick");
  };

  let body;
  if (phase === "start") {
    body = React.createElement("div", { className: "ix-card" },
      React.createElement("div", { className: "ix-start" },
        React.createElement("h2", { className: "ix-h" }, "Content request"),
        React.createElement("p", { className: "ix-sub", style: { margin: 0 } }, "Two lines to start. The form asks for the rest only if your answers call for it."),
        React.createElement(Field, { f: T("who", "Your name and team", { ph: "Priya Raman, Field Marketing" }), val: meta.who, onChange: (i, val) => setMeta({ who: val, camp: meta.camp }) }),
        React.createElement(Field, { f: T("camp", "Campaign or project", { ph: "Close Faster, Q3" }), val: meta.camp, onChange: (i, val) => setMeta({ who: meta.who, camp: val }) }),
        React.createElement("div", { className: "ix-nav" },
          React.createElement("button", { type: "button", className: "ix-btn demo", onClick: runDemo }, "Fill out an example"),
          React.createElement("button", { type: "button", className: "ix-btn go", onClick: () => setPhase("pick") }, "Get started →"))));
  } else if (phase === "pick") {
    body = React.createElement(TypePicker, { key: "pick", sel, setSel, onDemo: runDemo, onBegin: () => { setPos([0, 0]); setPhase("run"); }, demo, tap, press });
  } else if (phase === "run" && step) {
    const isLastStep = pos[1] + 1 >= steps.length;
    const isLastType = pos[0] + 1 >= sel.length;
    const nextLabel = !isLastStep ? "Continue →" : isLastType ? "Submit request →" : "Next: " + byId(sel[pos[0] + 1]).label + " →";
    body = React.createElement(StepScreen, { key: "s" + pos[0] + "-" + pos[1], t: cur, tIdx: pos[0], total: sel.length, step, sIdx: pos[1], sTotal: steps.length, ans, setAns, onBack: retreat, onNext: advance, onChangeTypes: () => setPhase("pick"), nextLabel, demo, flash, tap, press });
  } else if (phase === "done") {
    body = React.createElement(Results, { sel, answers, onRestart: () => { setAnswers({}); setPos([0, 0]); setPhase("start"); }, onEdit: () => { setPos([0, 0]); setPhase("run"); } });
  } else {
    body = React.createElement("div", { className: "ix-card" });
  }

  return React.createElement("div", { className: "ix dlr" },
    demo ? React.createElement("div", { className: "ix-demobar", role: "status" },
      React.createElement("i", { className: "dot" }),
      React.createElement("span", null, "Filling out the example. Every answer is kept exactly as typed."),
      React.createElement("button", { type: "button", className: "sk", onClick: finishDemo }, "Skip to the end →")) : null,
    React.createElement("div", { className: "ix-stage" }, body));
}

const ixRoot = document.getElementById("intake-app");
if (ixRoot) ReactDOM.createRoot(ixRoot).render(React.createElement(IntakeApp));
