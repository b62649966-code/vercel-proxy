import fetch from "node-fetch";

export default async function handler(req, res) {
  const origin = `https://${req.headers.host}`;
  const reqUrl = new URL(req.url, origin);
  const target = reqUrl.searchParams.get("url");

  /* =====================
     HOMEPAGE
     ===================== */
  if (!target) {
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
<title>WGs+ Proxy</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {
  margin: 0;
  font-family: system-ui;
  background: #020617;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.card {
  background: #020617;
  border: 1px solid #1e293b;
  padding: 32px;
  border-radius: 14px;
  width: 380px;
}
input, button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
}
input {
  background: #0f172a;
  color: white;
}
button {
  margin-top: 10px;
  background: #3b82f6;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background: #2563eb;
}
</style>
</head>
<body>
  <div class="card">
    <h2>WGs+ Proxy</h2>
    <form id="f">
      <input id="u" placeholder="https://example.com" required />
      <button>Go</button>
    </form>
  </div>

<script>
const f = document.getElementById("f");
const u = document.getElementById("u");
f.onsubmit = e => {
  e.preventDefault();
  if (!/^https?:\\/\\//i.test(u.value)) {
    u.value = "https://" + u.value;
  }
  location.href = "/api?url=" + encodeURIComponent(u.value);
};
</script>
</body>
</html>
`);
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
     FETCH TARGET (with timeout)
     ===================== */
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response;
  try {
    response = await fetch(targetUrl.href, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      }
    });
  } catch {
    clearTimeout(timeout);
    return res.status(502).send("Site did not respond");
  }
  clearTimeout(timeout);

  const type = response.headers.get("content-type") || "";

  /* =====================
     HTML HANDLING
     ===================== */
  if (type.includes("text/html")) {
    let html = await response.text();
    const PROXY = `${origin}/api?url=`;

    const inject = `
<script>
(() => {
  const wrap = url => {
    try {
      return "${PROXY}" + encodeURIComponent(new URL(url, location.href).href);
    } catch {
      return url;
    }
  };

  history.pushState = new Proxy(history.pushState, {
    apply(t,a,args){ if(args[2]) args[2]=wrap(args[2]); return Reflect.apply(t,a,args); }
  });

  history.replaceState = new Proxy(history.replaceState, {
    apply(t,a,args){ if(args[2]) args[2]=wrap(args[2]); return Reflect.apply(t,a,args); }
  });

  window.fetch = new Proxy(window.fetch, {
    apply(t,a,args){ args[0]=wrap(args[0]); return Reflect.apply(t,a,args); }
  });

  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m,u){
    return open.call(this,m,wrap(u));
  };
})();
</script>`;

    html = html.replace(/<head>/i, `<head>${inject}`);

    // Rewrite absolute URLs
    html = html.replace(
      /(href|src|action|srcset)=["'](https?:\/\/[^"']+)["']/gi,
      `$1="${PROXY}$2"`
    );

    // Rewrite relative URLs
    html = html.replace(
      /(href|src|action|srcset)=["']\/([^"']*)["']/gi,
      `$1="${PROXY}${targetUrl.origin}/$2"`
    );

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(html);
  }

  /* =====================
     NON-HTML (images, css, js)
     ===================== */
  res.setHeader("Content-Type", type);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=30");

  const buffer = Buffer.from(await response.arrayBuffer());
  return res.status(200).send(buffer);
}
