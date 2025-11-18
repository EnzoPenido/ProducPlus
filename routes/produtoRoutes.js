import express from "express";
import { autenticarJWT } from "../middlewares/authMiddleware.js";
import { permitirRoles } from "../middlewares/roleMiddleware.js";
import {
    listarProdutos,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto
} from "../controllers/produtoController.js";

const router = express.Router();

router.get("/", listarProdutos);
router.get("/:id", buscarProduto);
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarProduto);
router.put("/:id", autenticarJWT, permitirRoles("ADMIN"), atualizarProduto);
router.delete("/:id", autenticarJWT, permitirRoles("ADMIN"), excluirProduto);

export default router;