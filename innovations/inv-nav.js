/* Previous / next rails on the individual innovation pages, plus arrow keys.
   The order matches the cards on the innovations index. */
(function () {
  "use strict";
  var ORDER = [
    ["boothtok.html", "BoothTok"],
    ["cost-calculator.html", "Cost Calculator"],
    ["thought-leadership.html", "Thought Leadership Enhancements"],
    ["content-intake.html", "Visual Content Intake"]
  ];
  var here = (location.pathname.split("/").pop() || "").toLowerCase();
  var i = -1;
  ORDER.forEach(function (p, k) { if (p[0] === here) i = k; });
  if (i < 0) return;
  var prev = ORDER[(i - 1 + ORDER.length) % ORDER.length];
  var next = ORDER[(i + 1) % ORDER.length];

  function rail(side, item) {
    var a = document.createElement("a");
    a.className = "inv-rail inv-rail-" + side;
    a.href = item[0];
    a.innerHTML = '<span class="ir-arrow" aria-hidden="true">' + (side === "prev" ? "\u2190" : "\u2192") + "</span>" +
      '<span class="ir-lab"><b>' + (side === "prev" ? "Previous" : "Next") + " innovation</b>" + item[1] + "</span>";
    document.body.appendChild(a);
    return a;
  }
  rail("prev", prev);
  rail("next", next);

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName) || t.isContentEditable)) return;
    if (document.querySelector("dialog[open]")) return;
    /* the embedded apps own their own arrow keys */
    if (t && t.closest && t.closest("iframe, .dlr-frame, .bt-phone")) return;
    location.href = (e.key === "ArrowLeft" ? prev : next)[0];
  });
})();
