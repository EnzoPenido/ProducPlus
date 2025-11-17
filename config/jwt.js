import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "2h";

export function gerarToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
