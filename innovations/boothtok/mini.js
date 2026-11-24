(function(){
"use strict";
var HOLD=2500, GLIDE=500;
var CLIPS=[
  {f:"crowd.mp4",h:"fieldteam.jules",t:1.2,cap:"Booth challenge, hour six. Nobody has left.",snd:"original sound"},
  {f:"skate.mp4",h:"activations.kai",t:0.8,cap:"Ramp went up outside Hall C at 7am.",snd:"original sound"},
  {f:"smiling.mp4",h:"dollarous.live",t:0.6,vf:1,cap:"Asked twelve people what slows their close.",snd:"original sound"},
  {f:"concert.mp4",h:"afterhours.badge",t:1.4,cap:"The 9pm party is the actual conference.",snd:"unreleased - the floor plan"}
];
var I={
  heart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.6-4.7-9.5-9.3C.9 8.2 2.7 4.6 6.2 4c2.2-.4 4.3.7 5.8 2.6C13.5 4.7 15.6 3.6 17.8 4c3.5.6 5.3 4.2 3.7 7.7C19.6 16.3 12 21 12 21z"/></svg>',
  comment:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c5 0 9 3.3 9 7.4 0 4.1-4 7.4-9 7.4-.9 0-1.8-.1-2.6-.3L5 20.4l.7-3.3C3.6 15.7 3 13.4 3 10.4 3 6.3 7 3 12 3z"/></svg>',
  note:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17.5" r="3"/><circle cx="18" cy="15.5" r="3"/><path d="M10 17.5V6.2L21 4v11.5"/></svg>',
  vf:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.6 12.4l3 3 5.8-6.4" stroke="#0b0d0c" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
var reel=document.getElementById("reel"), bar=document.getElementById("bar");/* one extra pane repeating clip 0, so the wrap back to the top is invisible */
var order=CLIPS.concat([CLIPS[0]]);
reel.innerHTML=order.map(function(c,i){
  return '<div class="pane"><video playsinline muted preload="'+(i<2?"auto":"metadata")+'" src="'+c.f+'"></video><div class="veil"></div>'+
    '<div class="rail"><span class="av"><img src="av/'+c.h+'.png" alt=""><b>+</b></span>'+
    '<span class="act">'+I.heart+'<span>'+(12+i*7)+'</span></span>'+
    '<span class="act">'+I.comment+'<span>'+(3+i*2)+'</span></span></div>'+
    '<div class="meta"><span class="who">@'+c.h+(c.vf?I.vf:"")+'</span>'+
    '<span class="cap">'+c.cap+'</span><span class="snd">'+I.note+'<span>'+c.snd+'</span></span></div></div>';
}).join("");
var vids=[].slice.call(reel.querySelectorAll("video"));
var n=0, timer=null, raf=null, t0=0, running=true;
function seek(v,t){ try{ if(v.readyState>0) v.currentTime=t; else v.addEventListener("loadeddata",function(){v.currentTime=t;},{once:true}); }catch(e){} }
function show(i){
  n=i;
  reel.style.transform="translateY("+(-i*377)+"px)";
  vids.forEach(function(v,k){ if(k!==i){ v.pause(); } });
  var v=vids[i], c=order[i];
  seek(v,c.t);
  if(running){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  t0=performance.now();
  cancelAnimationFrame(raf);
  (function tick(){ var f=Math.min(1,(performance.now()-t0)/HOLD); bar.style.width=(f*100)+"%"; if(f<1) raf=requestAnimationFrame(tick); })();
  clearTimeout(timer);
  timer=setTimeout(next,HOLD);
  /* prime the clip after this one */
  var nx=vids[i+1]; if(nx) nx.preload="auto";
}
function next(){
  if(n<order.length-1){ show(n+1); return; }
  /* landed on the repeat pane: cut back to the real first pane with no motion */
  reel.classList.add("snap");
  reel.style.transform="translateY(0)";
  void reel.offsetWidth;
  reel.classList.remove("snap");
  vids[order.length-1].pause();
  show(0);
}
show(0);
window.addEventListener("message",function(e){
  var m=e.data&&e.data.mini;
  if(m==="pause"&&running){ running=false; vids[n].pause(); clearTimeout(timer); cancelAnimationFrame(raf); }
  else if(m==="play"&&!running){ running=true; show(n); }
});
/* the parent may have posted its state before this document existed, so ask */
function hello(){ try{ parent.postMessage({mini:"ready"},"*"); }catch(e){} }
hello();
window.addEventListener("load",hello);
document.addEventListener("visibilitychange",function(){
  if(document.hidden){ vids[n].pause(); clearTimeout(timer); }
  else if(running){ show(n); }
});
})();
