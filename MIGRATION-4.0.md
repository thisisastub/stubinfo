# 4.0 preserve list

Read before laying down the next Claude Design export. Everything below exists in the
live 3.0 site but **not** in a Design handoff bundle, so an export will either
overwrite it or a "start clean" sweep will delete it.

Baseline: `3c08a99` — the commit that imported the September 2026 handoff.
Six commits of production work sit on top of it.

---

## 1. Never delete — git cannot restore these

These are in `.gitignore`. They exist only on this disk. No commit holds them.

| Path | Files | What it is |
|---|---|---|
| `masterclass/` | 31 | The hidden platform — compiled apps, lesson data, media |
| `project/` | 154 | The Claude Design project mirror |
| `remotion/` | 16,510 | The video subproject |
| `revised handoff 2026-09/` | 186 | Last export — the diff anchor for the next one |
| `revised handoff 2026-08/` | 85 | Prior export |
| `revised handoff/` | 40 | First export |
| `CLAUDE.md`, `.claude/`, `.agents/` | — | Project instructions and settings |

Back these up before anything else. **`masterclass/` is the one that would actually hurt.**

## 2. Re-apply after the export lands

Six commits, saved as `production-delta-3.0.patch` (18 hunks) in case the files get replaced wholesale.

| Fix | Commit | Files |
|---|---|---|
| Continue un-greyed before the walkthrough clicks it; QR added | `0efe0bc` | `innovations/boothtok.{css,html}`, `innovations/src/intake-app.jsx`, `innovations/js/intake-app.js` |
| QR enlarged so a phone camera can resolve it | `9f7963e` | `innovations/boothtok.css` |
| Full screen on first tap when opened from the QR | `0a252c2` | `innovations/boothtok/booth.{css,js}` |
| Brand logos white on ink — no card, no separator | `852c804` | `index.html`, `patterns.css` |
| White logos rebuilt without edge artifacts | `b26bfe0` | `assets/brands/*-white.webp` |
| Brand logos as vector from official artwork | `5218fcd` | `assets/brands/*-white.svg`, `index.html` |

Net files to re-check: `index.html` · `patterns.css` · `innovations/boothtok.css` ·
`innovations/boothtok.html` · `innovations/boothtok/booth.{css,js}` ·
`innovations/src/intake-app.jsx` · `innovations/js/intake-app.js` · `assets/brands/*-white.svg`

## 3. Structural things the export will undo

- **Precompiled JSX.** `innovations/src/*.jsx` → `innovations/js/*.js` is real here. The
  bundle still ships browser-Babel JSX at the innovations root. Don't let it back in.
- **Deployment plumbing.** `CNAME`, `.nojekyll`, `serve.json`, `.gitignore`, `uploads/`.
  None are in a bundle.
- **`main` is live.** Pages serves tracked files from `main` at root. Port on a branch.

## 4. Sign-off

- [ ] `masterclass/`, `project/`, `remotion/` and all three handoff folders intact
- [ ] All six fixes in section 2 present, verified in a browser not just in the diff
- [ ] BoothTok QR scans from ~18in; first tap goes full screen
- [ ] Content Intake walkthrough: Continue enabled when the tap indicator reaches it
- [ ] Brand logos: white on ink, vector, no edge artifacts, no card, no separator
- [ ] No Babel standalone; `innovations/js/` still compiled from `src/`
- [ ] Both themes render; pre-paint theme script intact
- [ ] `CNAME` and `.nojekyll` still at root

## 5. Carried over from the 3.0 checklist, still open

- `<image-slot>` is still live — 4 instances in `index.html`, shipping the 65KB `image-slot.js`
- `index.html` pulls React `.development.js` builds from unpkg
