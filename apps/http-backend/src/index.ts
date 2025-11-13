import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";
import cookieParser from "cookie-parser";
import cors from "cors";
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

// Enable CORS with credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

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

    // Sign JWT token
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "1y" }
    );

    // Set HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      path: "/",
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
      { expiresIn: "1y" }
    );

    // Set HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("auth_token", { path: "/" });
  res.json({ message: "Logged out successfully" });
});

app.get("/me", async (req, res) => {
  try {
    //   const userId = req.userId;
    // if (!userId) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }

    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: {
    //     id: true,
    //     email: true,
    //     name: true,
    //     photo: true,
    //   },
    // });

    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // res.json({ user });

    res.json({ test: "it works" });
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
    res.status(500).json({
      error: error.message,
      message: "Room creation failed, the slug is already taken",
    });
  }
});

app.get("/rooms", middleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { adminId: userId },
          {
            chats: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    });

    res.json({
      rooms,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/room/:roomId/messages", middleware, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Get all messages for the room
    const messages = await prisma.chat.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.message,
        userId: msg.userId,
        user: msg.user,
        timestamp: msg.createdAt,
      })),
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
