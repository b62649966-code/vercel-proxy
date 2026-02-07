// pages/api/index.js
import fetch from "node-fetch";

const PROXY = "/api?url=";

export default async function handler(req, res) {
  const { url } = req.query;

  // Homepage
  if (!url) {
    return res.send(`<!DOCTYPE html>
<html>
<head>
  <title>WGs+</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      margin:0;
      font-family:sans-serif;
      background:#000;
      color:#fff;
      text-align:center;
      overflow:hidden; /* added for particles */
    }

    /* === PARTICLE CANVAS === */
    canvas#particles {
      position:fixed;
      inset:0;
      z-index:-1;
    }

    #icon-row { display:flex; justify-content:center; flex-wrap:wrap; gap:30px; margin-top:30px; }
    .icon-item { width:64px; height:64px; cursor:pointer; transition: transform .2s; }
    .icon-item img { width:100%; height:100%; object-fit:contain; }
    .icon-item:hover { transform:scale(1.1); }
    input { padding:10px; width:300px; border-radius:20px; border:none; margin-top:100px; background:#111; color:#fff; }
    button { padding:10px 20px; margin-left:10px; border-radius:20px; border:none; background:#3b82f6; color:#fff; cursor:pointer; }
  </style>
</head>
<body>

  <!-- PARTICLE CANVAS -->
  <canvas id="particles"></canvas>

  <h1>WGs+</h1>
  <div>
    <input id="urlInput" placeholder="Enter URL">
    <button onclick="go()">Go</button>
  </div>

  <div id="icon-row">
    <!-- icons unchanged -->
    ${/* icons untouched */""}
    ${""}
  </div>

  <script>
    function go() {
      const input = document.getElementById('urlInput').value;
      if(input) location.href='${PROXY}'+encodeURIComponent(input);
    }

    /* === PARTICLE SCRIPT === */
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particles = Array.from({ length: 80 }, () => ({
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
      ctx.fillStyle = 'rgba(255,255,255,0.7)';

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

  // Proxy fetch
  try {
    const response = await fetch(url);
    const body = await response.text();
    res.send(body);
  } catch (e) {
    res.status(500).send('Error fetching URL');
  }
}
