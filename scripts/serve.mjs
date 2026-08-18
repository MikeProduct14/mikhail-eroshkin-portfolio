import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const port = Number(process.env.PORT || 4173);
const host = "127.0.0.1";
const base = "/mikhail-eroshkin-portfolio";
const siteRoot = resolve("site");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8"
};

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (error) {
    if (error instanceof URIError) {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }
    throw error;
  }
  if (pathname === base) {
    response.writeHead(308, { Location: `${base}/${url.search}${url.hash}` });
    response.end();
    return;
  }
  if (!pathname.startsWith(`${base}/`)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  let relativePath = pathname.slice(base.length + 1);
  if (!relativePath || relativePath.endsWith("/")) relativePath += "index.html";
  const filePath = resolve(siteRoot, relativePath);
  if (!filePath.startsWith(`${siteRoot}${sep}`) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream", "Cache-Control": "no-store" });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`Portfolio server ready at http://${host}:${port}${base}/`);
});
