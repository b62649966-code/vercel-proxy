// api/index.js
import fetch from "node-fetch";

const PROXY = "/api?url=";

function injectedUI(home = false) {
  return `
<style>
:root { --wgs-color: #3b82f6; }

/* WGs logo / home */
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
  text-decoration: none;
}

/* Back button */
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
  background: rgba(255,255,255,0.1);
  padding: 4px 8px;
  border-radius: 6px;
  text-decoration: none;
  display: ${home ? "none" : "block"};
}

/* Optional particles */
#wgs-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* ==== Search UI ==== */
body {
  margin: 0;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  color: #fff;
}

#search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15%;
}

#search-container input {
  width: 480px;
  max-width: 90%;
  padding: 12px 16px;
  font-size: 17px;
  border-radius: 24px;
  border: 1px solid #333;
  outline: none;
  transition: all 0.2s;
  background: #111;
  color: #fff;
}

#search-container input:focus {
  border-color: var(--wgs-color);
  box-shadow: 0 0 10px rgba(59,130,246,0.5);
}

#search-container button {
  margin-top: 16px;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  background: var(--wgs-color);
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
}

#search-container button:hover {
  background: #2563eb;
}

/* ==== Icon row under search bar ==== */
#icon-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.icon-item {
  width: 64px;
  height: 64px;
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.2s;
}

.icon-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-item:hover {
  transform: scale(1.1);
}
</style>

${
  home
    ? `<a id="wgs-logo" href="/api">WGs</a><canvas id="wgs-canvas"></canvas>`
    : `<a id="back-btn" href="/api">Home</a>`
}

<script>
(() => {
  const meta = document.querySelector('meta[name="theme-color"]');
  const color = meta?.content || getComputedStyle(document.body).color || "#3b82f6";
  document.documentElement.style.setProperty("--wgs-color", color);

  ${
    home
      ? `
  const canvas = document.getElementById("wgs-canvas");
  const ctx = canvas.getContext("2d");
  let w,h;
  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}
  resize(); addEventListener("resize",resize);
  const particles = Array.from({length:45},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.35,vy:(Math.random()-0.5)*0.35,r:Math.random()*2+1}));
  function draw(){ctx.clearRect(0,0,w,h);ctx.fillStyle=color;ctx.shadowBlur=20;ctx.shadowColor=color;for(const p of particles){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw);}
  draw();
      `
      : ""
  }
})();
</script>
`;
}

export default async function handler(req,res){
  const {url} = req.query;

  if(!url){
    // Homepage
    return res.send(`<!DOCTYPE html>
<html>
<head>
<title>WGs+</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#3b82f6">
</head>
<body>

${injectedUI(true)}

<!-- Search container -->
<div id="search-container">
  <input id="urlInput" placeholder="Search or enter URL">
  <button id="searchBtn">Search</button>
</div>

<!-- Icon row under search bar -->
<div id="icon-row">
  <a href="" class="icon-item"><img src="YOUR_ROBLOX_ICON_URL_HERE" alt="Roblox"></a>
  <a href="" class="icon-item"><img src="YOUR_MOVIE_ICON_URL_HERE" alt="Movie"></a>
  <a href="" class="icon-item"><img src="YOUR_GAME_ICON_URL_HERE" alt="Game"></a>
</div>

<script>
const searchInput=document.getElementById("urlInput");
const searchBtn=document.getElementById("searchBtn");

searchBtn.onclick = () => {
  let u = searchInput.value;
  if(!/^https?:\\/\\//i.test(u)) u = "https://"+u;
  location.href="${PROXY}"+encodeURIComponent(u);
}

searchInput.addEventListener("keypress", e => {
  if(e.key==="Enter"){ e.preventDefault(); searchBtn.click(); }
});
</script>

</body>
</html>`);
  }

  // Proxy fetch
  let target;
  try{ target=new URL(url); }
  catch{ return res.status(400).send("Invalid URL"); }

  try{
    const r=await fetch(target.href,{headers:{"User-Agent":"Mozilla/5.0"}});
    const type=r.headers.get("content-type")||"";
    res.setHeader("Content-Type",type);

    if(type.includes("text/html")){
      let html=await r.text();
      html = html.replace(/<head>/i, "<head>" + injectedUI(false));
      html = html.replace(/<(a|form)\s+([^>]*)(href|action)=["'](https?:\/\/[^"']+)["']/gi, `<$1 $2$3="${PROXY}$4"`);
      html = html.replace(/<(a|form)\s+([^>]*)(href|action)=["']\/([^"']*)["']/gi, `<$1 $2$3="${PROXY}${target.origin}/$4"`);
      return res.send(html);
    }

    res.send(Buffer.from(await r.arrayBuffer()));
  }catch(e){ console.error(e); res.status(500).send("Fetch error"); }
}
