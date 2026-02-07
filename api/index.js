// api/index.js
import fetch from "node-fetch";

const PROXY = "/api?url=";

/* =====================
   SHARED UI SCRIPT
   ===================== */
function injectedUI(home = false) {
  return `
<style>
:root { --wgs-color: #3b82f6; }

/* ===== LOGO / HOME ===== */
#wgs-logo {
  position: fixed;
  top: 14px;
  left: 16px;
  z-index: 1000000;
  font-family: system-ui;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  color: var(--wgs-color);
  text-shadow: 0 0 14px var(--wgs-color);
  animation: float 3s ease-in-out infinite;
  user-select: none;
  pointer-events: auto;
  text-decoration: none;
}

/* ===== BACK BUTTON ===== */
#back-btn {
  position: fixed;
  top: 14px;
  left: 70px;
  z-index: 1000000;
  font-family: system-ui;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: #fff;
  background: rgba(0,0,0,0.4);
  padding: 4px 8px;
  border-radius: 6px;
  text-decoration: none;
  display: none;
}

/* ===== PARTICLES ===== */
#wgs-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>

${
  home
    ? `<a id="wgs-logo" href="/api" title="Go Home">WGs</a>
       <canvas id="wgs-canvas"></canvas>`
    : `<a id="back-btn" href="/api">Home</a>` // show back button on proxied pages
}

<script>
(() => {
  const meta = document.querySelector('meta[name="theme-color"]');
  const color = meta?.content || getComputedStyle(document.body).color || "#3b82f6";
  document.documentElement.style.setProperty("--wgs-color", color);

  ${
    home
      ? `
  // PARTICLES
  const canvas = document.getElementById("wgs-canvas");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  resize();
  addEventListener("resize", resize);

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 2 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
      `
      : ""
  }
})();
</script>
`;
}

/* =====================
   API HANDLER
   ===================== */
export default async function handler(req, res) {
  const { url } = req.query;

  /* ===== HOME PAGE ===== */
  if (!url) {
    return res.send(`<!DOCTYPE html>
<html>
<head>
  <title>WGs+</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#3b82f6">
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: radial-gradient(circle at top, #020617, #000);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui;
      color: white;
      overflow: hidden;
    }
    .card {
      background: rgba(2,6,23,.85);
      backdrop-filter: blur(10px);
      padding: 36px;
      border-radius: 16px;
      width: 380px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,.8);
      z-index: 1;
    }
    input, button {
      width: 100%;
      padding: 14px;
      border-radius: 8px;
      border: none;
      margin-top: 12px;
      font-size: 15px;
    }
    input { background: #1e293b; color: white; }
    button { background: #3b82f6; color: white; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h2>WGs+</h2>
    <form id="proxyForm">
      <input id="urlInput" placeholder="Enter website URL" required>
      <button>Go</button>
    </form>
  </div>

  ${injectedUI(true)}

  <script>
    proxyForm.onsubmit = e => {
      e.preventDefault();
      let u = urlInput.value;
      if (!/^https?:\\/\\//i.test(u)) u = "https://" + u;
      location.href = "${PROXY}" + encodeURIComponent(u);
    };
  </script>
</body>
</html>`);
  }

  /* ===== PROXY FETCH ===== */
  let target;
  try { target = new URL(url); }
  catch { return res.status(400).send("Invalid URL"); }

  try {
    const r = await fetch(target.href, { headers: { "User-Agent": "Mozilla/5.0" } });
    const type = r.headers.get("content-type") || "";
    res.setHeader("Content-Type", type);

    if (type.includes("text/html")) {
      let html = await r.text();

      // Inject UI without breaking JS-heavy sites
      html = html.replace(/<head>/i, "<head>" + injectedUI(false));

      // Only rewrite basic links and forms; skip scripts
      html = html.replace(/<(a|form)\s+([^>]*)(href|action)=["'](https?:\/\/[^"']+)["']/gi,
        `<$1 $2$3="${PROXY}$4"`);
      html = html.replace(/<(a|form)\s+([^>]*)(href|action)=["']\/([^"']*)["']/gi,
        `<$1 $2$3="${PROXY}${target.origin}/$4"`);

      return res.send(html);
    }

    res.send(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    console.error(e);
    res.status(500).send("Fetch error");
  }
}
