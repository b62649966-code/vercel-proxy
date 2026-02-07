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
  <a href="" class="icon-item"><img src="data:image/png;base64,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" alt="Roblox"></a>
  <a href="" class="icon-item"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaGdPRxbzDWLAp2N9pNVPtvAEaWElXZcPasg&s" alt="Movie"></a>
  <a href="" class="icon-item"><img src="data:image/png;base64,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" alt="Game"></a>
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
