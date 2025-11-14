import express from "express";
import {
    listarCompras,
    buscarCompra,
    criarCompra,
    atualizarCompra,
    excluirCompra
} from "../controllers/compraController.js";

const router = express.Router();

router.get("/", listarCompras);
router.get("/:id", buscarCompra);
router.post("/", criarCompra);
router.put("/:id", atualizarCompra);
router.delete("/:id", excluirCompra);

export default router;