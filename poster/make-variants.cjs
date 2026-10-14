// Versiones del póster "Tu iglesia, en un solo lugar" (2026-10-14):
//  - historia de Instagram/WhatsApp (1080×1920)
//  - pantalla del culto 16:9 (1920×1080)
// Uso: node poster/make-variants.cjs  →  poster/*.png (al doble de resolución) y *.svg
const fs = require("fs");
const path = require("path");
const NM = "C:/dev/truly-crm/web/node_modules/";
const QRCode = require(NM + "qrcode");
const sharp = require(NM + "sharp");

const URL = "https://trulychurch.com";
const FONT = "Segoe UI, Arial, sans-serif";
const ICONS = {
  groups: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19v1"/>',
  pray: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
};
const FEATURES = [
  ["groups", "Grupos de conexión", "Encuentra uno cerca de tu casa"],
  ["pray", "Peticiones de oración", "Oramos por ti"],
  ["calendar", "Eventos", "Inscríbete en un minuto"],
  ["chat", "Asistencia en línea", "Respuestas al instante"],
  ["login", "Plataforma", "Para líderes y miembros"],
  ["pin", "Planea tu visita", "Horarios y cómo llegar"],
];

const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
const N = qr.modules.size;
function qrBlock(x, y, size) {
  const cell = size / N;
  let rects = "";
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (qr.modules.get(c, r)) rects += `<rect x="${(c * cell).toFixed(2)}" y="${(r * cell).toFixed(2)}" width="${(cell + 0.4).toFixed(2)}" height="${(cell + 0.4).toFixed(2)}"/>`;
  const pad = size * 0.09;
  return `<rect x="${x}" y="${y}" width="${size + pad * 2}" height="${size + pad * 2}" rx="${size * 0.09}" fill="#ffffff"/><g transform="translate(${x + pad} ${y + pad})" fill="#0b1116">${rects}</g>`;
}
const logoSvg = fs
  .readFileSync(path.join(__dirname, "../site/logo.svg"), "utf8")
  .replace(/<svg[^>]*>/, "")
  .replace("</svg>", "")
  .replace(/id="g"/g, 'id="lg"')
  .replace(/url\(#g\)/g, "url(#lg)");

function background(W, H) {
  return `<defs>
    <radialGradient id="glow1" cx="85%" cy="8%" r="60%"><stop offset="0" stop-color="#22b8d6" stop-opacity="0.38"/><stop offset="1" stop-color="#22b8d6" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="5%" cy="75%" r="55%"><stop offset="0" stop-color="#137d9a" stop-opacity="0.35"/><stop offset="1" stop-color="#137d9a" stop-opacity="0"/></radialGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#137d9a"/><stop offset="0.6" stop-color="#0d4f63"/><stop offset="1" stop-color="#0b2d38"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0b1116"/><rect width="${W}" height="${H}" fill="url(#glow1)"/><rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <circle cx="${W - 80}" cy="120" r="230" fill="none" stroke="#7fe3f2" stroke-opacity="0.12"/>
  <circle cx="${W - 80}" cy="120" r="320" fill="none" stroke="#7fe3f2" stroke-opacity="0.07"/>`;
}
function logo(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><svg width="64" height="64" viewBox="0 0 64 64">${logoSvg}</svg><text x="82" y="44" font-family="${FONT}" font-weight="700" font-size="34" fill="#ffffff">Truly Church</text></g>`;
}
function heading(x, y, size) {
  return `<text x="${x + 4}" y="${y}" font-family="${FONT}" font-weight="700" font-size="${size * 0.27}" letter-spacing="${size * 0.06}" fill="#22b8d6">TODO EN UN SOLO LUGAR</text>
  <text x="${x}" y="${y + size * 1.13}" font-family="${FONT}" font-weight="700" font-size="${size}" letter-spacing="-2" fill="#ffffff">Tu iglesia,</text>
  <text x="${x}" y="${y + size * 2.28}" font-family="${FONT}" font-weight="700" font-size="${size}" letter-spacing="-2" fill="#7fe3f2">en un solo lugar.</text>`;
}
function sub(x, y, size, lines) {
  return lines.map((l, i) => `<text x="${x}" y="${y + i * size * 1.45}" font-family="${FONT}" font-size="${size}" fill="#c9d0d8">${l}</text>`).join("");
}
function features(x, y, cols, cw, ch, gx, gy, k = 1) {
  return FEATURES.map(([icon, title, desc], i) => {
    const fx = x + (i % cols) * (cw + gx);
    const fy = y + Math.floor(i / cols) * (ch + gy);
    return `<g transform="translate(${fx} ${fy})">
      <rect width="${cw}" height="${ch}" rx="22" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.1"/>
      <circle cx="54" cy="${ch / 2}" r="28" fill="#22b8d6" fill-opacity="0.16"/>
      <g transform="translate(40 ${ch / 2 - 14}) scale(1.17)" fill="none" stroke="#7fe3f2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon]}</g>
      <text x="100" y="${ch / 2 - 4}" font-family="${FONT}" font-weight="700" font-size="${25 * k}" fill="#ffffff">${title}</text>
      <text x="100" y="${ch / 2 + 26}" font-family="${FONT}" font-size="${19 * k}" fill="#b7bcc4">${desc}</text>
    </g>`;
  }).join("");
}

const LAYOUTS = {
  // Historia: vertical alta. Deja aire arriba y abajo (ahí van los botones de Instagram/WhatsApp).
  "truly-church-un-solo-lugar-historia": {
    W: 1080,
    H: 1920,
    body: () =>
      logo(90, 170) +
      heading(86, 420, 86) +
      sub(90, 680, 30, ["Encuentra todo lo relacionado con nuestra", "iglesia: grupos, oración, eventos y más."]) +
      features(90, 820, 2, 438, 104, 24, 18) +
      `<g transform="translate(90 1250)">
        <rect width="900" height="470" rx="34" fill="url(#card)" stroke="#7fe3f2" stroke-opacity="0.25"/>
        ${qrBlock(40, 40, 330)}
        <text x="450" y="70" font-family="${FONT}" font-weight="600" font-size="24" fill="#d6f6fb">Escanea el código</text>
        <text x="450" y="104" font-family="${FONT}" font-weight="600" font-size="24" fill="#d6f6fb">o ingresa a</text>
        <text x="40" y="${40 + 330 * 1.18 + 44}" font-family="${FONT}" font-weight="700" font-size="0"></text>
        <text x="450" y="200" font-family="${FONT}" font-weight="700" font-size="40" fill="#ffffff">trulychurch</text>
        <text x="450" y="248" font-family="${FONT}" font-weight="700" font-size="40" fill="#7fe3f2">.com</text>
        <text x="450" y="330" font-family="${FONT}" font-size="22" fill="#d6f6fb">Te esperamos</text>
        <text x="450" y="362" font-family="${FONT}" font-size="22" fill="#d6f6fb">este domingo</text>
        <text x="450" y="394" font-family="${FONT}" font-size="22" fill="#d6f6fb">9:00 y 11:30 a. m.</text>
      </g>`,
  },
  // Pantalla del culto: horizontal 16:9; texto grande para leer desde lejos.
  "truly-church-un-solo-lugar-pantalla": {
    W: 1920,
    H: 1080,
    body: () =>
      logo(120, 90) +
      heading(116, 290, 96) +
      sub(120, 585, 32, ["Encuentra todo lo relacionado con nuestra iglesia:", "grupos, oración, eventos y más."]) +
      features(120, 720, 3, 375, 104, 18, 20, 0.88) +
      `<g transform="translate(1310 150)">
        <rect width="490" height="780" rx="36" fill="url(#card)" stroke="#7fe3f2" stroke-opacity="0.25"/>
        ${qrBlock(55, 55, 320)}
        <text x="245" y="510" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="26" fill="#d6f6fb">Escanea el código o ingresa a</text>
        <text x="245" y="580" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="52" letter-spacing="-1" fill="#ffffff">trulychurch.com</text>
        <line x1="70" y1="630" x2="420" y2="630" stroke="#7fe3f2" stroke-opacity="0.3"/>
        <text x="245" y="682" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#d6f6fb">Te esperamos este domingo</text>
        <text x="245" y="718" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#d6f6fb">9:00 y 11:30 a. m.</text>
      </g>`,
  },
};

(async () => {
  for (const [name, { W, H, body }] of Object.entries(LAYOUTS)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${background(W, H)}${body()}</svg>`;
    const out = path.join(__dirname, name);
    fs.writeFileSync(out + ".svg", svg);
    await sharp(Buffer.from(svg), { density: 144 }).png().toFile(out + ".png");
    console.log("ok", name);
  }
})();
