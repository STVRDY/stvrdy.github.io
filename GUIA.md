# Guía del portfolio

Esta guía explica cómo ver, publicar, editar y arreglar tu web. No hace falta saber programar para el día a día: todo se hace desde el **panel** (`/admin`).

---

## 0. Antes de subir

Esta versión va **sin tus proyectos ni fotos**: lo que ves en Trabajo, Galería y Trayectoria son ejemplos para que tú los cambies desde el panel. Ya tiene tu nombre, correo, WhatsApp, LinkedIn, Instagram y los dos mensajes de clientes que me diste.

En `assets/uploads/` quedaron las imágenes de tu portfolio anterior ya comprimidas (portadas de videos, fotos, diseños, el logo del ojo y las imágenes del workflow). No se usan en ninguna parte todavía:
- Si las quieres usar, déjalas: aparecerán en el panel para elegirlas al crear proyectos.
- Si no, bórralas antes de subir (deja el archivo `.gitkeep`).

---

## 1. Qué hay en la carpeta

```
Portfolio/
├── index.html            ← el esqueleto de la página (casi nunca se toca)
├── css/styles.css        ← colores, tamaños y animaciones
├── js/main.js            ← lee el contenido y lo pone en la página
├── js/liquid-glass.js    ← efecto de vidrio líquido del menú y botones
├── content/              ← TODO tu contenido (lo edita el panel)
│   ├── perfil.json         nombre, foto, chat, contacto, redes
│   ├── proyectos.json      tus trabajos
│   ├── trayectoria.json    cifras, programas, idiomas, experiencia
│   ├── mensajes.json       mensajes de clientes
│   ├── faq.json            preguntas frecuentes (menú •••)
│   └── textos.json         textos del menú, títulos y botones
├── archive.html          ← redirige el enlace viejo "archive.html"
├── robots.txt / sitemap.xml ← para Google
├── assets/uploads/       ← fotos, PDF y loops que subes desde el panel
├── admin/                ← el panel de administración
│   ├── index.html
│   └── config.yml          ← configuración del panel (ya tiene tu usuario)
├── ver-local.bat         ← abre la web en tu PC
├── GUIA.md               ← esta guía
└── CLAUDE.md             ← instrucciones para Claude Code
```

**Regla de oro:** el contenido vive en `content/` y en `assets/uploads/`. El diseño vive en `css/` y `js/`. Si cambias contenido, no rompes el diseño, y al revés.

---

## 2. Ver la web en tu PC

1. Haz doble clic en **`ver-local.bat`**.
2. Se abre el navegador en `http://localhost:8000`.
3. Para apagarla, cierra la ventana negra.

> Si abres `index.html` con doble clic, verás un aviso rojo: el navegador no deja leer los archivos de `content/` así. Usa siempre `ver-local.bat`.
>
> Necesita Python instalado. Si la ventana dice que no lo encuentra, instálalo desde python.org y marca **"Add Python to PATH"**.

---

## 3. Publicar en GitHub (solo la primera vez)

Tu usuario es **STVRDY** y ya tienes el repositorio **`stvrdy.github.io`** con tu portfolio anterior. La web nueva va a **reemplazarlo** en `https://stvrdy.github.io`. GitHub guarda la versión vieja en el historial, así que siempre puedes recuperarla.

La forma más fácil sin comandos es **GitHub Desktop** (desktop.github.com).

1. Abre GitHub Desktop e inicia sesión con tu cuenta.
2. **File → Clone repository →** elige `STVRDY/stvrdy.github.io`. Clónalo en una carpeta **distinta**, por ejemplo `D:\stvrdy.github.io`.
3. **Guarda una copia del portfolio viejo:** en GitHub Desktop, menú **Branch → New branch**, nómbrala `portfolio-viejo`, pulsa **Publish branch**. Luego vuelve a la rama **main** (arriba, "Current branch").
4. Abre la carpeta clonada en el Explorador y **borra todo excepto la carpeta oculta `.git`** (no la toques).
5. Copia **todo** lo que hay dentro de `D:\Portfolio` y pégalo en esa carpeta clonada.
6. En GitHub Desktop verás los cambios. Escribe un resumen (por ejemplo "Portfolio nuevo"), pulsa **Commit to main** y luego **Push origin**.
7. En github.com, abre el repositorio → **Settings → Pages** y comprueba:
   - Source: **Deploy from a branch**
   - Branch: **main**, carpeta **/ (root)**
8. Espera 1–2 minutos y abre `https://stvrdy.github.io`.

Desde ese momento, la carpeta clonada es tu carpeta de trabajo (puedes borrar `D:\Portfolio` o dejarla como respaldo).

---

## 4. Activar el panel (solo la primera vez)

1. `admin/config.yml` ya está apuntando a tu repositorio `STVRDY/stvrdy.github.io`. No hay que cambiar nada.
2. Ve a `https://stvrdy.github.io/admin/`.
3. Pulsa **Sign In Using Access Token** y sigue el enlace que aparece. En GitHub:
   - Repository access: **Only select repositories** → tu repositorio.
   - Permissions → **Contents: Read and write**.
   - Expiration: la que quieras (por ejemplo 1 año). Cuando caduque, creas otro igual.
4. Copia el token, pégalo en el panel y entra.

El token se guarda solo en ese navegador. **No lo compartas con nadie**: quien lo tenga puede editar tu web. Si lo pierdes o sospechas algo, bórralo en GitHub → Settings → Developer settings → Personal access tokens.

> **Puerta secreta:** en tu propia web, mantén pulsada tu foto de perfil 1,5 segundos (hace un pequeño "salto"), y en los 10 segundos siguientes toca **3 veces el ©** del final de la página. Te lleva al panel. También puedes ir directo a `/admin/`. La seguridad real la da el token, no la puerta.

---

## 5. El día a día en el panel

Cada vez que pulsas **Save**, el panel guarda el cambio en GitHub y la web se actualiza sola en **1–2 minutos**. Si no lo ves, recarga con **Ctrl + F5**.

### Añadir un proyecto
1. **Contenido → Proyectos → Add proyecto** (sale arriba de la lista).
2. Rellena:
   - **Título**, **Categoría** (Video Editing, Motion Graphics, Montage, Long Format, 3D, Branding, Graphic Design, Photography) y **Formato** (Vertical 9:16 u Horizontal 16:9). Los filtros de la web solo muestran las categorías que tienen proyectos.
   - **Enlace de YouTube**: sirve el enlace normal, `youtu.be/…` o un Short (`youtube.com/shorts/…`).
   - **Portada** (recomendada): 1080×1920 para vertical, 1920×1080 para horizontal. Sin portada se usa la miniatura de YouTube, que en los Shorts a veces sale recortada.
   - **Destacado**: los 4 primeros destacados **verticales** salen en el teléfono y debajo de él, y los destacados salen primero en el abanico del inicio.
3. **Save**.

### Formato vertical / horizontal
En la web, el selector **Formato** (Vertical 9:16 · Horizontal 16:9) muestra cuántas piezas hay de cada tipo. Cada proyecto va en uno u otro según su campo **Formato**. Los diseños y fotos se muestran con el tamaño real de la imagen.

### Ordenar
Arrastra los proyectos en la lista. El de arriba sale primero.

### Esconder sin borrar
Apaga **Visible en la web**. Útil si un cliente te pide quitar una pieza: lo apagas, guardas y en 2 minutos ya no está.

### Videos
- Los videos largos van en **YouTube** (público u "oculto") y se pegan como enlace.
- El campo **Video corto en bucle** es solo para loops pequeños (menos de 25 MB, sin sonido), por ejemplo un motion de 5 segundos. Se reproduce solo en la cuadrícula.
- Si un video de YouTube no se reproduce en tu web, el dueño del canal desactivó la opción de insertarlo. Se arregla en YouTube Studio → el video → "Permitir insertar".

### Foto de perfil, CV y contacto
**Contenido → Perfil y contacto.** Ahí cambias foto, logo del menú, CV (PDF), correo, WhatsApp (solo números con código de país, por ejemplo `18095551234`), los mensajes del chat del inicio, el texto de "Sobre mí", las píldoras @ y tus redes. Una red sin enlace no aparece.

### Lo demás
- **Trayectoria**: las 3 cifras, programas, idiomas, servicios, el workflow (pasos con imagen) y experiencia. Si dejas la experiencia vacía, esa tarjeta no aparece.
- **Mensajes de clientes**: salen como widgets de iOS. Cada uno tiene nombre, cargo, foto (opcional), empresa, fecha, mensaje y una pestaña de color con un emoji y una frase corta (por ejemplo "⚡ Entrega en 24 horas").
- **Preguntas frecuentes**: aparecen en el menú •••.
- **Textos de la página**: menú, títulos y botones. Sirve para pasar la web a inglés.

Las fotos que subes se convierten solas a WebP y se reducen a 2200 px, así la web carga rápido.

---

## 5b. Recibir mensajes (importante, solo la primera vez)

El chat del inicio y el formulario de contacto envían los mensajes a tu correo con **Web3Forms**, un servicio gratis (250 mensajes al mes).

1. Entra en **web3forms.com**, escribe tu correo y pulsa **Create Access Key**.
2. Te llega un correo con tu **Access Key** (una clave larga). Cópiala.
3. En el panel: **Perfil y contacto → Clave de Web3Forms** → pega la clave → **Save**.
4. Prueba: escribe en el chat de tu web. Te pedirá un correo para responder y el mensaje te llegará a tu bandeja (revisa también Spam la primera vez).

Esa clave puede verse en el código de la página: es normal, Web3Forms está hecho así y solo sirve para enviarte mensajes a ti.

Sin la clave, la web no se rompe: en vez de enviar, ofrece **WhatsApp** y un botón para **copiar tu correo**.

### Experiencia con logos
En **Trayectoria → Experiencia** cada puesto tiene **Logo de la empresa** (mejor PNG o SVG cuadrado, con fondo transparente o blanco), **Fechas**, **Es mi trabajo actual** (pone la etiqueta verde "Actual") y **Qué hacías** (opcional). Si no subes logo, se muestran las iniciales de la empresa.

### Campos vacíos
Ninguna lista del panel es obligatoria: puedes dejar vacíos el workflow, los servicios o la experiencia y la sección simplemente no aparece.

### Portadas copiadas de YouTube Studio
Si pegas como portada un enlace que empieza por `https://i9.ytimg.com/...`, ese enlace caduca a los pocos días. La web lo detecta y usa la miniatura automática del video. Lo mejor es descargar la imagen y subirla al panel como **Portada**.

---

## 6. Trabajar sin internet (opcional)

1. Abre `ver-local.bat`.
2. Ve a `http://localhost:8000/admin/` con **Chrome o Edge**.
3. Pulsa **Work with Local Repository** y elige tu carpeta de trabajo (la carpeta clonada del repositorio).
4. Los cambios se guardan en tu PC. Para publicarlos: GitHub Desktop → **Commit** → **Push origin**.

**Importante:** si editaste online, antes de editar en local pulsa **Fetch origin / Pull** en GitHub Desktop. Así no se pisan los cambios.

---

## 7. Si algo se rompe

| Problema | Solución |
|---|---|
| Aviso rojo "No se pudo cargar el contenido" en tu PC | Abre la web con `ver-local.bat`, no con doble clic. |
| Aviso rojo en la web publicada | Un archivo de `content/` quedó mal escrito (normalmente por editarlo a mano). En GitHub Desktop → **History** → clic derecho en el último cambio → **Revert changes in commit** → Push. |
| Aviso rojo "Recarga la página con Ctrl + F5" | El navegador guardó una versión anterior. Recarga con Ctrl + F5. Si cambias `css/` o `js/`, sube el número `?v=` en `index.html`. |
| No veo un cambio | Espera 2 minutos y recarga con Ctrl + F5. En GitHub → pestaña **Actions** ves si la publicación sigue en curso. |
| El panel dice que no encuentra el repositorio | Revisa la línea `repo:` de `admin/config.yml` y que el token tenga **Contents: Read and write** en ese repositorio. |
| El token dejó de funcionar | Caducó. Crea uno nuevo (paso 4). |
| Una imagen no aparece | Súbela de nuevo desde el panel. No renombres archivos dentro de `assets/uploads/` a mano. |
| El vidrio del menú se ve raro | Borra la línea `<script src="js/liquid-glass.js"></script>` en `index.html`. Queda un vidrio normal. |

**Volver atrás siempre es posible:** GitHub guarda cada cambio. En GitHub Desktop → History puedes deshacer cualquiera.

---

## 8. Cambiar el diseño

- **Colores y medidas:** al principio de `css/styles.css` (sección "1. COLORES Y MEDIDAS"). Cambiar `--blue` cambia el azul de toda la web.
- **Animaciones de scroll:** cada sección con `data-scene` recibe un número `--p` que va de 0 a 1 mientras bajas. En el CSS verás cosas como `translateY(calc((1 - var(--p)) * 300px))`: eso mueve el teléfono 300 px según `--p`.
- Para cambios grandes, abre la carpeta en **Claude Code** y pídeselo en español. El archivo `CLAUDE.md` le explica cómo está hecho el proyecto.

---

## 9. Límites a tener en cuenta

- GitHub Pages recomienda que el repositorio no pase de **1 GB**, y ningún archivo puede pasar de **100 MB**. Por eso los videos van en YouTube.
- El panel no deja subir archivos de más de **25 MB**.
- El repositorio es público: no subas contratos, datos de clientes ni material sin publicar.
