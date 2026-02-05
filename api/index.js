import fetch from "node-fetch";

export default async function handler(req, res) {
  const reqUrl = new URL(req.url, `https://${req.headers.host}`);
  const target = reqUrl.searchParams.get("url");

  /* =====================
     HOMEPAGE
     ===================== */
  if (!target) {
    return res
      .status(200)
      .setHeader("Content-Type", "text/html")
      .send(`<!DOCTYPE html>
<html>
<head>
<title>Web Proxy</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {
  margin: 0;
  font-family: system-ui;
  background: #0f172a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.card {
  background: #020617;
  padding: 30px;
  border-radius: 14px;
  width: 400px;
}
input, button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
}
button {
  margin-top: 10px;
  background: #3b82f6;
  color: white;
  font-weight: bold;
}
</style>
</head>
<body>
<div class="card">
  <h2>Web Proxy</h2>
  <form>
    <input name="url" placeholder="https://example.com" required>
    <button>Go</button>
  </form>
</div>
</body>
</html>`);
  }

  /* =====================
     VALIDATE URL
     ===================== */
  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return res.status(400).send("Invalid URL");
  }

  /* =====================
     FETCH TARGET
     ===================== */
  let response;
  try {
    response = await fetch(targetUrl.href, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "*/*" },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error fetching target URL");
  }

  const contentType = response.headers.get("content-type") || "";

  /* =====================
     HTML RESPONSE
     ===================== */
  if (contentType.includes("text/html")) {
    let html = await response.text();

    const inject = `
<script>
(() => {
  const PROXY = "${reqUrl.origin}/api?url=";
  const wrap = url => { try { return PROXY + encodeURIComponent(new URL(url, location.href).href); } catch { return url; } };

  // Patch history
  history.pushState = new Proxy(history.pushState, { apply(t,a,args){ args[2] = wrap(args[2]); return Reflect.apply(t,a,args); }});
  history.replaceState = new Proxy(history.replaceState, { apply(t,a,args){ args[2] = wrap(args[2]); return Reflect.apply(t,a,args); }});

  // Patch fetch
  window.fetch = new Proxy(window.fetch, { apply(t,a,args){ args[0]=wrap(args[0]); return Reflect.apply(t,a,args); }});

  // Patch XHR
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m,u){ return open.call(this,m,wrap(u)); };
})();
</script>`;

    html = html.replace(/<head>/i, `<head>${inject}`);
    html = html.replace(
      /(href|src|action)=["'](https?:\/\/[^"']+)["']/gi,
      `$1="${reqUrl.origin}/api?url=$2"`
    );
    html = html.replace(
      /(href|src|action)=["']\/([^"']*)["']/gi,
      `$1="${reqUrl.origin}/api?url=${targetUrl.origin}/$2"`
    );

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(html);
  }

  /* =====================
     NON-HTML RESPONSE
     ===================== */
  res.setHeader("Content-Type", contentType);
  res.setHeader("Access-Control-Allow-Origin", "*");

  const buffer = Buffer.from(await response.arrayBuffer());
  return res.status(200).send(buffer);
}
