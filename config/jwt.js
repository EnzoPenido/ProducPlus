import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function gerarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "5h"
  });
}

export function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}