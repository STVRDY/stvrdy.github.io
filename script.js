const reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;
const isTouch = matchMedia("(hover: none)").matches;

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const PLAY_SVG = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

/* ============================================================================
   1. SMOOTH SCROLL  (lenis-like, propio, sin dependencias)
   ============================================================================ */
const Scroll = (() => {
  let target = window.scrollY, current = window.scrollY, rafId = null, running = false;
  const ease = 0.085;
  const enabled = !reduceMotion && !isTouch;

  function onWheel(e) {
    if (document.body.classList.contains("lb-open")) return;
    e.preventDefault();
    target = clamp(target + e.deltaY, 0, document.documentElement.scrollHeight - innerHeight);
    if (!running) { running = true; loop(); }
  }
  function loop() {
    current = lerp(current, target, ease);
    if (Math.abs(target - current) < 0.4) { current = target; running = false; }
    window.scrollTo(0, current);
    onScrollFrame(current);
    if (running) rafId = requestAnimationFrame(loop);
  }
  const subs = [];
  function onScrollFrame(y) { subs.forEach(fn => fn(y)); }

  function init() {
    if (enabled) {
      addEventListener("wheel", onWheel, { passive: false });
      // mantener sincronizado si el usuario usa teclado / barra / anclas
      addEventListener("scroll", () => { if (!running) { target = current = window.scrollY; onScrollFrame(window.scrollY); } }, { passive: true });
    } else {
      addEventListener("scroll", () => onScrollFrame(window.scrollY), { passive: true });
    }
  }
  function scrollTo(y) {
    target = clamp(y, 0, document.documentElement.scrollHeight - innerHeight);
    if (enabled) { if (!running) { running = true; loop(); } }
    else window.scrollTo({ top: target, behavior: "smooth" });
  }
  return { init, scrollTo, onScroll: fn => subs.push(fn), get y() { return current; } };
})();

/* ============================================================================
   2. RENDER — tarjetas desde data.js
   ============================================================================ */
function cardHTML(w, i, forceVertical) {
  const isVideo = w.type === "video";
  /* const src = isVideo ? `https://img.youtube.com/vi/${w.youtube}/hqdefault.jpg` : w.img; */
  const src = isVideo ? (w.thumbnail || `https://img.youtube.com/vi/${w.youtube}/hqdefault.jpg`): w.img;
  const isVertical = w.vertical || forceVertical;
  const dataAttr = isVideo
    ? `data-video="${w.youtube}"${isVertical ? ' data-vertical="1"' : ''}`
    : `data-img="${w.img}"`;
  const playBtn = isVideo ? `<div class="card__play">${PLAY_SVG}</div>` : "";
  return `
  <a class="card reveal ${isVideo ? "is-video" : "is-image"}" data-cat="${slug(w.tag)}" ${dataAttr}
     data-cursor="${isVideo ? "play" : "view"}" style="--i:${i}">
    <div class="card__media">
      <img src="${src}" alt="${w.title}" loading="lazy" onerror="this.style.display='none';">
      <div class="ph"></div>
    </div>
    ${playBtn}
    <span class="card__tag">${w.tag}</span>
    <div class="card__meta"><h3>${w.title}</h3><p>${w.sub || ""}</p></div>
  </a>`;
}

function renderFeatured() {
  const grid = $("#featuredGrid");
  if (!grid) return;
  grid.innerHTML = WORKS.filter(w => w.featured).slice(0, 6).map((w, i) => cardHTML(w, i, true)).join("");
}

function renderArchive() {
  const grid = $("#archiveGrid");
  if (!grid) return;
  grid.innerHTML = WORKS.map((w, i) => cardHTML(w, i)).join("");

  const bar = $("#filterBar");
  if (!bar) return;
  const counts = {};
  WORKS.forEach(w => counts[w.tag] = (counts[w.tag] || 0) + 1);
  const btns = [`<button class="filter-btn on" data-filter="all">All</button>`]
    .concat(CATEGORIES.filter(c => counts[c]).map(c => `<button class="filter-btn" data-filter="${slug(c)}">${c}</button>`));
  bar.innerHTML = btns.join("") + `<span class="filter-count" id="filterCount"></span>`;

  const cards = $$(".card", grid);
  const countEl = $("#filterCount");
  const setCount = n => { if (countEl) countEl.textContent = `${n} / ${WORKS.length}`; };
  setCount(WORKS.length);

  $$(".filter-btn", bar).forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".filter-btn", bar).forEach(b => b.classList.remove("on"));
      btn.classList.add("on");
      const f = btn.dataset.filter;
      let shown = 0, delay = 0;
      cards.forEach(card => {
        const ok = f === "all" || card.dataset.cat === f;
        if (ok) {
          shown++;
          card.classList.remove("hide");
          card.style.transitionDelay = (delay++ * 0.03) + "s";
          requestAnimationFrame(() => card.classList.remove("filter-out"));
        } else {
          card.classList.add("filter-out");
          card.style.transitionDelay = "0s";
          setTimeout(() => card.classList.add("hide"), 300);
        }
      });
      setCount(shown);
    });
  });
}

function renderCategory() {
  const grid = $("#categoryGrid");
  if (!grid) return;
  const cat = grid.dataset.category;
  const titleEl = $("#categoryTitle");
  if (titleEl) titleEl.textContent = cat;
  const items = WORKS.filter(w => w.tag === cat);
  grid.innerHTML = items.length
    ? items.map((w, i) => cardHTML(w, i)).join("")
    : `<p class="empty">Aún no hay trabajos en esta categoría.</p>`;
}

/* ============================================================================
   3. REVEAL on scroll (Intersection Observer)
   ============================================================================ */
function initReveals() {
  if (reduceMotion) { $$(".reveal, .reveal-up").forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal, .reveal-up, .card").forEach(el => io.observe(el));
}

/* ============================================================================
   4. SPLIT text (about) — palabra por palabra al hacer scroll
   ============================================================================ */
function initSplit() {
  const el = $("[data-split]");
  if (!el) return;
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(" ");
  const spans = $$(".word", el);
  if (reduceMotion) { spans.forEach(s => s.style.opacity = 1); return; }
  function update() {
    const r = el.getBoundingClientRect();
    const start = innerHeight * 0.85, end = innerHeight * 0.35;
    const p = clamp((start - r.top) / (start - end), 0, 1);
    const lit = Math.floor(p * spans.length);
    spans.forEach((s, i) => s.style.opacity = i <= lit ? 1 : 0.14);
  }
  Scroll.onScroll(update);
  addEventListener("resize", update);
  update();
}

/* ============================================================================
   5. COUNTERS
   ============================================================================ */
function initCounters() {
  const els = $$("[data-count]");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count;
      if (reduceMotion) { el.textContent = end + (end >= 40 ? "+" : ""); io.unobserve(el); return; }
      let start = null;
      const dur = 1600;
      function step(t) {
        if (!start) start = t;
        const p = clamp((t - start) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * end) + (end >= 40 ? "+" : "");
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
}

/* ============================================================================
   6. HERO intro + parallax
   ============================================================================ */
function initHero() {
  const hero = $(".hero");
  if (!hero) return;
  if (!reduceMotion) {
    // parallax de los glows con el mouse + scroll
    const g1 = $(".g1"), g2 = $(".g2"), inner = $(".hero__inner");
    if (!isTouch) {
      addEventListener("mousemove", e => {
        const dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
        if (g1) g1.style.transform = `translate(${dx*60}px, ${dy*40}px)`;
        if (g2) g2.style.transform = `translate(${dx*-40}px, ${dy*-30}px)`;
        if (inner) inner.style.transform = `translate(${dx*12}px, ${dy*8}px)`;
      });
    }
    Scroll.onScroll(y => {
      if (y < innerHeight * 1.2) {
        if (g1) g1.style.marginTop = (y * 0.25) + "px";
        if (g2) g2.style.marginTop = (y * -0.12) + "px";
      }
    });
  }
}

/* ============================================================================
   7. WORKFLOW — scroll horizontal con sticky (nativo)
   ============================================================================ */
function initWorkflow() {
  const flow = $(".flow"), sticky = $(".flow__sticky"), track = $("#flowTrack");
  if (!flow || !track) return;

  if (isTouch || innerWidth <= 720) {
    // móvil: scroll vertical natural, sólo revelamos cada tarjeta
    flow.classList.add("flow--stacked");
    return;
  }

  function setHeight() {
    const pad = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pad")) || 40;
    const dist = track.scrollWidth - innerWidth + pad * 2;
    flow.style.height = (innerHeight + Math.max(dist, 0)) + "px";
    return Math.max(dist, 0);
  }
  let dist = setHeight();
  // recalcular cuando todo (fuentes/imágenes) haya cargado y en resize
  addEventListener("load", () => { dist = setHeight(); onFrame(Scroll.y); });
  addEventListener("resize", () => { dist = setHeight(); onFrame(Scroll.y); });
  // recalculo de seguridad por si las imágenes de fondo tardan
  setTimeout(() => { dist = setHeight(); onFrame(Scroll.y); }, 600);
  setTimeout(() => { dist = setHeight(); onFrame(Scroll.y); }, 1500);

  function onFrame(y) {
    const start = flow.offsetTop;
    const p = clamp((y - start) / (flow.offsetHeight - innerHeight), 0, 1);
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
  }
  Scroll.onScroll(onFrame);
  onFrame(Scroll.y);
}

/* ============================================================================
   8. LIGHTBOX — video (vertical sin bordes) + imagen
   ============================================================================ */
function initLightbox() {
  const lb = $("#lightbox");
  if (!lb) return;
  const frame = $("#lbFrame"), img = $("#lbImg"), closeBtn = $("#lbClose");

  const open = () => { lb.classList.add("active"); document.body.classList.add("lb-open"); };
  function openVideo(id, vertical) {
    lb.classList.remove("is-image"); lb.classList.add("is-video");
    lb.classList.toggle("vertical", !!vertical);
    if (img) img.src = "";
    frame.src = `https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&playsinline=1`;
    open();
  }
  function openImage(src) {
    lb.classList.remove("is-video"); lb.classList.add("is-image");
    frame.src = "";
    img.src = src;
    open();
  }
  function close() {
    lb.classList.remove("active");
    document.body.classList.remove("lb-open");
    setTimeout(() => { frame.src = ""; if (img) img.src = ""; lb.classList.remove("is-image", "is-video", "vertical"); }, 400);
  }

  document.addEventListener("click", e => {
    const card = e.target.closest("[data-video], [data-img]");
    if (!card) return;
    e.preventDefault();
    if (card.dataset.video) openVideo(card.dataset.video, card.dataset.vertical);
    else if (card.dataset.img) openImage(card.dataset.img);
  });
  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox__stage")) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && lb.classList.contains("active")) close(); });
}

/* ============================================================================
   9. CURSOR personalizado
   ============================================================================ */
function initCursor() {
  const cur = $(".cursor"), dot = $(".cursor-dot");
  if (!cur || !dot || isTouch) return;
  let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
  addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  (function loop(){
    cx = lerp(cx, mx, 0.18); cy = lerp(cy, my, 0.18);
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", e => {
    const t = e.target.closest('a, button, [data-cursor], .card, .serv__row');
    if (!t) return;
    cur.classList.add(t.dataset.cursor === "play" ? "play" : "hover");
  });
  document.addEventListener("mouseout", e => {
    const t = e.target.closest('a, button, [data-cursor], .card, .serv__row');
    if (!t) return;
    cur.classList.remove("play", "hover");
  });
}

/* ============================================================================
   10. NAV hide/show + curtain
   ============================================================================ */
function initNav() {
  const nav = $("#nav");
  if (!nav) return;
  let lastY = 0;
  Scroll.onScroll(y => {
    nav.classList.toggle("hidden", y > lastY && y > 240);
    lastY = y;
  });
}

function initCurtain() {
  const curtain = $("#curtain");
  if (!curtain) return;
  curtain.classList.add("js-active");
  if (reduceMotion) { curtain.style.display = "none"; heroIntro(); return; }
  const mark = curtain.querySelector("span");
  mark.style.transform = "translateY(110%)";
  mark.style.opacity = "0";
  requestAnimationFrame(() => {
    mark.style.transition = "transform .7s var(--ease), opacity .7s var(--ease)";
    mark.style.transform = "translateY(0)";
    mark.style.opacity = "1";
  });
  setTimeout(() => {
    mark.style.transform = "translateY(-110%)";
    mark.style.opacity = "0";
  }, 1050);
  setTimeout(() => {
    curtain.style.transition = "transform .8s var(--ease)";
    curtain.style.transform = "translateY(-100%)";
  }, 1300);
  setTimeout(() => { curtain.style.display = "none"; heroIntro(); }, 2100);
}

function heroIntro() {
  $$(".hero h1 .line span").forEach((s, i) => {
    s.style.transition = `transform 1.1s var(--ease) ${i * 0.12}s`;
    requestAnimationFrame(() => s.style.transform = "translateY(0)");
  });
  const fadeUp = $$(".hero__tag, .hero__roles, .page-hero p, .page-hero .eyebrow");
  fadeUp.forEach((el, i) => {
    el.style.transition = `opacity .9s var(--ease) ${0.3 + i*0.08}s, transform .9s var(--ease) ${0.3 + i*0.08}s`;
    requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
  });
}

/* ============================================================================
   11. Anclas suaves
   ============================================================================ */
function initAnchors() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      Scroll.scrollTo(el.getBoundingClientRect().top + window.scrollY - 30);
    });
  });
}

/* ============================================================================
   INIT
   ============================================================================ */
renderFeatured();
renderArchive();
renderCategory();
Scroll.init();
initReveals();
initSplit();
initCounters();
initHero();
initWorkflow();
initLightbox();
initCursor();
initNav();
initAnchors();
initCurtain();
