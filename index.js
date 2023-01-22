import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

// multer Imports

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

// import Socket

import { createServer } from "http";
import { Server } from "socket.io";
import Users from "./Backend/Models/Users.js";
import Message from "./Backend/Models/Message.js";

// Import Routes

import { AuthenticatedUser } from "./Backend/Utils/Auth.js";
import { signup } from "./Backend/Controllers/AuthController.js";
import Auth from "./Backend/Routes/AuthRoutes.js";
import user from "./Backend/Routes/UserRoutes.js";

const app = express();
dotenv.config();

mongoose.set("strictQuery", false);
const connect = () => {
  mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("Database Connected successfully");
    })
    .catch((err) => {
      throw err;
    });
};

// using multer

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(
  "/images",
  express.static(path.join(__dirname, "./Backend/Utils/images"))
);

//middlewares

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// multer storage part

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Backend/Utils/images");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

// multer upload part

const upload = multer({ storage: storage });
app.post(
  "/api/auth/signup",
  upload.single("profilePicture"),
  signup,
  (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  }
);

//  All main routes

app.use("/api/auth", Auth);
app.use("/api/user", user);

// Socket Setup

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Sorting fuctions for messages

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

// Socket Connection

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await Users.find();
    io.emit("new-user", members);
  });
  socket.on("join-room", async (newRoom, previousRoom) => {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });
});

app.post("/api/auth/signout/:id", AuthenticatedUser, async (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      await Users.findByIdAndUpdate(
        req.params.id,
        {
          status: "offline",
          newMessages: req.body.newMessages,
        },
        { new: true }
      );
      res.cookie("access_token", null, {
        expiresIn: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Logged Out",
      });
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  } else {
    return res.status(400).json({
      message: "canot log out others account",
      success: false,
    });
  }
});

// server setup

app.listen(process.env.LOCAL_HOST_PORT, () => {
  connect();
  console.log(
    `server is running on http://localhost:${process.env.LOCAL_HOST_PORT}`
  );
});
