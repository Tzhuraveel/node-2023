import http from "node:http";

import express, { Application, NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import * as mongoose from "mongoose";
import { Server } from "socket.io";

import { configs } from "./config";
import { ApiError } from "./error";
import { authRouter, userRouter } from "./router";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join:roomOne", ({ roomId }) => {
    socket.join(roomId);

    io.to(roomId).emit("user:joined", {
      socketId: socket.id,
      action: "Joined",
    });

    socket.on("message", (data) => {
      console.log(data);
      io.to(roomId).emit("get:message", data);
    });
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message, status });
});

server.listen(configs.PORT, () => {
  mongoose.connect(configs.DB_URL).then(() => console.log("Server started"));
});
