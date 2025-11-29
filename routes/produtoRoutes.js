import express from "express";
import {
    listarProdutos,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto,
    baixarEstoque,
    ajustarEstoque
} from "../controllers/produtoController.js";
import { autenticarJWT } from "../middlewares/authMiddleware.js";
import { permitirRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// --- ROTAS PÚBLICAS ---
router.get("/", listarProdutos);
router.get("/:id", buscarProduto);

// --- ROTA DE COMPRA ---
router.put("/baixa-estoque", autenticarJWT, permitirRoles("CLIENTE", "ADMIN"), baixarEstoque);

// --- ROTAS DE ADMIN ---
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarProduto);
router.put("/:id", autenticarJWT, permitirRoles("ADMIN"), atualizarProduto);
router.delete("/:id", autenticarJWT, permitirRoles("ADMIN"), excluirProduto);
router.patch("/:id/estoque", autenticarJWT, permitirRoles("ADMIN"), ajustarEstoque);

export default router;