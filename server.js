import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================
   MAIN WEBSITE
   ===================== */
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family:system-ui">
  <h1>My Website</h1>
  <form action="/proxy">
    <input name="url" placeholder="https://example.com" required>
    <button>Open via Proxy</button>
  </form>
</body>
</html>`);
});

/* =====================
   PROXY ROUTE
   ===================== */
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing url");

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return res.status(400).send("Invalid URL");
  }

  const response = await fetch(targetUrl.href, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "*/*"
    }
  });

  const type = response.headers.get("content-type") || "";

  /* =====================
     HTML HANDLING
     ===================== */
  if (type.includes("text/html")) {
    let html = await response.text();

    const inject = `
<script>
(() => {
  const PROXY = "${req.protocol}://${req.get("host")}/proxy?url=";

  const wrap = url => {
    try {
      return PROXY + encodeURIComponent(new URL(url, location.href).href);
    } catch {
      return url;
    }
  };

  history.pushState = new Proxy(history.pushState, {
    apply(t, a, args) {
      if (args[2]) args[2] = wrap(args[2]);
      return Reflect.apply(t, a, args);
    }
  });

  history.replaceState = new Proxy(history.replaceState, {
    apply(t, a, args) {
      if (args[2]) args[2] = wrap(args[2]);
      return Reflect.apply(t, a, args);
    }
  });

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
      `$1="/proxy?url=$2"`
    );

    html = html.replace(
      /(href|src|action)=["']\/([^"']*)["']/gi,
      `$1="/proxy?url=${targetUrl.origin}/$2"`
    );

    res.set("Content-Type", "text/html");
    return res.send(html);
  }

  /* =====================
     EVERYTHING ELSE
     ===================== */
  res.set("Content-Type", type);
  response.body.pipe(res);
});

/* =====================
   START SERVER
   ===================== */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
