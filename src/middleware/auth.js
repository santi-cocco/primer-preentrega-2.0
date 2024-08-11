import { request, response } from "express";
import { verifyToken } from "../utils/jwt.js";

export async function auth  (req =request, res= response, next) {
    const token = req.cookies.currentUser;

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }
  
    try {
      const decoded = verifyToken(token);
  
      const user = await userModel.findOne({ email: decoded.email });
  
      if (!user) {
        return res.status(404).json({ error: "No se encontró el usuario" });
      }
  
      req.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: decoded.email,
        role: decoded.role,
      };
  
      next();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener el usuario", details: error.message });
    }
  }

  export async function admin(req =request, res= response, next) {
    const { role } = req.user;
  
    if (role === "admin") {
      next();
    } else {
      return res.status(401).json({ error: "No autorizado" });
    }
  }