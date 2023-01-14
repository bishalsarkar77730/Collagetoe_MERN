import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer";

// Import Routes

import Auth from "./Backend/Routes/AuthRoutes.js";
import user from "./Backend/Routes/UserRoutes.js";
import convo from "./Backend/Routes/ConversationRoute.js";
import msg from "./Backend/Routes/MessageRoute.js";

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


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./Backend/Utils/images");
  },
  filename: function (req, file, callback) {
    callback(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", Auth);
app.use("/api/user", user);
app.use("api/con", convo);
app.use("api/mesg", msg);

app.listen(process.env.LOCAL_HOST_PORT, () => {
  connect();
  console.log(
    `server is running on http://localhost:${process.env.LOCAL_HOST_PORT}`
  );
});
