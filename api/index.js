import fetch from "node-fetch";

const PROXY = "/api?url=";

export default async function handler(req, res) {
  const { url } = req.query;

  // ================= HOME PAGE =================
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
      color: #00ff9c;
      overflow: hidden;
    }

    canvas {
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
      letter-spacing: 4px;
      margin-bottom: 30px;
    }

    .search {
      display: flex;
      align-items: center;
    }

    input {
      width: 480px;
      padding: 16px 20px;
      border-radius: 30px;
      border: 1px solid #0f766e;
      background: #050505;
      color: #00ff9c;
      font-size: 16px;
      outline: none;
      box-shadow: 0 0 15px rgba(0,255,156,.25);
    }

    input::placeholder {
      color: #0f766e;
    }

    button {
      margin-left: 12px;
      padding: 16px 28px;
      border-radius: 30px;
      border: none;
      background: #00ff9c;
      color: #000;
      font-weight: bold;
      cursor: pointer;
    }

    #icon-row {
      margin-top: 40px;
      display: flex;
      gap: 32px;
    }

    .icon-item {
      width: 64px;
      height: 64px;
      cursor: pointer;
      transition: transform .2s;
    }

    .icon-item:hover {
      transform: scale(1.15);
    }

    .icon-item img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 6px rgba(0,255,156,.4));
    }
  </style>
</head>

<body>
<canvas id="particles"></canvas>

<div class="center">
  <h1>WGs+</h1>

  <div class="search">
    <input id="urlInput" placeholder="enter site (example: roblox.com)">
    <button onclick="go()">GO</button>
  </div>

  <div id="icon-row">
    <a class="icon-item" href="${PROXY}https://luminal.arrowbases.com/40810x.html">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKYAAACUCAMAAAAu5KLjAAAAZlBMVEUAAAD////6+vrt7e3y8vK0tLTa2trh4eHk5OS7u7vd3d3Ozs739/cfHx/R0dE7OztAQECWlpaLi4uenp53d3fBwcFbW1uEhIQYGBhFRUVvb29QUFAMDAxqamqnp6djY2MvLy8oKCgVM4c2AAAFaklEQVR4nO2b2ZayOhCFDWE0EMYwC/j+L/mXHolTSxArba918l31YKcL2KkpxW5nMBgMBoPBYDAYDAaDwWAw/L+ZHMrzMeq/bYcCn5wRadv8YVMLMhP63Gm/bc4rAkJYxml4sdViWRdH3zbqicglpNrt6iIX/nxbKUsPf8zSkhJrPH/VJ2Pqzpbansim71p2R0aIG9983w3ct2Zj3fSQfM2yOxxCgocfNUXO7NlSz8nG7zuAIwgyff5xFJeOvKkhaLX+rqkNyLB78bu+cDid76ofZOP3tlUFBiz8OiqLYS+3FRfZlyxlz9J8pK+LwJ+1alGnTabfsOwO+PerAk+XOe51W+XZK6HoYYRtsvY5Tl0RSEspDwqtlt0xgG986w+iSvhXW/OyO2qy7A5ByPDu30RjGnhyW7Gh0h4BGvCaW55dPzUVs+Su8pxOq1uFJM7fvhm6VHhzYkU4pKuIlt2RQhJXf7JA3KZCRgBPHLAMu6N3N0jzaZGoSV37ooASw6xHIhAWTrpeHwZ2Slc5ymoPjJBWfPTMb6mbbDnwbsZ512sukxPiIC4n8X5M4j5ZTsceSiCcIMbmGpwTmoRuAHdEEROzCldCEpCmQIweDoJ3+4GJE5LhLVfzlTnhm5QhCRElD5W0ryNcgpb2sfpja4H8gOlIQCCJE4jLaZLmLkT1mrWPFXjvmSAEI2rpCCmyjmd+8pqIy4HSGeJyEo4rzQA38M4c6bb64hUUVUKSAnYQojsCJ0x1BHTIulzE4jVVd0+2UCtL3zp5Jy0R554zOg1VrTvaLK/Wyi3eE3v83KpnI8AdLddX1bkEd51VGeloEXfCsOuBQVleMXkQs08PjWJ7aJLm6cxKUbdYxBLyxIAqwjVDzQmvEFXdEkPVuTs2hQjPJbjCTLgmHZ2kFv7z8idyGfziTNkn6HADrwSyrv3yJ25S+2LNNWmR5p6QfPEDE70GKaHcbq6m+oKqHiPEUu8SpOq9an/ElFiIgVcCaqPLkr/pYKy4Jgs18EpOR2uLOeyRXYMU+ERv+V45KgltY3JVyWEHd5AP7fFixPI1RYxYOgI6+I9wWfLt5RSQp82qa6I6DmBOR2vL6U/LPHliCUWOQpqa+ppiRd0StymbG+veckR3NDUMw3XJYR91+f7UrlbUTFRPw7Ah64/WdlExsOWaqVcGqW2kp6ziDaLlZw7S9D6y5wUrTn3fQegpfWMPtfTtPT3nLG1IQkQ3N9qqwLuNUyaJXPpqaB6dSl9MN6croNuoERiUbuvINU+lL2K3p4TAqyOJy5X1xVtkmhqGHm7z2dVT+kYWrpuDSDkhLjejLhPfAlJXC3E5SYCbHDq4PeeZiOO6Oa6nYVjiJoeNTywdAR3qCw8xAlcW4RPecpIBV0u6BhJA8qxEm8QGpVtaGobpuVsphgKlmRJbekrf3fHSWQ19nn8e2Q+aZmWAQuzlyCBLx+STXDHQJM0z9ZgN7twt8ER+2HzupKn0vXKMD8483BbaPEu2mDpZekrfB7pcyElcKrLx3W2VaZqVeeZYVvKu2nuRvrWtAk0DCT/TTzmns1ZtUSUrs/FJUy97gajIA9mEc51qXKFVKH21zMooSMr0OorvqSexIT8QOg6n11Dmrj83DGnQLk1i/640n4gPqZgdgM2HV8fAESXWL86+/0Qdl8MsVcv2nJ8OoRO4iL/wjlZdOVy+OOYO7cPUuK7SdwN9V+TyGNhnQ3FjKdPTMNxKHYEA5lHs0Mu76b/tbaPOtOCQVNc3XGyWF8lpIEHLGNenTGUl5NuYPuOWltIXh75wrm+4fNkdLVMfMnF+wyX4lZdwPqCOwQO0f8FpGgwGg8FgMBgMBoPBYPiAf79FOkfTotI3AAAAAElFTkSuQmCC">
    </a>
  </div>
</div>

<script>
function go() {
  let v = document.getElementById('urlInput').value.trim();
  if (!v) return;
  if (!v.startsWith('http')) v = 'https://' + v;
  location.href = '${PROXY}' + encodeURIComponent(v);
}

document.getElementById('urlInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') go();
});

// particles
const c = document.getElementById('particles');
const ctx = c.getContext('2d');
let w,h,p;
function resize(){
  w=c.width=innerWidth; h=c.height=innerHeight;
  p=Array.from({length:80},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*2}));
}
window.onresize=resize; resize();
(function loop(){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(0,255,156,.7)';
  p.forEach(o=>{
    o.x+=o.vx; o.y+=o.vy;
    if(o.x<0||o.x>w) o.vx*=-1;
    if(o.y<0||o.y>h) o.vy*=-1;
    ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,Math.PI*2); ctx.fill();
  });
  requestAnimationFrame(loop);
})();
</script>
</body>
</html>`);
  }

  // ================= PROXY =================
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": req.headers["user-agent"] || ""
      }
    });

    let body = await response.text();

    // base tag for relative URLs
    body = body.replace(
      "<head>",
      `<head><base href="${url}">`
    );

    // rewrite absolute links
    body = body.replace(
      /(href|src)="https?:\/\/([^"]+)"/g,
      `$1="${PROXY}https://$2"`
    );

    res.send(body);
  } catch (e) {
    res.status(500).send("Error fetching URL");
  }
}
