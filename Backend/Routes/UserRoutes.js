import express from "express";
import { AuthenticatedUser } from "../Utils/Auth.js";
import {
  UserUpdate,
  deleteUser,
  GetUser,
  GetFollowings,
  GetFollowers,
  FollowUSer,
  UnFollowUSer,
  fillterUser,
  fillterbyroute,
} from "../Controllers/UserController.js";

const router = express.Router();

router.put("/:id", AuthenticatedUser, UserUpdate);
router.get("/:id", AuthenticatedUser, GetUser);
router.delete("/:id", AuthenticatedUser, deleteUser);
router.get("/followers/:id", AuthenticatedUser, GetFollowers);
router.get("/followings/:id", AuthenticatedUser, GetFollowings);
router.put("/:id/follow", AuthenticatedUser, FollowUSer);
router.put("/:id/unfollow", AuthenticatedUser, UnFollowUSer);
router.get("/city//", fillterUser);
router.get("/route//", fillterbyroute);

export default router;
