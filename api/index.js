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
      overflow:hidden;
    }

    canvas#particles {
      position:fixed;
      inset:0;
      z-index:-1;
    }

    #icon-row {
      display:flex;
      justify-content:center;
      flex-wrap:wrap;
      gap:30px;
      margin-top:30px;
    }

    .icon-item {
      width:64px;
      height:64px;
      cursor:pointer;
      transition: transform .2s;
    }

    .icon-item img {
      width:100%;
      height:100%;
      object-fit:contain;
    }

    .icon-item:hover {
      transform:scale(1.1);
    }

    input {
      padding:10px;
      width:300px;
      border-radius:20px;
      border:none;
      margin-top:100px;
      background:#111;
      color:#fff;
    }

    button {
      padding:10px 20px;
      margin-left:10px;
      border-radius:20px;
      border:none;
      background:#3b82f6;
      color:#fff;
      cursor:pointer;
    }
  </style>
</head>
<body>

<canvas id="particles"></canvas>

<h1>WGs+</h1>

<div>
  <input id="urlInput" placeholder="Enter URL">
  <button onclick="go()">Go</button>
</div>

<div id="icon-row">

  <!-- ROBLOX -->
  <a class="icon-item" href="${PROXY}https://luminal.arrowbases.com/40810x.html">
    <img src="data:image/png;base64,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">
  </a>

  <!-- MOVIE -->
  <a class="icon-item" href="${PROXY}https://www.examplemovie.com">
    <img src="data:image/png;base64,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">
  </a>

  <!-- GAMES -->
  <a class="icon-item" href="${PROXY}https://linear-maroon-lpc9bycpg2.edgeone.app/">
    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIsA4QMBIgACEQEDEQH/xAAcAAEBAQACAwEAAAAAAAAAAAAABwYEBQIDCAH/xABFEAABAwMCAQcGCgcJAQAAAAAAAQIDBAURBgcSEyEiMUFRYQgUF3GBkTJSVJKTlKGx0tMVVWOiwdHhIyQzQkOChcLiFv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA">
  </a>

</div>

<script>
  function go() {
    const input = document.getElementById('urlInput').value;
    if (input) location.href = '${PROXY}' + encodeURIComponent(input);
  }

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
    res.status(500).send("Error fetching URL");
  }
}
