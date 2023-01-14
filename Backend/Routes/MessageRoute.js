import express from "express";
import { AuthenticatedUser } from "../Utils/Auth.js";
import { addnewmesg, getmsg } from "../Controllers/MessageController.js";

const router = express.Router();

router.post("/", AuthenticatedUser, addnewmesg);
router.get("/:conversationId", AuthenticatedUser, getmsg);

export default router;
