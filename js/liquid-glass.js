/* =========================================================
   LIQUID GLASS
   Añade refracción + aberración cromática a los elementos con clase .lg
   Solo en Chrome / Edge (son los únicos que aceptan filtros SVG en
   backdrop-filter). En Safari y Firefox se ve el vidrio normal del CSS.
   Si algún día da problemas, borra la línea <script src="js/liquid-glass.js">
   de index.html y la web sigue funcionando igual.
   ========================================================= */
(function () {
  var isChromium = !!window.chrome && CSS.supports('backdrop-filter', 'blur(1px)');
  if (!isChromium || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var defs = document.getElementById('lgDefs');
  var count = 0;

  // Crea un "mapa de desplazamiento": rojo = mover en X, verde = mover en Y.
  // Cerca del borde la luz se curva hacia dentro, como en un vidrio grueso.
  function makeMap(w, h, radius) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    var img = ctx.createImageData(w, h);
    var r = Math.min(radius, w / 2, h / 2);
    var band = Math.max(6, Math.min(w, h) * 0.42);
    var hx = w / 2, hy = h / 2;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var px = x + 0.5 - hx, py = y + 0.5 - hy;
        var qx = Math.abs(px) - (hx - r), qy = Math.abs(py) - (hy - r);
        var ox = Math.max(qx, 0), oy = Math.max(qy, 0);
        var outside = Math.hypot(ox, oy);
        var d = outside + Math.min(Math.max(qx, qy), 0) - r; // <0 dentro
        var nx, ny;
        if (outside > 0) { nx = ox / outside; ny = oy / outside; }
        else if (qx > qy) { nx = 1; ny = 0; } else { nx = 0; ny = 1; }
        nx *= Math.sign(px) || 1; ny *= Math.sign(py) || 1;
        var t = Math.min(1, Math.max(0, 1 + d / band));
        var m = t * t;
        var i = (y * w + x) * 4;
        img.data[i] = 128 - nx * m * 127;
        img.data[i + 1] = 128 - ny * m * 127;
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL();
  }

  function apply(el) {
    var w = el.offsetWidth, h = el.offsetHeight;
    if (w < 8 || h < 8) return;
    var radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || h / 2;
    var id = el.dataset.lgId || ('lg-' + (++count));
    el.dataset.lgId = id;
    var s = Math.min(36, Math.max(14, h * 0.55)); // fuerza de la refracción
    var old = document.getElementById(id);
    if (old) old.remove();
    var ns = 'http://www.w3.org/2000/svg';
    var f = document.createElementNS(ns, 'filter');
    f.setAttribute('id', id);
    f.setAttribute('x', 0); f.setAttribute('y', 0);
    f.setAttribute('width', w); f.setAttribute('height', h);
    f.setAttribute('filterUnits', 'userSpaceOnUse');
    f.setAttribute('primitiveUnits', 'userSpaceOnUse');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    f.innerHTML =
      '<feImage href="' + makeMap(w, h, radius) + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="map"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + s + '" xChannelSelector="R" yChannelSelector="G" result="dr"/>' +
      '<feColorMatrix in="dr" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + (s * 0.9) + '" xChannelSelector="R" yChannelSelector="G" result="dg"/>' +
      '<feColorMatrix in="dg" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + (s * 0.8) + '" xChannelSelector="R" yChannelSelector="G" result="db"/>' +
      '<feColorMatrix in="db" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/>' +
      '<feBlend in="r" in2="g" mode="screen" result="rg"/>' +
      '<feBlend in="rg" in2="b" mode="screen"/>';
    defs.appendChild(f);
    el.style.setProperty('--lg-filter', 'url(#' + id + ')');
    el.classList.add('lg-on');
  }

  var ro = new ResizeObserver(function (entries) {
    entries.forEach(function (e) { apply(e.target); });
  });
  window.liquidGlass = function (root) {
    (root || document).querySelectorAll('.lg').forEach(function (el) {
      if (!el.dataset.lgWatch) { el.dataset.lgWatch = 1; ro.observe(el); }
    });
  };
  window.liquidGlass();
})();
