import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.API_BASE_URL || "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  }),
);

app.use(express.static(join(__dirname)));

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "src/index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`SPA Server running at http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    throw err;
  }
});
