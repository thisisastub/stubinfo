/* dc-runtime.js — runs the Claude Design page logic (js/<page>.js) against the page markup.
   The page HTML is the template: {{ name }} holes and data-dc-* attributes are bound to the
   values returned by the logic class's renderVals(). Plain JS, React 18 UMD, no build step. */
(function () {
  'use strict';
  var R = window.React, RD = window.ReactDOM, E = R.createElement;

  /* ---------- attribute name + value handling ---------- */
  var NAMES = { 'class': 'className', 'for': 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly',
    maxlength: 'maxLength', minlength: 'minLength', autoplay: 'autoPlay', playsinline: 'playsInline',
    crossorigin: 'crossOrigin', srcset: 'srcSet', colspan: 'colSpan', rowspan: 'rowSpan',
    frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', autocomplete: 'autoComplete',
    enctype: 'encType', contenteditable: 'contentEditable', spellcheck: 'spellCheck',
    novalidate: 'noValidate', datetime: 'dateTime', referrerpolicy: 'referrerPolicy',
    'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'xmlns:xlink': 'xmlnsXlink',
    fetchpriority: 'fetchPriority', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint',
    'data-dc-src': 'src', 'data-dc-poster': 'poster' };
  var BOOL = { autoplay: 1, loop: 1, muted: 1, controls: 1, disabled: 1, hidden: 1, required: 1,
    playsinline: 1, allowfullscreen: 1, checked: 1, selected: 1, open: 1, novalidate: 1, readonly: 1,
    multiple: 1, defer: 1, async: 1, inert: 1 };
  var HOLE = /\{\{\s*([\w$.]+)\s*\}\}/g;

  function camel(p) {
    if (p.indexOf('--') === 0) return p;
    if (p.indexOf('-ms-') === 0) p = p.slice(1);
    return p.replace(/^-/, '').replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })
      .replace(/^(webkit|moz|o)([A-Z])/, function (_, v, c) { return v.charAt(0).toUpperCase() + v.slice(1) + c; });
  }
  function parseStyle(s) {
    var out = {}, depth = 0, q = '', start = 0, parts = [];
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (q) { if (c === q) q = ''; continue; }
      if (c === '"' || c === "'") q = c; else if (c === '(') depth++; else if (c === ')') depth--;
      else if (c === ';' && depth === 0) { parts.push(s.slice(start, i)); start = i + 1; }
    }
    parts.push(s.slice(start));
    parts.forEach(function (d) {
      var k = d.indexOf(':'); if (k < 0) return;
      var prop = d.slice(0, k).trim(), val = d.slice(k + 1).trim();
      if (prop && val !== '') out[camel(prop)] = val;
    });
    return out;
  }
  function lookup(path, scope) {
    var parts = path.split('.'), v = scope[parts[0]];
    for (var i = 1; i < parts.length; i++) v = v == null ? undefined : v[parts[i]];
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scope); return v == null || v === false ? '' : String(v); });
  }
  function soleHole(str) { var m = /^\s*\{\{\s*([\w$.]+)\s*\}\}\s*$/.exec(str); return m && m[1]; }
  function evName(kebab) { return 'on' + kebab.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(''); }

  /* ---------- compile the template DOM once ---------- */
  function compile(node) {
    if (node.nodeType === 3) return { t: node.nodeValue };
    if (node.nodeType !== 1) return null;
    var tag = node.localName, el = { tag: tag, attrs: [], kids: [] };
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i], n = a.name;
      if (n === 'data-dc-if') el.cond = a.value.trim();
      else if (n === 'data-dc-for') el.each = a.value.trim();
      else if (n === 'data-dc-as') el.as = a.value.trim();
      else if (n === 'data-dc-ref') el.ref = a.value.trim();
      else if (n.indexOf('data-dc-on-') === 0) el.attrs.push({ ev: evName(n.slice(11)), path: a.value.trim() });
      else el.attrs.push({ n: n, v: a.value });
    }
    if (tag === 'style' || tag === 'script') { el.raw = node.textContent; return el; }
    var src = tag === 'template' ? node.content : node;
    for (var c = src.firstChild; c; c = c.nextSibling) { var k = compile(c); if (k) el.kids.push(k); }
    return el;
  }

  /* ---------- render compiled template with the current values ---------- */
  function textNodes(str, scope, out) {
    var last = 0, m; HOLE.lastIndex = 0;
    while ((m = HOLE.exec(str))) {
      if (m.index > last) out.push(str.slice(last, m.index));
      var v = lookup(m[1], scope);
      out.push(v != null && v !== false && v !== true ? v : null); // keep positions stable for React
      last = HOLE.lastIndex;
    }
    if (last < str.length) out.push(str.slice(last));
  }
  function kids(list, scope) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var k = list[i];
      if (k.t != null) { textNodes(k.t, scope, out); continue; }
      out.push(build(k, scope)); // null placeholders keep sibling positions stable
    }
    return out;
  }
  function build(el, scope) {
    if (el.cond && !lookup(el.cond, scope)) return null;
    var props = {}, isVideo = el.tag === 'video', isText = el.tag === 'textarea';
    for (var i = 0; i < el.attrs.length; i++) {
      var a = el.attrs[i];
      if (a.ev) { var fn = lookup(a.path, scope); if (typeof fn === 'function') props[a.ev] = fn; continue; }
      var n = a.n, raw = a.v, v;
      var only = soleHole(raw);
      if (only) {
        v = lookup(only, scope);
        if (BOOL[n]) { if (!v || v === 'false') continue; v = true; }
        else if (v == null || v === false) continue;
        else if (v === true) v = 'true';
        else v = String(v);
      } else v = raw.indexOf('{{') >= 0 ? interp(raw, scope) : raw;
      if (n === 'style') { props.style = parseStyle(v); continue; }
      if (BOOL[n] && v === '') v = true;
      if (n === 'muted') continue;
      if (n === 'value' && (el.tag === 'input' || isText || el.tag === 'select')) { props.defaultValue = v; continue; }
      if (n === 'checked') { props.defaultChecked = true; continue; }
      if (n === 'selected') continue;
      props[NAMES[n] || n] = v;
    }
    if (el.ref) { var ref = lookup(el.ref, scope); if (ref) props.ref = ref; }
    if (isVideo) {
      var userRef = props.ref;
      props.ref = function (node) {
        if (node) {
          node.muted = true; node.setAttribute('muted', '');
          // background videos stay in the page: inline on iOS (incl. older in-app browsers),
          // and no picture-in-picture or casting pop-outs on Android
          node.playsInline = true; node.setAttribute('playsinline', ''); node.setAttribute('webkit-playsinline', '');
          node.disablePictureInPicture = true; node.setAttribute('disablepictureinpicture', '');
          node.disableRemotePlayback = true; node.setAttribute('disableremoteplayback', '');
          node.setAttribute('x-webkit-airplay', 'deny');
        }
        if (typeof userRef === 'function') userRef(node); else if (userRef) userRef.current = node;
      };
    }
    if (el.raw != null) { props.dangerouslySetInnerHTML = { __html: el.raw }; return E(el.tag, props); }
    if (isText) {
      var t = []; textNodes(el.kids.map(function (k) { return k.t || ''; }).join(''), scope, t);
      if (t.length) props.defaultValue = t.join('');
      return E('textarea', props);
    }
    var children;
    if (el.each) {
      var list = lookup(el.each, scope) || [], alias = el.as || 'item';
      children = list.map(function (item, idx) {
        var s = Object.create(scope); s[alias] = item; s.$index = idx;
        return E(R.Fragment, { key: idx }, kids(el.kids, s));
      });
    } else children = kids(el.kids, scope);
    return E.apply(null, [el.tag, props].concat(children));
  }

  /* ---------- base class the page logic extends ---------- */
  var TEMPLATE = [];
  class DCLogic extends R.Component {
    renderVals() { return {}; }
    render() {
      var vals = Object.assign({}, extraVals(this), this.renderVals() || {});
      return E(R.Fragment, null, kids(TEMPLATE, vals));
    }
  }
  window.DCLogic = DCLogic;

  /* ---------- footer "Imagery credits" dialog, shared by every page ---------- */
  function extraVals(comp) {
    var s = comp.state || {};
    return {
      isOpen: !!s.__credits,
      open: function () { comp.setState({ __credits: true }); },
      close: function () { comp.setState({ __credits: false }); },
      stop: function (e) { e.stopPropagation(); }
    };
  }

  /* ---------- Web3Forms contact (the live site's form backend) ---------- */
  var W3F_KEY = 'd8c93437-f4ee-49f7-95ad-5df7d3697d78';
  function sendForm(form) {
    var fd = new FormData(form);
    if (fd.get('botcheck')) return Promise.resolve({ success: true });
    fd.delete('botcheck');
    fd.set('access_key', W3F_KEY);
    fd.set('subject', 'New message from stubblefield.info');
    fd.set('from_name', 'stubblefield.info contact form');
    return fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
      .then(function (r) { return r.json(); })
      .catch(function () { return { success: false }; });
  }

  function mount(Comp) {
    var root = document.querySelector('[data-dc-root]');
    if (!root) return;
    TEMPLATE = [];
    for (var c = root.firstChild; c; c = c.nextSibling) { var k = compile(c); if (k) TEMPLATE.push(k); }
    var host = document.createElement('div');
    host.setAttribute('data-dc-live', '');
    host.style.display = 'contents';
    root.parentNode.replaceChild(host, root);
    var r = RD.createRoot(host);
    RD.flushSync(function () { r.render(E(Comp, {})); });
    document.documentElement.classList.remove('dc-pending');
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  window.DC = { mount: mount, sendForm: sendForm };
})();
