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
    body { margin:0; font-family:sans-serif; background:#000; color:#fff; text-align:center; }
    #icon-row { display:flex; justify-content:center; flex-wrap:wrap; gap:30px; margin-top:30px; }
    .icon-item { width:64px; height:64px; cursor:pointer; transition: transform .2s; }
    .icon-item img { width:100%; height:100%; object-fit:contain; }
    .icon-item:hover { transform:scale(1.1); }
    input { padding:10px; width:300px; border-radius:20px; border:none; margin-top:100px; background:#111; color:#fff; }
    button { padding:10px 20px; margin-left:10px; border-radius:20px; border:none; background:#3b82f6; color:#fff; cursor:pointer; }
  </style>
</head>
<body>
  <h1>WGs+</h1>
  <div>
    <input id="urlInput" placeholder="Enter URL">
    <button onclick="go()">Go</button>
  </div>
  <div id="icon-row">
    <a class="icon-item" href="${PROXY}https://luminal.arrowbases.com/40810x.html/"><img src="https://1000logos.net/wp-content/uploads/2021/05/Roblox-Logo.png" alt="Roblox"></a>
    <a class="icon-item" href="${PROXY}https://www.examplemovie.com"><img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Movie"></a>
    <a class="icon-item" href="${PROXY}https://www.examplegame.com"><img src="https://cdn-icons-png.flaticon.com/512/3082/3082037.png" alt="Game"></a>
    <a class="icon-item" href="${PROXY}https://linear-maroon-lpc9bycpg2.edgeone.app/"><img src="data:image/jpeg;base64,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" alt="WGS+ Games"></a>
  </div>

  <script>
    function go() {
      const input = document.getElementById('urlInput').value;
      if(input) location.href='${PROXY}'+encodeURIComponent(input);
    }
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
