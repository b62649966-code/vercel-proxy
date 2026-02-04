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
      background: #0f172a;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      position: relative;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
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
  <canvas id="starfield"></canvas>
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

    // LIGHTWEIGHT STARFIELD PARTICLE EFFECT
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 80; // fewer stars for performance

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createStars() {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * canvas.width,
          o: Math.random()
        });
      }
    }

    function moveStars() {
      for (let star of stars) {
        star.z -= 1.5; // slower speed
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
          star.o = Math.random();
        }
      }
    }

    function drawStars() {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      for (let star of stars) {
        const k = 128 / star.z;
        const x = (star.x - canvas.width/2) * k + canvas.width/2;
        const y = (star.y - canvas.height/2) * k + canvas.height/2;
        const size = (1 - star.z/canvas.width) * 2;
        ctx.globalAlpha = star.o;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;
    }

    function animate() {
      moveStars();
      drawStars();
      requestAnimationFrame(animate);
    }

    createStars();
    animate();
  </script>
</body>
</html>`);
});
