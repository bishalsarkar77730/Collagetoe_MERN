import express from "express";
import { AuthenticatedUser } from "../Utils/Auth.js";
import {
  UserUpdate,
  deleteUser,
  GetUser,
  GetFollowers,
  FollowUSer,
  UnFollowUSer,
} from "../Controllers/UserController.js";

const router = express.Router();

router.put("/:id", AuthenticatedUser, UserUpdate);
router.get("/:id", AuthenticatedUser, GetUser);
router.delete("/:id", AuthenticatedUser, deleteUser);
router.get("/friends/:id", AuthenticatedUser, GetFollowers);
router.put("/:id/follow", AuthenticatedUser, FollowUSer);
router.put("/:id/unfollow", AuthenticatedUser, UnFollowUSer);

export default router;
