import express from "express";
import { signup, signin, LogOut } from "../Controllers/AuthController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", LogOut);

export default router;