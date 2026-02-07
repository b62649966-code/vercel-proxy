import fetch from "node-fetch";

const BASIC = "/api?url=";

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
body{
  margin:0;
  background:#000;
  color:#00ff9c;
  font-family:monospace;
  overflow:hidden;
}
canvas{position:fixed;inset:0;z-index:-1}
.center{
  height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
}
h1{font-size:80px;margin-bottom:20px}
.controls{
  display:flex;
  gap:10px;
  margin-bottom:15px;
}
select,input,button{
  padding:14px 20px;
  border-radius:25px;
  border:1px solid #00ff9c;
  background:#050505;
  color:#00ff9c;
  font-size:15px;
}
input{width:460px}
button{
  background:#00ff9c;
  color:#000;
  cursor:pointer;
}
#icon-row{
  margin-top:35px;
  display:flex;
  gap:40px;
}
.icon-item{
  width:64px;height:64px;
  transition:.2s;
}
.icon-item:hover{transform:scale(1.15)}
.icon-item img{
  width:100%;height:100%;
  filter:drop-shadow(0 0 8px rgba(0,255,156,.6));
}
</style>
</head>

<body>
<canvas id="bg"></canvas>

<div class="center">
  <h1>WGs+</h1>

  <div class="controls">
    <select id="engine">
      <option value="basic">Basic Proxy</option>
      <option value="uv">Ultraviolet</option>
      <option value="rh">Rammerhead</option>
      <option value="sw">Service Worker</option>
      <option value="bare">Bare Server</option>
    </select>
    <input id="u" placeholder="enter site (roblox.com)">
    <button onclick="go()">GO</button>
  </div>

  <div id="icon-row">
    <a class="icon-item" onclick="openApp('https://www.roblox.com')">
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Roblox_Logo.svg">
    </a>
    <a class="icon-item" onclick="openApp('https://www.examplemovie.com')">
      <img src="https://cdn-icons-png.flaticon.com/512/2503/2503508.png">
    </a>
    <a class="icon-item" onclick="openApp('https://linear-maroon-lpc9bycpg2.edgeone.app/')">
      <img src="https://cdn-icons-png.flaticon.com/512/686/686589.png">
    </a>
  </div>
</div>

<script>
function buildURL(raw){
  if(!raw.startsWith('http')) raw='https://'+raw;
  const e = engine.value;

  if(e==='basic') return '${BASIC}'+encodeURIComponent(raw);
  if(e==='uv') return '/uv/service/'+btoa(raw);
  if(e==='rh') return '/rh/'+encodeURIComponent(raw);
  if(e==='sw') return '/sw/'+encodeURIComponent(raw);
  if(e==='bare') return '/bare/'+encodeURIComponent(raw);
}

function go(){
  if(!u.value.trim()) return;
  location.href = buildURL(u.value.trim());
}

function openApp(url){
  location.href = buildURL(url);
}

u.onkeydown = e => e.key==='Enter' && go();

// particles
const c=bg,ctx=c.getContext('2d');
let W,H,P;
function r(){
  W=c.width=innerWidth;
  H=c.height=innerHeight;
  P=[...Array(90)].map(()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*2}));
}
onresize=r;r();
(function a(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#00ff9c';
  P.forEach(o=>{
    o.x+=o.vx;o.y+=o.vy;
    if(o.x<0||o.x>W)o.vx*=-1;
    if(o.y<0||o.y>H)o.vy*=-1;
    ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,7);ctx.fill();
  });
  requestAnimationFrame(a);
})();
</script>
</body>
</html>`);
  }

  // ================= BASIC PROXY =================
  try {
    const r = await fetch(url, {
      headers:{ "user-agent": req.headers["user-agent"] || "" }
    });
    let b = await r.text();
    b = b.replace("<head>", `<head><base href="${url}">`);
    b = b.replace(/(href|src)="https?:\/\/([^"]+)"/g,
      `$1="${BASIC}https://$2"`);
    res.send(b);
  } catch {
    res.status(500).send("Proxy error");
  }
}
