import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

/* =====================
   HOMEPAGE
   ===================== */
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>WGs+</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui;
      background: #0f172a;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #020617;
      padding: 40px;
      border-radius: 16px;
      width: 400px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    input, button {
      width: 100%;
      padding: 14px;
      border-radius: 8px;
      border: none;
      margin-top: 10px;
      font-size: 16px;
    }
    input {
      background: #1e293b;
      color: white;
    }
    input::placeholder {
      color: #94a3b8;
    }
    button {
      background: #3b82f6;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>WGs+</h2>
    <form action="/proxy">
      <input name="url" placeholder="Enter website URL" required>
      <button>Go</button>
    </form>
  </div>
</body>
</html>`);
});

/* =====================
   PROXY ROUTE
   ===================== */
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing URL");

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return res.status(400).send("Invalid URL");
  }

  try {
    const response = await fetch(targetUrl.href, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "*/*" }
    });

    const type = response.headers.get("content-type") || "";
    res.set("Content-Type", type);

    if (type.includes("text/html")) {
      let html = await response.text();

      const PROXY = `/proxy?url=`;
      const inject = `
<script>
(() => {
  const wrap = url => { try { return PROXY + encodeURIComponent(new URL(url, location.href).href); } catch { return url; } };
  history.pushState = new Proxy(history.pushState, { apply(t,a,args){ if(args[2]) args[2]=wrap(args[2]); return Reflect.apply(t,a,args); } });
  history.replaceState = new Proxy(history.replaceState, { apply(t,a,args){ if(args[2]) args[2]=wrap(args[2]); return Reflect.apply(t,a,args); } });
  window.fetch = new Proxy(window.fetch, { apply(t,a,args){ args[0]=wrap(args[0]); return Reflect.apply(t,a,args); } });
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m,u){ return open.call(this,m,wrap(u)); }
})();
</script>`;

      html = html.replace(/<head>/i, `<head>${inject}`);
      html = html.replace(/(href|src|action)=["'](https?:\/\/[^"']+)["']/gi, `$1="${PROXY}$2"`);
      html = html.replace(/(href|src|action)=["']\/([^"']*)["']/gi, `$1="${PROXY}${targetUrl.origin}/$2"`);

      return res.send(html);
    }

    // Other content types (images, CSS, JS)
    response.body.pipe(res);

  } catch (err) {
    console.error("Proxy fetch error:", err);
    return res.status(500).send("Error fetching target URL");
  }
});

/* =====================
   START SERVER
   ===================== */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
