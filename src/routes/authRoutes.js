import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import { createHash } from "../utils/bcryptPassword.js";
import { userModel } from "../models/usersModel.js";

const router = Router();

// Login Route
router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    const payload = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      maxAge: 100000,
      httpOnly: true,
    });

    res.status(200).json({
      message: "Login success",
      token,
    });
  }
);

// Register Route
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, role, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const hashPassword = await createHash(password);

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user", details: error.message });
  }
});

// Current User Route
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      message: "Welcome",
      user: req.user,
    });
  }
);

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Session closed" });
});

export default router;
