/* BoothTok — feed engine. Vanilla, no framework.
   Counts persist in localStorage under boothtok.v1; the tapped state on a
   heart or repost clears after 30s so it can be tapped again. */
(function () {
"use strict";

var FEED = [
  { f: "tocamera.mp4", h: "dollarous.live", pos: "28% 50%", vf: 1, cap: "Day one, hour nine. I have said <em>exception queue</em> 212 times and I will say it again tomorrow.", snd: "original sound - dollarous.live", cr: "\u201cA Woman Recording Herself with a Camera\u201d \u00b7 Pexels 9032610", follow: 1 },
  { f: "cat.mp4", h: "hallcat.official", cap: "Convention center cat has better badge access than our CFO.", snd: "lofi booth beats - staticroom", cr: "\u201cCharming Stray Cat Resting in Sunlit Park\u201d \u00b7 Pexels 32768497" },
  { f: "crowd.mp4", h: "fieldteam.jules", cap: "Booth challenge, hour six. Nobody has left. Somebody get these people a chair.", snd: "original sound - fieldteam.jules", cr: "\u201cGroup Cheering on a Team Building Activity\u201d \u00b7 Pexels 7551529", follow: 1 },
  { f: "makeup.mp4", h: "boothdemos", pos: "32% 50%", vf: 1, cap: "Live demo, station three. Forty seconds, no pitch, no deck.", snd: "soft focus - roomtone", cr: "\u201cUsing a Beauty Blender\u201d \u00b7 Coverr", follow: 1 },
  { f: "skate.mp4", h: "activations.kai", cap: "Ramp went up outside Hall C at 7am. Foot traffic tripled by 10.", snd: "original sound - activations.kai", cr: "\u201cMan Riding a Skateboard Doing Stunt\u201d \u00b7 Pexels 4832027" },
  { f: "moto.mp4", h: "sparks.activation", cap: "Nobody asked for a stunt bike at a fintech expo. Everybody stopped walking.", snd: "throttle - nightshift", cr: "\u201cA Female Motorcyclist Doing Stunts in the City\u201d \u00b7 Pexels 9607281" },
  { f: "smiling.mp4", h: "dollarous.live", vf: 1, cap: "Asked twelve people at our booth what slows their close. Twelve identical answers.", snd: "original sound - dollarous.live", cr: "\u201cA Woman Smiling\u201d \u00b7 Coverr", follow: 1 },
  { f: "concert.mp4", h: "afterhours.badge", cap: "The 9pm party is the actual conference. The keynote is the pre-roll.", snd: "unreleased - the floor plan", cr: "\u201cRock Band Performing on Stage During Concert\u201d \u00b7 Pexels 12525478" },
  { f: "tp.mp4", h: "boothbloopers", cap: "6am setup. This is what happens before doors open and nobody talks about it.", snd: "original sound - boothbloopers", cr: "\u201cMan House Safe Apartment\u201d \u00b7 Pexels 4115288" },
  { f: "flip.mp4", h: "brandstunts", cap: "Sponsor stunt, take fourteen. He landed it on twelve. We kept filming.", snd: "slowdown - halfspeed", cr: "\u201cMan Jumping in Park in Slow Motion\u201d \u00b7 Pexels 13189498" },
  { f: "plane.mp4", h: "roadcrew.sam", cap: "Booth is in the hold. Twelve crates, one truss, four days. See you in Phoenix.", snd: "golden hour - runway", cr: "\u201cA Small Airplane Flying Over the Water at Sunset\u201d \u00b7 Pexels 19690013" },
  { f: "celebration.mp4", h: "dollarous.live", vf: 1, cap: "Closed the quarter and tore down the booth in the same week. Both went fine.", snd: "original sound - dollarous.live", cr: "\u201cVideo of People Celebrating\u201d \u00b7 Pexels 7119932", follow: 1 },
  { f: "moto-city.mp4", h: "urbanmoto.crew", cap: "Wheelie past the registration line. Security has notes.", snd: "citymode - twostroke", cr: "\u201cUrban Motorcycle Riders Performing Stunts\u201d \u00b7 Pexels 34925342" },
  { f: "cat-stretch.mp4", h: "hallcat.official", cap: "Stretching before the keynote. Peak preparation.", snd: "lofi booth beats - staticroom", cr: "\u201cKedi Gevsiyor\u201d \u00b7 Pexels 27911209" },
  { f: "motocross.mp4", h: "rockyterrain", cap: "Client asked for rugged. Client got rugged.", snd: "original sound - rockyterrain", cr: "\u201cExtreme Motocross Action on Rocky Terrain\u201d \u00b7 Pexels 31942309" },
  { f: "waterslide.mp4", h: "offsite.season", cap: "Team offsite. The strategy session was scheduled for after this.", snd: "summer intake - poolside", cr: "\u201cExciting Water Slide Adventure at Theme Park\u201d \u00b7 Pexels 37652203" },
  { f: "skating.mp4", h: "teamoffsite", cap: "Corporate 5k, unofficial division. We were asked not to do this again.", snd: "original sound - teamoffsite", cr: "\u201cDynamic Inline Skating on Scenic Road\u201d \u00b7 Pexels 34896076" }
];

var KEY = "boothtok.v1", RESET = 30000;
var store = {};
try { store = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { store = {}; }
var save = function () { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
var rnd = function () { return Math.floor(Math.random() * 39) + 1; };

FEED.forEach(function (p) {
  var s = store[p.f];
  if (!s) { s = store[p.f] = { hearts: rnd(), reposts: rnd(), comments: rnd() }; }
  if (s.comments == null) s.comments = rnd();
  p.s = s;
});
save();

var I = {
  heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.6-4.7-9.5-9.3C.9 8.2 2.7 4.6 6.2 4c2.2-.4 4.3.7 5.8 2.6C13.5 4.7 15.6 3.6 17.8 4c3.5.6 5.3 4.2 3.7 7.7C19.6 16.3 12 21 12 21z"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c5 0 9 3.3 9 7.4 0 4.1-4 7.4-9 7.4-.9 0-1.8-.1-2.6-.3L5 20.4l.7-3.3C3.6 15.7 3 13.4 3 10.4 3 6.3 7 3 12 3z"/></svg>',
  repost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 12V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 12v3a3 3 0 0 1-3 3H3"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 11.2 3.9 3.3c-.8-.4-1.6.4-1.3 1.2l2.3 6.1c.1.3.4.5.7.5l7.6.6c.3 0 .3.5 0 .5l-7.6.6c-.3 0-.6.2-.7.5l-2.3 6.1c-.3.8.5 1.6 1.3 1.2l17.6-7.9c.7-.3.7-1.2 0-1.5z"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17.5" r="3"/><circle cx="18" cy="15.5" r="3"/><path d="M10 17.5V6.2L21 4v11.5"/></svg>',
  vf: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.6 12.4l3 3 5.8-6.4" stroke="#0b0d0c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>',
  swipe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v14M6 12l6 6 6-6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9.2"/><path d="M12 10.6v6" stroke-linecap="round"/><circle cx="12" cy="7.4" r="1.2" fill="currentColor" stroke="none"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2.5 11h2.7v9h5.2v-5.7h3.2V20h5.2v-9h2.7z"/></svg>',
  disc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="11" cy="11" r="7.5"/><path d="M16.6 16.6 21 21" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>',
  me: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke-linecap="round"/></svg>'
};

var num = function (n) { return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n); };

var root = document.getElementById("bt");
var stage = document.createElement("div");
stage.className = "stage";
root.appendChild(stage);

/* ---------- shell ---------- */
stage.insertAdjacentHTML("beforeend",
  '<div class="top">' +
    '<button class="ic" id="btInfo" aria-label="Credits and sources">' + I.info + '</button>' +
    '<div class="tabs"><button data-t="following">Following</button><button data-t="foryou" class="on">For You</button></div>' +
    '<button class="ic" aria-label="Search">' + I.search + '</button>' +
  '</div>' +
  '<div class="feed" id="btFeed"></div>' +
  '<div class="hint">' + I.swipe + '<span>Swipe up</span></div>' +
  '<div class="toast" id="btToast" role="status"></div>' +
  '<nav class="nav">' +
    '<button class="on">' + I.home + '<span>Home</span></button>' +
    '<button>' + I.disc + '<span>Discover</span></button>' +
    '<button aria-label="Create"><span class="plus">' + I.plus + '</span></button>' +
    '<button>' + I.inbox + '<span>Inbox</span></button>' +
    '<button>' + I.me + '<span>Booth</span></button>' +
  '</nav>' +
  '<div class="sheet" id="btSheet"><div class="scrim"></div><div class="card">' +
    '<h2>Credits<button class="x" aria-label="Close">\u00d7</button></h2>' +
    '<div class="body"><p><b>BoothTok</b> is a concept demo for Dollarous, a fictitious FinTech brand. The handles, captions and counts are invented. The footage is stock, used here to stand in for a brand\u2019s own event library.</p>' +
    '<ul>' + FEED.map(function (p) { return "<li><b>@" + p.h + "</b>" + p.cr + "</li>"; }).join("") + '</ul>' +
    '<p style="margin-top:1rem">Pexels and Coverr clips are used under their respective free licenses. No clip depicts a real Dollarous event, because there is no Dollarous.</p></div>' +
  '</div></div>');

var feed = document.getElementById("btFeed");
var toastEl = document.getElementById("btToast"), toastT = null;
var toast = function (m) {
  toastEl.textContent = m;
  toastEl.classList.add("up");
  clearTimeout(toastT);
  toastT = setTimeout(function () { toastEl.classList.remove("up"); }, 1900);
};

/* ---------- posts ---------- */
function build(list) {
  feed.innerHTML = list.map(function (p, i) {
    return '<article class="post" data-i="' + i + '" data-f="' + p.f + '">' +
      '<video playsinline muted preload="none" disablepictureinpicture ' + (p.pos ? 'style="object-position:' + p.pos + '"' : "") + "></video>" +
      '<div class="veil"></div><div class="tap"></div>' +
      '<div class="pausedot">' + I.play + '</div>' +
      '<div class="prog"><i></i></div>' +
      '<div class="rail">' +
        '<span class="av"><img src="av/' + p.h + '.png" alt="" width="128" height="128"><b>' + (p.follow ? "\u2713" : "+") + "</b></span>" +
        '<button class="act ht" data-a="heart">' + I.heart + '<span>' + num(p.s.hearts) + '</span></button>' +
        '<button class="act" data-a="comment">' + I.comment + '<span>' + num(p.s.comments) + '</span></button>' +
        '<button class="act rp" data-a="repost">' + I.repost + '<span>' + num(p.s.reposts) + '</span></button>' +
        '<span class="act sh">' + I.share + "<span>Share</span></span>" +
      '</div>' +
      '<div class="meta">' +
        '<span class="who">@' + p.h + (p.vf ? '<span class="vf">' + I.vf + "</span>" : "") + "</span>" +
        '<span class="cap">' + p.cap + "</span>" +
        '<span class="snd">' + I.note + "<i><span>" + p.snd + " \u00b7 " + p.snd + " \u00b7 </span></i></span>" +
      "</div></article>";
  }).join("");
  wire(list);
}

var active = null;

function wire(list) {
  var posts = [].slice.call(feed.children);

  /* only the neighbours carry a src, so 17 clips never load at once */
  function window3(n) {
    posts.forEach(function (el, i) {
      var v = el.firstElementChild, near = Math.abs(i - n) <= 1;
      if (near && !v.src) { v.src = list[i].f; v.preload = i === n ? "auto" : "metadata"; }
      else if (!near && v.src && Math.abs(i - n) > 3) { v.pause(); v.removeAttribute("src"); v.load(); }
    });
  }

  function play(el) {
    if (active && active !== el) { active.firstElementChild.pause(); active.classList.remove("paused"); }
    active = el;
    var i = +el.dataset.i;
    window3(i);
    var v = el.firstElementChild;
    v.muted = true; v.volume = 0;
    var go = v.play();
    if (go && go.catch) go.catch(function () {});
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.6) play(e.target); });
  }, { root: feed, threshold: [0, 0.6, 1] });
  posts.forEach(function (el) { io.observe(el); });

  posts.forEach(function (el) {
    var p = list[+el.dataset.i], v = el.firstElementChild;
    var bar = el.querySelector(".prog i");
    v.addEventListener("timeupdate", function () {
      if (v.duration) bar.style.width = (v.currentTime / v.duration) * 100 + "%";
    });

    /* clip runs out -> ride down to the next one, or wrap at the end */
    v.addEventListener("ended", function () {
      if (active !== el) { v.currentTime = 0; return; }
      var next = el.nextElementSibling;
      if (next) glide(next);
      else { wrapT = 0; wrap(); }
    });

    /* tap = pause, double tap = heart */
    var tap = el.querySelector(".tap"), last = 0, single = null;
    tap.addEventListener("click", function (e) {
      var now = Date.now();
      if (now - last < 300) {
        clearTimeout(single);
        last = 0;
        burst(el, e);
        bump(el, p, "heart", true);
        return;
      }
      last = now;
      single = setTimeout(function () {
        if (v.paused) { v.play().catch(function () {}); el.classList.remove("paused"); }
        else { v.pause(); el.classList.add("paused"); }
      }, 300);
    });

    el.querySelectorAll(".act[data-a]").forEach(function (b) {
      b.addEventListener("click", function () {
        var a = b.dataset.a;
        if (a === "comment") return toast("Comments are off on the booth screen.");
        bump(el, p, a);
      });
    });

    el.querySelector(".av").addEventListener("click", function () {
      this.classList.toggle("on");
      this.lastElementChild.textContent = this.classList.contains("on") ? "\u2713" : "+";
    });
  });

  if (posts[0]) { window3(0); play(posts[0]); }
}

/* ---------- counters ---------- */
var timers = {};
function bump(el, p, kind, onlyOn) {
  if (kind !== "heart" && kind !== "repost") return;
  var b = el.querySelector('[data-a="' + kind + '"]');
  var field = kind === "heart" ? "hearts" : "reposts";
  var k = p.f + ":" + kind;
  if (b.classList.contains("hit") && onlyOn) return;
  p.s[field]++;
  b.lastElementChild.textContent = num(p.s[field]);
  b.classList.add("hit");
  save();
  clearTimeout(timers[k]);
  timers[k] = setTimeout(function () { b.classList.remove("hit"); }, RESET);
}

function burst(el, e) {
  var r = el.getBoundingClientRect();
  var s = document.createElement("span");
  s.className = "pop";
  s.innerHTML = I.heart;
  s.style.left = (e.clientX - r.left) + "px";
  s.style.top = (e.clientY - r.top) + "px";
  el.appendChild(s);
  setTimeout(function () { s.remove(); }, 720);
}

/* ---------- tabs, sheet, hint ---------- */
document.querySelectorAll(".tabs button").forEach(function (b) {
  b.addEventListener("click", function () {
    document.querySelectorAll(".tabs button").forEach(function (o) { o.classList.remove("on"); });
    b.classList.add("on");
    active = null;
    feed.scrollTop = 0;
    build(b.dataset.t === "following" ? FEED.filter(function (p) { return p.follow; }) : FEED);
  });
});

var sheet = document.getElementById("btSheet");
document.getElementById("btInfo").addEventListener("click", function () { sheet.classList.add("up"); });
sheet.querySelector(".x").addEventListener("click", function () { sheet.classList.remove("up"); });
sheet.querySelector(".scrim").addEventListener("click", function () { sheet.classList.remove("up"); });

feed.addEventListener("scroll", function () { feed.classList.add("moved"); }, { once: true, passive: true });

/* mandatory snap cancels a smooth scroll on this container, so it comes off
   for the duration of the animation and goes straight back */
function glide(el) {
  var top = feed.scrollTop + el.getBoundingClientRect().top - feed.getBoundingClientRect().top;
  feed.style.scrollSnapType = "none";
  feed.scrollTo({ top: top, behavior: "smooth" });
  setTimeout(function () { feed.style.scrollSnapType = ""; }, 620);
}

/* at the end of the feed, a further downward gesture wraps to the top */
var wrapT = 0;
function atEnd() { return feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 4; }
function wrap() {
  if (!atEnd() || Date.now() - wrapT < 900) return;
  wrapT = Date.now();
  feed.style.scrollSnapType = "none";
  feed.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(function () {
    if (feed.scrollTop > 4) feed.scrollTop = 0;
    feed.style.scrollSnapType = "";
  }, 620);
  toast("Back to the top. The feed does not end.");
}
feed.addEventListener("wheel", function (e) { if (e.deltaY > 8) wrap(); }, { passive: true });
var ty = 0, tPull = 0;
feed.addEventListener("touchstart", function (e) { ty = e.touches[0].clientY; tPull = 0; }, { passive: true });
feed.addEventListener("touchmove", function (e) {
  tPull = ty - e.touches[0].clientY;
  if (tPull > 24) wrap();
}, { passive: true });
/* a flick that ends before touchmove clears the threshold still wraps */
feed.addEventListener("touchend", function () { if (tPull > 10) wrap(); }, { passive: true });
feed.addEventListener("keydown", function (e) { if (e.key === "ArrowDown" || e.key === "PageDown") wrap(); });

build(FEED);
})();
