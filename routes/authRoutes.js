const express = require("express");
const router = express.Router();
const { registerUser, loginUser ,logOut} = require("../controllers/authController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);

module.exports = router;
