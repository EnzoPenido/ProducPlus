import express from "express";
import { autenticarJWT } from "../middlewares/authMiddleware.js";
import { permitirRoles } from "../middlewares/roleMiddleware.js";
import {
    listarProdutos,
    listarProdutosPorCategoria,
    listarProdutosPorSecao,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto,
    baixarEstoque
} from "../controllers/produtoController.js";

const router = express.Router();

router.get("/", listarProdutos);
router.get("/secao/:secao", listarProdutosPorSecao);
router.get("/categoria/:idCategoria", listarProdutosPorCategoria);
router.get("/:id", buscarProduto);
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarProduto);
router.put("/:id", autenticarJWT, permitirRoles("ADMIN"), atualizarProduto);
router.delete("/:id", autenticarJWT, permitirRoles("ADMIN"), excluirProduto);
router.put("/baixa-estoque", baixarEstoque);

export default router;