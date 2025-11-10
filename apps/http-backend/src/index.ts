import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";

import {
  CreateRoomSchema,
  CreateUserSchema,
  LoginSchema,
} from "@repo/common/types";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({ error: data.error });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: data.data.email,
        name: data.data.name,
        password: data.data.password,
      },
    });

    res.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message, message: "User already exists" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const data = LoginSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).json({ error: data.error });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data.data.email,
        password: data.data.password,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/room", middleware, async (req, res) => {
  try {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).json({ error: data.error });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const room = await prisma.room.create({
      data: {
        name: data.data.name,
        adminId: userId,
        slug: data.data.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    res.json({
      message: "Room created successfully",
      room: {
        id: room.id,
        name: room.name,
        slug: room.slug,
        adminId: room.adminId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/health", (req, res) => {
  res.json("Hello World!");
});

app.listen(port, () => {
  console.log(`HTTP server listening at http://localhost:${port}`);
});
