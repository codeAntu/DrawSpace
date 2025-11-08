import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "./config";

const app = express();
const port = 3001;

app.post("/signup", (req, res) => {
  try {
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/login", (req, res) => {
  try {
    const token = jwt.sign(
      {
        userId: "exampleUserId",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.send({ token });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/room", middleware, (req, res) => {
  try {
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`HTTP server listening at http://localhost:${port}`);
});
