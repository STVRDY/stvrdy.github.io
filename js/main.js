/* =========================================================
   PORTFOLIO · LÓGICA
   ---------------------------------------------------------
   Lee los archivos de /content (los mismos que edita el panel /admin)
   y llena cada sección. No hace falta tocar este archivo para
   cambiar textos, fotos o proyectos.
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let T = {};        // textos de la página (content/textos.json)
let P = {};        // perfil
let PROJECTS = []; // proyectos visibles

/* ---------- utilidades ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Rutas de archivos subidos: funcionan igual en usuario.github.io y en usuario.github.io/repo
const url = p => (p || '').replace(/^\/+/, '').replace(/ /g, '%20');
// Degradado de relleno cuando un proyecto aún no tiene portada
const hue = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
const grad = s => `linear-gradient(160deg, hsl(${hue(s)} 82% 66%), hsl(${(hue(s) + 45) % 360} 70% 36%))`;

// Saca el ID de cualquier enlace de YouTube (normal, youtu.be, shorts, embed, live)
function ytId(link) {
  const m = String(link || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : '';
}
// Miniatura automática de YouTube (si no subiste portada)
function ytThumb(id, vertical) {
  return `https://i.ytimg.com/vi/${id}/${vertical ? 'oardefault' : 'maxresdefault'}.jpg`;
}
// Si la miniatura grande no existe, usa la estándar
// Si una portada no carga, usa la miniatura de YouTube
window.coverFix = function (img) {
  img.onerror = () => thumbFix(img);
  img.onload = () => thumbFix(img);
  img.src = ytThumb(img.dataset.yt, img.dataset.v === '1');
};
window.thumbFix = function (img) {
  if (img.dataset.fixed) return;
  if (img.naturalWidth && img.naturalWidth > 120) return;
  img.dataset.fixed = 1;
  img.src = `https://i.ytimg.com/vi/${img.dataset.yt}/hqdefault.jpg`;
};

// Devuelve el HTML de la imagen/video de una pieza
function mediaHTML(x, opts = {}) {
  const vertical = x.format !== 'horizontal';
  const id = ytId(x.youtube);
  if (x.video && opts.video !== false) return `<video src="${esc(url(x.video))}" muted loop playsinline preload="metadata"${x.cover ? ` poster="${esc(url(x.cover))}"` : ''}></video>`;
  // Los enlaces i9.ytimg.com (copiados de YouTube Studio) caducan: mejor usar la miniatura automática
  const cover = /i9\.ytimg\.com/.test(x.cover || '') && id ? '' : x.cover;
  if (cover) return `<img src="${esc(url(cover))}" alt="" loading="lazy"${id ? ` data-yt="${id}" data-v="${vertical ? 1 : 0}" onerror="coverFix(this)"` : ''}>`;
  if (id) return `<img src="${ytThumb(id, vertical)}" data-yt="${id}" onload="thumbFix(this)" onerror="thumbFix(this)" alt="" loading="lazy">`;
  return opts.ph ? `<span class="ph">${esc(x.title)}</span>` : '';
}
const playable = x => !!(ytId(x.youtube) || x.video);

async function load(name) {
  const r = await fetch(`content/${name}.json`, { cache: 'no-cache' });
  if (!r.ok) throw new Error(name);
  return r.json();
}

/* ---------- arranque ---------- */
(async function start() {
  let data;
  try {
    data = await Promise.all(['textos', 'perfil', 'proyectos', 'trayectoria', 'galeria', 'mensajes', 'faq'].map(load));
  } catch (e) {
    document.body.insertAdjacentHTML('afterbegin', `<p style="position:fixed;z-index:99;inset:auto 16px 16px;padding:14px 18px;border-radius:16px;background:#ff3b30;color:#fff;font-weight:600">No se pudo cargar el contenido. Abre la página con "ver-local.bat" (no con doble clic en index.html).</p>`);
    return;
  }
  const [textos, perfil, proyectos, tray, galeria, mensajes, faq] = data;
  T = textos; P = perfil;
  PROJECTS = (proyectos.items || []).filter(x => x.visible !== false);

  applyTexts();
  renderProfile();
  renderFan();
  renderAbout();
  renderFeatured();
  renderMarquee();
  renderWork();
  renderBento(tray);
  renderGallery(galeria.items || []);
  renderMessages(mensajes.items || []);
  renderContact();
  renderSheet(faq.items || []);
  setupScroll();
  setupReveal();
  setupAdminDoor();
  setupProfileTilt();
  window.liquidGlass && window.liquidGlass();
  chatIntro();
})();

/* ---------- textos ---------- */
function applyTexts() {
  $$('[data-t]').forEach(el => { if (T[el.dataset.t] != null) el.textContent = T[el.dataset.t]; });
  document.title = `${P.name || 'Portfolio'} — ${P.role || 'Portfolio'}`;
  document.documentElement.lang = T.lang || 'es';
  $('#cName').placeholder = T.contact_name || '';
  $('#cMsg').placeholder = T.contact_message || '';
  $('#cEmail').placeholder = T.contact_email_ph || '';
  $('#chatInput').placeholder = T.chat_placeholder || 'iMessage';
}

/* ---------- perfil ---------- */
const initials = n => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
function renderProfile() {
  $('#pName').textContent = P.name || '';
  $('#pStatus').textContent = [P.status, P.location].filter(Boolean).join(' · ');
  $('#avatar').innerHTML = P.avatar ? `<img src="${esc(url(P.avatar))}" alt="${esc(P.name)}">` : esc(initials(P.name));
  const logo = P.logo || P.avatar;
  $('#navLogo').outerHTML = logo ? `<img src="${esc(url(logo))}" alt="${esc(P.name)}"${P.logo ? ' class="is-logo"' : ''}>` : `<span>${esc(initials(P.name))}</span>`;
  $('#toName').textContent = P.name || '';
  $('#footName').textContent = [P.name, T.footer_note].filter(Boolean).join(' · ');
  $('#copy').textContent = '© ' + new Date().getFullYear();

  // Píldoras "@" alrededor del perfil
  const spots = innerWidth < 640
    ? ['left:4%;top:13%', 'right:4%;top:11%', 'left:3%;top:34%', 'right:3%;top:35%']
    : ['left:14%;top:22%', 'left:80%;top:18%', 'left:9%;top:70%', 'left:86%;top:66%', 'left:24%;top:88%', 'left:74%;top:86%', 'left:50%;top:9%'];
  $('#tags').innerHTML = (P.tags || []).slice(0, spots.length).map((t, i) =>
    `<span class="tag" style="${spots[i]};--d:${(.25 + i * .07).toFixed(2)}">@${esc(t.replace(/\s+/g, ''))}</span>`).join('');
}

/* ---------- chat del perfil ---------- */
function bubble(html, me, raw) {
  const b = document.createElement('div');
  b.className = 'b' + (me ? ' me' : '');
  raw ? (b.innerHTML = html) : (b.textContent = html);
  $('#chat').append(b);
  requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('in')));
}
function trimChat() {
  const box = $('#chat');
  while (box.children.length > 5) box.firstElementChild.remove();
}
async function chatIntro() {
  const input = $('#chatInput');
  const msgs = P.chat || [];
  await wait(reduced ? 0 : 700);
  for (const m of msgs) {
    if (!reduced) for (const ch of m) { input.value += ch; await wait(18 + Math.random() * 30); }
    await wait(reduced ? 0 : 220);
    input.value = '';
    bubble(m, true); trimChat();
    await wait(reduced ? 0 : 420);
  }
  const d = document.createElement('div');
  d.className = 'delivered'; d.textContent = T.delivered || 'Entregado';
  $('#chat').append(d);
  input.readOnly = false;
  setChatInput('msg');
}
// Paso 1: el visitante escribe su mensaje. Paso 2: le pedimos el correo. Paso 3: se envía.
const chat = { step: 'msg', msg: '' };
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
async function botSay(html, raw) {
  await wait(400);
  const t = document.createElement('div');
  t.className = 'typing'; t.innerHTML = '<i></i><i></i><i></i>';
  $('#chat').append(t);
  await wait(900); t.remove();
  bubble(html, false, raw); trimChat();
}
function setChatInput(step) {
  const input = $('#chatInput');
  chat.step = step;
  input.type = step === 'email' ? 'email' : 'text';
  input.placeholder = step === 'email' ? (T.contact_email_ph || 'tu@correo.com') : (T.contact_message || '');
}
$('#chatForm').addEventListener('submit', async e => {
  e.preventDefault();
  const input = $('#chatInput'), v = input.value.trim();
  if (!v || input.readOnly) return;
  input.value = '';
  $('.delivered', $('#chat'))?.remove();
  bubble(v, true); trimChat();
  if (chat.step === 'msg') {
    chat.msg = v;
    if (!P.form_key) return botSay(fallbackHTML(v), true);
    setChatInput('email');
    return botSay(T.chat_ask_email || '¿A qué correo te respondo?');
  }
  if (!isEmail(v)) return botSay(T.chat_bad_email || 'Ese correo no parece válido.');
  input.readOnly = true;
  try {
    await sendForm({ email: v, message: chat.msg, source: 'Chat del inicio' });
    const d = document.createElement('div');
    d.className = 'delivered'; d.textContent = T.delivered || 'Entregado';
    $('#chat').append(d);
    await botSay(T.chat_sent || '¡Listo! Te respondo pronto.');
  } catch (err) {
    await botSay(fallbackHTML(chat.msg), true);
  }
  input.readOnly = false;
  setChatInput('msg');
});

/* ---------- abanico de tarjetas ---------- */
function renderFan() {
  const list = [...PROJECTS].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 9);
  const order = [0, -1, 1, -2, 2, -3, 3, -4, 4];
  $('#fan').innerHTML = list.map((x, n) => {
    const i = order[n];
    return `<div class="fcard" data-k="${PROJECTS.indexOf(x)}" style="--i:${i};--a:${Math.abs(i)};--g:${grad(x.title)}">${mediaHTML(x, { video: false })}</div>`;
  }).join('');
  $$('.fcard').forEach(c => c.onclick = () => openProject(PROJECTS[c.dataset.k]));
}

/* ---------- sobre mí: palabras que se encienden ---------- */
function words(el, text) {
  const w = String(text || '').split(/\s+/).filter(Boolean);
  el.innerHTML = w.map((x, i) => `<span class="w" style="--k:${(i / w.length).toFixed(3)}">${esc(x)}</span>`).join(' ');
}
function renderAbout() { words($('#about'), P.about); }

/* ---------- destacados ---------- */
function renderFeatured() {
  // El teléfono es vertical: se usan los destacados verticales (máx. 4)
  let f = PROJECTS.filter(x => x.featured && x.format !== 'horizontal');
  if (!f.length) f = PROJECTS.filter(x => x.format !== 'horizontal').slice(0, 4);
  f = f.slice(0, 4);
  const [main, ...rest] = f;
  if (main) {
    const scr = $('#phoneScreen');
    scr.style.setProperty('--g', grad(main.title));
    scr.innerHTML = mediaHTML(main) + (playable(main) ? '<span class="play">▶</span>' : '') +
      `<span class="cap">${esc(main.title)}<small>${esc([main.client, main.year].filter(Boolean).join(' · '))}</small></span>`;
    $('#phone').onclick = () => openProject(main);
    const v = $('video', scr); if (v) { v.autoplay = true; v.play().catch(() => {}); }
  }
  $('#featRow').innerHTML = rest.map(x => `
    <article class="fitem" data-k="${PROJECTS.indexOf(x)}">
      <div class="thumb" style="--g:${grad(x.title)}">${mediaHTML(x, { video: false })}</div>
      <h3>${esc(x.title)}</h3>
      <p>${esc([x.role, x.client].filter(Boolean).join(' · '))}</p>
    </article>`).join('');
  $$('.fitem').forEach(c => c.onclick = () => openProject(PROJECTS[c.dataset.k]));

  const clients = [...new Set(f.map(x => x.client).filter(Boolean))].slice(0, 4);
  const pos = ['left:3%;top:30%', 'right:3%;top:22%', 'left:1%;top:64%', 'right:1%;top:58%'];
  $('#boxPills').innerHTML = clients.slice(0, innerWidth < 640 ? 2 : 4).map((c, i) => `<span class="tag" style="${pos[i]};--d:${(.2 + i * .06).toFixed(2)}">@${esc(c)}</span>`).join('');
}

/* ---------- marquesina ---------- */
function renderMarquee() {
  const w = P.marquee || [];
  if (!w.length) { $('#marquee').remove(); return; }
  const pics = PROJECTS.slice(0, 8);
  let html = '';
  for (let r = 0; r < 3; r++) w.forEach((t, i) => {
    const x = pics[(i + r * w.length) % Math.max(1, pics.length)];
    html += `<span>${esc(t)}</span>` + (x ? `<span class="mi" style="--g:${grad(x.title)}">${mediaHTML(x, { video: false })}</span>` : '<span>✦</span>');
  });
  $('#marqueeTrack').innerHTML = html;
}

/* ---------- cuadrícula de trabajo ---------- */
const CATS = ['video', 'motion', 'montage', 'longform', 'render3d', 'branding', 'diseno', 'foto'];
const catLabel = c => T['cat_' + c] || c;
const state = { cat: 'all', format: 'vertical', open: false };
function renderWork() {
  const present = CATS.filter(c => PROJECTS.some(x => x.category === c));
  $('#filters').innerHTML = ['all', ...present].map(c =>
    `<button role="tab" data-cat="${c}" class="${state.cat === c ? 'on' : ''}">${esc(c === 'all' ? T.cat_all || 'Todo' : catLabel(c))}</button>`).join('');
  $$('#filters button').forEach(b => b.onclick = () => { state.cat = b.dataset.cat; state.open = false; renderWork(); });
  $$('.ratio button').forEach(b => {
    b.classList.toggle('on', b.dataset.format === state.format);
    b.onclick = () => { state.format = b.dataset.format; state.open = false; renderWork(); };
  });
  const list = PROJECTS.filter(x => (x.format || 'vertical') === state.format && (state.cat === 'all' || x.category === state.cat));
  const limit = state.format === 'vertical' ? 8 : 6;
  const shown = state.open ? list : list.slice(0, limit);
  const grid = $('#grid');
  grid.className = 'grid ' + state.format;
  grid.innerHTML = shown.length ? shown.map((x, n) => `
    <article class="tile" style="--n:${n % limit}" data-k="${PROJECTS.indexOf(x)}">
      <div class="media" style="--g:${grad(x.title)}">${mediaHTML(x, { ph: true })}${playable(x) ? '<span class="play">▶</span>' : ''}</div>
      <div class="lbl"><b>${esc(x.title)}</b><span>${esc([catLabel(x.category), x.year].filter(Boolean).join(' · '))}</span></div>
    </article>`).join('') : `<p class="empty">—</p>`;
  $$('.tile', grid).forEach(t => t.onclick = () => openProject(PROJECTS[t.dataset.k]));
  const more = $('#moreWork');
  more.hidden = list.length <= limit;
  more.textContent = state.open ? (T.see_less || 'Ver menos') : (T.see_more || 'Ver más');
  more.onclick = () => { state.open = !state.open; renderWork(); if (!state.open) $('#todo').scrollIntoView(); };
  observeReveal($$('.tile', grid));
  observeVideos($$('video', grid));
}

/* ---------- trayectoria (bento) ---------- */
const isNow = e => e.current || /actual|hoy|present|now/i.test(e.years || '');
function renderBento(d) {
  const s = d.stats || [];
  const stat = (x, cls = '') => x ? `<div class="k" data-count="${Number(x.value) || 0}" data-suffix="${esc(x.suffix || '')}">0${esc(x.suffix || '')}</div><div class="l ${cls}">${esc(x.label)}</div>` : '';
  const colors = ['#0a84ff', '#bf5af2', '#ff9f0a', '#30d158', '#ff375f', '#64d2ff', '#ffd60a'];
  const chip = (html, i, c) => `<span class="chip" style="--ci:${i}">${c ? `<i style="--c:${c}"></i>` : ''}${html}</span>`;
  const img = d.image || P.avatar; // sin imagen propia, usa tu foto de perfil
  const xp = d.experience || [];
  $('#bento').innerHTML = `
    <div class="bc bc-img" style="--n:0">${img ? `<img src="${esc(url(img))}" alt="" loading="lazy">` : ''}<span class="shade"></span><div>${stat(s[0])}</div></div>
    <div class="bc bc-blue" style="--n:1"><span class="orb"></span>${stat(s[1])}</div>
    <div class="bc bc-wide" style="--n:2"><h3>${esc(T.programs_title || '')}</h3>
      <div class="chips">${(d.programs || []).map((p, i) => chip(esc(p), i, colors[i % colors.length])).join('')}</div></div>
    <div class="bc bc-wide bc-mesh" style="--n:3"><h3>${esc(T.languages_title || '')}</h3>
      <div class="chips">${(d.languages || []).map((l, i) => chip(`<b>${esc(l.name)}</b><small>${esc(l.level)}</small>`, i)).join('')}</div></div>
    <div class="bc bc-mint" style="--n:4">${stat(s[2])}</div>
    ${(d.services || []).length ? `<div class="bc bc-full" style="--n:5"><h3>${esc(T.services_title || '')}</h3>
      <div class="chips">${d.services.map((x, i) => chip(esc(x), i)).join('')}</div></div>` : ''}
    ${xp.length ? `<div class="bc bc-xp" data-scene="pass" style="--n:6">
      <span class="xp-glow" aria-hidden="true"></span>
      <header class="xp-head"><h3>${esc(T.experience_title || '')}</h3><span>${xp.length} ${esc(T.experience_count || '')}</span></header>
      <ol class="xp">${xp.map((e, i) => `
        <li class="xp-i${isNow(e) ? ' is-now' : ''}" style="--n:${i}">
          <span class="xp-logo">${e.logo ? `<img src="${esc(url(e.logo))}" alt="${esc(e.company)}" loading="lazy">` : `<b>${esc(initials(e.company))}</b>`}</span>
          <div class="xp-txt"><b>${esc(e.role)}</b><span>${esc(e.company)}</span>${e.description ? `<p>${esc(e.description)}</p>` : ''}</div>
          <div class="xp-when">${isNow(e) ? `<span class="now"><i></i>${esc(T.experience_now || 'Actual')}</span>` : ''}<em>${esc(e.years || '')}</em></div>
        </li>`).join('')}</ol></div>` : ''}`;
  observeReveal($$('.bc'), el => $$('[data-count]', el).forEach(countUp));
  observeReveal($$('.xp-i'));
  setupGlow($$('.bc'));
  renderWorkflow(d.workflow || []);
}

/* Luz que sigue al ratón + leve inclinación 3D (solo con ratón) */
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
function setupGlow(els) {
  if (!finePointer || reduced) return;
  els.forEach(el => {
    const tilt = !el.classList.contains('bc-xp');
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      if (tilt) { el.style.setProperty('--ry', ((x / r.width - .5) * 7).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((.5 - y / r.height) * 7).toFixed(2) + 'deg'); }
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
}
function setupProfileTilt() {
  if (!finePointer || reduced) return;
  const stage = $('.hero-stage'), card = $('#profile');
  stage.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    card.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg');
    card.style.setProperty('--rx', (-y * 14).toFixed(2) + 'deg');
    card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
  });
  stage.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
}

/* ---------- workflow (pasos de trabajo) ---------- */
function renderWorkflow(steps) {
  if (!steps.length) { $('#workflow').remove(); return; }
  $('#flowRow').innerHTML = steps.map((s, i) => `
    <article class="step" style="--n:${i};--g:${grad(s.title)}">
      ${s.image ? `<img src="${esc(url(s.image))}" alt="" loading="lazy">` : ''}
      <div class="step-body"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
    </article>`).join('');
  observeReveal($$('.step'));
}
function countUp(el) {
  const end = +el.dataset.count, suf = el.dataset.suffix, t0 = performance.now(), dur = reduced ? 1 : 1400;
  (function step(t) {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(end * e) + suf;
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* ---------- galería ---------- */
let GALLERY = [];
function renderGallery(items) {
  GALLERY = items;
  words($('#galleryTitle'), T.gallery_title);
  // posición (x%, y%), tamaño, velocidad y giro de cada imagen
  const spots = [[12, 16, 120, 260, 14], [30, 8, 84, 160, -10], [70, 10, 104, 220, 8], [88, 22, 132, 300, -12], [6, 46, 92, 180, -8], [94, 50, 96, 200, 10],
    [16, 80, 128, 280, 10], [36, 90, 88, 170, -6], [64, 88, 116, 240, 12], [86, 82, 90, 190, -10], [24, 38, 64, 120, 6], [78, 38, 70, 140, -6]];
  const small = innerWidth < 640;
  const big = Math.max(1, Math.min(1.7, innerWidth / 1440)); // escala en monitores grandes
  $('#scatter').innerHTML = spots.map((s, i) => {
    const x = items[i % Math.max(1, items.length)] || {};
    const key = (x.caption || '') + i;
    return `<div class="sc" data-g="${i % Math.max(1, items.length)}" style="left:${s[0]}%;top:${s[1]}%;--s:${small ? s[2] * .6 : Math.round(s[2] * big)}px;--sp:${Math.round(s[3] * big)}px;--r:${s[4]}deg;--g:${grad(key)}">${x.image ? `<img src="${esc(url(x.image))}" alt="" loading="lazy">` : ''}</div>`;
  }).join('');
  $$('.sc').forEach(el => el.onclick = () => openGallery());
  $('#openGallery').onclick = openGallery;
}
function openGallery() {
  const v = $('#viewerIn');
  v.className = 'viewer-in gal';
  v.innerHTML = `<button class="v-close lg lg-light" aria-label="Cerrar">✕</button><div class="masonry">${GALLERY.map((x, i) => `
    <figure style="--g:${grad((x.caption || '') + i)}">${x.image ? `<img src="${esc(url(x.image))}" alt="${esc(x.caption)}" loading="lazy">` : `<div class="v-ph" style="--ar:${[0.8, 1, 1.25, 0.75][i % 4]}">${esc(x.caption)}</div>`}${x.caption && x.image ? `<figcaption>${esc(x.caption)}</figcaption>` : ''}</figure>`).join('')}</div>`;
  showViewer();
}

/* ---------- mensajes ---------- */
function renderMessages(items) {
  if (!items.length) { $('#mensajes').remove(); return; }
  const pop = (m, i) => `<div class="pop${i % 5 === 3 ? ' me' : ''}"><em>${esc(m.emoji || '💬')}</em><b>${esc([m.name, m.company].filter(Boolean).join(' · '))}</b><span>${esc(m.message)}</span></div>`;
  const fill = arr => { let out = []; while (out.length < 14) out = out.concat(arr); return out; };
  $('#row1').innerHTML = fill(items).map(pop).join('');
  $('#row2').innerHTML = fill([...items].reverse()).map(pop).join('');
}

/* ---------- contacto ----------
   Los mensajes se envían con Web3Forms (gratis). La clave va en el panel:
   Perfil y contacto → "Clave de Web3Forms". Sin clave, se ofrece WhatsApp y copiar el correo. */
const wa = t => `https://wa.me/${String(P.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(t)}`;
async function sendForm({ name = '', email, message, source }) {
  if (!P.form_key) throw new Error('Falta la clave de Web3Forms');
  const r = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: P.form_key,
      subject: `Portfolio · mensaje de ${name || email}`,
      from_name: name || 'Visitante del portfolio',
      name, email, message, origen: source
    })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.message || 'Error ' + r.status);
}
// Plan B: WhatsApp + botón para copiar el correo
function fallbackHTML(msg) {
  const parts = [];
  if (P.whatsapp) parts.push(`<a href="${wa(msg)}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (P.email) parts.push(`<button type="button" class="copy-mail" data-copy="${esc(P.email)}">${esc(P.email)}</button>`);
  return `${esc(T.chat_fallback || 'Escríbeme por')} ${parts.join(' · ')}`;
}
document.addEventListener('click', async e => {
  const b = e.target.closest('.copy-mail');
  if (!b) return;
  try { await navigator.clipboard.writeText(b.dataset.copy); }
  catch { const r = document.createRange(); r.selectNodeContents(b); getSelection().removeAllRanges(); getSelection().addRange(r); }
  const old = b.textContent; b.textContent = T.copied || 'Copiado ✓';
  setTimeout(() => b.textContent = old, 1600);
});
function renderContact() {
  const form = $('#cForm'), status = $('#cStatus'), btn = $('#cSend');
  const updWa = () => $('#cWa').href = wa(`Hola, soy ${$('#cName').value || ''}. ${$('#cMsg').value}`);
  $('#cName').oninput = $('#cMsg').oninput = updWa; updWa();
  if (!P.whatsapp) $('#cWa').hidden = true;
  $('#cCopy').dataset.copy = P.email || '';
  $('#cCopy').textContent = T.copy_email || 'Copiar correo';
  if (!P.email) $('#cCopy').hidden = true;
  const say = (cls, html) => { status.className = 'c-status ' + cls; status.innerHTML = html; };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#cName').value.trim(), email = $('#cEmail').value.trim(), message = $('#cMsg').value.trim();
    if (!message || !isEmail(email)) return say('warn', esc(T.contact_need || 'Escribe tu mensaje y un correo válido.'));
    btn.disabled = true; form.classList.add('sending'); say('', esc(T.contact_sending || 'Enviando…'));
    try {
      await sendForm({ name, email, message, source: 'Formulario de contacto' });
      // El mensaje enviado aparece como burbuja azul de iMessage
      $('#cSent').insertAdjacentHTML('beforeend', `<div class="b me in">${esc(message)}</div>`);
      $('#cMsg').value = '';
      say('ok', esc(T.contact_sent || 'Entregado. Te respondo pronto.'));
    } catch (err) {
      say('err', fallbackHTML(message));
    }
    btn.disabled = false; form.classList.remove('sending');
  });
  $('#socials').innerHTML = (P.socials || []).filter(s => s.url).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join('');
}

/* ---------- menú ••• ---------- */
function renderSheet(faq) {
  const links = [['#trabajo', 'nav_work'], ['#sobre', 'nav_about'], ['#trayectoria', 'nav_background'], ['#galeria', 'nav_gallery']];
  $('#sheetIn').innerHTML = `
    ${links.map(([h, k]) => `<a class="mi-row mob" href="${h}" data-close>${esc(T[k] || '')}<span>›</span></a>`).join('')}
    ${P.cv ? `<a class="mi-row" href="${esc(url(P.cv))}" download target="_blank" rel="noopener">${esc(T.cv_button || 'CV')}<span>↓</span></a>` : ''}
    <h3 style="margin-top:18px">${esc(T.faq_title || '')}</h3>
    ${faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
    <button class="mi-row" data-close>${esc(T.close || 'Cerrar')}<span>✕</span></button>`;
  const sheet = $('#sheet');
  $('#moreBtn').onclick = () => sheet.showModal();
  sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('[data-close]')) sheet.close(); });
}

/* ---------- visor de proyectos ---------- */
function openProject(x) {
  if (!x) return;
  const vertical = x.format !== 'horizontal';
  const id = ytId(x.youtube);
  const imgs = [x.cover, ...(x.images || [])].filter(Boolean);
  let media;
  if (id) media = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="${esc(x.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  else if (x.video) media = `<video src="${esc(url(x.video))}" controls autoplay playsinline loop></video>`;
  else if (imgs.length) media = `<img id="vMain" src="${esc(url(imgs[0]))}" alt="${esc(x.title)}">`;
  else media = `<div class="v-ph" style="--g:${grad(x.title)}">${esc(x.title)}</div>`;
  const v = $('#viewerIn');
  v.className = 'viewer-in ' + (vertical ? 'vertical' : 'horizontal');
  v.innerHTML = `
    <button class="v-close lg lg-light" aria-label="Cerrar">✕</button>
    <div class="v-media">${media}</div>
    <div class="v-info">
      <h3>${esc(x.title)}</h3>
      <div class="v-meta">${esc([catLabel(x.category), x.client, x.role, x.year].filter(Boolean).join(' · '))}</div>
      ${x.description ? `<p>${esc(x.description)}</p>` : ''}
      ${imgs.length > 1 || (imgs.length && (id || x.video)) ? `<div class="v-thumbs">${imgs.map(s => `<button data-src="${esc(url(s))}"><img src="${esc(url(s))}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
    </div>`;
  $$('.v-thumbs button', v).forEach(b => b.onclick = () => {
    $('.v-media', v).innerHTML = `<img id="vMain" src="${b.dataset.src}" alt="">`;
  });
  showViewer();
}
function showViewer() {
  const d = $('#viewer');
  d.showModal();
  window.liquidGlass && window.liquidGlass(d);
}
(() => {
  const d = $('#viewer');
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('.v-close')) d.close(); });
  d.addEventListener('close', () => { $('#viewerIn').innerHTML = ''; }); // detiene el video al cerrar
})();

/* ---------- animaciones de scroll ----------
   Cada sección con data-scene recibe --p (0 → 1):
   sticky = progreso mientras la sección está "pegada"
   pass   = progreso mientras la sección cruza la pantalla */
function setupScroll() {
  const scenes = $$('[data-scene]');
  const root = document.documentElement;
  let ticking = false;
  function update() {
    const vh = innerHeight;
    for (const el of scenes) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      let p = el.dataset.scene === 'sticky' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      el.style.setProperty('--p', Math.min(1, Math.max(0, reduced ? 1 : p)).toFixed(4));
    }
    root.style.setProperty('--sky', Math.min(1, Math.max(0, (scrollY - vh * .7) / (vh * .9))).toFixed(3));
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}

/* Aparecer al entrar en pantalla */
let io;
function observeReveal(els, cb) {
  io = io || new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); e.target._cb && e.target._cb(e.target); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -5% 0px' });
  els.forEach(el => { el._cb = cb; io.observe(el); });
}
function setupReveal() {}

/* Videos subidos: solo se reproducen cuando se ven */
let vio;
function observeVideos(vs) {
  vio = vio || new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause()), { threshold: .3 });
  vs.forEach(v => vio.observe(v));
}

/* ---------- puerta secreta al panel ----------
   1) Mantén pulsada tu foto de perfil 1,5 segundos (vibra un poco)
   2) En los 10 segundos siguientes, toca 3 veces el © del pie de página
   → abre /admin (que además pide tu inicio de sesión de GitHub) */
function setupAdminDoor() {
  const av = $('#avatar');
  let timer, armed = 0, taps = 0;
  const cancel = () => clearTimeout(timer);
  av.addEventListener('pointerdown', () => {
    timer = setTimeout(() => {
      armed = Date.now(); taps = 0;
      av.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], 320);
      navigator.vibrate && navigator.vibrate(30);
    }, 1500);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => av.addEventListener(ev, cancel));
  av.addEventListener('contextmenu', e => e.preventDefault());
  $('#copy').addEventListener('click', () => {
    if (armed && Date.now() - armed < 10000) {
      if (++taps >= 3) location.href = 'admin/';
    } else taps = 0;
  });
}
