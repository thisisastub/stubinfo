/* Behaviour reference for cost-calculator.html.
   DCLogic is a React-class-style base (state, setState, lifecycle). renderVals() returns the values bound to
   {{ name }} holes and data-dc-* attributes in the HTML. Port this into your own vanilla JS or React. */
class Component extends DCLogic {
  componentDidMount() {
    // visitors who ask for reduced motion get the hero video paused from the start
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { this.setState({ bgPaused: true }); const hv = document.querySelector('video[data-hero-bg]'); if (hv) hv.pause(); }
    this.ros = [];
    document.querySelectorAll('iframe[data-autoh]').forEach(f => {
      const fit = () => { try { const d = f.contentDocument; if (!d || !d.body) return; const h = Math.ceil(d.body.getBoundingClientRect().height); if (h > 50) { f._h = h + 'px'; if (!f.dataset.fs) f.style.height = f._h; } } catch (e) {} };
      const hook = () => { fit(); try { const ro = new ResizeObserver(fit); ro.observe(f.contentDocument.body); this.ros.push(ro); } catch (e) {} };
      if (f.contentDocument && f.contentDocument.readyState === 'complete' && f.contentDocument.body && f.contentDocument.body.childElementCount) hook();
      f.addEventListener('load', hook);
    });

    const frames = [...document.querySelectorAll('iframe[data-autoh]')];
    const setFs = (f, on, native) => {
      f.dataset.fs = on ? '1' : '';
      if (!native) Object.assign(f.style, on ? { position: 'fixed', inset: '0', width: '100vw', height: '100vh', zIndex: '1000', boxShadow: 'none' } : { position: '', inset: '', width: '100%', zIndex: '', boxShadow: '' });
      if (!on && f._h) f.style.height = f._h;
      document.body.style.overflow = on && !native ? 'hidden' : '';
      try { f.contentWindow.postMessage({ dlrFsState: on }, '*'); } catch (e) {}
    };
    this.onFsMsg = (e) => {
      if (!e.data || typeof e.data.dlrFs !== 'boolean') return;
      const f = frames.find(x => x.contentWindow === e.source); if (!f) return;
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (!e.data.dlrFs) { if (fsEl === f) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else setFs(f, false, false); return; }
      const req = f.requestFullscreen || f.webkitRequestFullscreen;
      const fallback = () => setFs(f, true, false);
      if (!req) return fallback();
      try { const r = req.call(f); if (r && r.then) r.then(() => setFs(f, true, true), fallback); else setFs(f, true, true); } catch (err) { fallback(); }
    };
    this.onFsChange = () => { const el = document.fullscreenElement || document.webkitFullscreenElement; frames.forEach(f => { if (f.dataset.fs && el !== f && f.style.position !== 'fixed') setFs(f, false, true); }); };
    this.onFsKey = (e) => { if (e.key === 'Escape') frames.forEach(f => { if (f.style.position === 'fixed') setFs(f, false, false); }); };
    window.addEventListener('message', this.onFsMsg);
    document.addEventListener('fullscreenchange', this.onFsChange);
    document.addEventListener('webkitfullscreenchange', this.onFsChange);
    window.addEventListener('keydown', this.onFsKey);
    const box = document.querySelector('[data-bt-screen]');
    if (box) {
      const mini = box.querySelector('iframe');
      const scale = () => { mini.style.transform = 'scale(' + (box.clientWidth / 180) + ')'; };
      scale(); const ro = new ResizeObserver(scale); ro.observe(box); this.ros.push(ro);
      const tell = () => { try { mini.contentWindow.postMessage({ mini: 'play' }, '*'); } catch (e) {} };
      this.onMsg = (e) => { if (e.data && e.data.mini === 'ready') tell(); };
      window.addEventListener('message', this.onMsg); mini.addEventListener('load', tell);
    }
  }
  componentWillUnmount() { window.removeEventListener('message', this.onFsMsg); document.removeEventListener('fullscreenchange', this.onFsChange); document.removeEventListener('webkitfullscreenchange', this.onFsChange); window.removeEventListener('keydown', this.onFsKey); (this.ros || []).forEach(r => r.disconnect()); this.onMsg && window.removeEventListener('message', this.onMsg); }
  renderVals() {
    return {
      bgPaused: !!(this.state && this.state.bgPaused), bgPlaying: !(this.state && this.state.bgPaused), bgPressed: (this.state && this.state.bgPaused) ? 'true' : 'false', bgLabel: (this.state && this.state.bgPaused) ? 'Play background video' : 'Pause background video',
      toggleBg: () => { const p = !(this.state && this.state.bgPaused); this.setState({ bgPaused: p }); const hv = document.querySelector('video[data-hero-bg]'); if (hv) { if (p) hv.pause(); else { const r = hv.play(); if (r && r.catch) r.catch(() => {}); } } },
      fullPhone: () => { const p = document.querySelector('[data-bt-phone]'); if (!p) return; const req = p.requestFullscreen || p.webkitRequestFullscreen; if (req) { const r = req.call(p); if (r && r.catch) r.catch(() => window.open('/innovations/boothtok/app.html', '_blank', 'noopener')); } else window.open('/innovations/boothtok/app.html', '_blank', 'noopener'); }
    };
  }
}
