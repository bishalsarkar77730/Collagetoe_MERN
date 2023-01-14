import express from "express";
import { AuthenticatedUser } from "../Utils/Auth.js";
import {
  newconv,
  getconv,
  Convooo,
} from "../Controllers/CoversationController.js";

const router = express.Router();

router.post("/", AuthenticatedUser, newconv);
router.get("/:userId", AuthenticatedUser, getconv);
router.get("/find/:firstUserId/:secondUserId", AuthenticatedUser, Convooo);

export default router;
