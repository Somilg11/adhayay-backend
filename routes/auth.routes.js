import express from "express";
import { registerUser, loginUser, logOut } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);

export default router;
