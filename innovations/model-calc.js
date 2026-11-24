(function () {
  var D = { vol: 5000, cost: 15.97, err: 3.6, fix: 53.50, imp: 60 };
  var el = function (id) { return document.getElementById(id); };
  var f = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var raw = function (n) { return Math.round(n).toLocaleString('en-US'); };

  function calc() {
    var vol = Math.max(0, +el('i-vol').value || 0);
    var cost = Math.max(0, +el('i-cost').value || 0);
    var err = Math.max(0, +el('i-err').value || 0);
    var fix = Math.max(0, +el('i-fix').value || 0);
    var imp = Math.max(0, +el('i-imp').value || 0);

    el('o-err').textContent = err.toFixed(1) + '%';
    el('o-imp').textContent = imp + '%';

    var proc = vol * cost;
    var errs = vol * (err / 100);
    var rework = errs * fix;
    var month = proc + rework;
    var year = month * 12;

    el('o-day').textContent = raw(year / 365);
    el('o-year').textContent = f(year);
    el('o-month').textContent = f(month);
    el('o-proc').textContent = f(proc * 12);
    el('o-rework').textContent = f(rework * 12);
    el('o-errs').textContent = raw(errs * 12);

    var total = proc + rework;
    var pp = total > 0 ? (proc / total) * 100 : 50;
    el('seg-proc').style.width = pp.toFixed(1) + '%';
    el('seg-rework').style.width = (100 - pp).toFixed(1) + '%';

    el('o-now').textContent = f(year);
    el('o-next').textContent = f(year * (1 - imp / 100));
  }

  el('calc-form').addEventListener('input', calc);
  el('calc-reset').addEventListener('click', function () {
    el('i-vol').value = D.vol; el('i-cost').value = D.cost;
    el('i-err').value = D.err; el('i-fix').value = D.fix; el('i-imp').value = D.imp;
    calc();
  });
  el('calc-send').addEventListener('click', function () {
    var b = el('calc-send');
    b.disabled = true;
    b.textContent = 'Demo only, nothing sent';
    setTimeout(function () { b.disabled = false; b.textContent = 'Email me this breakdown'; }, 2400);
  });
  calc();
})();
