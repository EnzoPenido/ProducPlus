import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js";
const router = express.Router();
router.post("/login", loginAdmin);
export default router;