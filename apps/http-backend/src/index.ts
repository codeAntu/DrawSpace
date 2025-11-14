import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { sendError, sendSuccess } from "./responseHelper";

import {
  CreateRoomSchema,
  CreateUserSchema,
  LoginSchema,
} from "@repo/common/types";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();

apiRouter.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    return sendError(res, JSON.stringify(data.error), "Invalid input", 400);
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: data.data.email,
        name: data.data.name,
        password: data.data.password,
      },
    });
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "1y" }
    );
    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      "User created successfully",
      201
    );
  } catch (error: any) {
    return sendError(res, error.message, "User already exists", 500);
  }
});

apiRouter.post("/login", async (req, res) => {
  try {
    const data = LoginSchema.safeParse(req.body);
    if (!data.success) {
      return sendError(res, JSON.stringify(data.error), "Invalid input", 400);
    }
    const user = await prisma.user.findUnique({
      where: {
        email: data.data.email,
        password: data.data.password,
      },
    });
    if (!user) {
      return sendError(res, "Invalid credentials", "Login failed", 401);
    }
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "1y" }
    );
    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      "Login successful"
    );
  } catch (error: any) {
    return sendError(res, error.message, "Login failed", 500);
  }
});

apiRouter.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully", error: null });
});

apiRouter.get("/me", middleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Unauthorized",
          message: "Unauthorized",
        });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        photo: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          error: "User not found",
          message: "User not found",
        });
    }

    res.json({
      success: true,
      user,
      error: null,
      message: "User fetched successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        error: error.message,
        message: "Failed to fetch user",
      });
  }
});

apiRouter.post("/room", middleware, async (req, res) => {
  try {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
      return res
        .status(400)
        .json({ success: false, error: data.error, message: "Invalid input" });
    }
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Unauthorized",
          message: "Unauthorized",
        });
    }
    const room = await prisma.room.create({
      data: {
        name: data.data.name,
        adminId: userId,
      },
    });
    res.json({
      success: true,
      message: "Room created successfully",
      room: {
        id: room.id,
        name: room.name,
        adminId: room.adminId,
      },
      error: null,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        error: error.message,
        message: "Room creation failed, the slug is already taken",
      });
  }
});

apiRouter.get("/rooms", middleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Unauthorized",
          message: "Unauthorized",
        });
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
      success: true,
      rooms,
      error: null,
      message: "Rooms fetched successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        error: error.message,
        message: "Failed to fetch rooms",
      });
  }
});

apiRouter.get("/room/:roomId/messages", middleware, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          error: "Unauthorized",
          message: "Unauthorized",
        });
    }
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      return res
        .status(404)
        .json({
          success: false,
          error: "Room not found",
          message: "Room not found",
        });
    }
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
      success: true,
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.message,
        userId: msg.userId,
        user: msg.user,
        timestamp: msg.createdAt,
      })),
      error: null,
      message: "Messages fetched successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        error: error.message,
        message: "Failed to fetch messages",
      });
  }
});

apiRouter.get("/health", (req, res) => {
  res.json({ success: true, message: "Hello World!", error: null });
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`HTTP server listening at http://localhost:${port}`);
});
