import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

import {
  CreateUserSchema,
  CreateRoomSchema,
  LoginSchema,
} from "@repo/common/types";

const app = express();
const port = 3001;

app.post("/signup", async (req, res) => {
  try {
    const data = CreateUserSchema.safeParse(req.body);

    if (!data.success) {
      return res.status(400).send({ error: data.error });
    }

    const user = await prisma.user.create({
      data: {
        email: data.data.email,
        name: data.data.name,
        password: data.data.password,
      },
    });

    res.send({ message: "User created successfully" });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/login", (req, res) => {
  try {
    const data = LoginSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).send({ error: data.error });
    }

    const user = {
      id: "exampleUserId",
      email: data.data.email,
    };

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
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).send({ error: data.error });
    }

    res.send({ message: "Room created successfully" });
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
