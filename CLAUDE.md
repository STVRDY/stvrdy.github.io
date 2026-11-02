# Portfolio — notas para Claude Code

El dueño no es programador. Explica los cambios en español, en pocas palabras, y mantén todo simple de reparar.

## Cómo está hecho
- Sitio estático para GitHub Pages, **sin paso de build** (nada de npm, frameworks ni bundlers). HTML + CSS + JS puro.
- `index.html` es solo el esqueleto. `js/main.js` carga los JSON de `content/` con `fetch` y llena cada sección.
- El contenido lo edita el dueño desde el panel **Sveltia CMS** en `/admin` (`admin/config.yml`). Si añades o cambias un campo en un JSON de `content/`, **actualiza también `admin/config.yml`** para que el panel lo muestre, y mantenlo válido.
- Archivos subidos: `assets/uploads/`. Las rutas pueden empezar con `/`; `main.js` las vuelve relativas con `url()`.
- Videos largos: enlaces de YouTube (campo `youtube`), nunca archivos pesados en el repo.

## Animaciones
- Las secciones con `data-scene="sticky"` o `data-scene="pass"` reciben `--p` (0 → 1) desde `setupScroll()` en `main.js`. Las animaciones se escriben en CSS con `var(--p)`.
- `.lg` = botón/elemento con liquid glass. `js/liquid-glass.js` añade la refracción solo en Chromium; el resto usa el vidrio del CSS.
- Respeta `prefers-reduced-motion`.

## Reglas
- No metas dependencias externas sin necesidad. Si hace falta una, cárgala desde un CDN con versión fija.
- Comenta en español las partes nuevas.
- Prueba en móvil (390 px) y escritorio, sin scroll horizontal.
- Ver en local: `ver-local.bat` (o `python -m http.server 8000`).
- La guía para el dueño es `GUIA.md`: actualízala si cambias cómo se usa algo.
