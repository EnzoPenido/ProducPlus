import express from "express";
import { autenticarJWT } from "../middlewares/authMiddleware.js";
import { permitirRoles } from "../middlewares/roleMiddleware.js";
import { criarAdmin, listarAdmins } from "../controllers/adminController.js";

const router = express.Router();
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarAdmin);
router.get("/", autenticarJWT, permitirRoles("ADMIN"), listarAdmins);
export default router;