import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World! Your server is running on Railway.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

