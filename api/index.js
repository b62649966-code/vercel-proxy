import express from "express";
import fetch from "node-fetch";

const app = express();

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
      background: black;
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
      box-shadow: 0 8px 20px rgba(0,0,0,0.7);
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
    button {
      background: #3b82f6;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>WGs+</h2>
    <form id="proxyForm" action="/proxy">
      <input id="urlInput" name="url" placeholder="Enter website URL" required>
      <button type="submit">Go</button>
    </form>
  </div>

  <script>
    const form = document.getElementById("proxyForm");
    const input = document.getElementById("urlInput");

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!/^https?:\\/\\//i.test(input.value)) {
        input.value = "https://" + input.value;
      }
      form.submit();
    });
  </script>
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
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    const type = response.headers.get("content-type") || "";
    res.setHeader("Content-Type", type);

    if (type.includes("text/html")) {
      let html = await response.text();
      const PROXY = "/proxy?url=";

      const inject = `
<style>
#proxy-back {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 999999;
  background: black;
  color: white;
  border: 1px solid #333;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
<button id="proxy-back" onclick="history.back()">← Back</button>
<script>
(() => {
  const wrap = url => {
    try {
      return "${PROXY}" + encodeURIComponent(new URL(url, location.href).href);
    } catch {
      return url;
    }
  };

  window.fetch = new Proxy(window.fetch, {
    apply(t, a, args) {
      args[0] = wrap(args[0]);
      return Reflect.apply(t, a, args);
    }
  });

  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m, u) {
    return open.call(this, m, wrap(u));
  };
})();
</script>`;

      html = html.replace(/<head>/i, `<head>${inject}`);
      html = html.replace(
        /(href|src|action)=["'](https?:\/\/[^"']+)["']/gi,
        `$1="${PROXY}$2"`
      );
      html = html.replace(
        /(href|src|action)=["']\/([^"']*)["']/gi,
        `$1="${PROXY}${targetUrl.origin}/$2"`
      );

      return res.send(html);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching target URL");
  }
});

/* =====================
   VERCEL EXPORT
   ===================== */
export default app;
