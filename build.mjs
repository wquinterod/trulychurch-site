// Genera el sitio de demostración "Truly Church" (iglesia ficticia) en site/,
// en español (raíz) e inglés (site/en/). Uso: node build.mjs
// Lo que se incrusta de Truly es exactamente lo que recibe una iglesia real
// desde Comunicaciones → Página web: el chat con Sofía (script) y las páginas
// de oración y "Buscar mi grupo" (iframes).
//
// Fotos: Unsplash (licencia Unsplash). Video: Mixkit (licencia Mixkit). Ambas
// permiten uso comercial sin atribución obligatoria; se acredita igual.
import { mkdirSync, writeFileSync } from "node:fs";

const TRULY = "https://truly.church";
const CODE = "5egx2yABl2bx"; // Iglesia Demo de Truly ("Truly Church")
// Truly avisa el alto real de sus páginas incrustadas: el iframe crece o se
// encoge con el contenido (sin scroll adentro). Es el mismo script que trae el
// código para incrustar de Truly (Comunicaciones > Página web).
const EMBED_LISTENER = `<script>addEventListener("message",function(e){if(e.origin!=="${TRULY}"||!e.data||e.data.type!=="truly-embed-height")return;document.querySelectorAll("iframe").forEach(function(f){if(f.contentWindow===e.source)f.style.height=Math.max(320,Number(e.data.height)||0)+"px"})});</script>`;
const FINDER_URL = `${TRULY}/grupos-cerca/${CODE}`;
const finderModal = (t) => `<dialog class="finder-modal" id="truly-finder" aria-label="${t.finderTitle}">
  <div class="finder-bar"><b>${t.finderTitle}</b><button type="button" class="finder-close" data-close-finder aria-label="${t.close}">✕</button></div>
  <iframe data-src="${FINDER_URL}" title="${t.finderTitle}" style="height:900px"></iframe>
</dialog>
<script>(function(){var d=document.getElementById("truly-finder");if(!d||!d.showModal)return;var f=d.querySelector("iframe");document.addEventListener("click",function(e){var a=e.target.closest("[data-open-finder]");if(a){e.preventDefault();if(!f.src)f.src=f.dataset.src;d.showModal();}if(e.target.closest("[data-close-finder]")||e.target===d)d.close();});})();</script>`;
const CHAT = `<script src="${TRULY}/api/public/chat/${CODE}/widget.js" async></script>`;
const img = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const MEDIA = {
  heroVideo: "https://assets.mixkit.co/videos/45952/45952-720.mp4",
  heroPoster: img("photo-1679579664774-da4283cab147", 1800),
  silhouettes: img("photo-1679579664774-da4283cab147"),
  stage: img("photo-1724885794747-f4fb4dd8d0f2", 1200),
  praying: img("photo-1729089049653-24312fdca908"),
  hands: img("photo-1666713937678-1dedb9b8f9ff", 1200),
  worship: img("photo-1635178945103-fb817c1476fd", 1200),
};

const icon = {
  people: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.6c2.6.2 4.6 1.9 5.3 5.4"/></svg>',
  book: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20"/></svg>',
  hands: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6"/><path d="M12 6 8.7 9.3a1 1 0 0 0 0 1.4l.5.6c.7.7 1.8.7 2.5 0l1-1a3.2 3.2 0 0 1 4.5 0l2.3 2.2"/></svg>',
  pin: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  kids: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="3"/><path d="M6 21v-4a6 6 0 0 1 12 0v4"/><path d="M9 21v-3M15 21v-3"/></svg>',
};

// ---------- Textos ----------
const T = {
  es: {
    lang: "es",
    other: "en",
    nav: { index: "Inicio", nosotros: "Nosotros", grupos: "Grupos", eventos: "Eventos", oracion: "Oración", visitanos: "Visítanos" },
    plan: "Planea tu visita",
    platform: "Plataforma",
    finderTitle: "Buscar mi grupo de conexión",
    close: "Cerrar",
    platformTitle: "Entra a Truly: líderes, equipo y miembros",
    demo: `Sitio de demostración: <b>Truly Church</b> es una iglesia ficticia. El chat, la oración y "Encuentra tu grupo" funcionan con <a href="${TRULY}" target="_blank" rel="noopener">Truly</a>.`,
    menu: "Abrir menú",
    footer: {
      tagline: "Una familia para pertenecer, crecer y servir en Houston.",
      visit: "Visítanos",
      sundays: "Domingos 9:00 y 11:30 a. m.",
      connect: "Conéctate",
      findGroup: "Encuentra tu grupo",
      pray: "Pide oración",
      church: "Iglesia",
      story: "Nuestra historia",
      pastors: "Pastores",
      faq: "Preguntas frecuentes",
      copy: "© 2026 Truly Church · Iglesia ficticia para demostración.",
      yours: "Tu iglesia también puede tener esto:",
      know: "conoce Truly",
      credits: "Fotos: Unsplash · Video: Mixkit",
    },
    embedLang: "",
  },
  en: {
    lang: "en",
    other: "es",
    nav: { index: "Home", nosotros: "About", grupos: "Groups", eventos: "Events", oracion: "Prayer", visitanos: "Visit" },
    plan: "Plan your visit",
    platform: "Platform",
    finderTitle: "Find my connection group",
    close: "Close",
    platformTitle: "Sign in to Truly: leaders, team and members",
    demo: `Demo site: <b>Truly Church</b> is a fictional church. The chat, prayer and "Find your group" run on <a href="${TRULY}" target="_blank" rel="noopener">Truly</a>.`,
    menu: "Open menu",
    footer: {
      tagline: "A family to belong, grow and serve in Houston.",
      visit: "Visit us",
      sundays: "Sundays 9:00 and 11:30 a.m.",
      connect: "Connect",
      findGroup: "Find your group",
      pray: "Ask for prayer",
      church: "Church",
      story: "Our story",
      pastors: "Pastors",
      faq: "FAQ",
      copy: "© 2026 Truly Church · Fictional church for demonstration.",
      yours: "Your church can have this too:",
      know: "meet Truly",
      credits: "Photos: Unsplash · Video: Mixkit",
    },
    embedLang: "",
  },
};

const PAGES = ["index", "nosotros", "grupos", "eventos", "oracion", "visitanos"];

function layout(t, file, title, description, body) {
  const base = t.lang === "es" ? "" : "../";
  const here = t.lang === "es" ? "" : "en/";
  const nav = PAGES.map((p) => `<li><a href="${p}.html"${p === file ? ' aria-current="page"' : ""}>${t.nav[p]}</a></li>`).join("");
  const esHref = t.lang === "es" ? `${file}.html` : `../${file}.html`;
  const enHref = t.lang === "en" ? `${file}.html` : `en/${file}.html`;
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Truly Church</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="alternate" hreflang="es" href="/${file}.html">
<link rel="alternate" hreflang="en" href="/en/${file}.html">
<link rel="icon" href="${base}logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}styles.css">
</head>
<body>
<div class="demo-bar">${t.demo}</div>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="index.html"><img src="${base}logo.svg" alt=""><b>Truly Church</b></a>
    <button class="menu-toggle" aria-label="${t.menu}" aria-expanded="false" onclick="const l=document.querySelector('.nav-links');const o=l.classList.toggle('open');this.setAttribute('aria-expanded',o)"><span></span><span></span><span></span></button>
    <ul class="nav-links">${nav}<li><a class="nav-platform" href="${TRULY}/login" title="${t.platformTitle}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>${t.platform}</a></li></ul>
    <div class="nav-end">
      <nav class="lang-switch" aria-label="Idioma / Language"><a href="${esHref}" hreflang="es"${t.lang === "es" ? ' aria-current="true"' : ""}>ES</a><a href="${enHref}" hreflang="en"${t.lang === "en" ? ' aria-current="true"' : ""}>EN</a></nav>
      <a class="btn btn-gold" href="visitanos.html">${t.plan}</a>
    </div>
  </div>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="footer-brand"><img src="${base}logo.svg" alt=""><b>Truly Church</b></div>
        <p>${t.footer.tagline}</p>
      </div>
      <div><h4>${t.footer.visit}</h4><ul><li>100 Demo Way</li><li>Houston, TX</li><li>${t.footer.sundays}</li></ul></div>
      <div><h4>${t.footer.connect}</h4><ul><li><a href="grupos.html">${t.footer.findGroup}</a></li><li><a href="oracion.html">${t.footer.pray}</a></li><li><a href="eventos.html">${t.nav.eventos}</a></li></ul></div>
      <div><h4>${t.footer.church}</h4><ul><li><a href="nosotros.html">${t.footer.story}</a></li><li><a href="nosotros.html#pastores">${t.footer.pastors}</a></li><li><a href="visitanos.html">${t.footer.faq}</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span>${t.footer.copy} <span class="credits">${t.footer.credits}</span></span>
      <span>${t.footer.yours} <a href="${TRULY}" target="_blank" rel="noopener">${t.footer.know}</a></span>
    </div>
  </div>
</footer>
${finderModal(t)}
${EMBED_LISTENER}
${CHAT}
${here ? "" : ""}
</body>
</html>
`;
}

// ---------- Contenido por idioma ----------
function content(lang) {
  const es = lang === "es";
  const L = (a, b) => (es ? a : b);
  const times = `<ul class="times">
        <li><div><b>${L("Domingo", "Sunday")}</b><span>${L("Servicio", "Service")}</span></div><div class="hour">${L("9:00 a. m.", "9:00 a.m.")}</div></li>
        <li><div><b>${L("Domingo", "Sunday")}</b><span>${L("Servicio", "Service")}</span></div><div class="hour">${L("11:30 a. m.", "11:30 a.m.")}</div></li>
        <li><div><b>${L("Miércoles", "Wednesday")}</b><span>${L("Oración y estudio", "Prayer & study")}</span></div><div class="hour">${L("7:30 p. m.", "7:30 p.m.")}</div></li>
      </ul>`;
  const eventRow = (d, m, title, desc, primary) =>
    `<div class="event"><div class="date"><b>${d}</b><span>${m}</span></div><div><h3>${title}</h3><p>${desc}</p></div><a class="btn ${primary ? "btn-navy" : "btn-outline"}" href="visitanos.html">${L("Más información", "Learn more")}</a></div>`;
  const events = [
    ["25", L("Oct", "Oct"), L("Noche de bienvenida", "Welcome night"), L("Viernes 7:00 p. m. · Para quienes nos visitan por primera vez.", "Friday 7:00 p.m. · For first-time guests.")],
    ["08", L("Nov", "Nov"), L("Retiro de matrimonios", "Marriage retreat"), L("Sábado 9:00 a. m. · Talleres, almuerzo y tiempo en pareja.", "Saturday 9:00 a.m. · Workshops, lunch and time together.")],
    ["15", L("Nov", "Nov"), L("Clase: Fundamentos de la fe", "Class: Foundations of faith"), L("Cuatro sábados · El primer paso de la ruta de crecimiento.", "Four Saturdays · The first step of our growth path.")],
    ["13", L("Dic", "Dec"), L("Noche de Navidad", "Christmas night"), L("Sábado 6:00 p. m. · Música, niños y cena para toda la familia.", "Saturday 6:00 p.m. · Music, kids and dinner for the whole family.")],
  ];
  const spanishOnly = es ? "" : `<p class="embed-note"><b>Note:</b> this form is shown in Spanish, the language this church uses in Truly.</p>`;

  return {
    index: {
      title: L("Inicio", "Home"),
      description: L("Truly Church: una familia para pertenecer, crecer y servir en Houston.", "Truly Church: a family to belong, grow and serve in Houston."),
      body: `
<section class="hero-v" style="padding:0">
  <img class="poster" src="${MEDIA.heroPoster}" alt="">
  <video autoplay muted loop playsinline preload="metadata" poster="${MEDIA.heroPoster}" aria-hidden="true"><source src="${MEDIA.heroVideo}" type="video/mp4"></video>
  <div class="wrap">
    <div>
      <span class="live-dot">${L("Este domingo · 9:00 y 11:30", "This Sunday · 9:00 & 11:30")}</span>
      <h1>${L("Un lugar para <em>crecer</em>.", "A place to <em>grow</em>.")}</h1>
      <p class="lead">${L("Somos una familia de fe en Houston. Aquí nadie llega solo: te recibimos, caminamos contigo y te ayudamos a dar el siguiente paso.", "We are a family of faith in Houston. No one arrives alone here: we welcome you, walk with you and help you take your next step.")}</p>
      <div class="hero-actions">
        <a class="btn btn-group" href="${FINDER_URL}" data-open-finder><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${L("Buscar mi grupo de conexión", "Find my connection group")}</a>
        <a class="btn btn-ghost" href="visitanos.html">${L("Planea tu visita", "Plan your visit")}</a>
      </div>
    </div>
    <aside class="glass">
      <h2>${L("Nuestras reuniones", "Gatherings")}</h2>
      ${times}
    </aside>
  </div>
  <span class="scroll-cue" aria-hidden="true"></span>
</section>

<section class="group-spotlight">
  <div class="wrap">
    <div class="spot">
      <div>
        <span class="eyebrow">${L("Grupos de conexión", "Connection groups")}</span>
        <h2>${L("¿Buscas un grupo <em>cerca de tu casa</em>?", "Looking for a group <em>near your home</em>?")}</h2>
        <p>${L("Escribe tu dirección y en un minuto ves los grupos más cercanos, su día y su líder. Tú eliges; el líder te contacta.", "Enter your address and in a minute you will see the closest groups, their day and their leader. You choose; the leader reaches out.")}</p>
        <ul class="spot-facts"><li><b>12</b>${L("grupos activos", "active groups")}</li><li><b>1×</b>${L("por semana", "per week")}</li><li><b>1 min</b>${L("para encontrarlo", "to find yours")}</li></ul>
      </div>
      <a class="btn btn-spot" href="${FINDER_URL}" data-open-finder><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${L("Buscar mi grupo de conexión", "Find my connection group")}<span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><span>${L("Pertenecer · Crecer · Servir · Orar · Celebrar · ", "Belong · Grow · Serve · Pray · Celebrate · ").repeat(6)}</span></div>

<section>
  <div class="wrap">
    <div class="section-head center">
      <span class="eyebrow">${L("Tu siguiente paso", "Your next step")}</span>
      <h2 class="title">${L("Conéctate, crece y sirve", "Connect, grow and serve")}</h2>
      <p>${L("Así es el camino de cada persona en Truly Church. Empieza por donde estés.", "This is everyone's path at Truly Church. Start wherever you are.")}</p>
    </div>
    <div class="bento">
      <a class="tile span-4" href="grupos.html" style="min-height:340px"><img src="${MEDIA.silhouettes}" alt=""><h3>${L("Conéctate", "Connect")}</h3><p>${L("Doce grupos de conexión se reúnen en casas por toda la ciudad. Encuentra el más cercano a ti.", "Twelve connection groups meet in homes across the city. Find the one closest to you.")}</p><span class="go">${L("Buscar mi grupo →", "Find my group →")}</span></a>
      <a class="tile gold span-2" href="eventos.html"><h3>${L("Crece", "Grow")}</h3><p>${L("Clases, rutas de crecimiento y un plan devocional.", "Classes, growth paths and a devotional plan.")}</p><span class="go">${L("Próximas clases →", "Upcoming classes →")}</span></a>
      <a class="tile plain span-2" href="nosotros.html#ministerios"><h3>${L("Sirve", "Serve")}</h3><p>${L("Alabanza, niños, bienvenida, medios y más.", "Worship, kids, welcome team, media and more.")}</p><span class="go">${L("Áreas de servicio →", "Ways to serve →")}</span></a>
      <a class="tile span-4" href="oracion.html" style="min-height:300px"><img src="${MEDIA.praying}" alt=""><h3>${L("¿Podemos orar por ti?", "Can we pray for you?")}</h3><p>${L("Nuestro equipo de cuidado ora por cada petición. Es confidencial.", "Our care team prays for every request. It's confidential.")}</p><span class="go">${L("Enviar una petición →", "Send a request →")}</span></a>
    </div>
  </div>
</section>

<section class="alt">
  <div class="wrap split">
    <div class="photo-card"><img src="${MEDIA.stage}" alt=""><div class="badge"><b>2011</b>${L("Doce personas y una mesa", "Twelve people and a table")}</div></div>
    <div>
      <span class="eyebrow" style="color:#b97a2e">${L("Nuestra historia", "Our story")}</span>
      <h2 class="title">${L("Empezamos en una sala, con doce personas y una mesa", "We started in a living room, with twelve people and a table")}</h2>
      <p style="color:var(--muted);font-size:18px">${L("En 2011 un grupo de familias comenzó a reunirse los jueves para orar y compartir la cena. Hoy somos una iglesia con dos servicios y grupos en toda la ciudad, pero seguimos creyendo lo mismo: la vida se vive mejor en comunidad.", "In 2011 a few families began meeting on Thursdays to pray and share dinner. Today we are a church with two services and groups across the city, but we still believe the same thing: life is better lived in community.")}</p>
      <div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
        <div class="stat"><b>12</b><span>${L("grupos de conexión", "connection groups")}</span></div>
        <div class="stat"><b>40+</b><span>${L("voluntarios", "volunteers")}</span></div>
      </div>
      <p style="margin-top:24px"><a class="btn btn-outline" href="nosotros.html">${L("Conoce nuestra historia", "Read our story")}</a></p>
    </div>
  </div>
</section>

<section>
  <div class="wrap" style="text-align:center;max-width:820px">
    <p class="quote">${L('"En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros."', '"By this everyone will know that you are my disciples, if you love one another."')}</p>
    <span class="quote-ref">${L("Juan 13:35", "John 13:35")}</span>
  </div>
</section>

<section class="sand">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">${L("Próximamente", "Coming up")}</span><h2 class="title">${L("Eventos", "Events")}</h2></div>
    ${events.slice(0, 2).map((e) => eventRow(...e, false)).join("\n    ")}
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta">
      <div><h2>${L("¿Tienes preguntas?", "Have questions?")}</h2><p>${L("Escríbenos ahora: Sofía, nuestra asistente, te responde de inmediato.", "Message us now: Sofía, our assistant, replies right away.")}</p></div>
      <a class="btn btn-gold" href="visitanos.html">${L("Planea tu visita", "Plan your visit")}</a>
    </div>
  </div>
</section>`,
    },
    nosotros: {
      title: L("Nosotros", "About"),
      description: L("La historia, la misión y los pastores de Truly Church.", "The story, mission and pastors of Truly Church."),
      body: `
<section class="page-hero photo" style="background-image:url('${MEDIA.silhouettes}')"><div class="wrap"><span class="eyebrow">${L("Nosotros", "About us")}</span><h1>${L("Una familia que camina junta", "A family that walks together")}</h1><p>${L("Creemos que cada persona puede conocer a Dios, crecer en su fe y encontrar su lugar para servir.", "We believe everyone can know God, grow in faith and find their place to serve.")}</p></div></section>

<section>
  <div class="wrap split">
    <div>
      <div class="section-head" style="margin-bottom:28px"><span class="eyebrow">${L("Nuestra historia", "Our story")}</span><h2 class="title">${L("De una sala a toda la ciudad", "From a living room to the whole city")}</h2></div>
      <ul class="timeline">
        <li><b>${L("2011 · Una mesa y doce personas", "2011 · A table and twelve people")}</b><p>${L("Tres familias empiezan a reunirse los jueves en una casa de Clear Lake para orar y compartir la cena.", "Three families start meeting on Thursdays in a Clear Lake home to pray and share dinner.")}</p></li>
        <li><b>${L("2014 · El primer domingo", "2014 · Our first Sunday")}</b><p>${L("Alquilamos un salón comunitario y celebramos nuestro primer servicio con ochenta personas.", "We rented a community hall and held our first service with eighty people.")}</p></li>
        <li><b>${L("2018 · Grupos en cada barrio", "2018 · Groups in every neighborhood")}</b><p>${L("Los grupos de conexión se multiplican: hoy hay doce, en casas de toda la ciudad.", "Connection groups multiply: today there are twelve, in homes across the city.")}</p></li>
        <li><b>${L("2023 · Una casa propia", "2023 · A home of our own")}</b><p>${L("Nos mudamos a 100 Demo Way y abrimos un segundo servicio los domingos.", "We moved to 100 Demo Way and added a second Sunday service.")}</p></li>
        <li><b>${L("Hoy · Pertenecer, crecer y servir", "Today · Belong, grow and serve")}</b><p>${L("Seguimos con la misma convicción: la fe se vive mejor en comunidad.", "Same conviction as day one: faith is better lived in community.")}</p></li>
      </ul>
    </div>
    <div class="photo-card" style="min-height:520px"><img src="${MEDIA.worship}" alt=""><div class="badge"><b>${L("Una sola familia", "One family")}</b>${L("Dos servicios cada domingo", "Two services every Sunday")}</div></div>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">${L("Lo que nos mueve", "What drives us")}</span><h2 class="title">${L("Misión y valores", "Mission & values")}</h2><p>${L("Ayudar a cada persona a conectarse con Dios y con otros, crecer en su fe y servir con sus dones.", "Help every person connect with God and others, grow in faith and serve with their gifts.")}</p></div>
    <div class="cards">
      <article class="card"><div class="icon">${icon.people}</div><h3>${L("Comunidad", "Community")}</h3><p>${L("Nadie debería vivir su fe solo. Por eso todo empieza en un grupo.", "No one should live their faith alone. That's why it all starts in a group.")}</p></article>
      <article class="card"><div class="icon">${icon.hands}</div><h3>${L("Cuidado", "Care")}</h3><p>${L("Acompañamos a cada persona en los buenos y en los difíciles momentos.", "We walk with every person through good times and hard times.")}</p></article>
      <article class="card"><div class="icon">${icon.book}</div><h3>${L("Crecimiento", "Growth")}</h3><p>${L("Damos pasos claros para que la fe madure con el tiempo.", "Clear steps so faith matures over time.")}</p></article>
    </div>
  </div>
</section>

<section id="pastores">
  <div class="wrap">
    <div class="section-head center"><span class="eyebrow">${L("Liderazgo", "Leadership")}</span><h2 class="title">${L("Nuestros pastores", "Our pastors")}</h2></div>
    <div class="people">
      <article class="person"><div class="avatar">SH</div><h3>Samuel & Lucía Herrera</h3><p>${L("Pastores principales", "Lead pastors")}</p></article>
      <article class="person"><div class="avatar">MV</div><h3>Marcos Vega</h3><p>${L("Pastor de grupos de conexión", "Connection groups pastor")}</p></article>
      <article class="person"><div class="avatar">AR</div><h3>Andrea Ruiz</h3><p>${L("Directora del equipo de cuidado", "Care team director")}</p></article>
    </div>
  </div>
</section>

<section id="ministerios" class="sand">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">${L("Sirve", "Serve")}</span><h2 class="title">${L("Áreas de servicio", "Ways to serve")}</h2><p>${L("Hay un lugar para tus dones. Pregúntale a Sofía en el chat cómo empezar.", "There's a place for your gifts. Ask Sofía in the chat how to start.")}</p></div>
    <div class="cards">
      <article class="card"><div class="icon">${icon.kids}</div><h3>${L("Niños", "Kids")}</h3><p>${L("Enseñamos a los más pequeños con amor y creatividad cada domingo.", "We teach the little ones with love and creativity every Sunday.")}</p></article>
      <article class="card"><div class="icon">${icon.people}</div><h3>${L("Bienvenida", "Welcome team")}</h3><p>${L("La primera sonrisa que recibe cada persona que llega.", "The first smile every guest receives.")}</p></article>
      <article class="card"><div class="icon">${icon.book}</div><h3>${L("Alabanza y medios", "Worship & media")}</h3><p>${L("Música, sonido, luces y transmisión de cada servicio.", "Music, sound, lights and streaming for every service.")}</p></article>
    </div>
  </div>
</section>`,
    },
    grupos: {
      title: L("Grupos de conexión", "Connection groups"),
      description: L("Encuentra un grupo de conexión cerca de tu casa.", "Find a connection group near your home."),
      body: `
<section class="page-hero photo compact" style="background-image:url('${MEDIA.praying}')"><div class="wrap"><span class="eyebrow">${L("Grupos de conexión", "Connection groups")}</span><h1>${L("Encuentra tu grupo", "Find your group")}</h1><p>${L("Nos reunimos en casas por toda la ciudad. Escribe tu dirección y te mostramos los grupos más cercanos.", "We meet in homes across the city. Enter your address and we'll show you the closest groups.")}</p></div></section>
<section>
  <div class="wrap" style="max-width:1160px">
    <ol class="steps">
      <li><span>1</span><b>${L("Escribe tu dirección", "Enter your address")}</b><p>${L("Solo la usamos para calcular qué grupos te quedan más cerca.", "We only use it to find the groups closest to you.")}</p></li>
      <li><span>2</span><b>${L("Mira los grupos cercanos", "See the nearby groups")}</b><p>${L("Distancia, día, hora y el nombre del líder de cada uno.", "Distance, day, time and the leader of each one.")}</p></li>
      <li><span>3</span><b>${L("Elige y te contactamos", "Choose and we reach out")}</b><p>${L("El líder recibe tu solicitud y te escribe para darte la bienvenida.", "The leader gets your request and reaches out to welcome you.")}</p></li>
    </ol>
    <div class="finder-cta">
      <a class="btn btn-group" href="${FINDER_URL}" data-open-finder><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>${L("Buscar mi grupo de conexión", "Find my connection group")}</a>
      <p>${L("12 grupos activos en casas de Houston · toma un minuto", "12 active groups in homes across Houston · takes a minute")}</p>
    </div>
    ${spanishOnly}
  </div>
</section>`,
    },
    oracion: {
      title: L("Petición de oración", "Prayer request"),
      description: L("Envía tu petición de oración al equipo de cuidado.", "Send your prayer request to the care team."),
      body: `
<section class="page-hero photo compact" style="background-image:url('${MEDIA.hands}')"><div class="wrap"><span class="eyebrow">${L("Oración", "Prayer")}</span><h1>${L("Queremos orar por ti", "We want to pray for you")}</h1><p>${L("Cuéntanos tu necesidad. Nuestro equipo de cuidado ora por cada petición y, si lo deseas, te contacta.", "Tell us what you need. Our care team prays for every request and, if you wish, reaches out to you.")}</p></div></section>
<section>
  <div class="wrap" style="max-width:760px">
    <div class="embed-shell"><iframe src="${TRULY}/oracion/${CODE}" style="height:900px" loading="lazy" title="${L("Petición de oración", "Prayer request")}"></iframe></div>
    <p class="embed-note"><b>${L("Tu petición es confidencial:", "Your request is confidential:")}</b> ${L("solo la ve el equipo de cuidado de la iglesia.", "only the church's care team sees it.")}</p>
    ${spanishOnly}
  </div>
</section>`,
    },
    eventos: {
      title: L("Eventos", "Events"),
      description: L("Próximos eventos de Truly Church.", "Upcoming events at Truly Church."),
      body: `
<section class="page-hero photo" style="background-image:url('${MEDIA.stage}')"><div class="wrap"><span class="eyebrow">${L("Agenda", "Calendar")}</span><h1>${L("Próximos eventos", "Upcoming events")}</h1><p>${L("Hay algo para cada etapa de la vida. Inscríbete y recibe tu entrada en el correo.", "There's something for every season of life. Sign up and get your ticket by email.")}</p></div></section>
<section>
  <div class="wrap">
    ${events.map((e) => eventRow(...e, true)).join("\n    ")}
  </div>
</section>`,
    },
    visitanos: {
      title: L("Visítanos", "Visit"),
      description: L("Dirección, horarios y qué esperar en tu primera visita.", "Address, service times and what to expect on your first visit."),
      body: `
<section class="page-hero photo" style="background-image:url('${MEDIA.worship}')"><div class="wrap"><span class="eyebrow">${L("Planea tu visita", "Plan your visit")}</span><h1>${L("Te estamos esperando", "We're expecting you")}</h1><p>${L("Sabemos que llegar por primera vez a una iglesia puede dar nervios. Aquí te contamos todo lo que necesitas saber.", "Visiting a church for the first time can feel nerve-racking. Here's everything you need to know.")}</p></div></section>
<section>
  <div class="wrap split">
    <div class="card" style="padding:34px">
      <div class="icon">${icon.pin}</div>
      <h3>100 Demo Way, Houston, TX</h3>
      <p>${L("Estacionamiento gratuito. Al llegar, busca a nuestro equipo de bienvenida con camisetas doradas.", "Free parking. When you arrive, look for our welcome team in gold shirts.")}</p>
      <ul class="times" style="margin-top:18px">
        <li style="border-color:var(--line)"><div><b style="color:var(--navy)">${L("Domingo", "Sunday")}</b><span style="color:var(--muted)">${L("Servicios", "Services")}</span></div><div class="hour" style="color:#b97a2e">${L("9:00 y 11:30 a. m.", "9:00 & 11:30 a.m.")}</div></li>
        <li><div><b style="color:var(--navy)">${L("Miércoles", "Wednesday")}</b><span style="color:var(--muted)">${L("Oración y estudio", "Prayer & study")}</span></div><div class="hour" style="color:#b97a2e">${L("7:30 p. m.", "7:30 p.m.")}</div></li>
      </ul>
    </div>
    <div class="faq">
      <details open><summary>${L("¿Cuánto dura un servicio?", "How long is a service?")}</summary><p>${L("Alrededor de una hora y media: música, una enseñanza práctica y oración.", "About an hour and a half: music, a practical message and prayer.")}</p></details>
      <details><summary>${L("¿Qué hay para mis hijos?", "What about my kids?")}</summary><p>${L("Clases para niños de 0 a 11 años durante cada servicio, con un registro seguro al llegar.", "Classes for kids ages 0–11 during every service, with secure check-in on arrival.")}</p></details>
      <details><summary>${L("¿Cómo me visto?", "What should I wear?")}</summary><p>${L("Como te sientas cómodo. Aquí vas a ver de todo.", "Whatever feels comfortable. You'll see everything here.")}</p></details>
      <details><summary>${L("¿Cómo conozco a otras personas?", "How do I meet people?")}</summary><p>${L('La mejor forma es un grupo de conexión. <a href="grupos.html">Encuentra el más cercano</a>.', 'The best way is a connection group. <a href="grupos.html">Find the closest one</a>.')}</p></details>
      <details><summary>${L("¿Tengo más preguntas?", "More questions?")}</summary><p>${L("Toca el botón del chat abajo a la derecha: Sofía, nuestra asistente, te responde enseguida.", "Tap the chat button at the bottom right: Sofía, our assistant, will reply right away.")}</p></details>
    </div>
  </div>
</section>`,
    },
  };
}

mkdirSync(new URL("./site/en/", import.meta.url), { recursive: true });
let count = 0;
for (const lang of ["es", "en"]) {
  const t = T[lang];
  const c = content(lang);
  for (const file of PAGES) {
    const p = c[file];
    const out = new URL(`./site/${lang === "es" ? "" : "en/"}${file}.html`, import.meta.url);
    writeFileSync(out, layout(t, file, p.title, p.description, p.body));
    count++;
  }
}
writeFileSync(new URL("./site/robots.txt", import.meta.url), "User-agent: *\nDisallow: /\n");
console.log(`Sitio generado: ${count} páginas (español e inglés).`);
