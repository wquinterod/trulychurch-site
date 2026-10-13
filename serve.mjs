// Servidor local mínimo para ver el sitio (solo desarrollo).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./site/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml", ".txt": "text/plain" };

createServer(async (req, res) => {
  let path = decodeURIComponent((req.url || "/").split("?")[0]).replace(/^\/+/, "");
  if (!path || path.endsWith("/")) path += "index.html";
  if (path.includes("..")) return res.writeHead(400).end();
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end("No encontrado");
  }
}).listen(Number(process.env.PORT || 4173), () => console.log("http://localhost:" + (process.env.PORT || 4173)));
