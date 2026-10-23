(function () {
  var COLS = 60, ROWS = 32;
  var PALETTE = [
    ["#e1c5af", "#e8ebef", "#386284", "#977c69", "#735c47", "#f6e4bf", "#558baa", "#2a6875"],
    ["#ecd9cb", "#f0f2f5", "#7e99af", "#bbaa9e", "#a49587", "#f9edd5", "#91b4c8", "#759da5"],
    ["#f6eee7", "#f8f9fa", "#c3d0da", "#e0d8d2", "#d5cec8", "#fcf7ec", "#ccdce6", "#bfd2d6"]
  ];
  var ART = String.raw`

                     __           \888p
                    q88qp_     ._d88888p
                   q888888qqqqqq88888888q_
                   88888888888888888888888p
                  .888888888888888888888888(
                  d8888888888888888888888888|    __,_qq.
                 _d88888888888888888888888888,   |88888_qp
                 d888888888888888888888888888| .p88888888b
      .qpq8qqq   d8888888888888888888888888888q8888888888b
      _8888888_   d88888888888888888888888888888888888888b
     :888888888qq_,88888888888888888888888888888888888888
     '8888888888888888888888888888888888888888888888888P
      '88888888888888888888888888888888888888888888888"
       "88888888888888888888888888888888888888888888P'
         "O88888888888888888888888888888888888888888q_,
           "8888888888888888888888888888888888888888888.
             .p88888888888888888888888888888888888888888
             _888888888888888888888888888888888888888888p
             88888888888888888888888888888888888888888888
            _88888888888888888888888888888888888888888888p
     88p\pq,888888888888888888888888888888888888888888888b
  qqq8888888888888888888888888888888888888888888888888888b
  "888888888888888888888888888888888888888888888888888888b
   "88888888888888888888888888888888888888888888888888888P
    88888888888888888888888888888888888888888888888888888
    '888888888888888888888888888888888888888888888888888
     '888888888888888888888888888888888888888888888888"
      ')888888888888888888888888888888888888888888888'
        '"P8888PP'''   ''''YPPPPPPP"''"888888888888"'
            '''                         "Y88888Y"'

`;
  var INK = String.raw`

                     00           76121
                    762111     076666221
                   76662221111166666222211
                   766626666666666622222221
                  01222266666655557222222221
                  122555526655555555572222211    1111110
                 11055555555555555555572222211   111111111
                 12551555555555555555557222211 11666666111
      11111111   12555555555555555555557222771166666662711
      117666117   1055533555535055555572227722666666222111
     0177666666777711555555555555555522222222222622222221
     017222666666661177555555555555522222222222222222221
      1122222666622222155500000555555557222222222222217
       11222222222255555555555555555555557222222222211
         1122222255555555555555555555555555722222222110
           111225555555555555555555555555555722222272110
             0155555555555555555555555555555572227777771
             01555555555555555555555555555555577777777771
             15555555555555555555555555555555007777777771
            1155555555555555555555555555555000077777777771
     15111111005555555555555555555555555500000007777777771
  11115511001000055555555555555555555500000510007517777771
  11515555445000000055555555555555000000001551115001151771
   1155555555550000000000000000000000000555555550000051771
    10000000555000000000000000000000001555555000000000171
    0143340000000000000000000000000001555500003330000011
     01333400000007700000000000000000155500433333300011
      013334000001771110000000000000011550033333300011
        111100011111   111111111111111110000044000011
            000                         1110000110

`;

  var START = 0.5, PASS = 2, EVERY = 6, HALF = 5, LEAN = 0.9, SOLID = "8dbqpPYOo0";

  var canvas = document.getElementById("snorlax");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var art = rows(ART), ink = rows(INK);
  var cellW = 0, cellH = 0, lo = Infinity, hi = -Infinity;

  function rows(s) {
    return s.slice(1, -1).split("\n").map(function (l) { while (l.length < COLS) l += " "; return l; });
  }

  art.forEach(function (line, y) {
    for (var x = 0; x < COLS; x++) {
      if (line[x] !== " ") {
        lo = Math.min(lo, x + LEAN * y);
        hi = Math.max(hi, x + LEAN * y);
      }
    }
  });
  var span = hi - lo + 2 * HALF;

  function size() {
    var dpr = window.devicePixelRatio || 1;
    var w = Math.max(1, Math.round(canvas.getBoundingClientRect().width * dpr));
    cellW = w / COLS;
    cellH = cellW * 2;
    canvas.width = w;
    canvas.height = Math.round(cellH * ROWS);
    ctx.font = "bold " + cellW / 0.6 + "px ui-monospace, Menlo, Consolas, 'DejaVu Sans Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  function draw(t) {
    var since = t - START;
    var at = since >= 0 ? lo - HALF + (span * (since % EVERY)) / PASS : -Infinity;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        var ch = art[y][x];
        if (ch === " ") continue;
        var d = Math.abs(x + LEAN * y - at);
        var k = d < HALF ? 1 - d / HALF : 0;
        k = k * k * (3 - 2 * k);
        if (k > 0.55 && SOLID.indexOf(ch) >= 0) ch = "/";
        var i = parseInt(ink[y][x], 36);
        ctx.fillStyle = PALETTE[k > 0.6 ? 2 : k > 0.25 ? 1 : 0][isNaN(i) ? 5 : i];
        ctx.fillText(ch, (x + 0.5) * cellW, (y + 0.5) * cellH);
      }
    }
  }

  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var t0 = performance.now(), last = 0;

  function frame(now) {
    var t = (now - t0) / 1000;
    var glint = t >= START && (t - START) % EVERY < PASS;
    if (glint && now - last > 33) { draw(t); last = now; }
    else if (!glint && last !== -1) { draw(0); last = -1; }
    requestAnimationFrame(frame);
  }

  size();
  draw(0);
  if (!still) requestAnimationFrame(frame);
  window.addEventListener("resize", function () { size(); draw(0); last = 0; });
})();
