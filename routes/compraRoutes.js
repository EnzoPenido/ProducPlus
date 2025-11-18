import express from "express";
import { autenticarJWT } from "../middlewares/authMiddleware.js";
import { permitirRoles } from "../middlewares/roleMiddleware.js";
import {
    listarCompras,
    buscarCompra,
    criarCompra,
    atualizarCompra,
    excluirCompra
} from "../controllers/compraController.js";

const router = express.Router();

router.get("/", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), listarCompras);
router.get("/:id", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), buscarCompra);
router.post("/", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), criarCompra);
router.put("/:id", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), atualizarCompra);
router.delete("/:id", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), excluirCompra);

export default router;