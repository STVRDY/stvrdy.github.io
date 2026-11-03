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
const scrollHooks = []; // funciones que se llaman en cada scroll

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
    data = await Promise.all(['textos', 'perfil', 'proyectos', 'trayectoria', 'mensajes', 'faq'].map(load));
  } catch (e) {
    document.body.insertAdjacentHTML('afterbegin', `<p style="position:fixed;z-index:99;inset:auto 16px 16px;padding:14px 18px;border-radius:16px;background:#ff3b30;color:#fff;font-weight:600">No se pudo cargar el contenido. Abre la página con "ver-local.bat" (no con doble clic en index.html).</p>`);
    return;
  }
  const [textos, perfil, proyectos, tray, mensajes, faq] = data;
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

/* ---------- cuadrícula de trabajo ----------
   Mosaico tipo "masonry": cada pieza ocupa su altura real.
   Videos: 9:16 o 16:9. Diseños y fotos: el tamaño original de la imagen. */
const CATS = ['video', 'motion', 'montage', 'longform', 'render3d', 'branding', 'diseno', 'foto'];
const catLabel = c => T['cat_' + c] || c;
const state = { cat: 'all', format: 'vertical', open: false };
const isImage = x => !playable(x); // sin video: es diseño o foto
const fmtOf = x => x.format || 'vertical';
let firstWork = true;

function renderWork() {
  const inFormat = PROJECTS.filter(x => fmtOf(x) === state.format);
  // si el formato no tiene piezas de esa categoría, vuelve a "Todo"
  if (state.cat !== 'all' && !inFormat.some(x => x.category === state.cat)) state.cat = 'all';
  const present = CATS.filter(c => inFormat.some(x => x.category === c));
  $('#filters').innerHTML = ['all', ...present].map(c => {
    const n = c === 'all' ? inFormat.length : inFormat.filter(x => x.category === c).length;
    return `<button role="tab" data-cat="${c}" class="${state.cat === c ? 'on' : ''}">${esc(c === 'all' ? T.cat_all || 'Todo' : catLabel(c))}<sup>${n}</sup></button>`;
  }).join('');
  $$('#filters button').forEach(b => b.onclick = () => { state.cat = b.dataset.cat; state.open = false; renderWork(); });

  // selector de formato con contador y píldora que se desliza
  $$('.ratio button').forEach(b => {
    const n = PROJECTS.filter(x => fmtOf(x) === b.dataset.format).length;
    b.classList.toggle('on', b.dataset.format === state.format);
    b.setAttribute('aria-selected', b.dataset.format === state.format);
    $('.cnt', b).textContent = n;
    b.disabled = !n;
    b.onclick = () => { if (state.format !== b.dataset.format) { state.format = b.dataset.format; state.open = false; renderWork(); } };
  });
  movePill();

  const list = inFormat.filter(x => state.cat === 'all' || x.category === state.cat);
  const limit = 12;
  const shown = state.open ? list : list.slice(0, limit);
  const grid = $('#grid');

  // FLIP: recuerda dónde estaba cada pieza para animarla a su nuevo sitio
  const before = new Map($$('.tile', grid).map(t => [t.dataset.k, t.getBoundingClientRect()]));

  grid.className = 'grid ' + state.format;
  grid.innerHTML = shown.length ? shown.map((x, n) => {
    const img = isImage(x);
    const ar = img ? '4 / 5' : (fmtOf(x) === 'horizontal' ? '16 / 9' : '9 / 16');
    const count = [x.cover, ...(x.images || [])].filter(Boolean).length;
    return `
    <article class="tile${img ? ' is-img' : ''}" style="--n:${n % limit}" data-k="${PROJECTS.indexOf(x)}" tabindex="0" data-tag="${esc(img ? (T.cursor_image || 'Ver') : (T.cursor_video || 'Ver video'))}">
      <div class="tile-in">
        <div class="media" style="--g:${grad(x.title)};--ar:${ar}">
          ${mediaHTML(x, { ph: true })}
          <span class="glare"></span>
          <span class="cat">${esc(catLabel(x.category))}</span>
          ${count > 1 ? `<span class="stack">${count}</span>` : ''}
          ${playable(x) ? '<span class="play">▶</span>' : ''}
        </div>
        <div class="lbl"><b>${esc(x.title)}</b><span>${esc([x.client, x.year].filter(Boolean).join(' · '))}</span></div>
      </div>
    </article>`;
  }).join('') : `<p class="empty">—</p>`;

  const tiles = $$('.tile', grid);
  tiles.forEach(t => {
    t.onclick = () => openProject(PROJECTS[t.dataset.k]);
    t.onkeydown = e => { if (e.key === 'Enter') openProject(PROJECTS[t.dataset.k]); };
    // diseños y fotos: usa la proporción real de la imagen
    const im = $('.is-img .media img', t) || (t.classList.contains('is-img') && $('img', t));
    if (im) {
      const fit = () => { if (im.naturalWidth) $('.media', t).style.setProperty('--ar', `${im.naturalWidth} / ${im.naturalHeight}`); };
      im.complete ? fit() : im.addEventListener('load', fit);
    }
  });
  layoutGrid();
  setupTileFx(tiles);

  if (firstWork) { observeReveal(tiles); firstWork = false; }
  else {
    tiles.forEach((t, i) => {
      t.classList.add('in');
      const old = before.get(t.dataset.k), now = t.getBoundingClientRect();
      if (reduced) return;
      if (old) t.animate([{ transform: `translate(${old.left - now.left}px, ${old.top - now.top}px) scale(${old.width / now.width})` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
      else t.animate([{ opacity: 0, transform: 'translateY(30px) scale(.92)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 600, delay: Math.min(i, 12) * 40, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    });
  }
  const more = $('#moreWork');
  more.hidden = list.length <= limit;
  more.textContent = state.open ? (T.see_less || 'Ver menos') : `${T.see_more || 'Ver más'} (+${Math.max(0, list.length - limit)})`;
  more.onclick = () => { state.open = !state.open; renderWork(); if (!state.open) $('#todo').scrollIntoView(); };
  observeVideos($$('video', grid));
}

// mueve la píldora del selector de formato debajo del botón activo
function movePill() {
  const on = $('.ratio button.on'), pill = $('.ratio-pill');
  if (!on || !pill) return;
  pill.style.width = on.offsetWidth + 'px';
  pill.style.transform = `translateX(${on.offsetLeft - 4}px)`;
}

// Mosaico: cada pieza ocupa tantas filas de 8 px como mida de alto
const gridRO = new ResizeObserver(() => layoutGrid());
function layoutGrid() {
  const grid = $('#grid');
  if (!grid) return;
  $$('.tile', grid).forEach(t => {
    const h = $('.tile-in', t).getBoundingClientRect().height;
    t.style.gridRowEnd = `span ${Math.ceil((h + 22) / 8)}`;
    // columna de la pieza → velocidad distinta al hacer scroll (efecto parallax)
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const col = Math.round(t.offsetLeft / (grid.clientWidth / cols));
    t.style.setProperty('--sp', [0, 1, -.4, .7, -.2][col % 5]);
    if (!t._ro) { t._ro = 1; gridRO.observe($('.tile-in', t)); }
  });
}
addEventListener('resize', () => { layoutGrid(); movePill(); });

// Inclinación + brillo en cada pieza y etiqueta que sigue al cursor
const cursorTag = { x: 0, y: 0, tx: 0, ty: 0, on: false, raf: 0 };
function setupTileFx(tiles) {
  if (!finePointer || reduced) return;
  const tag = $('#cursorTag');
  tiles.forEach(t => {
    const m = $('.media', t);
    t.addEventListener('pointerenter', () => { tag.textContent = (t.classList.contains('is-img') ? '' : '▶ ') + t.dataset.tag; tag.classList.add('on'); cursorTag.on = true; loopTag(); });
    t.addEventListener('pointerleave', () => { tag.classList.remove('on'); cursorTag.on = false; m.style.setProperty('--rx', '0deg'); m.style.setProperty('--ry', '0deg'); });
    t.addEventListener('pointermove', e => {
      const r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      m.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg');
      m.style.setProperty('--rx', ((.5 - y) * 10).toFixed(2) + 'deg');
      m.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      m.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      cursorTag.tx = e.clientX; cursorTag.ty = e.clientY;
    });
  });
}
function loopTag() {
  if (cursorTag.raf) return;
  const tag = $('#cursorTag');
  const step = () => {
    cursorTag.x += (cursorTag.tx - cursorTag.x) * .22; cursorTag.y += (cursorTag.ty - cursorTag.y) * .22;
    tag.style.transform = `translate(${cursorTag.x}px, ${cursorTag.y}px)`;
    cursorTag.raf = cursorTag.on || Math.abs(cursorTag.tx - cursorTag.x) > .5 ? requestAnimationFrame(step) : 0;
  };
  cursorTag.raf = requestAnimationFrame(step);
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
        <li class="xp-i${isNow(e) ? ' is-now' : ''}${e.description ? ' has-more' : ''}" style="--n:${i}"${e.description ? ' tabindex="0"' : ''}>
          <span class="xp-logo">${e.logo ? `<img src="${esc(url(e.logo))}" alt="${esc(e.company)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('b'), { textContent: '${esc(initials(e.company))}' }))">` : `<b>${esc(initials(e.company))}</b>`}</span>
          <div class="xp-txt"><b>${esc(e.role)}</b><span>${esc(e.company)}${e.description ? `<i class="xp-hint" aria-hidden="true">+</i>` : ''}</span>
            ${e.description ? `<div class="xp-more"><p>${esc(e.description)}</p></div>` : ''}</div>
          <div class="xp-when">${isNow(e) ? `<span class="now"><i></i>${esc(T.experience_now || 'Actual')}</span>` : ''}<em>${esc(e.years || '')}</em></div>
        </li>`).join('')}</ol></div>` : ''}`;
  observeReveal($$('.bc'), el => $$('[data-count]', el).forEach(countUp));
  observeReveal($$('.xp-i'));
  // En móvil (sin hover) se despliega al tocar
  $$('.xp-i.has-more').forEach(li => li.addEventListener('click', () => { if (!finePointer) li.classList.toggle('open'); }));
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

/* ---------- mensajes de clientes ----------
   Tarjetas estilo widget de iOS: tarjeta oscura + pestaña de color debajo.
   Al bajar pasan en horizontal; la del centro crece y saca su pestaña. */
const TAB_COLORS = { verde: '#a6f25c', azul: '#64b5ff', rosa: '#ff8fc7', naranja: '#ffb35c', morado: '#b9a3ff', amarillo: '#ffe066' };
const CLOCK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M5 3 2 6M19 3l3 3"/></svg>';
function renderMessages(items) {
  if (!items.length) { $('#mensajes').remove(); return; }
  const cols = Object.values(TAB_COLORS);
  $('#wtrack').innerHTML = items.map((m, i) => `
    <article class="wcard" style="--tab:${TAB_COLORS[m.color] || cols[i % cols.length]}">
      <div class="w-main">
        <header class="w-top"><span>${esc(m.company || T.messages_client || 'Cliente')}</span>${m.date ? `<span class="w-time">${CLOCK}${esc(m.date)}</span>` : ''}</header>
        <div class="w-who">
          <span class="w-av">${m.photo ? `<img src="${esc(url(m.photo))}" alt="" loading="lazy">` : esc(initials(m.name))}</span>
          <div><b>${esc(m.name)}</b><small><i></i>${esc(m.role || T.messages_verified || 'Cliente')}</small></div>
        </div>
        <p class="w-msg">“${esc(m.message)}”</p>
      </div>
      <div class="w-tab"><span>${esc(m.emoji || '⚡')}</span>${esc(m.tag || m.company || '')}</div>
    </article>`).join('');
  $('#wdots').innerHTML = items.map(() => '<i></i>').join('');
  // la altura de la sección define cuánto hay que bajar para verlas todas
  if (!reduced) $('#mensajes').style.height = `calc(100vh + ${Math.max(1, items.length - 1) * 55}vh)`;
  scrollHooks.push(updateMessages);
}
function updateMessages() {
  const sec = $('#mensajes'), track = $('#wtrack');
  if (!sec || reduced) return;
  const r = sec.getBoundingClientRect(), vh = innerHeight;
  if (r.bottom < 0 || r.top > vh) return;
  const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
  const cards = $$('.wcard', track);
  const first = cards[0], last = cards[cards.length - 1];
  const span = (last.offsetLeft + last.offsetWidth / 2) - (first.offsetLeft + first.offsetWidth / 2);
  const x = p * span;
  track.style.transform = `translateX(${-x}px)`;
  const center = first.offsetLeft + first.offsetWidth / 2 + x;
  let active = 0;
  cards.forEach((c, i) => {
    const d = Math.max(-1.5, Math.min(1.5, (c.offsetLeft + c.offsetWidth / 2 - center) / (c.offsetWidth + 40)));
    c.style.setProperty('--d', d.toFixed(3));
    c.style.setProperty('--a', Math.min(1, Math.abs(d)).toFixed(3));
    if (Math.abs(d) < .5) active = i;
  });
  $$('#wdots i').forEach((dot, i) => dot.classList.toggle('on', i === active));
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
  const links = [['#trabajo', 'nav_work'], ['#sobre', 'nav_about'], ['#trayectoria', 'nav_background'], ['#contacto', 'say_hi']];
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

/* ---------- visor de proyectos ----------
   Videos: YouTube. Diseños y fotos: imagen a su tamaño real, con flechas si hay varias. */
function openProject(x) {
  if (!x) return;
  const vertical = x.format !== 'horizontal';
  const id = ytId(x.youtube);
  const imgs = [x.cover, ...(x.images || [])].filter(Boolean);
  const v = $('#viewerIn');
  let idx = 0;
  const imgHTML = i => `<img class="v-img" src="${esc(url(imgs[i]))}" alt="${esc(x.title)}">${imgs.length > 1 ? `
      <button class="v-nav prev lg lg-light" aria-label="Anterior">‹</button><button class="v-nav next lg lg-light" aria-label="Siguiente">›</button>
      <span class="v-count">${i + 1} / ${imgs.length}</span>` : ''}`;
  let media, kind;
  if (id) { kind = vertical ? 'vertical' : 'horizontal'; media = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="${esc(x.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; }
  else if (x.video) { kind = vertical ? 'vertical' : 'horizontal'; media = `<video src="${esc(url(x.video))}" controls autoplay playsinline loop></video>`; }
  else if (imgs.length) { kind = 'image'; media = imgHTML(0); }
  else { kind = vertical ? 'vertical' : 'horizontal'; media = `<div class="v-ph" style="--g:${grad(x.title)}">${esc(x.title)}</div>`; }
  v.className = 'viewer-in ' + kind;
  v.innerHTML = `
    <button class="v-close lg lg-light" aria-label="Cerrar">✕</button>
    <div class="v-media">${media}</div>
    <div class="v-info">
      <span class="v-cat">${esc(catLabel(x.category))}</span>
      <h3>${esc(x.title)}</h3>
      <div class="v-meta">${esc([x.client, x.role, x.year].filter(Boolean).join(' · '))}</div>
      ${x.description ? `<p>${esc(x.description)}</p>` : ''}
      ${imgs.length > 1 || (imgs.length && (id || x.video)) ? `<div class="v-thumbs">${imgs.map((s, i) => `<button data-i="${i}"><img src="${esc(url(s))}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
    </div>`;
  const show = i => {
    idx = (i + imgs.length) % imgs.length;
    v.className = 'viewer-in image';
    $('.v-media', v).innerHTML = imgHTML(idx);
    $$('.v-thumbs button', v).forEach(b => b.classList.toggle('on', +b.dataset.i === idx));
  };
  v.onclick = e => {
    if (e.target.closest('.v-nav.prev')) show(idx - 1);
    else if (e.target.closest('.v-nav.next')) show(idx + 1);
    else if (e.target.closest('.v-thumbs button')) show(+e.target.closest('button').dataset.i);
  };
  v.onkeydown = null;
  $('#viewer').onkeydown = e => {
    if (!imgs.length || v.classList.contains('vertical') || v.classList.contains('horizontal')) return;
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  };
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
    scrollHooks.forEach(f => f());
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
