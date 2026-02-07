// pages/api/index.js
import fetch from "node-fetch";

const PROXY = "/api?url=";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.send(`<!DOCTYPE html>
<html>
<head>
  <title>WGs+</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    body {
      margin: 0;
      font-family: monospace;
      background: #000;
      color: #fff;
      overflow: hidden;
    }

    canvas#particles {
      position: fixed;
      inset: 0;
      z-index: -1;
    }

    .center {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    h1 {
      font-size: 72px;
      margin-bottom: 30px;
      letter-spacing: 4px;
    }

    .search-box {
      display: flex;
      align-items: center;
    }

    input {
      padding: 16px 20px;
      width: 480px;
      border-radius: 30px;
      border: 1px solid #222;
      background: #050505;
      color: #00ff9c;
      font-size: 16px;
      outline: none;
      box-shadow: 0 0 12px rgba(0,255,156,0.15);
    }

    input::placeholder {
      color: #0f766e;
    }

    button {
      padding: 16px 28px;
      margin-left: 12px;
      border-radius: 30px;
      border: none;
      background: #00ff9c;
      color: #000;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }

    #icon-row {
      display: flex;
      gap: 32px;
      margin-top: 40px;
    }

    .icon-item {
      width: 64px;
      height: 64px;
      transition: transform .2s;
      cursor: pointer;
    }

    .icon-item img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 6px rgba(0,255,156,0.4));
    }

    .icon-item:hover {
      transform: scale(1.15);
    }
  </style>
</head>

<body>
  <canvas id="particles"></canvas>

  <div class="center">
    <h1>WGs+</h1>

    <div class="search-box">
      <input id="urlInput" placeholder="enter site (example: google.com)" />
      <button onclick="go()">GO</button>
    </div>

    <div id="icon-row">
      <a class="icon-item" href="${PROXY}https://luminal.arrowbases.com/40810x.html">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKYAAACUCAMAAAAu5KLjAAAA..." />
      </a>

      <a class="icon-item" href="${PROXY}https://www.examplemovie.com">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMEAAACUCAMAAAAd..." />
      </a>

      <a class="icon-item" href="${PROXY}https://linear-maroon-lpc9bycpg2.edgeone.app/">
        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." />
      </a>
    </div>
  </div>

<script>
  function go() {
    let input = document.getElementById('urlInput').value.trim();
    if (!input) return;

    // auto-add protocol
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      input = 'https://' + input;
    }

    location.href = '${PROXY}' + encodeURIComponent(input);
  }

  // enter key support
  document.getElementById('urlInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') go();
  });

  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    }));
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0,255,156,0.7)';
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
</script>

</body>
</html>`);
  }

  try {
    const response = await fetch(url);
    const body = await response.text();
    res.send(body);
  } catch {
    res.status(500).send("Error fetching URL");
  }
}
