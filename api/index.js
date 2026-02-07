import fetch from "node-fetch";

const PROXY = "/api?url=";

export default async function handler(req, res) {
  const { url } = req.query;

  // ================= HOME =================
  if (!url) {
    return res.send(`<!DOCTYPE html>
<html>
<head>
<title>WGs+</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
body {
  margin:0;
  background:black;
  color:#00ff9c;
  font-family:monospace;
  overflow:hidden;
}

canvas {
  position:fixed;
  inset:0;
  z-index:-1;
}

.center {
  height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
}

h1 {
  font-size:80px;
  margin-bottom:25px;
}

.search {
  display:flex;
}

input {
  width:520px;
  padding:16px 22px;
  border-radius:30px;
  border:1px solid #00ff9c;
  background:#050505;
  color:#00ff9c;
  font-size:16px;
  outline:none;
}

button {
  margin-left:10px;
  padding:16px 28px;
  border-radius:30px;
  border:none;
  background:#00ff9c;
  color:black;
  font-weight:bold;
  cursor:pointer;
}

#icon-row {
  margin-top:35px;
  display:flex;
  gap:40px;
}

.icon-item {
  width:64px;
  height:64px;
  transition:.2s;
}

.icon-item:hover {
  transform:scale(1.15);
}

.icon-item img {
  width:100%;
  height:100%;
  filter:drop-shadow(0 0 8px rgba(0,255,156,.6));
}
</style>
</head>

<body>
<canvas id="p"></canvas>

<div class="center">
  <h1>WGs+</h1>

  <div class="search">
    <input id="u" placeholder="enter site (roblox.com)">
    <button onclick="go()">GO</button>
  </div>

  <div id="icon-row">
    <!-- ROBLOX -->
    <a class="icon-item" href="${PROXY}https://www.roblox.com">
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Roblox_Logo.svg">
    </a>

    <!-- MOVIES -->
    <a class="icon-item" href="${PROXY}https://www.examplemovie.com">
      <img src="https://cdn-icons-png.flaticon.com/512/2503/2503508.png">
    </a>

    <!-- GAMES -->
    <a class="icon-item" href="${PROXY}https://linear-maroon-lpc9bycpg2.edgeone.app/">
      <img src="https://cdn-icons-png.flaticon.com/512/686/686589.png">
    </a>
  </div>
</div>

<script>
function go(){
  let v=u.value.trim();
  if(!v) return;
  if(!v.startsWith('http')) v='https://'+v;
  location.href='${PROXY}'+encodeURIComponent(v);
}
u.onkeydown=e=>e.key==='Enter'&&go();

// particles
const c=p,ctx=c.getContext('2d');
let W,H,d;
function r(){
  W=c.width=innerWidth;
  H=c.height=innerHeight;
  d=[...Array(90)].map(()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*2}));
}
onresize=r;r();
(function a(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#00ff9c';
  d.forEach(o=>{
    o.x+=o.vx;o.y+=o.vy;
    if(o.x<0||o.x>W)o.vx*=-1;
    if(o.y<0||o.y>H)o.vy*=-1;
    ctx.beginPath();
    ctx.arc(o.x,o.y,o.r,0,7);
    ctx.fill();
  });
  requestAnimationFrame(a);
})();
</script>
</body>
</html>`);
  }

  // ================= PROXY =================
  try {
    const r = await fetch(url, {
      headers: { "user-agent": req.headers["user-agent"] || "" }
    });

    let b = await r.text();

    b = b.replace("<head>", `<head><base href="${url}">`);
    b = b.replace(/(href|src)="https?:\/\/([^"]+)"/g, `$1="${PROXY}https://$2"`);

    res.send(b);
  } catch {
    res.status(500).send("Proxy error");
  }
}
