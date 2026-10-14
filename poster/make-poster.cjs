// Póster "Todo en un solo lugar" con QR a trulychurch.com (2026-10-14).
// Uso: node poster/make-poster.cjs  →  poster/truly-church-un-solo-lugar.(svg|png)
// Usa qrcode y sharp del repo de Truly (C:\dev\truly-crm\web\node_modules).
const fs = require("fs");
const path = require("path");
const NM = "C:/dev/truly-crm/web/node_modules/";
const QRCode = require(NM + "qrcode");
const sharp = require(NM + "sharp");

const URL = "https://trulychurch.com";
const W = 1080;
const H = 1350;
const FONT = "Segoe UI, Arial, sans-serif";

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

// Íconos de línea (24×24), mismos trazos que la página.
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

async function main() {
  const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const qrSize = 300;
  const cell = qrSize / n;
  let qrRects = "";
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (qr.modules.get(x, y)) qrRects += `<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${(cell + 0.4).toFixed(2)}" height="${(cell + 0.4).toFixed(2)}"/>`;

  const logo = fs
    .readFileSync(path.join(__dirname, "../site/logo.svg"), "utf8")
    .replace(/<\?xml[^>]*>/, "")
    .replace(/<svg[^>]*>/, "")
    .replace("</svg>", "")
    .replace(/id="g"/g, 'id="lg"')
    .replace(/url\(#g\)/g, "url(#lg)");

  // Rejilla 2×3 de lo que hay en la página.
  const gx = 90, gy = 640, cw = 438, ch = 104, gap = 24;
  let grid = "";
  FEATURES.forEach(([icon, title, sub], i) => {
    const x = gx + (i % 2) * (cw + gap);
    const y = gy + Math.floor(i / 2) * (ch + 18);
    grid += `
    <g transform="translate(${x} ${y})">
      <rect width="${cw}" height="${ch}" rx="22" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.1"/>
      <circle cx="54" cy="${ch / 2}" r="28" fill="#22b8d6" fill-opacity="0.16"/>
      <g transform="translate(40 ${ch / 2 - 14}) scale(1.17)" fill="none" stroke="#7fe3f2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon]}</g>
      <text x="100" y="${ch / 2 - 4}" font-family="${FONT}" font-weight="700" font-size="25" fill="#ffffff">${esc(title)}</text>
      <text x="100" y="${ch / 2 + 26}" font-family="${FONT}" font-size="19" fill="#b7bcc4">${esc(sub)}</text>
    </g>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow1" cx="85%" cy="8%" r="60%"><stop offset="0" stop-color="#22b8d6" stop-opacity="0.38"/><stop offset="1" stop-color="#22b8d6" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="5%" cy="70%" r="55%"><stop offset="0" stop-color="#137d9a" stop-opacity="0.35"/><stop offset="1" stop-color="#137d9a" stop-opacity="0"/></radialGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#137d9a"/><stop offset="0.6" stop-color="#0d4f63"/><stop offset="1" stop-color="#0b2d38"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0b1116"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <circle cx="1000" cy="120" r="230" fill="none" stroke="#7fe3f2" stroke-opacity="0.12"/>
  <circle cx="1000" cy="120" r="320" fill="none" stroke="#7fe3f2" stroke-opacity="0.07"/>

  <g transform="translate(90 86) scale(1.0)"><svg width="64" height="64" viewBox="0 0 64 64">${logo}</svg></g>
  <text x="172" y="130" font-family="${FONT}" font-weight="700" font-size="34" fill="#ffffff">Truly Church</text>

  <text x="90" y="265" font-family="${FONT}" font-weight="700" font-size="22" letter-spacing="5" fill="#22b8d6">TODO EN UN SOLO LUGAR</text>
  <text x="86" y="358" font-family="${FONT}" font-weight="700" font-size="82" letter-spacing="-2" fill="#ffffff">Tu iglesia,</text>
  <text x="86" y="452" font-family="${FONT}" font-weight="700" font-size="82" letter-spacing="-2" fill="#7fe3f2">en un solo lugar.</text>
  <text x="90" y="530" font-family="${FONT}" font-size="29" fill="#c9d0d8">Encuentra todo lo relacionado con nuestra iglesia:</text>
  <text x="90" y="572" font-family="${FONT}" font-size="29" fill="#c9d0d8">grupos, oración, eventos y más.</text>
  ${grid}

  <g transform="translate(90 1030)">
    <rect width="900" height="250" rx="30" fill="url(#card)" stroke="#7fe3f2" stroke-opacity="0.25"/>
    <rect x="28" y="25" width="200" height="200" rx="18" fill="#ffffff"/>
    <g transform="translate(43 40) scale(${(170 / qrSize).toFixed(4)})" fill="#0b1116">${qrRects}</g>
    <text x="268" y="92" font-family="${FONT}" font-weight="600" font-size="24" fill="#d6f6fb">Escanea el código o ingresa a</text>
    <text x="266" y="152" font-family="${FONT}" font-weight="700" font-size="50" letter-spacing="-1" fill="#ffffff">trulychurch.com</text>
    <text x="268" y="200" font-family="${FONT}" font-size="22" fill="#d6f6fb">Te esperamos este domingo · 9:00 y 11:30 a. m.</text>
  </g>
</svg>`;

  const out = path.join(__dirname, "truly-church-un-solo-lugar");
  fs.writeFileSync(out + ".svg", svg);
  // 2× para que se vea nítido impreso o en pantallas grandes (2160×2700).
  await sharp(Buffer.from(svg), { density: 144 }).png().toFile(out + ".png");
  console.log("ok", out + ".png");
}
main();
