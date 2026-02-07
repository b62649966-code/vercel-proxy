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
    <a class="icon-item" href="${PROXY}https://aimbots-16407873.codehs.me/"><img src="https://1000logos.net/wp-content/uploads/2021/05/Roblox-Logo.png" alt="Roblox"></a>
    <a class="icon-item" href="${PROXY}https://www.examplemovie.com"><img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Movie"></a>
    <a class="icon-item" href="${PROXY}https://www.examplegame.com"><img src="https://cdn-icons-png.flaticon.com/512/3082/3082037.png" alt="Game"></a>
    <a class="icon-item" href="${PROXY}https://www.yourwgsplusgames.com"><img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="WGS+ Games"></a>
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
