// api/index.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  /* =====================
     HOMEPAGE
     ===================== */
  if (!url) {
    return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <title>WGs+</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui;
      background: black;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #020617;
      padding: 40px;
      border-radius: 16px;
      width: 400px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0,0,0,0.7);
    }
    input, button {
      width: 100%;
      padding: 14px;
      border-radius: 8px;
      border: none;
      margin-top: 10px;
      font-size: 16px;
    }
    input {
      background: #1e293b;
      color: white;
    }
    button {
      background: #3b82f6;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }
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
  <script>
    proxyForm.onsubmit = e => {
      e.preventDefault();
      let u = urlInput.value;
      if (!/^https?:\\/\\//i.test(u)) u = "https://" + u;
      location.href = "/api?url=" + encodeURIComponent(u);
    };
  </script>
</body>
</html>`);
  }

  /* =====================
     VALIDATE URL
     ===================== */
  let targetUrl;
  try {
    targetUrl = new URL(url);
  } catch {
    return res.status(400).send("Invalid URL");
  }

  try {
    const response = await fetch(targetUrl.href, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    const type = response.headers.get("content-type") || "";
    res.setHeader("Content-Type", type);

    /* =====================
       HTML HANDLING
       ===================== */
    if (type.includes("text/html")) {
      let html = await response.text();
      const PROXY = "/api?url=";

      const inject = `
<style>
#wgs-logo {
  position: fixed;
  top: 12px;
  left: 14px;
  z-index: 999999;
  font-family: system-ui;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  animation: float 3s ease-in-out infinite;
  text-shadow: 0 0 12px currentColor;
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

#wgs-toggle {
  position: fixed;
  top: 42px;
  left: 14px;
  font-size: 11px;
  opacity: 0.7;
}

#wgs-canvas {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
</style>

<div id="wgs-logo" title="Click = toggle particles | Double-click = home">WGs</div>
<div id="wgs-toggle">Particles: ON</div>
<canvas id="wgs-canvas"></canvas>

<script>
(() => {
  /* =====================
     THEME COLOR MATCHING
     ===================== */
  function getThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) return meta.content;
    const bg = getComputedStyle(document.body).backgroundColor;
    return bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#3b82f6";
  }
  const color = getThemeColor();
  const logo = document.getElementById("wgs-logo");
  logo.style.color = color;

  /* =====================
     PARTICLES
     ===================== */
  const canvas = document.getElementById("wgs-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, running = true;

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  resize();
  addEventListener("resize", resize);

  const particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1
  }));

  function draw() {
    if (!running) return;
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
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  /* =====================
     TOGGLE + HOME
     ===================== */
  let clickTimer;
  logo.onclick = () => {
    if (clickTimer) return;
    clickTimer = setTimeout(() => {
      running = !running;
      document.getElementById("wgs-toggle").textContent =
        "Particles: " + (running ? "ON" : "OFF");
      if (running) draw();
      clickTimer = null;
    }, 250);
  };

  logo.ondblclick = () => {
    clearTimeout(clickTimer);
    location.href = "/api";
  };

  /* =====================
     PROXY SAFETY
     ===================== */
  const wrap = u => {
    try {
      return "/api?url=" + encodeURIComponent(new URL(u, location.href).href);
    } catch {
      return u;
    }
  };

  history.pushState = new Proxy(history.pushState, {
    apply(t, a, args) {
      if (args[2]) args[2] = wrap(args[2]);
      return Reflect.apply(t, a, args);
    }
  });

  history.replaceState = new Proxy(history.replaceState, {
    apply(t, a, args) {
      if (args[2]) args[2] = wrap(args[2]);
      return Reflect.apply(t, a, args);
    }
  });

  window.fetch = new Proxy(window.fetch, {
    apply(t, a, args) {
      args[0] = wrap(args[0]);
      return Reflect.apply(t, a, args);
    }
  });

  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m, u) {
    return open.call(this, m, wrap(u));
  };
})();
</script>
`;

      html = html.replace(/<head>/i, `<head>${inject}`);
      html = html.replace(/(href|src|action)=["'](https?:\/\/[^"']+)["']/gi, `$1="${PROXY}$2"`);
      html = html.replace(/(href|src|action)=["']\/([^"']*)["']/gi, `$1="${PROXY}${targetUrl.origin}/$2"`);

      return res.send(html);
    }

    /* =====================
       OTHER FILES
       ===================== */
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching target URL");
  }
}
