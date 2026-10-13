// Genera el sitio de demostración "Truly Church" (iglesia ficticia) en site/.
// Uso: node build.mjs
// Lo que se incrusta de Truly es exactamente lo que recibe una iglesia real
// desde Comunicaciones → Página web: el chat con Sofía (script) y las páginas
// de oración y "Buscar mi grupo" (iframes).
import { writeFileSync } from "node:fs";

const TRULY = "https://truly.church";
const CODE = "5egx2yABl2bx"; // Iglesia Demo de Truly
const CHAT = `<script src="${TRULY}/api/public/chat/${CODE}/widget.js" async></script>`;

const NAV = [
  ["index.html", "Inicio"],
  ["nosotros.html", "Nosotros"],
  ["grupos.html", "Grupos"],
  ["eventos.html", "Eventos"],
  ["oracion.html", "Oración"],
  ["visitanos.html", "Visítanos"],
];

const icon = {
  people: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.6c2.6.2 4.6 1.9 5.3 5.4"/></svg>',
  book: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20"/></svg>',
  hands: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6"/><path d="M12 6 8.7 9.3a1 1 0 0 0 0 1.4l.5.6c.7.7 1.8.7 2.5 0l1-1a3.2 3.2 0 0 1 4.5 0l2.3 2.2"/></svg>',
  pray: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.5 2.5-2 6-2 9v5l-3 3"/><path d="M12 3c1.5 2.5 2 6 2 9v5l3 3"/></svg>',
  pin: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  kids: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="3"/><path d="M6 21v-4a6 6 0 0 1 12 0v4"/><path d="M9 21v-3M15 21v-3"/></svg>',
};

const ART = `<svg viewBox="0 0 400 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="sun" cx="70%" cy="22%" r="60%"><stop offset="0" stop-color="#F2C46D" stop-opacity=".9"/><stop offset=".45" stop-color="#E0A458" stop-opacity=".25"/><stop offset="1" stop-color="#E0A458" stop-opacity="0"/></radialGradient></defs><rect width="400" height="380" fill="url(#sun)"/><g fill="none" stroke="#F2C46D" stroke-opacity=".28"><circle cx="280" cy="84" r="60"/><circle cx="280" cy="84" r="100"/><circle cx="280" cy="84" r="140"/></g><path d="M0 300 C 80 250 160 280 220 260 S 340 220 400 240 V380 H0z" fill="#141a40" fill-opacity=".85"/><path d="M0 330 C 100 300 190 330 260 310 S 360 290 400 300 V380 H0z" fill="#0f1433"/><g transform="translate(150 180)" fill="#FBF7F0" fill-opacity=".92"><rect x="22" y="-40" width="8" height="70" rx="2"/><rect x="4" y="-22" width="44" height="8" rx="2"/></g></svg>`;

function page({ file, title, description, body }) {
  const nav = NAV.map(([href, label]) => `<li><a href="${href}"${href === file ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Truly Church</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="demo-bar">Sitio de demostración: <b>Truly Church</b> es una iglesia ficticia. El chat, la oración y "Encuentra tu grupo" funcionan con <a href="${TRULY}" target="_blank" rel="noopener">Truly</a>.</div>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="index.html"><img src="logo.svg" alt=""><b>Truly Church</b></a>
    <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" onclick="const l=document.querySelector('.nav-links');const o=l.classList.toggle('open');this.setAttribute('aria-expanded',o)"><span></span><span></span><span></span></button>
    <ul class="nav-links">${nav}</ul>
    <a class="btn btn-gold" href="visitanos.html">Planea tu visita</a>
  </div>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="footer-brand"><img src="logo.svg" alt=""><b>Truly Church</b></div>
        <p>Una familia para pertenecer, crecer y servir en Houston.</p>
      </div>
      <div><h4>Visítanos</h4><ul><li>100 Demo Way</li><li>Houston, TX</li><li>Domingos 9:00 y 11:30 a. m.</li></ul></div>
      <div><h4>Conéctate</h4><ul><li><a href="grupos.html">Encuentra tu grupo</a></li><li><a href="oracion.html">Pide oración</a></li><li><a href="eventos.html">Eventos</a></li></ul></div>
      <div><h4>Iglesia</h4><ul><li><a href="nosotros.html">Nuestra historia</a></li><li><a href="nosotros.html#pastores">Pastores</a></li><li><a href="visitanos.html">Preguntas frecuentes</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Truly Church · Iglesia ficticia para demostración.</span>
      <span>Tu iglesia también puede tener esto: <a href="${TRULY}" target="_blank" rel="noopener">conoce Truly</a></span>
    </div>
  </div>
</footer>
${CHAT}
</body>
</html>
`;
}

const pages = [
  {
    file: "index.html",
    title: "Inicio",
    description: "Truly Church: una familia para pertenecer, crecer y servir en Houston.",
    body: `
<section class="hero" style="padding:0">
  <div class="wrap">
    <div>
      <span class="eyebrow">Bienvenido a casa</span>
      <h1>Un lugar para <em>pertenecer</em>, crecer y servir.</h1>
      <p class="lead">Somos una familia de fe en Houston. Aquí nadie llega solo: te recibimos, caminamos contigo y te ayudamos a dar el siguiente paso.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="grupos.html">Encuentra tu grupo</a>
        <a class="btn btn-ghost" href="visitanos.html">Planea tu visita</a>
      </div>
    </div>
    <aside class="hero-card">
      <h2>Nuestras reuniones</h2>
      <ul class="times">
        <li><div><b>Domingo</b><span>Servicio en español</span></div><div class="hour">9:00 a. m.</div></li>
        <li><div><b>Domingo</b><span>Servicio en español</span></div><div class="hour">11:30 a. m.</div></li>
        <li><div><b>Miércoles</b><span>Oración y estudio</span></div><div class="hour">7:30 p. m.</div></li>
      </ul>
    </aside>
  </div>
  <div class="hero-glow"></div>
</section>

<section>
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">Tu siguiente paso</span>
      <h2 class="title">Conéctate, crece y sirve</h2>
      <p>Así es el camino de cada persona en Truly Church. Empieza por donde estés.</p>
    </div>
    <div class="cards">
      <article class="card"><div class="icon">${icon.people}</div><h3>Conéctate</h3><p>Los grupos de conexión se reúnen en casas por toda la ciudad. Encuentra el más cercano a ti.</p><a class="more" href="grupos.html">Buscar mi grupo →</a></article>
      <article class="card"><div class="icon">${icon.book}</div><h3>Crece</h3><p>Clases, rutas de crecimiento y un plan devocional para que tu fe eche raíces.</p><a class="more" href="eventos.html">Ver próximas clases →</a></article>
      <article class="card"><div class="icon">${icon.hands}</div><h3>Sirve</h3><p>Usa tus dones en alabanza, niños, bienvenida, medios y mucho más.</p><a class="more" href="nosotros.html#ministerios">Áreas de servicio →</a></article>
    </div>
  </div>
</section>

<section class="alt">
  <div class="wrap split">
    <div class="art">${ART}</div>
    <div>
      <span class="eyebrow" style="color:#b97a2e">Nuestra historia</span>
      <h2 class="title">Empezamos en una sala, con doce personas y una mesa</h2>
      <p style="color:var(--muted);font-size:18px">En 2011 un grupo de familias comenzó a reunirse los jueves para orar y compartir la cena. Hoy somos una iglesia con dos servicios y grupos en toda la ciudad, pero seguimos creyendo lo mismo: la vida se vive mejor en comunidad.</p>
      <p style="margin-top:24px"><a class="btn btn-outline" href="nosotros.html">Conoce nuestra historia</a></p>
    </div>
  </div>
</section>

<section>
  <div class="wrap split">
    <div>
      <p class="quote">"En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros."</p>
      <span class="quote-ref">Juan 13:35</span>
      <div class="stats">
        <div class="stat"><b>15</b><span>grupos de conexión</span></div>
        <div class="stat"><b>2</b><span>servicios cada domingo</span></div>
        <div class="stat"><b>40+</b><span>voluntarios</span></div>
        <div class="stat"><b>2011</b><span>año de fundación</span></div>
      </div>
    </div>
    <div class="card" style="padding:36px">
      <div class="icon">${icon.pray}</div>
      <h3>¿Podemos orar por ti?</h3>
      <p>Nuestro equipo de cuidado ora cada semana por cada petición. Cuéntanos qué necesitas; es confidencial.</p>
      <a class="btn btn-navy" href="oracion.html">Enviar una petición</a>
    </div>
  </div>
</section>

<section class="sand">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Próximamente</span><h2 class="title">Eventos</h2></div>
    <div class="event"><div class="date"><b>25</b><span>Oct</span></div><div><h3>Noche de bienvenida</h3><p>Para quienes nos visitan por primera vez. Café, historias y un recorrido por la iglesia.</p></div><a class="btn btn-outline" href="eventos.html">Ver más</a></div>
    <div class="event"><div class="date"><b>08</b><span>Nov</span></div><div><h3>Retiro de matrimonios</h3><p>Un día para fortalecer tu matrimonio, con talleres y tiempo en pareja.</p></div><a class="btn btn-outline" href="eventos.html">Ver más</a></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta">
      <div><h2>¿Tienes preguntas?</h2><p>Escríbenos ahora: Sofía, nuestra asistente, te responde de inmediato.</p></div>
      <a class="btn btn-gold" href="visitanos.html">Planea tu visita</a>
    </div>
  </div>
</section>`,
  },
  {
    file: "nosotros.html",
    title: "Nosotros",
    description: "La historia, la misión y los pastores de Truly Church.",
    body: `
<section class="page-hero"><div class="wrap"><span class="eyebrow">Nosotros</span><h1>Una familia que camina junta</h1><p>Creemos que cada persona puede conocer a Dios, crecer en su fe y encontrar su lugar para servir.</p></div></section>

<section>
  <div class="wrap split">
    <div>
      <div class="section-head" style="margin-bottom:28px"><span class="eyebrow">Nuestra historia</span><h2 class="title">De una sala a toda la ciudad</h2></div>
      <ul class="timeline">
        <li><b>2011 · Una mesa y doce personas</b><p>Tres familias empiezan a reunirse los jueves en una casa de Clear Lake para orar y compartir la cena.</p></li>
        <li><b>2014 · El primer domingo</b><p>Alquilamos un salón comunitario y celebramos nuestro primer servicio con ochenta personas.</p></li>
        <li><b>2018 · Grupos en cada barrio</b><p>Los grupos de conexión se multiplican: hoy hay quince, en casas de toda la ciudad.</p></li>
        <li><b>2023 · Una casa propia</b><p>Nos mudamos a 100 Demo Way y abrimos un segundo servicio los domingos.</p></li>
        <li><b>Hoy · Pertenecer, crecer y servir</b><p>Seguimos con la misma convicción: la fe se vive mejor en comunidad.</p></li>
      </ul>
    </div>
    <div class="art" style="min-height:460px">${ART}</div>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">Lo que nos mueve</span><h2 class="title">Misión y valores</h2><p>Ayudar a cada persona a conectarse con Dios y con otros, crecer en su fe y servir con sus dones.</p></div>
    <div class="cards">
      <article class="card"><div class="icon">${icon.people}</div><h3>Comunidad</h3><p>Nadie debería vivir su fe solo. Por eso todo empieza en un grupo.</p></article>
      <article class="card"><div class="icon">${icon.hands}</div><h3>Cuidado</h3><p>Acompañamos a cada persona en los buenos y en los difíciles momentos.</p></article>
      <article class="card"><div class="icon">${icon.book}</div><h3>Crecimiento</h3><p>Damos pasos claros para que la fe madure con el tiempo.</p></article>
    </div>
  </div>
</section>

<section id="pastores">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">Liderazgo</span><h2 class="title">Nuestros pastores</h2></div>
    <div class="people">
      <article class="person"><div class="avatar">SH</div><h3>Samuel y Lucía Herrera</h3><p>Pastores principales</p></article>
      <article class="person"><div class="avatar">MV</div><h3>Marcos Vega</h3><p>Pastor de grupos de conexión</p></article>
      <article class="person"><div class="avatar">AR</div><h3>Andrea Ruiz</h3><p>Directora del equipo de cuidado</p></article>
    </div>
  </div>
</section>

<section id="ministerios" class="sand">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Sirve</span><h2 class="title">Áreas de servicio</h2><p>Hay un lugar para tus dones. Pregúntale a Sofía en el chat cómo empezar.</p></div>
    <div class="cards">
      <article class="card"><div class="icon">${icon.kids}</div><h3>Niños</h3><p>Enseñamos a los más pequeños con amor y creatividad cada domingo.</p></article>
      <article class="card"><div class="icon">${icon.people}</div><h3>Bienvenida</h3><p>La primera sonrisa que recibe cada persona que llega.</p></article>
      <article class="card"><div class="icon">${icon.book}</div><h3>Alabanza y medios</h3><p>Música, sonido, luces y transmisión de cada servicio.</p></article>
    </div>
  </div>
</section>`,
  },
  {
    file: "grupos.html",
    title: "Grupos de conexión",
    description: "Encuentra un grupo de conexión cerca de tu casa.",
    body: `
<section class="page-hero"><div class="wrap"><span class="eyebrow">Grupos de conexión</span><h1>Encuentra tu grupo</h1><p>Nos reunimos en casas por toda la ciudad. Escribe tu dirección y te mostramos los grupos más cercanos.</p></div></section>
<section>
  <div class="wrap" style="max-width:880px">
    <div class="embed-shell">
      <iframe src="${TRULY}/grupos-cerca/${CODE}" style="height:980px" loading="lazy" title="Encuentra tu grupo"></iframe>
    </div>
    <p class="embed-note"><b>Así funciona:</b> al elegir un grupo, el líder recibe un aviso para darte la bienvenida.</p>
  </div>
</section>`,
  },
  {
    file: "oracion.html",
    title: "Petición de oración",
    description: "Envía tu petición de oración al equipo de cuidado.",
    body: `
<section class="page-hero"><div class="wrap"><span class="eyebrow">Oración</span><h1>Queremos orar por ti</h1><p>Cuéntanos tu necesidad. Nuestro equipo de cuidado ora por cada petición y, si lo deseas, te contacta.</p></div></section>
<section>
  <div class="wrap" style="max-width:760px">
    <div class="embed-shell">
      <iframe src="${TRULY}/oracion/${CODE}" style="height:860px" loading="lazy" title="Petición de oración"></iframe>
    </div>
    <p class="embed-note"><b>Tu petición es confidencial:</b> solo la ve el equipo de cuidado de la iglesia.</p>
  </div>
</section>`,
  },
  {
    file: "eventos.html",
    title: "Eventos",
    description: "Próximos eventos de Truly Church.",
    body: `
<section class="page-hero"><div class="wrap"><span class="eyebrow">Agenda</span><h1>Próximos eventos</h1><p>Hay algo para cada etapa de la vida. Inscríbete y recibe tu entrada en el correo.</p></div></section>
<section>
  <div class="wrap">
    <div class="event"><div class="date"><b>25</b><span>Oct</span></div><div><h3>Noche de bienvenida</h3><p>Viernes 7:00 p. m. · Para quienes nos visitan por primera vez.</p></div><a class="btn btn-navy" href="visitanos.html">Más información</a></div>
    <div class="event"><div class="date"><b>08</b><span>Nov</span></div><div><h3>Retiro de matrimonios</h3><p>Sábado 9:00 a. m. · Talleres, almuerzo y tiempo en pareja.</p></div><a class="btn btn-navy" href="visitanos.html">Más información</a></div>
    <div class="event"><div class="date"><b>15</b><span>Nov</span></div><div><h3>Clase: Fundamentos de la fe</h3><p>Cuatro sábados · El primer paso de la ruta de crecimiento.</p></div><a class="btn btn-navy" href="visitanos.html">Más información</a></div>
    <div class="event"><div class="date"><b>13</b><span>Dic</span></div><div><h3>Noche de Navidad</h3><p>Sábado 6:00 p. m. · Música, niños y una cena para toda la familia.</p></div><a class="btn btn-navy" href="visitanos.html">Más información</a></div>
  </div>
</section>`,
  },
  {
    file: "visitanos.html",
    title: "Visítanos",
    description: "Dirección, horarios y qué esperar en tu primera visita.",
    body: `
<section class="page-hero"><div class="wrap"><span class="eyebrow">Planea tu visita</span><h1>Te estamos esperando</h1><p>Sabemos que llegar por primera vez a una iglesia puede dar nervios. Aquí te contamos todo lo que necesitas saber.</p></div></section>
<section>
  <div class="wrap split">
    <div class="card" style="padding:34px">
      <div class="icon">${icon.pin}</div>
      <h3>100 Demo Way, Houston, TX</h3>
      <p>Estacionamiento gratuito. Al llegar, busca a nuestro equipo de bienvenida con camisetas doradas.</p>
      <ul class="times" style="margin-top:18px">
        <li style="border-color:var(--line)"><div><b style="color:var(--navy)">Domingo</b><span style="color:var(--muted)">Servicios</span></div><div class="hour" style="color:#b97a2e">9:00 y 11:30 a. m.</div></li>
        <li><div><b style="color:var(--navy)">Miércoles</b><span style="color:var(--muted)">Oración y estudio</span></div><div class="hour" style="color:#b97a2e">7:30 p. m.</div></li>
      </ul>
    </div>
    <div class="faq">
      <details open><summary>¿Cuánto dura un servicio?</summary><p>Alrededor de una hora y media: música, una enseñanza práctica y oración.</p></details>
      <details><summary>¿Qué hay para mis hijos?</summary><p>Clases para niños de 0 a 11 años durante cada servicio, con un registro seguro al llegar.</p></details>
      <details><summary>¿Cómo me visto?</summary><p>Como te sientas cómodo. Aquí vas a ver de todo.</p></details>
      <details><summary>¿Cómo conozco a otras personas?</summary><p>La mejor forma es un grupo de conexión. <a href="grupos.html">Encuentra el más cercano</a>.</p></details>
      <details><summary>¿Tengo más preguntas?</summary><p>Toca el botón del chat abajo a la derecha: Sofía, nuestra asistente, te responde enseguida.</p></details>
    </div>
  </div>
</section>`,
  },
];

for (const p of pages) writeFileSync(new URL(`./site/${p.file}`, import.meta.url), page(p));
writeFileSync(new URL("./site/robots.txt", import.meta.url), "User-agent: *\nDisallow: /\n");
console.log(`Sitio generado: ${pages.length} páginas.`);
