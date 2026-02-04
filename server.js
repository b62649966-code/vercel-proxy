app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>WGs+</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui;
      margin: 0;
      overflow: hidden;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(ellipse at bottom, #0f172a 0%, #020617 100%);
      color: white;
    }

    /* Starfield with pseudo-elements */
    body::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('https://i.ibb.co/0F1N9G5/stars.png') repeat;
      opacity: 0.3;
      z-index: 0;
    }

    .card {
      position: relative;
      z-index: 1;
      background: rgba(2, 6, 23, 0.85);
      padding: 40px;
      border-radius: 16px;
      width: 400px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0,0,0,0.5);
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

    h2 {
      margin-bottom: 20px;
      font-family: 'Orbitron', sans-serif;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>WGs+</h2>
    <form action="/proxy" onsubmit="addHttps()">
      <input id="urlInput" name="url" placeholder="Enter website URL" required>
      <button>Go</button>
    </form>
  </div>

  <script>
    // Prepend https:// if not already present
    function addHttps() {
      const input = document.getElementById('urlInput');
      if (!/^https?:\/\//i.test(input.value)) {
        input.value = 'https://' + input.value;
      }
    }
  </script>
</body>
</html>`);
});
