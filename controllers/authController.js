const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

// create

module.exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);
    res.cookie("token", token);
    res.send("user created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// login

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = generateToken(user);
      res.cookie("token", token);
      return res.json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// logout route.............

module.exports.logOut = function (req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    res.clearCookie("token");
    res.json({ message: `${decoded.email} has been logged out.` });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
