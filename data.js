/* ============================================================================
   ⭐ TU LISTA DE TRABAJOS — EL ÚNICO ARCHIVO QUE NECESITAS EDITAR ⭐
   ============================================================================

   Cada bloque { ... } es UN trabajo. Para añadir uno nuevo, copia un bloque,
   pégalo, y cambia los datos. El sitio (Home, Archive y páginas de categoría)
   se llena solo desde esta lista.

   CAMPOS:
   ---------------------------------------------------------------------------
   type   : "video"  → se reproduce en pantalla completa (usa "youtube")
            "image"  → foto/diseño, se abre en grande al hacer clic (usa "img")
   tag    : la categoría. USA EXACTAMENTE UNA DE ESTAS (respeta mayúsculas):
              "Video Editing"
              "Motion Graphics"
              "Branding"
              "Graphic Design"
              "Photography"
   title  : el nombre que se muestra
   sub    : texto pequeño debajo del título (cliente, año, lo que quieras)
   youtube: SOLO para type:"video". El ID del video de YouTube.
            En https://www.youtube.com/watch?v=ABC123 el ID es  ABC123
   vertical: (opcional) pon  true  si el video es vertical (Reel/Short/TikTok).
             Así se muestra en formato 9:16 sin bordes negros.
   img    : SOLO para type:"image". La ruta de tu imagen en assets/
   featured: (opcional) pon  true  para que aparezca en la Home. Máximo 6.
   ---------------------------------------------------------------------------
============================================================================ */

const WORKS = [


              /* Video Editing */

  {
    type: "video",
    tag: "Video Editing",
    title: "Whatspetona X RedEye",
    thumbnail: "assets/thumbnails/Whatspetona.webp",
    sub: "Blender Animation",
    youtube: "yv8D6X61BqE",
    featured: true,
    vertical: true
  },

  {
    type: "video",
    tag: "Video Editing",
    title: "Kboarddot X RedEye",
    thumbnail: "assets/thumbnails/Sketch.webp",
    sub: "Sketch Reel",
    youtube: "9Q0OUfR8EkI",
    vertical: true,
    featured: true
  },

  {
    type: "video",
    tag: "Video Editing",
    title: "Martinez Device X RedEye",
    thumbnail: "assets/thumbnails/MartinezDevice1.webp",
    sub: "Planned Obsolescence",
    youtube: "jPiH2U72sdw",
    vertical: true,
    featured: true
  },
    {
    type: "video",
    tag: "Video Editing",
    title: "NÜCLEO X RedEye",
    thumbnail: "assets/thumbnails/NÜCLEO.webp",
    sub: "Anniversary",
    youtube: "h3Uhf-wU8sE",
    vertical: true,
    featured: false
  } ,

    {
    type: "video",
    tag: "Video Editing",
    title: "Revenue Black X RedEye",
    sub: "Content Pillars",
    youtube: "dEaxqHFXwHM",
    vertical: true,
    featured: false
  } ,

    {
    type: "video",
    tag: "Video Editing",
    title: "Invent Wedding X RedEye",
    sub: "Destination Weddings",
    youtube: "a0-GAl9okhw",
    vertical: true,
    featured: false
  } ,

    {
    type: "video",
    tag: "Video Editing",
    title: "VFX / SFX Showcase",
    sub: "Showcase",
    youtube: "RPzXoalbqYo",
    vertical: true,
    featured: false
  } ,

    {
    type: "video",
    tag: "Video Editing",
    title: "Kboarddot X RedEye",
    sub: "Unboxing WIN60 He",
    youtube: "boCw6qVB5p4",
    vertical: true,
    featured: false
  } ,

        {
    type: "video",
    tag: "Video Editing",
    title: "VFX Showcase",
    sub: "Blender VFX",
    youtube: "YSyWnzbDkmc",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Martinez Device X RedEye",
    sub: "Unboxing PC Blocks",
    youtube: "-tunTa0XAi4",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Martinez Device X RedEye",
    sub: "Unboxing So DIMM Adapter",
    youtube: "jEz7PDhYNxM",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Martinez Device X RedEye",
    sub: "HotWheels Collection",
    youtube: "0ZzAWBRIxPU",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Golf Lux Escape X RedEye",
    sub: "Golf Courses",
    youtube: "yiAeh7ZaVwE",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Golf Lux Escape X RedEye",
    sub: "Golf Courses",
    youtube: "XkKNi2iPLbs",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Reválida Dental X RedEye",
    sub: "Degree recognized",
    youtube: "7wGLrugk35Q",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Reválida Dental X RedEye",
    sub: "Practicing in the USA",
    youtube: "8hPnnltgv4I",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Video Editing",
    title: "Kboarddot X RedEye",
    sub: "Product Review",
    youtube: "tlo5_7gsC34",
    vertical: true,
    featured: false
  } ,
        {
    type: "video",
    tag: "Video Editing",
    title: "Cinetic Loop",
    sub: "Blender Animation",
    youtube: "M6Ya957nCbA",
    vertical: false,
    featured: false
  } ,

            /* Motion Graphics */

         {
    type: "video",
    tag: "Motion Graphics",
    title: "Apple AD",
    thumbnail: "assets/thumbnails/Apple.webp",
    sub: "Work in progress",
    youtube: "RwrLyA96AKI",
    vertical: true,
    featured: true
  } ,

      {
    type: "video",
    tag: "Motion Graphics",
    title: "Logo Animation",
    thumbnail: "assets/thumbnails/RedEye.webp",
    sub: "Logo Outro",
    youtube: "_pUhm-8-l6M",
    vertical: true,
    featured: true
  } ,

           {
    type: "video",
    tag: "Motion Graphics",
    title: "Motion Graphic - Ebay",
    thumbnail: "assets/thumbnails/Ebay.webp",
    sub: "Concept",
    youtube: "ko7NeLo3NiY",
    vertical: true,
    featured: false
  } ,

      {
    type: "video",
    tag: "Motion Graphics",
    title: "Outro",
    sub: "Logo Animation",
    youtube: "FF5_YjyM9HA",
    vertical: true,
    featured: false
  } ,

  /* Montage */
        {
    type: "video",
    tag: "Montage",
    title: "Car Edit",
    thumbnail: "assets/thumbnails/brzmontage.webp",
    sub: "Toyota BRZ",
    youtube: "beKDFqerR-Y",
    vertical: true,
    featured: true
  },

          {
    type: "video",
    tag: "Montage",
    title: "Cinetic Transition",
    thumbnail: "assets/thumbnails/sentra.webp",
    sub: "Car Edit",
    youtube: "fhL4fB1jF_s",
    vertical: false,
    featured: false
  } ,

  {
    type: "video",
    tag: "Montage",
    title: "Studio X RedEye",
    thumbnail: "assets/thumbnails/Studiox.webp",
    sub: "Carwash Reel",
    youtube: "er4Kr_eoAIc",
    vertical: true,
    featured: false
  },

    {
    type: "video",
    tag: "Montage",
    title: "NKBeauty X RedEye",
    thumbnail: "assets/thumbnails/NKB.webp",
    sub: "Commercial Reel",
    youtube: "OxPAcA3ZTbo",
    vertical: true,
    featured: false
  },

  /* Long Format */

        {
    type: "video",
    tag: "Long Format",
    title: "Custom Keyboard",
    sub: "Review",
    youtube: "KiVF1xi4Jno",
    vertical: false,
    featured: false
  } ,


        {
    type: "video",
    tag: "Long Format",
    title: "AK820 Review",
    sub: "Review",
    youtube: "2PGojzDiqEw",
    vertical: false,
    featured: false
  } ,
  
    
  /* Graphic Design */


  {
    type: "image",
    tag: "Graphic Design",
    title: "Enorden - Graphics Test",
    sub: "Carrousel 1/3",
    img: "assets/projects/M63.webp",
    featured: false
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Enorden - Graphics Test",
    sub: "Carrousel 2/3",
    img: "assets/projects/M64.webp"
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Enorden - Graphics Test",
    sub: "Carrousel 3/3",
    img: "assets/projects/M65.webp",
    featured: false
  },

        {
    type: "image",
    tag: "Graphic Design",
    title: "Newlink - Graphics Test",
    sub: "Carrousel 1/3",
    img: "assets/projects/M81.webp",
    featured: false
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Newlink - Graphics Test",
    sub: "Carrousel 2/3",
    img: "assets/projects/M82.webp"
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Newlink - Graphics Test",
    sub: "Carrousel 3/3",
    img: "assets/projects/M83.webp",
    featured: false
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Civiltec - Graphics Test",
    sub: "Carrousel 1/3",
    img: "assets/projects/M75.webp",
    featured: false
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Civiltec - Graphics Test",
    sub: "Carrousel 2/3",
    img: "assets/projects/M76.webp"
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Civiltec - Graphics Test",
    sub: "Carrousel 3/3",
    img: "assets/projects/M77.webp",
    featured: false
  },

    {
    type: "image",
    tag: "Graphic Design",
    title: "Civiltec - Graphics Test",
    sub: "Carrousel 1/3",
    img: "assets/projects/M78.webp",
    featured: false
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Civiltec - Graphics Test",
    sub: "Carrousel 2/3",
    img: "assets/projects/M79.webp"
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Civiltec - Graphics Test",
    sub: "Carrousel 3/3",
    img: "assets/projects/M80.webp",
    featured: false
  },

  {
    type: "image",
    tag: "Graphic Design",
    title: "Newlink - Graphics Test",
    sub: "Development of a cured meat brand",
    img: "assets/projects/M84.webp",
    featured: false
  },



  

    {
    type: "image",
    tag: "Graphic Design",
    title: "Sauce League - Poster",
    sub: "Play-in Poster",
    img: "assets/projects/M38.webp",
    featured: false
  },

      {
    type: "image",
    tag: "Graphic Design",
    title: "Sauce League - Poster",
    sub: "Play-in Poster",
    img: "assets/projects/M39.webp",
    featured: false
  },

      {
    type: "image",
    tag: "Graphic Design",
    title: "Sauce League - Poster",
    sub: "MVP Game Poster",
    img: "assets/projects/M41.webp",
    featured: false
  },

      {
    type: "image",
    tag: "Graphic Design",
    title: "Caremax - Graphic Test",
    sub: "Commercial Post",
    img: "assets/projects/M66.webp",
    featured: false
  },

      {
    type: "image",
    tag: "Graphic Design",
    title: "Graphics Test",
    sub: "Commercial Post",
    img: "assets/projects/M67.webp",
    featured: false
  },

        {
    type: "image",
    tag: "Graphic Design",
    title: "Design",
    sub: "Random Stuff",
    img: "assets/projects/M70.webp",
    featured: false
  },

          {
    type: "image",
    tag: "Graphic Design",
    title: "Design",
    sub: "Random Stuff",
    img: "assets/projects/M71.webp",
    featured: false
  },

          {
    type: "image",
    tag: "Graphic Design",
    title: "Designs",
    sub: "Random Stuff",
    img: "assets/projects/M72.webp",
    featured: false
  },

          {
    type: "image",
    tag: "Graphic Design",
    title: "Design",
    sub: "SilllDa Inspired",
    img: "assets/projects/M73.webp",
    featured: false
  },

          {
    type: "image",
    tag: "Graphic Design",
    title: "Random Stuff",
    sub: "Random Stuff",
    img: "assets/projects/M74.webp",
    featured: false
  },

  
      /* Photography */


  {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M1.webp"
  },

  {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M2.webp"
  },

    {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M3.webp"
  },

     {
    type: "image",
    tag: "Photography",
    title: "Sport Photography",
    sub: "Sauce League - Game 1",
    img: "assets/projects/M69.webp"
  },

     {
    type: "image",
    tag: "Photography",
    title: "Sport Photography",
    sub: "Sauce League - Game 1",
    img: "assets/projects/M44.webp"
  },

     {
    type: "image",
    tag: "Photography",
    title: "Sport Photography",
    sub: "Sauce League - Game 1",
    img: "assets/projects/M46.webp"
  },

       {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M8.webp"
  },

       {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M16.webp"
  },

       {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M11.webp"
  },

       {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M17.webp"
  },

       {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M20.webp"
  },

       {
    type: "image",
    tag: "Photography",
    title: "Product Photography",
    sub: "Kboarddot - Product",
    img: "assets/projects/M21.webp"
  },

];

/* Las categorías que aparecen como filtros y como páginas.
   Si quieres quitar o renombrar una, edítala aquí (debe coincidir con los "tag" de arriba). */
const CATEGORIES = ["Motion Graphics","Video Editing","Graphic Design","Montage", "Branding", "Photography","Long Format"];
